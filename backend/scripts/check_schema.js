const pool = require("../config/db");
const fs = require('fs');

async function checkSchema() {
    try {
        const outputPath = 'scripts/constraints_output.txt';
        fs.writeFileSync(outputPath, "CONSTRAINTS:\n");
        const res = await pool.query(`
            SELECT conname, pg_get_constraintdef(c.oid)
            FROM pg_constraint c
            WHERE conrelid = 'student_admissions'::regclass
        `);
        res.rows.forEach(r => {
            fs.appendFileSync(outputPath, `${r.conname}: ${r.pg_get_constraintdef}\n`);
        });
        console.log(`Saved constraints to ${outputPath}`);
        process.exit(0);
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
}

checkSchema();
