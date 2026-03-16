const pool = require("./config/db");

async function check() {
  try {
    console.log("--- ROLES ---");
    const roles = await pool.query("SELECT * FROM roles");
    console.table(roles.rows);

    console.log("\n--- USERS ---");
    const users = await pool.query("SELECT id, name, email, role_id, status FROM users");
    console.table(users.rows);

    console.log("\n--- PERMISSIONS (First 10) ---");
    const perms = await pool.query("SELECT module, can_view, role_id FROM permissions LIMIT 10");
    console.table(perms.rows);

    process.exit(0);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
}

check();
