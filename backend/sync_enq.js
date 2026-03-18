const pool = require("./config/db");

const expectedEnqCols = [
    'enquiry_id', 'enquiry_date', 'mode_of_enquiry', 'student_name', 'gender', 'age', 'dob',
    'mobile_number', 'whatsapp_number', 'email_id', 'perm_address', 'perm_city', 'perm_state', 'perm_pin',
    'curr_address', 'curr_city', 'curr_state', 'curr_pin', 'highest_qualification', 'year_of_passing',
    'institution_name', 'career_objective', 'preferred_country', 'expected_salary', 'willing_to_work_all_india',
    'work_experience', 'company_name', 'position', 'salary', 'location', 'skills_trade',
    'father_name', 'mother_name', 'parent_contact', 'parent_occupation', 'referred_by',
    'counsellor_name', 'counsellor_code', 'will_attend_test', 'course_interested', 'level_of_course',
    'training_mode', 'batch_timing', 'counselling_date', 'counselling_done_by', 'interest_level',
    'follow_up_date', 'remarks', 'created_by_id'
];

async function syncEnq() {
    try {
        const existing = await pool.query("SELECT column_name FROM information_schema.columns WHERE table_name = 'student_enquiries'");
        const existingSet = new Set(existing.rows.map(r => r.column_name));

        for (const col of expectedEnqCols) {
            if (!existingSet.has(col)) {
                let type = "VARCHAR(255)";
                if (['enquiry_date', 'dob', 'counselling_date', 'follow_up_date'].includes(col)) type = "DATE";
                if (['age'].includes(col)) type = "INT";
                if (['perm_address', 'curr_address', 'skills_trade', 'remarks'].includes(col)) type = "TEXT";
                if (col === 'created_by_id') type = "INTEGER REFERENCES users(id)";
                
                console.log(`Adding enquiry column ${col} (${type})...`);
                await pool.query(`ALTER TABLE student_enquiries ADD COLUMN IF NOT EXISTS ${col} ${type}`);
            }
        }
        console.log("Enquiries schema sync complete!");
    } catch (err) {
        console.error("Sync error:", err.message);
    } finally {
        pool.end();
    }
}

syncEnq();
