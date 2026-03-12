const express = require("express");
const router = express.Router();
const pool = require("../config/db");
const authMiddleware = require("../middleware/authMiddleware");

// Helper to generate unique Enquiry ID
const generateEnquiryId = async () => {
    const result = await pool.query("SELECT COUNT(*) FROM student_enquiries");
    const count = parseInt(result.rows[0].count) + 1;
    return `ENQ${String(count).padStart(5, '0')}`;
};

// Create new enquiry
router.post("/", async (req, res) => {
    try {
        const enquiry_id = await generateEnquiryId();
        const data = req.body;

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
                counselling_date, counselling_done_by, interest_level, follow_up_date, remarks
            ) VALUES (
                $1, $2, $3, $4, $5, $6, $7, $8, $9, $10,
                $11, $12, $13, $14, $15, $16, $17, $18, $19, $20,
                $21, $22, $23, $24, $25, $26, $27, $28, $29, $30,
                $31, $32, $33, $34, $35, $36, $37, $38, $39, $40,
                $41, $42, $43, $44, $45, $46, $47, $48
            ) RETURNING *`;

        const values = [
            enquiry_id, data.enquiry_date || new Date(), data.mode_of_enquiry,
            data.student_name, data.gender, data.age, data.dob, data.mobile_number, data.whatsapp_number, data.email_id,
            data.perm_address, data.perm_city, data.perm_state, data.perm_pin,
            data.curr_address, data.curr_city, data.curr_state, data.curr_pin,
            data.highest_qualification, data.year_of_passing, data.institution_name,
            data.career_objective, data.preferred_country, data.expected_salary, data.willing_to_work_all_india,
            data.work_experience, data.company_name, data.position, data.salary, data.location, data.skills_trade,
            data.father_name, data.mother_name, data.parent_contact, data.parent_occupation,
            data.referred_by, data.counsellor_name, data.counsellor_code, data.will_attend_test,
            data.course_interested, data.level_of_course, data.training_mode, data.batch_timing,
            data.counselling_date, data.counselling_done_by, data.interest_level, data.follow_up_date, data.remarks
        ];

        const result = await pool.query(query, values);
        res.status(201).json(result.rows[0]);
    } catch (err) {
        console.error("Enquiry submission error:", err.message);
        res.status(500).json({ error: "Server Error" });
    }
});

// Get all enquiries
router.get("/", async (req, res) => {
    try {
        const result = await pool.query("SELECT * FROM student_enquiries ORDER BY created_at DESC");
        res.json(result.rows);
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ error: "Server Error" });
    }
});

module.exports = router;
