const pool = require("../config/db");

async function checkInfrastructure() {
  console.log("=== Roles ===");
  const roles = await pool.query("SELECT * FROM roles");
  roles.rows.forEach(r => console.log(`ID: ${r.id} | Name: ${r.name}`));

  console.log("\n=== Modules ===");
  const modules = await pool.query("SELECT * FROM modules");
  modules.rows.forEach(m => console.log(`ID: ${m.id} | Name: ${m.name} | Slug: ${m.slug}`));

  await pool.end();
}

checkInfrastructure().catch(console.error);
