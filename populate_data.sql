-- SQL COPY COMMAND APPROACH FOR ONLINE RETAIL DATA
-- 1. First create a temporary staging table that matches CSV structure
CREATE TEMP TABLE temp_online_retail (
    invoice_no VARCHAR(20),
    stock_code VARCHAR(20),
    description TEXT,
    quantity INTEGER,
    invoice_date TIMESTAMP,
    unit_price DECIMAL(10,2),
    customer_id INTEGER,
    country VARCHAR(100)
);

-- 2. Load CSV data directly into staging table
-- Note: Update the file path to match your CSV location
COPY temp_online_retail (invoice_no, stock_code, description, quantity, invoice_date, unit_price, customer_id, country)
FROM 'C:\temp\online_retail_data.csv'
DELIMITER ','
CSV HEADER;

-- 3. Clean the staging data
DELETE FROM temp_online_retail 
WHERE customer_id IS NULL 
   OR quantity <= 0 
   OR unit_price <= 0
   OR invoice_no LIKE 'C%';  -- Remove cancelled orders

-- 4. Populate countries from staging data
INSERT INTO countries (name, code)
SELECT DISTINCT 
    country,
    UPPER(LEFT(country, 3))
FROM temp_online_retail
WHERE country IS NOT NULL
ON CONFLICT (name) DO NOTHING;

-- 5. Populate customers with aggregated data
INSERT INTO customers (customer_id, customer_name, email, country_id, registration_date, total_spent, customer_segment)
SELECT 
    t.customer_id,
    'Customer_' || t.customer_id::text,
    'customer_' || t.customer_id::text || '@email.com',
    c.id,
    MIN(t.invoice_date),
    SUM(t.quantity * t.unit_price),
    CASE 
        WHEN SUM(t.quantity * t.unit_price) > 1000 THEN 'VIP'
        WHEN SUM(t.quantity * t.unit_price) > 500 THEN 'Premium'
        WHEN SUM(t.quantity * t.unit_price) > 100 THEN 'Regular'
        ELSE 'New'
    END
FROM temp_online_retail t
JOIN countries c ON c.name = t.country
GROUP BY t.customer_id, c.id
ON CONFLICT (customer_id) DO NOTHING;

-- 6. Populate products with category classification
INSERT INTO products (stock_code, description, category_id, unit_price, stock_quantity)
SELECT DISTINCT
    t.stock_code,
    t.description,
    CASE 
        WHEN LOWER(t.description) ~ 'cake|tin|kitchen|cup|plate|bowl' THEN 
            (SELECT id FROM categories WHERE name = 'Kitchen & Dining')
        WHEN LOWER(t.description) ~ 'candle|light|lantern|holder' THEN 
            (SELECT id FROM categories WHERE name = 'Candles & Lighting')
        WHEN LOWER(t.description) ~ 'bag|case|storage|box' THEN 
            (SELECT id FROM categories WHERE name = 'Bags & Cases')
        WHEN LOWER(t.description) ~ 'christmas|decoration|ornament' THEN 
            (SELECT id FROM categories WHERE name = 'Seasonal Items')
        WHEN LOWER(t.description) ~ 'heart|love|gift' THEN 
            (SELECT id FROM categories WHERE name = 'Gifts & Accessories')
        WHEN LOWER(t.description) ~ 'garden|plant|flower' THEN 
            (SELECT id FROM categories WHERE name = 'Home & Garden')
        ELSE (SELECT id FROM categories WHERE name = 'Other')
    END,
    AVG(t.unit_price),
    GREATEST(CAST(SUM(t.quantity) * 1.5 AS INTEGER), 10)
FROM temp_online_retail t
GROUP BY t.stock_code, t.description
ON CONFLICT (stock_code) DO NOTHING;

-- 7. Populate orders
INSERT INTO orders (invoice_no, customer_id, order_date, country_id, status)
SELECT DISTINCT
    t.invoice_no,
    t.customer_id,
    t.invoice_date,
    c.id,
    'completed'
FROM temp_online_retail t
JOIN countries c ON c.name = t.country
ON CONFLICT (invoice_no) DO NOTHING;

-- 8. Populate order items
INSERT INTO order_items (order_id, product_id, quantity, unit_price, line_total)
SELECT 
    o.order_id,
    p.product_id,
    t.quantity,
    t.unit_price,
    t.quantity * t.unit_price
FROM temp_online_retail t
JOIN orders o ON o.invoice_no = t.invoice_no
JOIN products p ON p.stock_code = t.stock_code;

-- 9. Update customer statistics (since triggers might not have run during bulk insert)
UPDATE customers 
SET total_orders = (
    SELECT COUNT(*) 
    FROM orders 
    WHERE orders.customer_id = customers.customer_id
),
last_purchase_date = (
    SELECT MAX(order_date) 
    FROM orders 
    WHERE orders.customer_id = customers.customer_id
);

-- 10. Drop temporary table
DROP TABLE temp_online_retail;

-- 11. Verify the population
SELECT 'Countries' as table_name, COUNT(*) as records FROM countries
UNION ALL
SELECT 'Categories', COUNT(*) FROM categories  
UNION ALL
SELECT 'Customers', COUNT(*) FROM customers
UNION ALL
SELECT 'Products', COUNT(*) FROM products
UNION ALL
SELECT 'Orders', COUNT(*) FROM orders
UNION ALL
SELECT 'Order Items', COUNT(*) FROM order_items;

-- 12. Show sample data verification
SELECT 
    c.customer_name,
    c.customer_segment,
    c.total_spent,
    c.total_orders,
    co.name as country
FROM customers c
JOIN countries co ON c.country_id = co.id
ORDER BY c.total_spent DESC
LIMIT 10;