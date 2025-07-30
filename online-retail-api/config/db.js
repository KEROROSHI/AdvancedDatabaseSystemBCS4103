// const { Pool } = require('pg');  // Make sure this line is at the top

// // Validate environment variables
// const requiredVars = ['DB_HOST', 'DB_PORT', 'DB_USER', 'DB_PASSWORD', 'DB_NAME'];
// requiredVars.forEach(varName => {
//   if (!process.env[varName]) {
//     console.error(`Missing required environment variable: ${varName}`);
//     process.exit(1);
//   }
// });

// const poolConfig = {
//   host: process.env.DB_HOST,
//   port: parseInt(process.env.DB_PORT),
//   user: process.env.DB_USER,
//   password: process.env.DB_PASSWORD,
//   database: process.env.DB_NAME,
//   ssl: false,
//   connectionTimeoutMillis: 5000
// };

// console.log('Database connection config:', {
//   ...poolConfig,
//   password: poolConfig.password ? '*****' : 'undefined'
// });

// const pool = new Pool(poolConfig);

// // Test connection immediately
// pool.query('SELECT NOW()')
//   .then(res => console.log('✅ Database connected at:', res.rows[0].now))
//   .catch(err => {
//     console.error('❌ Database connection failed:', err);
//     process.exit(1);
//   });

// module.exports = {
//   query: (text, params) => pool.query(text, params),
//   getClient: () => pool.connect()
// };

const { Pool } = require('pg');

// Validate environment variables
const requiredVars = ['DB_HOST', 'DB_PORT', 'DB_USER', 'DB_PASSWORD', 'DB_NAME'];
requiredVars.forEach(varName => {
  if (!process.env[varName]) {
    throw new Error(`Missing required environment variable: ${varName}`);
  }
});

const pool = new Pool({
  host: process.env.DB_HOST,
  port: parseInt(process.env.DB_PORT),
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  ssl: process.env.DB_SSL === 'true' ? { rejectUnauthorized: false } : false,
  connectionTimeoutMillis: 5000,
  idleTimeoutMillis: 30000
});

// Test connection
pool.query('SELECT NOW()')
  .then(() => console.log('Database connected successfully'))
  .catch(err => {
    console.error('Database connection failed:', err);
    process.exit(1);
  });

// Export both query and pool
module.exports = {
  query: (text, params) => pool.query(text, params),
  pool  // Make sure this is exported
};