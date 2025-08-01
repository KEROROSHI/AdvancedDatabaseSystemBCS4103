Business Logic Overview
This document provides a high-level overview of the key business processes and underlying logic implemented within the Online Retail Platform. It explains how various operations are handled to ensure a seamless e-commerce experience.

1. Customer Management Logic
The system manages customer data with a focus on profile integrity and segmentation.

Customer Registration & Profile
Unique Identification: Each customer is uniquely identified, primarily by their customer_id and email address. The system enforces unique email addresses to prevent duplicate accounts.

Data Capture: Essential customer details such as customer_name, email, phone, and country_id are captured during registration and can be updated.

Account Creation: Upon successful registration, a new customer record is created in the database.

Customer Segmentation
Automated Tiering: The update_customer_segments() database function automatically categorizes customers into predefined tiers (e.g., "Premium," "Regular," "New"). This segmentation is typically based on criteria such as total spending, number of orders, or recent activity.

Purpose: Customer segments are used for targeted marketing, loyalty programs, and personalized user experiences.

2. Product Catalog Management Logic
The product catalog is designed to be dynamic and support various product attributes and stock management.

Product Definition
Core Attributes: Each product is defined by a unique stock_code, description, category_id, unit_price, and stock_quantity.

Categorization: Products are organized into categories (category_id) to facilitate browsing and filtering.

Product Availability & Filtering
Filtering: Users can retrieve products based on category, minPrice, and maxPrice to refine their search.

Low Stock Alerts: The system can identify and list products that are below a predefined low-stock threshold, aiding inventory management.

3. Order Processing Workflow
The order processing flow is designed for efficiency, accuracy, and real-time inventory updates.

Order Creation
Customer & Items: An order is created by a customer_id and includes a list of items, each with a product_id and quantity.

Invoice Number: Orders are assigned an invoice_no for tracking.

Order Date: The order_date records when the order was placed.

Real-time Inventory Deduction
Automated Trigger: A critical piece of business logic is the trg_update_inventory database trigger. This trigger is activated AFTER INSERT ON olist_order_items.

Stock Update: For every item added to an order, the trigger automatically decrements the stock of the corresponding olist_products entry by the ordered quantity.

Overselling Prevention: The update_inventory_on_order() function (executed by the trigger) includes a check to ensure that stock does not fall below zero. If it would, the transaction is rolled back, and an exception is raised, preventing overselling.

Order Status Management
Lifecycle: Orders progress through various statuses: pending, processing, shipped, delivered, and cancelled.

Status Updates: The PATCH /api/orders/:id/status API allows for explicit status changes. Business rules may dictate valid transitions between statuses (e.g., cannot go directly from pending to delivered).

Order Cancellation
Stock Reversal: When an order is cancelled (DELETE /api/orders/:id), the system's business logic may include a process (either automated or manual) to reverse the stock deduction, returning the items to inventory. The specific implementation depends on the order's status at the time of cancellation.

4. Seller Management Logic
The platform supports multiple sellers, each managing their own product listings.

Seller Registration & Profile
Seller Identification: Each seller has a unique seller_id, seller_name, and email.

Product Association: Products are linked to sellers, allowing retrieval of all products sold by a specific seller.

5. Order Items, Payments, and Reviews Logic
These components support the detailed aspects of order fulfillment and customer feedback.

Order Items
Granular Tracking: Each order_item represents a specific product and quantity within an order, capturing the price_at_time of purchase.

Modifications: Adding, updating, or deleting order items typically triggers corresponding inventory adjustments.

Payments
Payment Records: The system records payment details for each order, including payment_method, amount, payment_date, and status.

Status Tracking: Payment statuses (completed, pending, failed, refunded) are tracked to reflect the transaction's state.

Reviews
Customer Feedback: Customers can submit reviews for products, including a rating and comment.

Average Scores: The system can calculate average review scores over specified periods, providing insights into product satisfaction.

6. Analytics and Reporting Logic
Business intelligence is derived from aggregated data to support decision-making.

Sales Analytics (get_sales_by_period)
Aggregated Data: The get_sales_by_period() database function aggregates sales data over a given start_date and end_date, with optional country_filter.

Key Metrics: It provides total_revenue, total_orders, avg_order_value, and unique_customers for the specified period.

Product Performance
Metrics: The system can generate reports on product performance, including total_sold, total_revenue, and average_rating.

Geographic Sales
Location-Based Insights: Sales data can be grouped by geographic locations (e.g., country, state) to identify regional trends.