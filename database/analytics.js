require("dotenv").config();
const { Client } = require("pg");

const client = new Client({
  host: process.env.PGHOST,
  user: process.env.PGUSER,
  password: process.env.PGPASSWORD,
  database: process.env.PGDATABASE,
  port: process.env.PGPORT,
});

async function getSales(start, end, country = null) {
  await client.connect();

  console.log("▶️ Running get_sales_by_period with:");
  console.log("   Start:", start);
  console.log("   End:", end);
  console.log("   Country:", country);

  const result = await client.query(
    "SELECT * FROM get_sales_by_period($1::DATE, $2::DATE, $3::VARCHAR)",
    [start, end, country]
  );

  console.table(result.rows);
  await client.end();
}

// Set new arguments here
getSales("2018-01-01", "2018-12-31", "SP");
