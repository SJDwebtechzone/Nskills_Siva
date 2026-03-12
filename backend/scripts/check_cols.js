const pool = require("../config/db");

async function checkCols() {
  try {
    const res = await pool.query(`SELECT column_name FROM information_schema.columns WHERE table_name = 'career_counsellors';`);
    console.log("Columns in career_counsellors:", res.rows.map(r => r.column_name));
  } catch (err) {
    console.error("Error checking columns:", err);
  } finally {
    pool.end();
  }
}

checkCols();
