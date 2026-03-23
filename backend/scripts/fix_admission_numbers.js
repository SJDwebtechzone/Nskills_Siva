const pool = require("../config/db");

async function fixAdmissionNumbers() {
    try {
        console.log("Fixing admission numbers...");
        const res = await pool.query(`
            UPDATE student_admissions 
            SET admission_number = enquiry_id 
            WHERE admission_number IS NULL OR admission_number = '' OR admission_number ~ '^[0-9]+$'
        `);
        console.log(`Updated ${res.rowCount} records.`);
        process.exit(0);
    } catch (err) {
        console.error("Error fixing admission numbers:", err.message);
        process.exit(1);
    }
}

fixAdmissionNumbers();
