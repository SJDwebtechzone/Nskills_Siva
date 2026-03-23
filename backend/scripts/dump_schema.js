const pg = require('pg');
const pool = new pg.Pool({ user: 'postgres', host: 'localhost', database: 'NSKILL', password: 'postgres', port: 5432 });

async function fullSchema() {
    try {
        const { rows: tables } = await pool.query(`SELECT table_name FROM information_schema.tables WHERE table_schema = 'public'`);
        
        console.log("-- NSKILL Database Complete Schema\n");

        for (const t of tables) {
            const tableName = t.table_name;
            const { rows: columns } = await pool.query(`
                SELECT column_name, data_type, is_nullable, character_maximum_length, column_default 
                FROM information_schema.columns 
                WHERE table_name = $1
                ORDER BY ordinal_position
            `, [tableName]);

            console.log(`-- Table: ${tableName}`);
            console.log(`CREATE TABLE ${tableName} (`);
            const colStrings = columns.map(c => {
                let s = `  ${c.column_name} ${c.data_type.toUpperCase()}`;
                if (c.character_maximum_length) s += `(${c.character_maximum_length})`;
                if (c.is_nullable === 'NO') s += ' NOT NULL';
                if (c.column_default) s += ` DEFAULT ${c.column_default}`;
                return s;
            });
            console.log(colStrings.join(",\n"));
            console.log(`);\n`);
        }
    } catch (err) {
        console.error(err);
    } finally {
        await pool.end();
    }
}

fullSchema();
