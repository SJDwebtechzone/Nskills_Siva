const pg = require('pg');
const pool = new pg.Pool({ user: 'postgres', host: 'localhost', database: 'NSKILL', password: 'postgres', port: 5432 });

async function migrate() {
    try {
        console.log("Migrating permissions from slugs to names...");
        // Get all modules to map slug -> name
        const { rows: modules } = await pool.query("SELECT name, slug FROM modules");
        
        for (const mod of modules) {
            const res = await pool.query(
                "UPDATE permissions SET module = $1 WHERE module = $2",
                [mod.name, mod.slug]
            );
            if (res.rowCount > 0) {
                console.log(`Updated ${res.rowCount} rows for ${mod.slug} -> ${mod.name}`);
            }
        }
        console.log("Migration complete.");
    } catch (err) {
        console.error(err);
    } finally {
        await pool.end();
    }
}

migrate();
