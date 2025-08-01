// config/db.js
// This file centralizes the PostgreSQL database connection pool.

// ----------------------
// 1. Module Imports
// ----------------------
const { Pool } = require('pg');

// ----------------------
// 2. Database Connection Configuration
// ----------------------
const pool = new Pool({
  host: process.env.PGHOST,
  user: process.env.PGUSER,
  password: process.env.PGPASSWORD,
  database: process.env.PGDATABASE,
  port: process.env.PGPORT,
});

// Add an event listener to log connection success or errors.
pool.on('connect', () => {
  console.log('Database pool connected.');
});

pool.on('error', (err) => {
  console.error('Unexpected error on idle client', err);
  process.exit(-1);
});

// ----------------------
// 3. Module Export
// ----------------------
// Export the pool for use in other modules.
module.exports = {
  query: (text, params) => pool.query(text, params),
  pool,
};
