// // app.js
// // This is the main Express application file that sets up the server and imports the routes.

// // ----------------------
// // 1. Module Imports
// // ----------------------
// const express = require('express');
// const customerRoutes = require('./routes/customers');
// const orderRoutes = require('./routes/orders');
// const productRoutes = require('./routes/products');
// const { Pool } = require('pg');
// require('dotenv').config();

// // ----------------------
// // 2. Database Connection Check
// // ----------------------
// // Create a temporary pool to test the connection on startup
// const pool = new Pool({
//   host: process.env.PGHOST,
//   user: process.env.PGUSER,
//   password: process.env.PGPASSWORD,
//   database: process.env.PGDATABASE,
//   port: process.env.PGPORT,
// });

// pool.connect()
//   .then(client => {
//     console.log('✅ Successfully connected to the database.');
//     client.release(); // Release the client back to the pool
//   })
//   .catch(err => {
//     console.error('❌ Database connection error:', err.stack);
//     console.error('Please check your .env file and PostgreSQL server status.');
//     process.exit(1); // Exit the process if connection fails
//   });

// // ----------------------
// // 3. Express Application Setup
// // ----------------------
// const app = express();
// const port = 3000;

// // Middleware to parse JSON request bodies.
// app.use(express.json());

// // ----------------------
// // 4. API Routes
// // ----------------------
// // Mount the customer routes under the '/api/customers' base path.
// app.use('/api/customers', customerRoutes);
// app.use('/api/orders', orderRoutes);
// app.use('/api/products', productRoutes);


// // Simple root endpoint for health check.
// app.get('/', (req, res) => {
//   res.send('Olist Customer API is running!');
// });

// // ----------------------
// // 5. Server Start
// // ----------------------
// // Start the Express server and listen on the specified port.
// app.listen(port, () => {
//   console.log(`🚀 Server listening at http://localhost:${port}`);
// });


// app.js
// This is the main Express application file that sets up the server and imports the routes.

// ----------------------
// 1. Module Imports
// ----------------------
const express = require('express');
const customerRoutes = require('./routes/customers');
const orderRoutes = require('./routes/orders');
const productRoutes = require('./routes/products');
const sellerRoutes = require('./routes/sellers');
const orderpaymentsRoutes = require('./routes/order-payments');
const reviewsRoutes = require('./routes/order-reviews');
const analyticsRoutes = require('./routes/analytics');
require('dotenv').config();

// The database connection is now handled and exported by config/db.js,
// so we don't need to define it here.
const db = require('./config/db');

// ----------------------
// 2. Express Application Setup
// ----------------------
const app = express();
const port = 3000;

// Middleware to parse JSON request bodies.
app.use(express.json());

// ----------------------
// 3. API Routes
// ----------------------
// Mount the customer routes under the '/api/customers' base path.
app.use('/api/customers', customerRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/products', productRoutes);
app.use('/api/sellers', sellerRoutes);
app.use('/api/order-payments', orderpaymentsRoutes);
app.use('/api/reviews', reviewsRoutes);
app.use('/api/analytics', analyticsRoutes);

// Simple root endpoint for health check.
app.get('/', (req, res) => {
  res.send('Olist API is running!');
});

// ----------------------
// 4. Server Start
// ----------------------
// Check database connection before starting the server
db.pool.connect()
  .then(client => {
    console.log('✅ Successfully connected to the database.');
    client.release(); // Release the client back to the pool

    // Start the Express server and listen on the specified port.
    app.listen(port, () => {
      console.log(`🚀 Server listening at http://localhost:${port}`);
    });
  })
  .catch(err => {
    console.error('❌ Database connection error:', err.stack);
    console.error('Please check your .env file and PostgreSQL server status.');
    process.exit(1); // Exit the process if connection fails
  });
