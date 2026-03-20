const pool = require("../config/db");

async function run() {
    const modules = await pool.query("SELECT * FROM modules");
    console.log("=== MODULES ===");
    modules.rows.forEach(m => console.log(`${m.id}: ${m.name} | slug: ${m.slug}`));
    await pool.end();
}
run();
