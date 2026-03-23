const pool = require("../config/db");
const fs = require('fs');

async function checkSchema() {
    try {
        const outputPath = 'scripts/referral_schema.txt';
        fs.writeFileSync(outputPath, "TABLE COLUMNS:\n");
        const res = await pool.query(`
            SELECT column_name, data_type, is_nullable
            FROM information_schema.columns 
            WHERE table_name = 'associate_referral_points'
            ORDER BY ordinal_position
        `);
        res.rows.forEach(c => {
            fs.appendFileSync(outputPath, `${c.column_name} (${c.data_type}) - ${c.is_nullable}\n`);
        });
        console.log(`Saved schema to ${outputPath}`);
        process.exit(0);
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
}

checkSchema();
