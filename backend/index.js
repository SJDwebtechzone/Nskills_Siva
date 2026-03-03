const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const { Pool } = require('pg');

dotenv.config();

const app = express();

// 🔥 PostgreSQL Connection
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

pool.connect()
  .then(() => console.log("✅ Database Connected Successfully"))
  .catch((err) => console.error("❌ Database Connection Failed:", err));

// middleware
app.use(cors());
app.use(express.json());

// routes
app.get('/', (req, res) => {
  res.send('API is running');
});

// custom routes
const userRoutes = require('./routes/userRoutes');
app.use('/api/users', userRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});