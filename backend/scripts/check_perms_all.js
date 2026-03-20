const pool = require("../config/db");

async function checkPermsAll() {
    const perms = await pool.query("SELECT DISTINCT module FROM permissions");
    console.log("=== Modules in Permissions Table ===");
    perms.rows.forEach(p => console.log(p.module));
    await pool.end();
}
checkPermsAll();
