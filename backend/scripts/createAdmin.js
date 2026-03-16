// backend/scripts/createAdmin.js
const bcrypt = require("bcryptjs");
const pool   = require("../config/db");

async function createAdmin() {
  try {
    const email    = "admin@example.com";
    const password = "Admin@123";
    const name     = "Super Admin";

    // 1. Hash the password
    const hashed = await bcrypt.hash(password, 10);
    console.log("✅ Password hashed:", hashed);

    // 2. Get Admin role id
    const roleResult = await pool.query(
      "SELECT id FROM roles WHERE name = $1",
      ["Admin"]
    );

    if (roleResult.rows.length === 0) {
      console.log("❌ Admin role not found. Creating it...");

      // Create Admin role if it doesn't exist
      const newRole = await pool.query(
        "INSERT INTO roles (name) VALUES ($1) RETURNING id",
        ["Admin"]
      );
      var roleId = newRole.rows[0].id;
      console.log("✅ Admin role created with id:", roleId);
    } else {
      var roleId = roleResult.rows[0].id;
      console.log("✅ Found Admin role id:", roleId);
    }

    // 3. Insert admin user (or update if already exists)
    const result = await pool.query(
      `INSERT INTO users (name, email, password, role_id, status)
       VALUES ($1, $2, $3, $4, 'Active')
       ON CONFLICT (email)
       DO UPDATE SET
         password = EXCLUDED.password,
         role_id  = EXCLUDED.role_id,
         status   = 'Active'
       RETURNING id, name, email, status`,
      [name, email, hashed, roleId]
    );

    console.log("✅ Admin user ready:", result.rows[0]);

    // 4. Give Admin role ALL permissions
    const modules = [
      "Dashboard", "Associate", "Students", "Staff / Trainee",
      "NTSC Admin", "Payments", "Manage Users", "Manage Roles",
      "Associate Management", "Home", "Homepage Banner", "Feature Popup",
      "Latest News", "Accreditions"
    ];

    for (const module of modules) {
      await pool.query(
        `INSERT INTO permissions (role_id, module, can_view, can_add, can_edit, can_delete)
         VALUES ($1, $2, true, true, true, true)
         ON CONFLICT (role_id, module)
         DO UPDATE SET
           can_view   = true,
           can_add    = true,
           can_edit   = true,
           can_delete = true`,
        [roleId, module]
      );
    }

    console.log("✅ All permissions granted to Admin role");
    console.log("\n🎉 Done! You can now login with:");
    console.log("   Email   :", email);
    console.log("   Password:", password);

    process.exit(0);
  } catch (err) {
    console.error("❌ Error:", err.message);
    console.error(err);
    process.exit(1);
  }
}

createAdmin();