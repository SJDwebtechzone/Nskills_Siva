// // routes/auth.js
// const express = require("express");
// const bcrypt = require("bcrypt");
// const jwt = require("jsonwebtoken");
// const pool = require("../config/db");

// const router = express.Router();
// const SECRET = "mysecret";

// router.post("/login", async (req, res) => {
//   const { email, password } = req.body;

//   const user = await pool.query(
//     "SELECT * FROM users WHERE email=$1",
//     [email]
//   );

//   if (user.rows.length === 0)
//     return res.status(400).json({ message: "User not found" });

//   const valid = await bcrypt.compare(
//     password,
//     user.rows[0].password
//   );

//   if (!valid)
//     return res.status(400).json({ message: "Invalid password" });

//   const token = jwt.sign(
//     { id: user.rows[0].id, role: user.rows[0].role },
//     SECRET,
//     { expiresIn: "1h" }
//   );

//   res.json({ token });
// });

// module.exports = router;

const express = require("express");
const router  = express.Router();
const bcrypt  = require("bcryptjs");
const jwt     = require("jsonwebtoken");
const pool    = require("../config/db");

const SECRET = process.env.JWT_SECRET || "mysecret";
console.log("✅ auth.js loaded successfully");

// ══════════════════════════════════════════════════════════════════════════════
// POST /api/auth/login
// ══════════════════════════════════════════════════════════════════════════════
router.post("/login", async (req, res) => {
  try {
    console.log("🔍 Login attempt:", req.body);
    const { email, password } = req.body;

    if (!email || !password) {
      console.log("❌ Missing email or password");
      return res.status(400).json({ message: "Email and password are required" });
    }

    // 1. Find user + role name
    console.log("🔍 Querying DB for:", email);
    const userResult = await pool.query(
      `SELECT u.id, u.name, u.email, u.password, u.status,
              r.id   AS role_id,
              r.name AS role_name,
              sa.admission_number, sa.enquiry_id
       FROM   users u
       LEFT JOIN roles r ON u.role_id = r.id
       LEFT JOIN student_admissions sa ON sa.email_id = u.email
       WHERE  u.email = $1
       LIMIT 1`,
      [email]
    );

    // 2. User not found
    console.log("🔍 User found:", userResult.rows.length > 0 ? "YES" : "NO");
    if (userResult.rows.length === 0)
      return res.status(401).json({ message: "Invalid email or password" });

    const user = userResult.rows[0];
    console.log("🔍 Status:", user.status, "| Role:", user.role_name);
    console.log("🔍 Hash preview:", user.password?.slice(0, 10));

    // 3. Check account status
    if (user.status !== "Active")
      return res.status(403).json({ message: "Account is inactive. Contact admin." });

    // 4. Compare password
    console.log("🔍 Comparing password...");
    const isMatch = await bcrypt.compare(password, user.password);
    console.log("🔍 Password match:", isMatch);
    if (!isMatch)
      return res.status(401).json({ message: "Invalid email or password" });

    // 5. Fetch permissions for this role
    console.log("🔍 Fetching permissions for role_id:", user.role_id);
    const permResult = await pool.query(
      `SELECT module, can_view, can_add, can_edit, can_delete
       FROM   permissions
       WHERE  role_id = $1`,
      [user.role_id]
    );

    console.log("🔍 Permissions found:", permResult.rows.length);

    // 6. Convert permissions array → object map
    // { "Dashboard": { view: true, add: true, edit: true, delete: true }, ... }
    const permissions = {};
    permResult.rows.forEach((p) => {
      permissions[p.module] = {
        view:   p.can_view,
        add:    p.can_add,
        edit:   p.can_edit,
        delete: p.can_delete,
      };
    });

    // 7. Sign JWT
    const token = jwt.sign(
      {
        id:       user.id,
        roleId:   user.role_id,
        roleName: user.role_name,
      },
      SECRET,
      { expiresIn: "1d" }
    );

    console.log("✅ Login success:", email);

    // 8. Send response
    res.json({
      token,
      user: {
        id:    user.id,
        name:  user.name,
        email: user.email,
        role:  user.role_name,
        admission_number: user.admission_number || user.enquiry_id,
      },
      permissions,
    });

  } catch (err) {
    console.error("❌ Login error:", err.message);
    console.error("❌ Stack:", err.stack);
    res.status(500).json({
      message: "Server error",
      detail:  err.message   // ← now shows in Thunder Client
    });
  }
});

module.exports = router;
