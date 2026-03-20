const pool = require('../config/db');

async function getSeedData() {
    try {
        const roles = await pool.query("SELECT * FROM roles");
        const modules = await pool.query("SELECT * FROM modules");
        
        console.log("ROLES:" + JSON.stringify(roles.rows));
        console.log("MODULES:" + JSON.stringify(modules.rows));
        process.exit();
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
}

getSeedData();
