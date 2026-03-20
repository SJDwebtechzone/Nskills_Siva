const pg = require('pg');
const pool = new pg.Pool({ 
    user: "postgres",
    host: "localhost",
    database: "NSKILL",
    password: "postgres",
    port: 5432,
});

async function getDetails() {
    try {
        const res = await pool.query(`
            SELECT table_name, column_name, data_type, is_nullable, column_default
            FROM information_schema.columns 
            WHERE table_name IN ('roles', 'users') 
            ORDER BY table_name, ordinal_position
        `);
        console.log(JSON.stringify(res.rows, null, 2));
    } catch (err) {
        console.error(err);
    } finally {
        await pool.end();
    }
}

getDetails();
