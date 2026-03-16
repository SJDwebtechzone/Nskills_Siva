const pool = require('./config/db');
const fs = require('fs');
const path = require('path');

const runSQL = async () => {
    try {
        const sql = fs.readFileSync(path.join(__dirname, 'associate_tracking_schema.sql'), 'utf8');
        await pool.query(sql);
        console.log("Associate tracking and Referral points tables/columns created successfully.");
        process.exit(0);
    } catch (err) {
        console.error("Error updating database:", err.message);
        process.exit(1);
    }
};

runSQL();
