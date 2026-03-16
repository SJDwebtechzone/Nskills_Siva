const pool = require("../config/db");
const fs = require("fs");

async function run() {
    const r = await pool.query(`
        SELECT u.id, u.name, u.email, u.status, r.name as role
        FROM users u 
        LEFT JOIN roles r ON u.role_id = r.id
        ORDER BY r.name, u.id
    `);
    const lines = r.rows.map(u => `[${u.role}] ${u.name} | Email: ${u.email} | Status: ${u.status}`);
    fs.writeFileSync("./users_list.txt", lines.join("\n"));
    console.log("Written to users_list.txt");
    await pool.end();
}

run().catch(e => { console.error(e.message); process.exit(1); });
