const pool = require("../config/db");

async function run() {
    const r = await pool.query(`
        SELECT u.id, u.name, u.email, u.status, u.password, r.name as role
        FROM users u 
        LEFT JOIN roles r ON u.role_id = r.id
        WHERE r.name = 'Associate'
    `);
    console.log("=== Associate Users ===");
    r.rows.forEach(u => {
        console.log(`ID: ${u.id}`);
        console.log(`Name: ${u.name}`);
        console.log(`Email: ${u.email}`);
        console.log(`Status: ${u.status}`);
        console.log(`Role: ${u.role}`);
        console.log(`Password hash: ${u.password?.slice(0, 30)}...`);
        console.log("---");
    });
    await pool.end();
}

run().catch(e => { console.error(e.message); process.exit(1); });
