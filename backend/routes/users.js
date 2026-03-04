// routes/users.js
const express = require("express");
const bcrypt = require("bcrypt");
const pool = require("../config/db");
const authMiddleware = require("../middleware/authMiddleware");
const generatePassword = require("../utils/passwordGenerator");

const router = express.Router();

router.post(
  "/",
  authMiddleware(["SUPERADMIN"]),
  async (req, res) => {
    const { name, email, role } = req.body;
    const plainPassword = generatePassword();
    const hashed = await bcrypt.hash(plainPassword, 10);

    await pool.query(
      "INSERT INTO users(name,email,password,role) VALUES($1,$2,$3,$4)",
      [name, email, hashed, role]
    );

    res.json({ message: "User created", password: plainPassword });
  }
);

module.exports = router;