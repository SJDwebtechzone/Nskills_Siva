const pool = require("../config/db");
const bcrypt = require("bcryptjs");

// ✅ Set a new password for the Associate user
// Change 'NewPassword123' below to whatever password you want
const NEW_PASSWORD = "Associate@123";
const EMAIL = "Nagarjuncs20@gmail.com";

async function run() {
    const hash = await bcrypt.hash(NEW_PASSWORD, 10);
    const result = await pool.query(
        "UPDATE users SET password = $1 WHERE email = $2 RETURNING id, name, email",
        [hash, EMAIL]
    );
    if (result.rows.length === 0) {
        console.log("❌ No user found with that email!");
    } else {
        console.log("✅ Password reset successful!");
        console.log(`   User: ${result.rows[0].name}`);
        console.log(`   Email: ${result.rows[0].email}`);
        console.log(`   New Password: ${NEW_PASSWORD}`);
    }
    await pool.end();
}

run().catch(e => { console.error(e.message); process.exit(1); });
