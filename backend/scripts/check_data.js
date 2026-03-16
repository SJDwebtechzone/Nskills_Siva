const pool = require("../config/db");

async function run() {
    const r = await pool.query("SELECT id, enquiry_id, full_name, created_at FROM student_admissions ORDER BY created_at DESC LIMIT 10");
    console.log("=== Recent Admissions ===");
    if (r.rows.length === 0) {
        console.log("No admissions found.");
    } else {
        r.rows.forEach(a => console.log(` ID:${a.id} | ENQ:${a.enquiry_id} | ${a.full_name} | ${a.created_at}`));
    }
    
    const eq = await pool.query("SELECT id, enquiry_id, student_name FROM student_enquiries ORDER BY created_at DESC LIMIT 10");
    console.log("\n=== Recent Enquiries ===");
    if (eq.rows.length === 0) {
        console.log("No enquiries found.");
    } else {
        eq.rows.forEach(e => console.log(` ID:${e.id} | ENQ:${e.enquiry_id} | ${e.student_name}`));
    }
    
    await pool.end();
}

run().catch(e => { console.error(e.message); process.exit(1); });
