const pool = require("../config/db");

async function checkPermissions() {
  try {
    const res = await pool.query(`
      SELECT p.*, r.name as role_name 
      FROM permissions p 
      JOIN roles r ON p.role_id = r.id 
      WHERE r.name = 'Associate'
    `);
    console.log("Associate Permissions:", JSON.stringify(res.rows, null, 2));
  } catch (err) {
    console.error(err);
  } finally {
    await pool.end();
  }
}

checkPermissions();
