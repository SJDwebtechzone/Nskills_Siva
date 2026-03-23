const pool = require("../config/db");

async function checkIds() {
    try {
        const res = await pool.query("SELECT id, enquiry_id, admission_number, full_name FROM student_admissions LIMIT 10");
        console.table(res.rows);
        process.exit(0);
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
}

checkIds();
