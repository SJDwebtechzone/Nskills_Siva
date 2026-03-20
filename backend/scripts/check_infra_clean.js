const pool = require("../config/db");

async function run() {
  try {
    const roles = await pool.query("SELECT * FROM roles");
    console.log("=== ROLES ===");
    roles.rows.forEach(r => console.log(`${r.id}: ${r.name}`));

    const modules = await pool.query("SELECT * FROM modules");
    console.log("\n=== MODULES ===");
    modules.rows.forEach(m => console.log(`${m.id}: ${m.name} [${m.slug}]`));
  } catch (err) {
    console.error(err);
  } finally {
    await pool.end();
  }
}

run();
