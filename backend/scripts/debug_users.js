const pg = require('pg');
const pool = new pg.Pool({ user: 'postgres', host: 'localhost', database: 'NSKILL', password: 'postgres', port: 5432 });

async function check() {
    try {
        const users = await pool.query('SELECT u.name, u.email, r.name as role FROM users u JOIN roles r ON u.role_id = r.id');
        console.log("ALL USERS:", JSON.stringify(users.rows, null, 2));

        const res = await pool.query('SELECT id, name FROM roles');
        console.log("ALL ROLES:", JSON.stringify(res.rows, null, 2));

    } catch (err) {
        console.error(err);
    } finally {
        await pool.end();
    }
}

check();
