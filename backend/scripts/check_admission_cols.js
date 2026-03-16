const pool = require("../config/db");

async function run() {
    const r = await pool.query(
        `SELECT column_name, data_type, is_nullable FROM information_schema.columns WHERE table_name = 'student_admissions' ORDER BY ordinal_position`
    );
    const fs = require('fs');
    fs.writeFileSync('./admission_cols.txt', r.rows.map(row => `${row.column_name} | ${row.data_type} | nullable:${row.is_nullable}`).join('\n'));
    console.log("Written to admission_cols.txt");
    await pool.end();
}

run().catch(e => { console.error(e.message); process.exit(1); });
