const pool = require("../config/db");

async function checkIds() {
    try {
        const res = await pool.query("SELECT id, enquiry_id, admission_number, full_name FROM student_admissions");
        res.rows.forEach(r => {
            console.log(`ID: ${r.id} | ENQ: ${r.enquiry_id} | ADM: ${r.admission_number} | NAME: ${r.full_name}`);
        });
        process.exit(0);
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
}

checkIds();
