const pool = require("./config/db");

async function seedAssociate() {
  try {
    // 1. Ensure Associate role exists
    let roleResult = await pool.query("SELECT id FROM roles WHERE name = $1", ["Associate"]);
    let roleId;
    
    if (roleResult.rows.length === 0) {
      console.log("Creating Associate role...");
      const newRole = await pool.query("INSERT INTO roles (name) VALUES ($1) RETURNING id", ["Associate"]);
      roleId = newRole.rows[0].id;
    } else {
      roleId = roleResult.rows[0].id;
    }

    // 2. Grant permissions specifically for Associate Management
    const modules = ["Associate Management"];

    for (const module of modules) {
      await pool.query(
        `INSERT INTO permissions (role_id, module, can_view, can_add, can_edit, can_delete)
         VALUES ($1, $2, true, true, true, true)
         ON CONFLICT (role_id, module)
         DO UPDATE SET can_view = true, can_add = true, can_edit = true, can_delete = true`,
        [roleId, module]
      );
    }

    console.log("✅ Associate role permissions updated successfully.");
    process.exit(0);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
}

seedAssociate();
