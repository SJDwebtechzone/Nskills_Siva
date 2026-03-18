const pool = require("./config/db");

async function checkTable() {
    try {
        const res = await pool.query("SELECT * FROM associate_referral_points LIMIT 1");
        console.log("Table exists", res.rows);
    } catch (err) {
        console.error("Table check error:", err.message);
    } finally {
        pool.end();
    }
}

checkTable();
