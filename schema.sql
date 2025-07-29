-- ONLINE RETAIL E-COMMERCE DATABASE SCHEMA
-- Dataset: Online Retail Dataset
-- ====================================================================

-- 1. COUNTRIES TABLE (Lookup table for customer locations)
CREATE TABLE countries (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL UNIQUE,
    code VARCHAR(10) UNIQUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Insert common countries from the dataset
INSERT INTO countries (name, code) VALUES
('United Kingdom', 'UK'),
('France', 'FR'),
('Germany', 'DE'),
('Netherlands', 'NL'),
('Belgium', 'BE'),
('Switzerland', 'CH'),
('Spain', 'ES'),
('Norway', 'NO'),
('Portugal', 'PT'),
('Italy', 'IT'),
('Poland', 'PL'),
('Austria', 'AT'),
('Denmark', 'DK'),
('Japan', 'JP'),
('Australia', 'AU'),
('Singapore', 'SG'),
('Sweden', 'SE'),
('Finland', 'FI'),
('Cyprus', 'CY'),
('Greece', 'GR'),
('Iceland', 'IS'),
('Malta', 'MT'),
('Lithuania', 'LT'),
('Brazil', 'BR'),
('Czech Republic', 'CZ'),
('Bahrain', 'BH'),
('Saudi Arabia', 'SA'),
('United States', 'US'),
('Canada', 'CA'),
('Lebanon', 'LB'),
('Israel', 'IL'),
('United Arab Emirates', 'AE'),
('Other', 'OT');
-- ====================================================================

-- 2. CATEGORIES TABLE (Product organization)
CREATE TABLE categories (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL UNIQUE,
    description TEXT,
    parent_category_id INTEGER REFERENCES categories(id),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Insert product categories based on Online Retail dataset analysis
INSERT INTO categories (name, description) VALUES
('Home & Garden', 'Home decoration and garden items'),
('Gifts & Accessories', 'Gift items and personal accessories'),
('Kitchen & Dining', 'Kitchen utensils and dining accessories'),
('Stationery & Office', 'Office supplies and stationery items'),
('Seasonal Items', 'Christmas, Halloween and seasonal products'),
('Bags & Cases', 'Handbags, cases and storage solutions'),
('Toys & Games', 'Children toys and games'),
('Fashion & Jewelry', 'Clothing accessories and jewelry'),
('Candles & Lighting', 'Candles, lamps and lighting products'),
('Party Supplies', 'Party decorations and supplies'),
('Storage & Organization', 'Storage boxes and organization items'),
('Bathroom & Personal Care', 'Bathroom accessories and personal care'),
('Books & Media', 'Books, CDs and media products'),
('Electronics & Gadgets', 'Electronic accessories and gadgets'),
('Craft & Hobby', 'Craft supplies and hobby items'),
('Travel & Luggage', 'Travel accessories and luggage'),
('Pet Supplies', 'Pet accessories and supplies'),
('Other', 'Miscellaneous items');
-- ====================================================================

-- 3. CUSTOMERS TABLE (Customer information and segmentation)
CREATE TABLE customers (
    customer_id INTEGER PRIMARY KEY, -- Use original CustomerID from dataset
    customer_name VARCHAR(255),
    email VARCHAR(255) UNIQUE,
    phone VARCHAR(20),
    country_id INTEGER REFERENCES countries(id),
    registration_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    total_spent DECIMAL(12,2) DEFAULT 0.00,
    total_orders INTEGER DEFAULT 0,
    customer_segment VARCHAR(20) DEFAULT 'New', -- 'New', 'Regular', 'Premium', 'VIP'
    last_purchase_date TIMESTAMP,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
-- ====================================================================

-- 4. PRODUCTS TABLE (Product catalog with inventory)
CREATE TABLE products (
    product_id SERIAL PRIMARY KEY,
    stock_code VARCHAR(20) UNIQUE NOT NULL, -- From original StockCode
    description TEXT,
    category_id INTEGER REFERENCES categories(id),
    unit_price DECIMAL(10,2) NOT NULL,
    stock_quantity INTEGER DEFAULT 0,
    reorder_level INTEGER DEFAULT 10, -- For inventory management
    supplier_info TEXT,
    is_active BOOLEAN DEFAULT true,
    weight DECIMAL(8,2), -- For shipping calculations
    dimensions VARCHAR(50), -- Length x Width x Height
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
-- ====================================================================

-- 5. ORDERS TABLE (Order/Invoice information)
CREATE TABLE orders (
    order_id SERIAL PRIMARY KEY,
    invoice_no VARCHAR(20) UNIQUE NOT NULL, -- From original InvoiceNo
    customer_id INTEGER REFERENCES customers(customer_id),
    order_date TIMESTAMP NOT NULL,
    country_id INTEGER REFERENCES countries(id),
    total_amount DECIMAL(12,2),
    total_items INTEGER DEFAULT 0,
    status VARCHAR(20) DEFAULT 'pending', -- 'pending', 'processing', 'completed', 'cancelled', 'refunded'
    payment_method VARCHAR(50),
    shipping_cost DECIMAL(8,2) DEFAULT 0.00,
    tax_amount DECIMAL(8,2) DEFAULT 0.00,
    discount_amount DECIMAL(8,2) DEFAULT 0.00,
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
-- ====================================================================

-- 6. ORDER_ITEMS TABLE (Individual items within orders - Junction table)
CREATE TABLE order_items (
    id SERIAL PRIMARY KEY,
    order_id INTEGER REFERENCES orders(order_id) ON DELETE CASCADE,
    product_id INTEGER REFERENCES products(product_id),
    quantity INTEGER NOT NULL,
    unit_price DECIMAL(10,2) NOT NULL, -- Price at time of purchase
    line_total DECIMAL(12,2) NOT NULL, -- quantity * unit_price
    discount_percent DECIMAL(5,2) DEFAULT 0.00,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
-- ====================================================================

-- 7. ADDITIONAL E-COMMERCE TABLES
-- Customer Addresses (for shipping)
CREATE TABLE customer_addresses (
    id SERIAL PRIMARY KEY,
    customer_id INTEGER REFERENCES customers(customer_id),
    address_type VARCHAR(20) DEFAULT 'shipping', -- 'billing', 'shipping'
    address_line1 VARCHAR(255) NOT NULL,
    address_line2 VARCHAR(255),
    city VARCHAR(100) NOT NULL,
    state_province VARCHAR(100),
    postal_code VARCHAR(20),
    country_id INTEGER REFERENCES countries(id),
    is_default BOOLEAN DEFAULT false,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Inventory Tracking (for stock movements)
CREATE TABLE inventory_movements (
    id SERIAL PRIMARY KEY,
    product_id INTEGER REFERENCES products(product_id),
    movement_type VARCHAR(20) NOT NULL, -- 'in', 'out', 'adjustment'
    quantity INTEGER NOT NULL,
    reference_type VARCHAR(20), -- 'order', 'return', 'adjustment', 'restock'
    reference_id INTEGER, -- ID of the related order, return, etc.
    notes TEXT,
    movement_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    created_by VARCHAR(100)
);

-- Price History (for tracking price changes)
CREATE TABLE price_history (
    id SERIAL PRIMARY KEY,
    product_id INTEGER REFERENCES products(product_id),
    old_price DECIMAL(10,2),
    new_price DECIMAL(10,2) NOT NULL,
    change_reason VARCHAR(100),
    effective_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    created_by VARCHAR(100)
);
-- ====================================================================

-- 8. INDEXES FOR PERFORMANCE OPTIMIZATION
-- Primary indexes (automatically created for PRIMARY KEYS)
-- Foreign key indexes for better join performance
CREATE INDEX idx_customers_country ON customers(country_id);
CREATE INDEX idx_products_category ON products(category_id);
CREATE INDEX idx_products_stock_code ON products(stock_code);
CREATE INDEX idx_orders_customer ON orders(customer_id);
CREATE INDEX idx_orders_country ON orders(country_id);
CREATE INDEX idx_orders_invoice ON orders(invoice_no);
CREATE INDEX idx_order_items_order ON order_items(order_id);
CREATE INDEX idx_order_items_product ON order_items(product_id);

-- Date-based indexes for time-series queries
CREATE INDEX idx_orders_date ON orders(order_date);
CREATE INDEX idx_customers_registration ON customers(registration_date);
CREATE INDEX idx_customers_last_purchase ON customers(last_purchase_date);

-- Status and segment indexes for filtering
CREATE INDEX idx_orders_status ON orders(status);
CREATE INDEX idx_customers_segment ON customers(customer_segment);
CREATE INDEX idx_products_active ON products(is_active);

-- Composite indexes for common query patterns
CREATE INDEX idx_orders_customer_date ON orders(customer_id, order_date);
CREATE INDEX idx_products_category_price ON products(category_id, unit_price);
CREATE INDEX idx_customers_country_segment ON customers(country_id, customer_segment);
CREATE INDEX idx_orders_date_status ON orders(order_date, status);

-- Text search indexes for product descriptions
CREATE INDEX idx_products_description ON products USING gin(to_tsvector('english', description));
-- ====================================================================

-- 9. VIEWS FOR COMMON QUERIES
-- Customer Summary View
CREATE VIEW customer_summary AS
SELECT 
    c.customer_id,
    c.customer_name,
    c.email,
    co.name as country_name,
    c.customer_segment,
    c.total_spent,
    c.total_orders,
    c.last_purchase_date,
    c.registration_date,
    CASE 
        WHEN c.last_purchase_date >= CURRENT_DATE - INTERVAL '90 days' THEN 'Active'
        WHEN c.last_purchase_date >= CURRENT_DATE - INTERVAL '365 days' THEN 'Inactive'
        ELSE 'Dormant'
    END as activity_status
FROM customers c
LEFT JOIN countries co ON c.country_id = co.id;

-- Product Summary View
CREATE VIEW product_summary AS
SELECT 
    p.product_id,
    p.stock_code,
    p.description,
    cat.name as category_name,
    p.unit_price,
    p.stock_quantity,
    p.reorder_level,
    CASE 
        WHEN p.stock_quantity <= p.reorder_level THEN 'Low Stock'
        WHEN p.stock_quantity = 0 THEN 'Out of Stock'
        ELSE 'In Stock'
    END as stock_status,
    p.is_active
FROM products p
LEFT JOIN categories cat ON p.category_id = cat.id;

-- Order Summary View
CREATE VIEW order_summary AS
SELECT 
    o.order_id,
    o.invoice_no,
    o.customer_id,
    c.customer_name,
    o.order_date,
    co.name as country_name,
    o.total_amount,
    o.total_items,
    o.status,
    COUNT(oi.id) as line_items_count
FROM orders o
LEFT JOIN customers c ON o.customer_id = c.customer_id
LEFT JOIN countries co ON o.country_id = co.id
LEFT JOIN order_items oi ON o.order_id = oi.order_id
GROUP BY o.order_id, o.invoice_no, o.customer_id, c.customer_name, 
         o.order_date, co.name, o.total_amount, o.total_items, o.status;

-- Sales Analytics View
CREATE VIEW daily_sales_summary AS
SELECT 
    DATE(order_date) as sale_date,
    COUNT(*) as total_orders,
    SUM(total_amount) as total_revenue,
    AVG(total_amount) as avg_order_value,
    COUNT(DISTINCT customer_id) as unique_customers
FROM orders 
WHERE status IN ('completed', 'processing')
GROUP BY DATE(order_date)
ORDER BY sale_date DESC;
-- ====================================================================

-- 10. CONSTRAINTS AND BUSINESS RULES
-- Ensure positive quantities and prices
ALTER TABLE products ADD CONSTRAINT chk_positive_price CHECK (unit_price > 0);
ALTER TABLE products ADD CONSTRAINT chk_non_negative_stock CHECK (stock_quantity >= 0);
ALTER TABLE order_items ADD CONSTRAINT chk_positive_quantity CHECK (quantity > 0);
ALTER TABLE order_items ADD CONSTRAINT chk_positive_unit_price CHECK (unit_price > 0);
ALTER TABLE orders ADD CONSTRAINT chk_non_negative_total CHECK (total_amount >= 0);

-- Ensure valid customer segments
ALTER TABLE customers ADD CONSTRAINT chk_valid_segment 
CHECK (customer_segment IN ('New', 'Regular', 'Premium', 'VIP'));

-- Ensure valid order status
ALTER TABLE orders ADD CONSTRAINT chk_valid_status 
CHECK (status IN ('pending', 'processing', 'completed', 'cancelled', 'refunded'));
-- ====================================================================

-- 11. TRIGGERS (Basic setup - will be expanded by Member 3)
-- Function to update order totals
CREATE OR REPLACE FUNCTION update_order_totals()
RETURNS TRIGGER AS $$
BEGIN
    -- Update total_amount and total_items for the order
    UPDATE orders 
    SET total_amount = (
        SELECT COALESCE(SUM(line_total), 0) 
        FROM order_items 
        WHERE order_id = COALESCE(NEW.order_id, OLD.order_id)
    ),
    total_items = (
        SELECT COALESCE(SUM(quantity), 0) 
        FROM order_items 
        WHERE order_id = COALESCE(NEW.order_id, OLD.order_id)
    ),
    updated_at = CURRENT_TIMESTAMP
    WHERE order_id = COALESCE(NEW.order_id, OLD.order_id);
    
    RETURN COALESCE(NEW, OLD);
END;
$$ LANGUAGE plpgsql;

-- Trigger to automatically update order totals when order_items change
CREATE TRIGGER trg_update_order_totals
    AFTER INSERT OR UPDATE OR DELETE ON order_items
    FOR EACH ROW
    EXECUTE FUNCTION update_order_totals();

-- Function to update timestamps
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Triggers to automatically update updated_at timestamps
CREATE TRIGGER trg_customers_updated_at BEFORE UPDATE ON customers
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER trg_products_updated_at BEFORE UPDATE ON products
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER trg_orders_updated_at BEFORE UPDATE ON orders
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ====================================================================
-- 12. SAMPLE DATA INSERTION (Small test dataset)
-- Sample customers
INSERT INTO customers (customer_id, customer_name, email, country_id, customer_segment) VALUES
(12346, 'John Smith', 'john.smith@email.com', 1, 'Regular'),
(12347, 'Marie Dubois', 'marie.dubois@email.com', 2, 'Premium'),
(12348, 'Hans Mueller', 'hans.mueller@email.com', 3, 'New'),
(12349, 'Emma Johnson', 'emma.johnson@email.com', 1, 'VIP'),
(12350, 'Carlos Rodriguez', 'carlos.rodriguez@email.com', 7, 'Regular');

-- Sample products
INSERT INTO products (stock_code, description, category_id, unit_price, stock_quantity) VALUES
('22423', 'REGENCY CAKESTAND 3 TIER', 3, 12.75, 50),
('85123A', 'WHITE HANGING HEART T-LIGHT HOLDER', 9, 2.95, 100),
('71053', 'WHITE METAL LANTERN', 9, 3.39, 75),
('84406B', 'CREAM CUPID HEARTS COAT HANGER', 1, 2.75, 30),
('22720', 'SET OF 3 CAKE TINS PANTRY DESIGN', 3, 4.95, 25),
('21730', 'GLASS STAR FROSTED T-LIGHT HOLDER', 9, 4.25, 80),
('22633', 'HAND WARMER UNION JACK', 2, 1.85, 150),
('22632', 'HAND WARMER RED POLKA DOT', 2, 1.85, 120);

-- Sample orders
INSERT INTO orders (invoice_no, customer_id, order_date, country_id, status) VALUES
('536365', 12346, '2024-12-01 08:26:00', 1, 'completed'),
('536366', 12347, '2024-12-01 08:28:00', 2, 'completed'),
('536367', 12348, '2024-12-02 09:15:00', 3, 'processing'),
('536368', 12349, '2024-12-02 10:30:00', 1, 'completed'),
('536369', 12350, '2024-12-03 11:45:00', 7, 'pending');

-- Sample order items
INSERT INTO order_items (order_id, product_id, quantity, unit_price, line_total) VALUES
(1, 1, 6, 12.75, 76.50),
(1, 2, 6, 2.95, 17.70),
(2, 3, 8, 3.39, 27.12),
(2, 4, 6, 2.75, 16.50),
(3, 5, 2, 4.95, 9.90),
(3, 6, 6, 4.25, 25.50),
(4, 7, 10, 1.85, 18.50),
(4, 8, 8, 1.85, 14.80),
(5, 1, 2, 12.75, 25.50);


-- VERIFICATION QUERIES
-- Check table creation
SELECT 
    table_name, 
    table_type
FROM information_schema.tables 
WHERE table_schema = 'public' 
ORDER BY table_name;

-- Check relationships
SELECT
    tc.table_name, 
    kcu.column_name, 
    ccu.table_name AS foreign_table_name,
    ccu.column_name AS foreign_column_name 
FROM 
    information_schema.table_constraints AS tc 
    JOIN information_schema.key_column_usage AS kcu
      ON tc.constraint_name = kcu.constraint_name
      AND tc.table_schema = kcu.table_schema
    JOIN information_schema.constraint_column_usage AS ccu
      ON ccu.constraint_name = tc.constraint_name
      AND ccu.table_schema = tc.table_schema
WHERE tc.constraint_type = 'FOREIGN KEY' 
ORDER BY tc.table_name;

-- Check indexes
SELECT 
    schemaname,
    tablename,
    indexname,
    indexdef
FROM pg_indexes 
WHERE schemaname = 'public'
ORDER BY tablename, indexname;

-- Test data verification
SELECT 'Countries' as table_name, COUNT(*) as record_count FROM countries
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

-- Success message
SELECT 'Online Retail E-commerce Database Schema Created Successfully!' as status;