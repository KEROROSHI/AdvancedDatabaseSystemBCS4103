require("dotenv").config();
const { Client } = require("pg");
const fs = require("fs");
const path = require("path");
const csv = require("csv-parser");

const client = new Client({
  host: process.env.PGHOST,
  user: process.env.PGUSER,
  password: process.env.PGPASSWORD,
  database: process.env.PGDATABASE,
  port: process.env.PGPORT,
});

const csvDir = path.join(__dirname, "inputs");

async function run() {
  await client.connect();
  await dropTables();
  await executeSQLFile("schema.sql");
  await importCSV("olist_customers_dataset.csv", "olist_customers");
  await importCSV("olist_geolocation_dataset.csv", "olist_geolocation");
  await importCSV("olist_products_dataset.csv", "olist_products");
  await importCSV("olist_sellers_dataset.csv", "olist_sellers");
  await importCSV("olist_orders_dataset.csv", "olist_orders");
  await importCSV("olist_order_items_dataset.csv", "olist_order_items");
  await importCSV("olist_order_payments_dataset.csv", "olist_order_payments");
  await importCSV("olist_order_reviews_dataset.csv", "olist_order_reviews");
  console.log("✅ Data import complete.");
  await client.end();
}

async function dropTables() {
  await client.query("DROP SCHEMA public CASCADE; CREATE SCHEMA public;");
}

async function executeSQLFile(fileName) {
  const sql = fs.readFileSync(path.join(__dirname, fileName)).toString();
  await client.query(sql);
}

async function importCSV(fileName, tableName) {
  return new Promise((resolve, reject) => {
    const filePath = path.join(csvDir, fileName);
    const rows = [];
    fs.createReadStream(filePath)
      .pipe(csv())
      .on("data", (row) => rows.push(row))
      .on("end", async () => {
        const columns = Object.keys(rows[0]);
        const placeholders = columns.map((_, i) => `$${i + 1}`).join(", ");
        const query = `INSERT INTO ${tableName} (${columns.join(", ")}) VALUES (${placeholders})`;
        for (let r of rows) {
          const values = columns.map((c) => (r[c] === "" ? null : r[c]));
          try {
            await client.query(query, values);
          } catch (e) {
            console.error("Insert error:", e.message);
          }
        }
        console.log(`Imported ${rows.length} records into ${tableName}`);
        resolve();
      });
  });
}

run().catch((err) => console.error("❌ Error:", err));
