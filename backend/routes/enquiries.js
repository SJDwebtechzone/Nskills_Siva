const express = require("express");
const router = express.Router();
const pool = require("../config/db");
const { authMiddleware } = require("../middleware/authMiddleware");

// Helper to generate unique Enquiry ID
const generateEnquiryId = async () => {
    const result = await pool.query("SELECT MAX(CAST(SUBSTRING(enquiry_id FROM 4) AS INTEGER)) as max_id FROM student_enquiries WHERE enquiry_id LIKE 'ENQ%'");
    const nextId = (result.rows[0].max_id || 0) + 1;
    return `ENQ${String(nextId).padStart(5, '0')}`;
};

// Create new enquiry
router.post("/", authMiddleware, async (req, res) => {
    try {
        const data = req.body;
        const userId = req.user.id; // From authMiddleware

        // Helper to convert empty strings to null for DB-safe insertion
        const toDate = v => (v && v.trim() !== "" ? v : null);
        const toStr  = v => (v !== undefined && v !== null ? v.toString() : null);

        // Validation
        const phoneRegex = /^\d{10}$/;
        if (data.mobile_number && !phoneRegex.test(data.mobile_number)) {
            return res.status(400).json({ error: "Mobile number must be exactly 10 digits" });
        }
        if (data.whatsapp_number && !phoneRegex.test(data.whatsapp_number)) {
            return res.status(400).json({ error: "WhatsApp number must be exactly 10 digits" });
        }
        if (!data.student_name) {
            return res.status(400).json({ error: "Student name is required" });
        }

        const enquiry_id = await generateEnquiryId();

        const query = `
            INSERT INTO student_enquiries (
                enquiry_id, enquiry_date, mode_of_enquiry,
                student_name, gender, age, dob, mobile_number, whatsapp_number, email_id,
                perm_address, perm_city, perm_state, perm_pin,
                curr_address, curr_city, curr_state, curr_pin,
                highest_qualification, year_of_passing, institution_name,
                career_objective, preferred_country, expected_salary, willing_to_work_all_india,
                work_experience, company_name, position, salary, location, skills_trade,
                father_name, mother_name, parent_contact, parent_occupation,
                referred_by, counsellor_name, counsellor_code, will_attend_test,
                course_interested, level_of_course, training_mode, batch_timing,
                counselling_date, counselling_done_by, interest_level, follow_up_date, remarks,
                created_by_id
            ) VALUES (
                $1, $2, $3, $4, $5, $6, $7, $8, $9, $10,
                $11, $12, $13, $14, $15, $16, $17, $18, $19, $20,
                $21, $22, $23, $24, $25, $26, $27, $28, $29, $30,
                $31, $32, $33, $34, $35, $36, $37, $38, $39, $40,
                $41, $42, $43, $44, $45, $46, $47, $48, $49
            ) RETURNING *`;

        const values = [
            enquiry_id, toDate(data.enquiry_date) || new Date(), toStr(data.mode_of_enquiry),
            toStr(data.student_name), toStr(data.gender), toStr(data.age), toDate(data.dob), toStr(data.mobile_number), toStr(data.whatsapp_number), toStr(data.email_id),
            toStr(data.perm_address), toStr(data.perm_city), toStr(data.perm_state), toStr(data.perm_pin),
            toStr(data.curr_address), toStr(data.curr_city), toStr(data.curr_state), toStr(data.curr_pin),
            toStr(data.highest_qualification), toStr(data.year_of_passing), toStr(data.institution_name),
            toStr(data.career_objective), toStr(data.preferred_country), toStr(data.expected_salary), toStr(data.willing_to_work_all_india),
            toStr(data.work_experience), toStr(data.company_name), toStr(data.position), toStr(data.salary), toStr(data.location), toStr(data.skills_trade),
            toStr(data.father_name), toStr(data.mother_name), toStr(data.parent_contact), toStr(data.parent_occupation),
            toStr(data.referred_by), toStr(data.counsellor_name), toStr(data.counsellor_code), toStr(data.will_attend_test),
            toStr(data.course_interested), toStr(data.level_of_course), toStr(data.training_mode), toStr(data.batch_timing),
            toDate(data.counselling_date), toStr(data.counselling_done_by), toStr(data.interest_level), toDate(data.follow_up_date), toStr(data.remarks),
            userId
        ];

        const result = await pool.query(query, values);
        res.status(201).json(result.rows[0]);
    } catch (err) {
        console.error("Enquiry submission error:", err.message);
        res.status(500).json({ error: "Server Error", details: err.message });
    }
});

// Get all enquiries (Filtered by Associate if not SuperAdmin)
router.get("/", authMiddleware, async (req, res) => {
    try {
        let query = "SELECT * FROM student_enquiries";
        let params = [];

        if (req.user.roleName === "Associate") {
            query += " WHERE created_by_id = $1";
            params.push(req.user.id);
        }

        query += " ORDER BY created_at DESC";
        const result = await pool.query(query, params);
        res.json(result.rows);
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ error: "Server Error" });
    }
});

// Get enquiry by enquiry_id
router.get("/:enquiry_id", authMiddleware, async (req, res) => {
    try {
        const result = await pool.query("SELECT * FROM student_enquiries WHERE enquiry_id = $1", [req.params.enquiry_id]);
        if (result.rows.length === 0) {
            return res.status(404).json({ error: "Enquiry not found" });
        }

        // Check ownership for Associates
        if (req.user.roleName === "Associate" && result.rows[0].created_by_id !== req.user.id) {
            return res.status(403).json({ error: "Access denied" });
        }

        res.json(result.rows[0]);
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ error: "Server Error" });
    }
});

module.exports = router;

module.exports = router;

