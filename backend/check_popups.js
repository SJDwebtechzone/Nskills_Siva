const pool = require("./config/db");

async function checkPopups() {
    try {
        const cols = await pool.query("SELECT column_name FROM information_schema.columns WHERE table_name = 'popups'");
        console.log("Popups columns:", cols.rows.map(r => r.column_name));
    } catch (err) {
        console.error("error:", err.message);
    } finally {
        pool.end();
    }
}

checkPopups();
