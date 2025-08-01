const db = require('./db');

async function initializeDatabase() {
  try {
    console.log('Initializing database procedures...');
    
    // First, add the columns if they don't exist
    await db.query(`
      DO $$
      BEGIN
        -- Add total_spent column if it doesn't exist
        IF NOT EXISTS (
          SELECT 1 
          FROM information_schema.columns 
          WHERE table_name = 'olist_customers' AND column_name = 'total_spent'
        ) THEN
          ALTER TABLE olist_customers ADD COLUMN total_spent NUMERIC DEFAULT 0;
        END IF;
        
        -- Add segment column if it doesn't exist
        IF NOT EXISTS (
          SELECT 1 
          FROM information_schema.columns 
          WHERE table_name = 'olist_customers' AND column_name = 'segment'
        ) THEN
          ALTER TABLE olist_customers ADD COLUMN segment VARCHAR(20) DEFAULT 'New';
        END IF;
      END
      $$;
    `);

    // Create or replace the function
    await db.query(`
      CREATE OR REPLACE FUNCTION update_customer_segments()
      RETURNS VOID AS $$
      BEGIN
        -- Update total_spent for all customers
        UPDATE olist_customers c SET total_spent = (
          SELECT COALESCE(SUM(oi.price), 0)
          FROM olist_orders o
          JOIN olist_order_items oi ON o.order_id = oi.order_id
          WHERE o.customer_id = c.customer_id
        );

        -- Update segments based on total_spent
        UPDATE olist_customers
        SET segment = CASE
          WHEN total_spent >= 1000 THEN 'Premium'
          WHEN total_spent >= 100 THEN 'Regular'
          ELSE 'New'
        END;
      END;
      $$ LANGUAGE plpgsql;
    `);
    
    // Execute the function to populate segments
    await db.query('SELECT update_customer_segments()');
    console.log('Database procedures initialized successfully');
  } catch (error) {
    console.error('Database initialization error:', error);
    throw error; // Rethrow to ensure startup fails if initialization fails
  }
}

module.exports = initializeDatabase;