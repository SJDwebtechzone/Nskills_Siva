const pool = require("./config/db");

async function checkColumns() {
    try {
        const res = await pool.query("SELECT * FROM associate_referral_points LIMIT 1");
        if (res.rows.length > 0) {
            console.log("Columns:", Object.keys(res.rows[0]));
        } else {
            console.log("No rows in table.");
        }
    } catch (err) {
        console.error("Column check error:", err.message);
    } finally {
        pool.end();
    }
}

checkColumns();
