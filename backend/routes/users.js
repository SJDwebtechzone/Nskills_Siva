// // routes/users.js
// const express = require("express");
// const bcrypt = require("bcrypt");
// const pool = require("../config/db");
// const authMiddleware = require("../middleware/authMiddleware");
// const generatePassword = require("../utils/passwordGenerator");

// const router = express.Router();

// router.post(
//   "/",
//   authMiddleware(["SUPERADMIN"]),
//   async (req, res) => {
//     const { name, email, role } = req.body;
//     const plainPassword = generatePassword();
//     const hashed = await bcrypt.hash(plainPassword, 10);

//     await pool.query(
//       "INSERT INTO users(name,email,password,role) VALUES($1,$2,$3,$4)",
//       [name, email, hashed, role]
//     );

//     res.json({ message: "User created", password: plainPassword });
//   }
// );

// module.exports = router;

const express = require("express");
const bcrypt = require("bcrypt");
const pool = require("../config/db");
const { authMiddleware, checkPermission } = require("../middleware/authMiddleware");
const generatePassword = require("../utils/passwordGenerator");

const router = express.Router();

// GET all users
router.get(
  "/",
  authMiddleware,
  checkPermission("Manage Users", "view"),
  async (req, res) => {
    try {
      const result = await pool.query(
        `SELECT u.id, u.name, u.email, u.status, u.created_at,
                r.name as role_name, r.id as role_id
         FROM users u
         LEFT JOIN roles r ON u.role_id = r.id
         ORDER BY u.created_at DESC`
      );
      res.json(result.rows);
    } catch (err) {
      console.error("Get users error:", err);
      res.status(500).json({ message: "Server error" });
    }
  }
);

// POST create user
router.post(
  "/",
  authMiddleware,
  checkPermission("Manage Users", "add"),
  async (req, res) => {
    try {
      const { name, email, role_id, status } = req.body;

      // Check if email already exists
      const existing = await pool.query(
        "SELECT id FROM users WHERE email = $1",
        [email]
      );
      if (existing.rows.length > 0)
        return res.status(400).json({ message: "Email already exists" });

      // Auto generate password
      const plainPassword = generatePassword();
      const hashed = await bcrypt.hash(plainPassword, 10);

      const result = await pool.query(
        `INSERT INTO users (name, email, password, role_id, status)
         VALUES ($1, $2, $3, $4, $5)
         RETURNING id, name, email, status`,
        [name, email, hashed, role_id, status || "Active"]
      );

      res.status(201).json({
        message: "User created successfully",
        user: result.rows[0],
        plainPassword, // send this to admin so they can share with user
      });
    } catch (err) {
      console.error("Create user error:", err);
      res.status(500).json({ message: "Server error" });
    }
  }
);

// PUT update user
router.put(
  "/:id",
  authMiddleware,
  checkPermission("Manage Users", "edit"),
  async (req, res) => {
    try {
      const { name, email, role_id, status } = req.body;

      const result = await pool.query(
        `UPDATE users
         SET name = $1, email = $2, role_id = $3, status = $4
         WHERE id = $5
         RETURNING id, name, email, status`,
        [name, email, role_id, status, req.params.id]
      );

      if (result.rows.length === 0)
        return res.status(404).json({ message: "User not found" });

      res.json({
        message: "User updated successfully",
        user: result.rows[0],
      });
    } catch (err) {
      console.error("Update user error:", err);
      res.status(500).json({ message: "Server error" });
    }
  }
);

// PUT reset password
router.put(
  "/:id/reset-password",
  authMiddleware,
  checkPermission("Manage Users", "edit"),
  async (req, res) => {
    try {
      const plainPassword = generatePassword();
      const hashed = await bcrypt.hash(plainPassword, 10);

      await pool.query(
        "UPDATE users SET password = $1 WHERE id = $2",
        [hashed, req.params.id]
      );

      res.json({
        message: "Password reset successfully",
        plainPassword, // send new password to admin
      });
    } catch (err) {
      console.error("Reset password error:", err);
      res.status(500).json({ message: "Server error" });
    }
  }
);

// DELETE user
router.delete(
  "/:id",
  authMiddleware,
  checkPermission("Manage Users", "delete"),
  async (req, res) => {
    try {
      const result = await pool.query(
        "DELETE FROM users WHERE id = $1 RETURNING id",
        [req.params.id]
      );

      if (result.rows.length === 0)
        return res.status(404).json({ message: "User not found" });

      res.json({ message: "User deleted successfully" });
    } catch (err) {
      console.error("Delete user error:", err);
      res.status(500).json({ message: "Server error" });
    }
  }
);

module.exports = router;