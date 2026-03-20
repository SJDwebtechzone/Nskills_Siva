const pool = require("../config/db");

async function setupAttendance() {
    try {
        console.log("Setting up attendance table...");
        
        await pool.query(`
            CREATE TABLE IF NOT EXISTS attendance (
                id SERIAL PRIMARY KEY,
                admission_id INTEGER REFERENCES student_admissions(id) ON DELETE CASCADE,
                date DATE NOT NULL,
                batch VARCHAR(50) NOT NULL,
                status VARCHAR(20) NOT NULL,
                punch_in TIME,
                punch_out TIME,
                remarks TEXT,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                UNIQUE(admission_id, date, batch)
            );
        `);
        
        console.log("Attendance table ready!");

        // Add 'Attendance' module to permissions if not exists
        const modules = ['Daily Attendance', 'Attendance Status'];
        for (const mod of modules) {
            await pool.query(`
                INSERT INTO modules (name, slug)
                VALUES ($1, $2)
                ON CONFLICT (slug) DO NOTHING
            `, [mod, mod.toLowerCase().replace(/ /g, '-')]);
        }
        
    } catch (err) {
        console.error("Setup error:", err.message);
    } finally {
        pool.end();
    }
}

setupAttendance();
