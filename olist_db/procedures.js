require("dotenv").config();
const { Client } = require("pg");
const fs = require("fs");
const path = require("path");

const client = new Client({
    host: process.env.PGHOST,
    user: process.env.PGUSER,
    password: process.env.PGPASSWORD,
    database: process.env.PGDATABASE,
    port: process.env.PGPORT,
});

async function run() {
    console.log("🟡 Connecting to PostgreSQL...");
    try {
        await client.connect();
        console.log("✅ Connected.");

        await executeSQLFile("stored_procedures.sql");
        await executeSQLFile("triggers.sql");

        console.log("✅ All SQL files executed.");
    } catch (err) {
        console.error("❌ Connection or SQL error:", err.message);
    } finally {
        await client.end();
        console.log("🔌 Connection closed.");
    }
}

async function executeSQLFile(fileName) {
    try {
        const sqlPath = path.join(__dirname, fileName);
        const sql = fs.readFileSync(sqlPath).toString();

        console.log(`▶️ Running ${fileName}`);
        console.log("Sample content:", sql.slice(0, 100));

        await client.query(sql);
        console.log(`✅ Done with ${fileName}`);
    } catch (err) {
        console.error(`❌ Failed executing ${fileName}:`, err.message);
    }
}

run();
