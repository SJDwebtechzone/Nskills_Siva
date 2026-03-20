const pool = require('../config/db');

async function getFullSchema() {
    try {
        const tablesRes = await pool.query(`
            SELECT table_name 
            FROM information_schema.tables 
            WHERE table_schema = 'public'
        `);
        
        const tables = tablesRes.rows.map(r => r.table_name);
        
        console.log("-- NSKILL2 DATABASE SCHEMA DUMP\n");
        
        for (const table of tables) {
            const columnsRes = await pool.query(`
                SELECT column_name, data_type, character_maximum_length, is_nullable, column_default
                FROM information_schema.columns
                WHERE table_name = $1
                ORDER BY ordinal_position
            `, [table]);
            
            console.log(`-- Table: ${table}`);
            console.log(`CREATE TABLE IF NOT EXISTS ${table} (`);
            const cols = columnsRes.rows.map(c => {
                let def = `  ${c.column_name} ${c.data_type.toUpperCase()}`;
                if (c.character_maximum_length) def += `(${c.character_maximum_length})`;
                if (c.is_nullable === 'NO') def += " NOT NULL";
                if (c.column_default) def += ` DEFAULT ${c.column_default}`;
                return def;
            });
            console.log(cols.join(",\n"));
            console.log(");\n");
        }
        process.exit();
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
}

getFullSchema();
