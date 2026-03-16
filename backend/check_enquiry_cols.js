const pool = require("./config/db");

async function check() {
  const result = await pool.query(`
    SELECT column_name, data_type 
    FROM information_schema.columns 
    WHERE table_name = 'student_enquiries'
  `);
  console.table(result.rows);
  process.exit(0);
}
check();
