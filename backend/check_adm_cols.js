const pool = require("./config/db");

async function checkCols() {
    try {
        const res = await pool.query("SELECT * FROM student_admissions LIMIT 1");
        if (res.rows.length > 0) {
            console.log("Columns:", Object.keys(res.rows[0]));
        } else {
            console.log("No rows in student_admissions.");
            // Check via INFORMATION_SCHEMA
            const cols = await pool.query("SELECT column_name FROM information_schema.columns WHERE table_name = 'student_admissions'");
            console.log("Columns in student_admissions:", cols.rows.map(r => r.column_name));
        }
    } catch (err) {
        console.error("Error:", err.message);
    } finally {
        pool.end();
    }
}

checkCols();
