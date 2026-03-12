const pool = require("../config/db");

async function fixTable() {
  try {
    const res = await pool.query(`ALTER TABLE career_counsellors ADD COLUMN IF NOT EXISTS languages_other TEXT;`);
    console.log("Column languages_other added to career_counsellors successfully.", res);
  } catch (err) {
    console.error("Error modifying table:", err);
  } finally {
    pool.end();
  }
}

fixTable();
