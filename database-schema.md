Database Schema Documentation
This document describes the PostgreSQL database schema for the Online Retail Platform. It outlines the tables, their columns, relationships, and key database functions and triggers that define the system's data structure and behavior.

1. Table Schemas
olist_customers Table
Stores information about registered customers.

Column Name

Data Type

Constraints

Description

customer_id

VARCHAR or INTEGER

PRIMARY KEY

Unique identifier for the customer.

customer_name

VARCHAR(255)

NOT NULL

Full name of the customer.

email

VARCHAR(255)

NOT NULL, UNIQUE

Unique email address of the customer.

phone

VARCHAR(20)

NULLABLE

Customer's phone number.

country_id

INTEGER

NULLABLE, FOREIGN KEY

ID linking to a countries table (if exists).

segment

VARCHAR(50)

NULLABLE, DEFAULT 'New'

Automated customer segment (e.g., Premium, Regular, New).

created_at

TIMESTAMP WITH TIME ZONE

DEFAULT NOW()

Timestamp when the customer record was created.

olist_products Table
Stores details about products available in the catalog.

Column Name

Data Type

Constraints

Description

product_id

VARCHAR or INTEGER

PRIMARY KEY

Unique identifier for the product.

stock_code

VARCHAR(50)

NOT NULL, UNIQUE

Unique internal stock code for the product.

description

TEXT

NOT NULL

Detailed description of the product.

category_id

INTEGER

NOT NULL, FOREIGN KEY

ID linking to a product categories table.

unit_price

NUMERIC(10, 2)

NOT NULL

Price of a single unit of the product.

stock

INTEGER

NOT NULL, DEFAULT 100

Current quantity of the product in stock.

seller_id

VARCHAR or INTEGER

NULLABLE, FOREIGN KEY

ID linking to the olist_sellers table (if applicable).

created_at

TIMESTAMP WITH TIME ZONE

DEFAULT NOW()

Timestamp when the product record was added.

olist_orders Table
Records details of customer orders.

Column Name

Data Type

Constraints

Description

order_id

VARCHAR or INTEGER

PRIMARY KEY

Unique identifier for the order.

customer_id

VARCHAR or INTEGER

NOT NULL, FOREIGN KEY

ID of the customer who placed the order.

invoice_no

VARCHAR(50)

NULLABLE, UNIQUE

Unique invoice number for the order.

order_date

TIMESTAMP WITH TIME ZONE

DEFAULT NOW()

Date and time the order was placed.

total_amount

NUMERIC(10, 2)

NOT NULL

Total calculated amount of the order.

status

VARCHAR(50)

NOT NULL, DEFAULT 'pending'

Current status of the order (e.g., pending, completed, shipped, cancelled).

olist_order_items Table
Details individual products within an order.

Column Name

Data Type

Constraints

Description

order_item_id

SERIAL

PRIMARY KEY

Unique identifier for the order item.

order_id

VARCHAR or INTEGER

NOT NULL, FOREIGN KEY

Links to the olist_orders table.

product_id

VARCHAR or INTEGER

NOT NULL, FOREIGN KEY

Links to the olist_products table.

quantity

INTEGER

NOT NULL, CHECK (quantity > 0)

Quantity of the product ordered.

price_at_time

NUMERIC(10, 2)

NOT NULL

Unit price of the product at the time of order.

olist_sellers Table
Stores information about product sellers.

Column Name

Data Type

Constraints

Description

seller_id

VARCHAR or INTEGER

PRIMARY KEY

Unique identifier for the seller.

seller_name

VARCHAR(255)

NOT NULL

Name of the seller.

email

VARCHAR(255)

NOT NULL, UNIQUE

Contact email for the seller.

created_at

TIMESTAMP WITH TIME ZONE

DEFAULT NOW()

Timestamp when the seller record was created.

olist_payments Table
Records payment transactions for orders.

Column Name

Data Type

Constraints

Description

payment_id

SERIAL

PRIMARY KEY

Unique identifier for the payment record.

order_id

VARCHAR or INTEGER

NOT NULL, FOREIGN KEY

Links to the olist_orders table.

payment_method

VARCHAR(50)

NOT NULL

Method of payment (e.g., Credit Card, PayPal).

amount

NUMERIC(10, 2)

NOT NULL

Amount of the payment.

payment_date

TIMESTAMP WITH TIME ZONE

DEFAULT NOW()

Date and time the payment was made.

status

VARCHAR(50)

NOT NULL

Status of the payment (e.g., completed, pending, failed).

olist_reviews Table
Stores customer reviews for products/orders.

Column Name

Data Type

Constraints

Description

review_id

SERIAL

PRIMARY KEY

Unique identifier for the review.

order_id

VARCHAR or INTEGER

NULLABLE, FOREIGN KEY

Links to the olist_orders table.

customer_id

VARCHAR or INTEGER

NOT NULL, FOREIGN KEY

