const pool = require('./config/db');

async function checkAndAddColumn() {
    try {
        console.log("Starting database update...");
        // Check if video_url exists
        const res = await pool.query(`
      SELECT column_name 
      FROM information_schema.columns 
      WHERE table_name='popups' AND column_name='video_url';
    `);

        if (res.rows.length === 0) {
            console.log("Adding video_url column to popups table...");
            await pool.query("ALTER TABLE popups ADD COLUMN video_url TEXT;");
            console.log("Column added successfully.");
        } else {
            console.log("Column video_url already exists.");
        }
    } catch (err) {
        console.error("CRITICAL ERROR updating database:");
        console.error(err);
        process.exit(1);
    } finally {
        await pool.end();
        console.log("Database connection closed.");
    }
}

checkAndAddColumn();
