const pg = require('pg');
const pool = new pg.Pool({ user: 'postgres', host: 'localhost', database: 'NSKILL', password: 'postgres', port: 5432 });

async function check() {
    try {
        console.log("--- Users ---");
        const users = await pool.query('SELECT name, email FROM users');
        console.log(users.rows);

        console.log("--- Admissions ---");
        const adms = await pool.query('SELECT full_name, email_id FROM student_admissions');
        console.log(adms.rows);

        console.log("--- Admissions without Users (The Query in no-credential) ---");
        const pending = await pool.query('SELECT full_name, email_id FROM student_admissions WHERE email_id NOT IN (SELECT email FROM users)');
        console.log(pending.rows);

    } catch (err) {
        console.error(err);
    } finally {
        await pool.end();
    }
}

check();
