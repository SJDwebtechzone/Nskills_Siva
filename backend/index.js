// const express = require('express');
// const cors = require('cors');
// const dotenv = require('dotenv');
// const { Pool } = require('pg');

// dotenv.config();

// const app = express();

// // 🔥 PostgreSQL Connection
// const pool = new Pool({
//   connectionString: process.env.DATABASE_URL,
// });

// pool.connect()
//   .then(() => console.log("✅ Database Connected Successfully"))
//   .catch((err) => console.error("❌ Database Connection Failed:", err));

// // middleware
// app.use(cors());
// app.use(express.json());

// // routes
// app.get('/', (req, res) => {
//   res.send('API is running');
// });

// // custom routes
// const userRoutes = require('./routes/userRoutes');
// app.use('/api/users', userRoutes);

// const PORT = process.env.PORT || 5000;
// app.listen(PORT, () => {
//   console.log(`Server running on port ${PORT}`);
// });

// require("dotenv").config();
// const express = require("express");
// const cors = require("cors");

// const authRoutes = require("./routes/auth");
// const userRoutes = require("./routes/users");
// const settingsRoutes = require("./routes/settings");
// const chatRoutes = require("./routes/chat");

// const app = express();
// app.use(cors());
// app.use(express.json());
// app.use("/uploads", express.static("uploads"));

// app.use("/api/settings", settingsRoutes);
// app.use("/api/users", userRoutes);
// app.use("/api/chat", chatRoutes);
// app.use("/api", authRoutes);

// app.listen(5000, () => {
//   console.log("Server running on port 5000");
// });


const express = require("express");
const cors    = require("cors");
require("dotenv").config();

const authRoutes      = require("./routes/auth");
const userRoutes      = require("./routes/users");
const associateRoutes = require("./routes/associate");
const rolesRouter = require("./routes/roles");

const settingsRoutes = require("./routes/settings");
const chatRoutes = require("./routes/chat");
const enquiriesRoutes = require("./routes/enquiries");
const admissionsRoutes = require("./routes/admissions");

const app  = express();
const PORT = process.env.PORT || 5000;

// ── Middleware ─────────────────────────────────────────────────────────────────
app.use(cors({ origin: "http://localhost:3000", credentials: true }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use("/uploads", express.static("uploads"));

// ── Routes ─────────────────────────────────────────────────────────────────────
app.use("/api/auth",      authRoutes);       // ✅ FIXED: was "/api" → now "/api/auth"
app.use("/api/users",     userRoutes);       // POST /api/users
app.use("/api/associate", associateRoutes);  // GET/POST /api/associate
app.use("/api/roles", rolesRouter);

// app.use("/api/popups", popupsRoutes);
app.use("/api/enquiries", enquiriesRoutes);
app.use("/api/admissions", admissionsRoutes);
app.use("/api/settings", settingsRoutes);
app.use("/api/chat", chatRoutes);

// app.use("/api", authRoutes);
// ── Health check ───────────────────────────────────────────────────────────────
app.get("/api/health", (req, res) => {
  res.json({ status: "ok", message: "NTSC API is running" });
});

// ── 404 handler ────────────────────────────────────────────────────────────────
app.use((req, res) => {
  res.status(404).json({ error: `Route not found: ${req.method} ${req.url}` });
});

// ── Global error handler ───────────────────────────────────────────────────────
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: "Something went wrong!" });
});

app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
  console.log(`   Auth    → POST http://localhost:${PORT}/api/auth/login`);
  console.log(`   Users   → http://localhost:${PORT}/api/users`);
  console.log(`   Assoc   → http://localhost:${PORT}/api/associate`);
});
