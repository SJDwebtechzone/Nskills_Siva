const express = require("express");
const router  = express.Router();
const pool    = require("../config/db");
const { authMiddleware, checkPermission } = require("../middleware/authMiddleware");

// GET /api/attendance/students?batch=Forenoon&date=2026-03-20&batchAllotted=Batch+A&course=Web+Dev
// Get all approved students and their attendance status for a given batch & date
router.get("/students", authMiddleware, async (req, res) => {
    try {
        const { batch, date, batchAllotted, course, markedById } = req.query;

        if (!batch || !date) {
            return res.status(400).json({ success: false, message: "Batch and date are required." });
        }

        // 1. Fetch all student admissions (approved) with optional filters
        let studentsQuery = `
            SELECT id, admission_number, full_name, email_id, course_name, photo_url, batch_allotted
            FROM   student_admissions
            WHERE  status = 'Approved'
        `;
        const params = [];
        
        if (batchAllotted) {
            params.push(`%${batchAllotted}%`);
            studentsQuery += ` AND batch_allotted ILIKE $${params.length}`;
        }
        if (course) {
            params.push(`%${course}%`);
            studentsQuery += ` AND course_name ILIKE $${params.length}`;
        }

        studentsQuery += ` ORDER BY full_name ASC`;
        const studentsRes = await pool.query(studentsQuery, params);

        // 2. Fetch existing attendance for this session batch/date
        let attendQuery = `
            SELECT a.admission_id, a.status, a.punch_in, a.punch_out, a.remarks, a.marked_by_id, u.name as marked_by_name
            FROM   attendance a
            LEFT JOIN users u ON a.marked_by_id = u.id
            WHERE  a.batch = $1 AND a.date = $2
        `;
        const attendParams = [batch, date];
        if (markedById) {
            attendParams.push(markedById);
            attendQuery += ` AND a.marked_by_id = $${attendParams.length}`;
        }

        const attendanceRes = await pool.query(attendQuery, attendParams);

        // Map attendance by admission_id for easy lookup
        const attendanceMap = {};
        attendanceRes.rows.forEach(a => {
            attendanceMap[a.admission_id] = {
                status: a.status,
                punch_in: a.punch_in,
                punch_out: a.punch_out,
                remarks: a.remarks,
                marked_by_id: a.marked_by_id,
                marked_by_name: a.marked_by_name
            };
        });

        // 3. Merge attendance data into student list
        const data = studentsRes.rows.map(s => {
            const att = attendanceMap[s.id] || { status: 'Absent', punch_in: '09:00:00', punch_out: '18:00:00', remarks: '' };
            return { ...s, attendance: att };
        });

        res.json({ success: true, data });
    } catch (err) {
        console.error("Fetch attendance students error:", err);
        res.status(500).json({ success: false, message: "Server error" });
    }
});

// POST /api/attendance/mark
// Save/Update attendance for multiple students
router.post("/mark", authMiddleware, async (req, res) => {
    const client = await pool.connect();
    try {
        const { date, batch, records, marked_by_id } = req.body; // records: [{admission_id, status, punch_in, punch_out, remarks}]

        if (!date || !batch || !records) {
            return res.status(400).json({ success: false, message: "Date, batch, and records are required." });
        }

        await client.query("BEGIN");

        for (const r of records) {
            await client.query(`
                INSERT INTO attendance (admission_id, date, batch, status, punch_in, punch_out, remarks, marked_by_id)
                VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
                ON CONFLICT (admission_id, date, batch)
                DO UPDATE SET
                    status       = EXCLUDED.status,
                    punch_in     = EXCLUDED.punch_in,
                    punch_out    = EXCLUDED.punch_out,
                    remarks      = EXCLUDED.remarks,
                    marked_by_id = COALESCE(EXCLUDED.marked_by_id, attendance.marked_by_id)
            `, [r.admission_id, date, batch, r.status, r.punch_in, r.punch_out, r.remarks, marked_by_id]);
        }

        await client.query("COMMIT");
        res.json({ success: true, message: "Attendance submitted successfully." });
    } catch (err) {
        await client.query("ROLLBACK");
        console.error("Mark attendance error:", err);
        res.status(500).json({ success: false, message: "Server error" });
    } finally {
        client.release();
    }
});

// GET /api/attendance/student-report
// Detailed report for the logged-in student
router.get("/student-report", authMiddleware, async (req, res) => {
    try {
        const userId = req.user.id;
        const role = req.user.roleName;

        if (role !== 'Student') {
            return res.status(403).json({ success: false, message: "Only students can view their reports." });
        }

        // 1. Find admission record for this user
        const userRes = await pool.query("SELECT email FROM users WHERE id = $1", [userId]);
        const email = userRes.rows[0]?.email;
        
        const admRes = await pool.query("SELECT id FROM student_admissions WHERE email_id = $1", [email]);
        const admissionId = admRes.rows[0]?.id;

        if (!admissionId) {
            return res.status(404).json({ success: false, message: "Admission record not found." });
        }

        // 2. Fetch all attendance records
        const recordsRes = await pool.query(`
            SELECT a.date, a.batch, a.status, a.punch_in, a.punch_out, u.name as marked_by_name, s.batch_allotted
            FROM   attendance a
            LEFT JOIN users u ON a.marked_by_id = u.id
            LEFT JOIN student_admissions s ON a.admission_id = s.id
            WHERE  a.admission_id = $1
            ORDER BY a.date DESC
        `, [admissionId]);

        // 3. Calculate percentages
        const totalSessions = recordsRes.rowCount;
        const presentSessions = recordsRes.rows.filter(r => r.status === 'Present').length;
        const absentSessions = recordsRes.rows.filter(r => r.status === 'Absent').length;
        const leaveSessions = recordsRes.rows.filter(r => r.status === 'Leave').length;

        const presentPercent = totalSessions > 0 ? ((presentSessions / totalSessions) * 100).toFixed(2) : 0;
        const absentPercent  = totalSessions > 0 ? (((absentSessions + leaveSessions) / totalSessions) * 100).toFixed(2) : 0;

        res.json({
            success: true,
            data: {
                summary: {
                    total: totalSessions,
                    present: presentSessions,
                    absent: absentSessions,
                    leave: leaveSessions,
                    presentPercent,
                    absentPercent
                },
                records: recordsRes.rows
            }
        });
    } catch (err) {
        console.error("Student report error:", err);
        res.status(500).json({ success: false, message: "Server error" });
    }
});

module.exports = router;
