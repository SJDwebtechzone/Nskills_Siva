// middleware/authMiddleware.js
const jwt = require("jsonwebtoken");
const SECRET = "mysecret";

function authMiddleware(roles = []) {
  return (req, res, next) => {
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) return res.status(401).json({ message: "Unauthorized" });

    const decoded = jwt.verify(token, SECRET);

    if (roles.length && !roles.includes(decoded.role)) {
      return res.status(403).json({ message: "Forbidden" });
    }

    req.user = decoded;
    next();
  };
}

module.exports = authMiddleware;