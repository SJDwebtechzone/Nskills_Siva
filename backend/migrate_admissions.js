const pool = require('./config/db');
const fs = require('fs');
const path = require('path');

const runSQL = async () => {
    try {
        const sql = fs.readFileSync(path.join(__dirname, 'admissions_schema.sql'), 'utf8');
        await pool.query(sql);
        console.log("Database table student_admissions created/updated successfully.");
        process.exit(0);
    } catch (err) {
        console.error("Error creating table:", err.message);
        process.exit(1);
    }
};

runSQL();
