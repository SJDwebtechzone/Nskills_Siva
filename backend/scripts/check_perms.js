const pool = require("../config/db");

async function checkPerms() {
    console.log("=== Permissions for Role ID 1 (Trainee) ===");
    const perms = await pool.query("SELECT * FROM permissions WHERE role_id = $1", [1]);
    perms.rows.forEach(p => console.log(`${p.module}: view:${p.can_view}, add:${p.can_add}, edit:${p.can_edit}, delete:${p.can_delete}`));
    await pool.end();
}
checkPerms();
