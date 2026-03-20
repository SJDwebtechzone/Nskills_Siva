const pg = require('pg');
const pool = new pg.Pool({ connectionString: 'postgres://postgres:1234@localhost:5432/nskills2' });

async function getDetails() {
    try {
        const res = await pool.query(`
            SELECT table_name, column_name, data_type, is_nullable, column_default
            FROM information_schema.columns 
            WHERE table_name IN ('roles', 'users', 'trainee_credentials') 
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
