const pool = require("./config/db");

async function checkTotalCols() {
    try {
        const res = await pool.query("SELECT COUNT(*) FROM information_schema.columns WHERE table_name = 'student_admissions'");
        console.log("Total columns in student_admissions:", res.rows[0].count);
        
        const cols = await pool.query("SELECT column_name FROM information_schema.columns WHERE table_name = 'student_admissions' ORDER BY ordinal_position");
        console.log("All column names:", cols.rows.map(r => r.column_name).join(", "));
    } catch (err) {
        console.error("Error:", err.message);
    } finally {
        pool.end();
    }
}

checkTotalCols();
