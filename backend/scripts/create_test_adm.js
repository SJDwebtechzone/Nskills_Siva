const pg = require('pg');
const pool = new pg.Pool({ user: 'postgres', host: 'localhost', database: 'NSKILL', password: 'postgres', port: 5432 });

async function check() {
    try {
        console.log("Creating test admission...");
        const res = await pool.query(`INSERT INTO student_admissions 
            (full_name, email_id, mobile_number, dob, payment_date, counselling_date, created_by_id) 
            VALUES ($1, $2, $3, NOW(), NOW(), NOW(), $4) RETURNING *`, 
            ['Pending Test Student', 'pending_test@example.com', '9999999999', 1]);
        console.log("Success:", res.rows[0]);
    } catch (err) {
        console.error(err);
    } finally {
        await pool.end();
    }
}

check();
