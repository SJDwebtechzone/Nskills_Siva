const jwt = require("jsonwebtoken");
const pool = require("../config/db");
const SECRET = process.env.JWT_SECRET || "mysecret";

function authMiddleware(req, res, next) {
  try {
    const token = req.headers.authorization?.split(" ")[1];
    if (!token)
      return res.status(401).json({ message: "Unauthorized" });

    const decoded = jwt.verify(token, SECRET);
    req.user = decoded; // { id, roleId, roleName }
    next();

  } catch (err) {
    return res.status(401).json({ message: "Invalid or expired token" });
  }
}

// Check specific permission on a module
function checkPermission(module, action) {
  return async (req, res, next) => {
    try {
      const result = await pool.query(
        `SELECT can_view, can_add, can_edit, can_delete
         FROM permissions
         WHERE role_id = $1 AND module = $2`,
        [req.user.roleId, module]
      );

      if (
        result.rows.length === 0 ||
        !result.rows[0][`can_${action}`]
      ) {
        return res.status(403).json({ message: "Access denied" });
      }

      next();
    } catch (err) {
      console.error("Permission check error:", err);
      res.status(500).json({ message: "Server error" });
    }
  };
}

module.exports = { authMiddleware, checkPermission };