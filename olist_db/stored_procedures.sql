CREATE OR REPLACE FUNCTION get_sales_by_period(
    start_date DATE,
    end_date DATE,
    country_filter VARCHAR DEFAULT NULL
)
RETURNS TABLE (
    total_revenue NUMERIC,
    total_orders INTEGER,
    avg_order_value NUMERIC,
    unique_customers INTEGER
) AS $$
BEGIN
    RETURN QUERY
    SELECT
        SUM(oi.price)::NUMERIC AS total_revenue,
        COUNT(DISTINCT o.order_id)::INT AS total_orders,
        AVG(oi.price)::NUMERIC AS avg_order_value,
        COUNT(DISTINCT o.customer_id)::INT AS unique_customers
    FROM olist_orders o
    JOIN olist_order_items oi ON o.order_id = oi.order_id
    JOIN olist_customers c ON o.customer_id = c.customer_id
    WHERE o.order_purchase_timestamp BETWEEN start_date AND end_date
      AND (country_filter IS NULL OR c.customer_state = country_filter);
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION update_customer_segments()
RETURNS VOID AS $$
BEGIN
    UPDATE olist_customers c SET total_spent = (
        SELECT SUM(price)
        FROM olist_orders o
        JOIN olist_order_items oi ON o.order_id = oi.order_id
        WHERE o.customer_id = c.customer_id
    );

    UPDATE olist_customers
    SET segment = CASE
        WHEN total_spent >= 1000 THEN 'Premium'
        WHEN total_spent >= 100 THEN 'Regular'
        ELSE 'New'
    END;
END;
$$ LANGUAGE plpgsql;

DO $$ BEGIN RAISE NOTICE 'Running updated stored_procedures.sql'; END $$;
