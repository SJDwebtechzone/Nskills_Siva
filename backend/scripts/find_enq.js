const pool = require("../config/db");

async function findEnq() {
    try {
        const res = await pool.query("SELECT enquiry_id FROM student_enquiries LIMIT 1");
        console.log("Enquiry IDs:");
        res.rows.forEach(r => console.log(r.enquiry_id));
        process.exit(0);
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
}

findEnq();