Links to the olist_customers table.

product_id

VARCHAR or INTEGER

NOT NULL, FOREIGN KEY

Links to the olist_products table.

rating

INTEGER

NOT NULL, CHECK (rating BETWEEN 1 AND 5)

Rating given by the customer (1-5 stars).

comment

TEXT

NULLABLE

Customer's written feedback.

review_date

TIMESTAMP WITH TIME ZONE

DEFAULT NOW()

Date and time the review was submitted.

2. Database Functions and Triggers
update_inventory_on_order() Function
This PostgreSQL PL/pgSQL function is crucial for real-time inventory management. It is triggered after a new item is inserted into the olist_order_items table. It automatically decrements the stock quantity of the corresponding product and prevents overselling by raising an exception if stock would fall below zero.

CREATE OR REPLACE FUNCTION update_inventory_on_order()
RETURNS TRIGGER AS $$
BEGIN
    -- Decrement the stock of the product by the quantity ordered
    UPDATE olist_products
    SET stock = stock - NEW.quantity
    WHERE product_id = NEW.product_id;

    -- Check if stock has fallen below zero after the update
    IF (SELECT stock FROM olist_products WHERE product_id = NEW.product_id) < 0 THEN
        RAISE EXCEPTION 'Inventory below zero for product %!', NEW.product_id;
    END IF;

    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

trg_update_inventory Trigger
This trigger ensures that the update_inventory_on_order() function is executed automatically whenever a new record is inserted into the olist_order_items table.

CREATE TRIGGER trg_update_inventory
AFTER INSERT ON olist_order_items
FOR EACH ROW
EXECUTE FUNCTION update_inventory_on_order();

update_customer_segments() Function
This function (or a similar procedure) is responsible for automatically categorizing customers into different segments based on their historical spending or other defined criteria. This is typically run periodically or triggered by specific customer actions.

-- Conceptual SQL for update_customer_segments()
-- Actual implementation details would depend on specific segmentation logic (e.g., total spent, number of orders)
-- This function would update the 'segment' column in the olist_customers table.

CREATE OR REPLACE FUNCTION update_customer_segments()
RETURNS VOID AS $$
BEGIN
    -- Example logic: Update customers to 'Premium' if total spent > X, 'Regular' if > Y, else 'New'
    -- This is a simplified example; actual logic would be more complex.
    UPDATE olist_customers oc
    SET segment = CASE
        WHEN (SELECT SUM(oi.quantity * oi.price_at_time) FROM olist_orders o JOIN olist_order_items oi ON o.order_id = oi.order_id WHERE o.customer_id = oc.customer_id) > 1000 THEN 'Premium'
        WHEN (SELECT COUNT(o.order_id) FROM olist_orders o WHERE o.customer_id = oc.customer_id) > 5 THEN 'Regular'
        ELSE 'New'
    END;
END;
$$ LANGUAGE plpgsql;

get_sales_by_period() Function
This function provides aggregated sales analytics over a specified time range, with optional filtering by country.

CREATE OR REPLACE FUNCTION get_sales_by_period(
    start_date DATE,
    end_date DATE,
    country_filter VARCHAR DEFAULT NULL
)
RETURNS TABLE (
    total_revenue NUMERIC,
    total_orders BIGINT,
    avg_order_value NUMERIC,
    unique_customers BIGINT
) AS $$
BEGIN
    RETURN QUERY
    SELECT
        SUM(oi.quantity * oi.price_at_time) AS total_revenue,
        COUNT(DISTINCT o.order_id) AS total_orders,
        COALESCE(SUM(oi.quantity * oi.price_at_time) / NULLIF(COUNT(DISTINCT o.order_id), 0), 0) AS avg_order_value,
        COUNT(DISTINCT o.customer_id) AS unique_customers
    FROM
        olist_orders o
    JOIN
        olist_order_items oi ON o.order_id = oi.order_id
    LEFT JOIN
        olist_customers c ON o.customer_id = c.customer_id
    WHERE
        o.order_date::DATE BETWEEN start_date AND end_date
        AND (country_filter IS NULL OR c.country_id = (SELECT country_id FROM olist_countries WHERE country_name = country_filter LIMIT 1)); -- Assuming a olist_countries table
END;
$$ LANGUAGE plpgsql;

3. Relationships (Conceptual)
The following outlines the conceptual relationships between the tables. Actual foreign key constraints would be defined in the DDL (Data Definition Language) scripts.

olist_customers 1:M olist_orders (One customer can place many orders)

olist_orders 1:M olist_order_items (One order can have many items)

olist_products 1:M olist_order_items (One product can be in many order items)

olist_products 1:M olist_reviews (One product can have many reviews)

olist_customers 1:M olist_reviews (One customer can write many reviews)

olist_orders 1:M olist_payments (One order can have many payments)

olist_sellers 1:M olist_products (One seller can sell many products)