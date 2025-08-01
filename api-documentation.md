# API Documentation

This document provides detailed information about the RESTful API endpoints for the Online Retail Platform.

---

## 1. Customer Management APIs

Endpoints for managing customer data, including registration, retrieval, and updates.

### `GET /api/customers`

* **Description:** Retrieves a paginated list of all registered customers.
* **Method:** `GET`
* **Query Parameters:**
    * `page` (Integer, Optional): The page number to retrieve. Defaults to 1 if not provided.
    * `limit` (Integer, Optional): The number of records per page. Defaults to a system-defined value if not provided.
* **Example Request:**
    ```
    GET http://localhost:3000/api/customers?page=1&limit=5
    ```
* **Example Response (200 OK):**
    ```json
    [
      {
        "customer_id": 123456,
        "customer_name": "John Doe",
        "email": "john.doe@example.com",
        "phone": "1234567890",
        "country_id": 1,
        "created_at": "2025-07-28T10:00:00Z"
      },
      {
        "customer_id": 123457,
        "customer_name": "Jane Smith",
        "email": "jane.smith@example.com",
        "phone": "0987654321",
        "country_id": 2,
        "created_at": "2025-07-29T11:30:00Z"
      }
    ]
    ```
* **Error Handling (500 Internal Server Error):**
    ```json
    {
      "error": "Server error: Failed to retrieve customers"
    }
    ```

### `GET /api/customers/:id`

* **Description:** Retrieves a single customer by their unique ID.
* **Method:** `GET`
* **Parameters:**
    * `id` (Path Parameter, Integer): The unique identifier of the customer.
* **Example Request:**
    ```
    GET http://localhost:3000/api/customers/12346
    ```
* **Example Response (200 OK):**
    ```json
    {
      "customer_id": 12346,
      "customer_name": "Existing Customer",
      "email": "existing@example.com",
      "phone": "1122334455",
      "country_id": 1,
      "created_at": "2025-07-27T09:00:00Z"
    }
    ```
* **Error Handling (404 Not Found):**
    ```json
    {
      "error": "Customer not found"
    }
    ```
* **Error Handling (500 Internal Server Error):**
    ```json
    {
      "error": "Server error: Failed to retrieve customer"
    }
    ```

### `POST /api/customers`

* **Description:** Creates a new customer record.
* **Method:** `POST`
* **Request Body (application/json):**
    ```json
    {
      "customer_id": 123458,
      "customer_name": "New Customer2",
      "email": "new2@example.com",
      "phone": "2345678901",
      "country_id": 1
    }
    ```
    * `customer_id` (Integer, Required): A unique identifier for the customer.
    * `customer_name` (String, Required): The full name of the customer.
    * `email` (String, Required): The unique email address of the customer.
    * `phone` (String, Optional): The customer's phone number.
    * `country_id` (Integer, Optional): The ID of the customer's country.
* **Example Response (201 Created):**
    ```json
    {
      "customer_id": 123458,
      "customer_name": "New Customer2",
      "email": "new2@example.com",
      "phone": "2345678901",
      "country_id": 1,
      "created_at": "2025-07-30T09:00:00Z"
    }
    ```
* **Error Handling (400 Bad Request):** (e.g., if required fields are missing or `customer_id` is not unique)
    ```json
    {
      "error": "Invalid input: Email is required"
    }
    ```
* **Error Handling (500 Internal Server Error):**
    ```json
    {
      "error": "Server error: Failed to create customer"
    }
    ```

### `PUT /api/customers/:id`

* **Description:** Updates an existing customer's details by their unique ID.
* **Method:** `PUT`
* **Parameters:**
    * `id` (Path Parameter, Integer): The unique identifier of the customer to update.
* **Request Body (application/json):**
    ```json
    {
      "customer_name": "Updated Name",
      "email": "updated@example.com"
    }
    ```
    * `customer_name` (String, Optional): The updated full name of the customer.
    * `email` (String, Optional): The updated email address of the customer.
    * *(Note: Other fields like `phone`, `country_id` could also be updated if the API supports it.)*
* **Example Request:**
    ```
    PUT http://localhost:3000/api/customers/12346
    ```
* **Example Response (200 OK):**
    ```json
    {
      "customer_id": 12346,
      "customer_name": "Updated Name",
      "email": "updated@example.com",
      "phone": "1122334455",
      "country_id": 1,
      "created_at": "2025-07-27T09:00:00Z"
    }
    ```
* **Error Handling (404 Not Found):**
    ```json
    {
      "error": "Customer not found"
    }
    ```
* **Error Handling (400 Bad Request):**
    ```json
    {
      "error": "Invalid input: Email format is incorrect"
    }
    ```
* **Error Handling (500 Internal Server Error):**
    ```json
    {
      "error": "Server error: Failed to update customer"
    }
    ```

### `GET /api/customers/:id/orders`

* **Description:** Retrieves all orders placed by a specific customer.
* **Method:** `GET`
* **Parameters:**
    * `id` (Path Parameter, Integer): The unique identifier of the customer.
* **Example Request:**
    ```
    GET http://localhost:3000/api/customers/123458/orders
    ```
* **Example Response (200 OK):**
    ```json
    [
      {
        "order_id": 201,
        "customer_id": 123458,
        "invoice_no": "636561",
        "order_date": "2023-11-15T14:30:00Z",
        "total_amount": 125.99,
        "status": "completed",
        "items": [
          {"product_id": 1, "quantity": 2, "unit_price_at_time": 25.00},
          {"product_id": 2, "quantity": 1, "unit_price_at_time": 75.99}
        ]
      },
      {
        "order_id": 202,
        "customer_id": 123458,
        "invoice_no": "636562",
        "order_date": "2023-11-20T10:00:00Z",
        "total_amount": 50.00,
        "status": "pending",
        "items": [
          {"product_id": 3, "quantity": 1, "unit_price_at_time": 50.00}
        ]
      }
    ]
    ```
* **Error Handling (404 Not Found):**
    ```json
    {
      "error": "Customer not found or no orders for this customer"
    }
    ```
* **Error Handling (500 Internal Server Error):**
    ```json
    {
      "error": "Server error: Failed to retrieve customer orders"
    }
    ```

---

## 2. Product Catalog APIs

Endpoints for managing the product catalog, including listing, creating, updating, and deleting products.

### `GET /api/products`

* **Description:** Retrieves a list of products, with optional filtering by category and price range.
* **Method:** `GET`
* **Query Parameters:**
    * `category` (Integer, Optional): Filter products by their category ID.
    * `minPrice` (Number, Optional): Filter products with a minimum unit price.
    * `maxPrice` (Number, Optional): Filter products with a maximum unit price.
* **Example Request:**
    ```
    GET http://localhost:3000/api/products?category=3&minPrice=10&maxPrice=100
    ```
* **Example Response (200 OK):**
    ```json
    [
      {
        "product_id": 10,
        "stock_code": "ITEM001",
        "description": "Product A",
        "category_id": 3,
        "unit_price": 50.00,
        "stock_quantity": 150,
        "created_at": "2025-07-25T08:00:00Z"
      },
      {
        "product_id": 11,
        "stock_code": "ITEM002",
        "description": "Product B",
        "category_id": 3,
        "unit_price": 75.00,
        "stock_quantity": 80,
        "created_at": "2025-07-26T09:15:00Z"
      }
    ]
    ```
* **Error Handling (500 Internal Server Error):**
    ```json
    {
      "error": "Server error: Failed to retrieve products"
    }
    ```

### `GET /api/products/:id`

* **Description:** Retrieves a single product by its unique ID.
* **Method:** `GET`
* **Parameters:**
    * `id` (Path Parameter, Integer): The unique identifier of the product.
* **Example Request:**
    ```
    GET http://localhost:3000/api/products/1
    ```
* **Example Response (200 OK):**
    ```json
    {
      "product_id": 1,
      "stock_code": "LAPTOPX",
      "description": "High-performance laptop for professionals.",
      "category_id": 1,
      "unit_price": 1200.00,
      "stock_quantity": 50,
      "created_at": "2025-07-25T08:00:00Z"
    }
    ```
* **Error Handling (404 Not Found):**
    ```json
    {
      "error": "Product not found"
    }
    ```
* **Error Handling (500 Internal Server Error):**
    ```json
    {
      "error": "Server error: Failed to retrieve product"
    }
    ```

### `POST /api/products`

* **Description:** Adds a new product to the catalog.
* **Method:** `POST`
* **Request Body (application/json):**
    ```json
    {
      "stock_code": "NEW1223",
      "description": "New Product",
      "category_id": 5,
      "unit_price": 29.99,
      "stock_quantity": 50
    }
    ```
    * `stock_code` (String, Required): A unique code for the product.
    * `description` (String, Required): A brief description of the product.
    * `category_id` (Integer, Required): The ID of the product's category.
    * `unit_price` (Number, Required): The price per unit of the product.
    * `stock_quantity` (Integer, Required): The initial quantity in stock.
* **Example Response (201 Created):**
    ```json
    {
      "product_id": 103,
      "stock_code": "NEW1223",
      "description": "New Product",
      "category_id": 5,
      "unit_price": 29.99,
      "stock_quantity": 50,
      "created_at": "2025-07-30T14:00:00Z"
    }
    ```
* **Error Handling (400 Bad Request):** (e.g., if required fields are missing or `stock_code` is not unique)
    ```json
    {
      "error": "Invalid input: Description, category_id, unit_price, and stock_quantity are required"
    }
    ```
* **Error Handling (500 Internal Server Error):**
    ```json
    {
      "error": "Server error: Failed to add product"
    }
    ```

### `PUT /api/products/:id`

* **Description:** Updates an existing product's details by its unique ID.
* **Method:** `PUT`
* **Parameters:**
    * `id` (Path Parameter, Integer): The unique identifier of the product to update.
* **Request Body (application/json):**
    ```json
    {
      "stock_code": "NEW123",
      "unit_price": 34.99,
      "stock_quantity": 45
    }
    ```
    * `stock_code` (String, Optional): The updated stock code.
    * `description` (String, Optional): The updated description.
    * `category_id` (Integer, Optional): The updated category ID.
    * `unit_price` (Number, Optional): The updated price.
    * `stock_quantity` (Integer, Optional): The updated stock quantity.
* **Example Request:**
    ```
    PUT http://localhost:3000/api/products/10
    ```
* **Example Response (200 OK):**
    ```json
    {
      "product_id": 10,
      "stock_code": "NEW123",
      "description": "Product A",
      "category_id": 3,
      "unit_price": 34.99,
      "stock_quantity": 45,
      "created_at": "2025-07-25T08:00:00Z"
    }
    ```
* **Error Handling (404 Not Found):**
    ```json
    {
      "error": "Product not found"
    }
    ```
* **Error Handling (400 Bad Request):**
    ```json
    {
      "error": "Invalid input: Unit price must be a positive number"
    }
    ```
* **Error Handling (500 Internal Server Error):**
    ```json
    {
      "error": "Server error: Failed to update product"
    }
    ```

### `DELETE /api/products/:id`

* **Description:** Deletes a product from the catalog by its unique ID.
* **Method:** `DELETE`
* **Parameters:**
    * `id` (Path Parameter, Integer): The unique identifier of the product to delete.
* **Example Request:**
    ```
    DELETE http://localhost:3000/api/products/12
    ```
* **Example Response (204 No Content):**
    *(Successful deletion typically returns a 204 status code with no response body)*
* **Error Handling (404 Not Found):**
    ```json
    {
      "error": "Product not found"
    }
    ```
* **Error Handling (500 Internal Server Error):**
    ```json
    {
      "error": "Server error: Failed to delete product"
    }
    ```

---

## 3. Order Management APIs

Endpoints for creating, retrieving, and managing customer orders.

### `GET /api/orders`

* **Description:** Retrieves a list of all orders, with optional filtering by status and date range.
* **Method:** `GET`
* **Query Parameters:**
    * `status` (String, Optional): Filter orders by their current status (e.g., `completed`, `pending`, `shipped`).
    * `startDate` (String, Optional, `YYYY-MM-DD`): Filter orders placed on or after this date.
    * `endDate` (String, Optional, `YYYY-MM-DD`): Filter orders placed on or before this date.
* **Example Request:**
    ```
    GET http://localhost:3000/api/orders?status=completed&startDate=2023-01-01
    ```
* **Example Response (200 OK):**
    ```json
    [
      {
        "order_id": 201,
        "customer_id": 123458,
        "invoice_no": "636561",
        "order_date": "2023-11-15T14:30:00Z",
        "total_amount": 125.99,
        "status": "completed",
        "items": [
          {"product_id": 1, "quantity": 2, "unit_price_at_time": 25.00},
          {"product_id": 2, "quantity": 1, "unit_price_at_time": 75.99}
        ]
      }
    ]
    ```
* **Error Handling (500 Internal Server Error):**
    ```json
    {
      "error": "Server error: Failed to retrieve orders"
    }
    ```

### `GET /api/orders/:id`

* **Description:** Retrieves a single order by its unique ID.
* **Method:** `GET`
* **Parameters:**
    * `id` (Path Parameter, Integer): The unique identifier of the order.
* **Example Request:**
    ```
    GET http://localhost:3000/api/orders/1
    ```
* **Example Response (200 OK):**
    ```json
    {
      "order_id": 1,
      "customer_id": 123456,
      "invoice_no": "INV001",
      "order_date": "2023-10-20T10:00:00Z",
      "total_amount": 250.00,
      "status": "shipped",
      "items": [
        {"product_id": 101, "quantity": 1, "unit_price_at_time": 150.00},
        {"product_id": 102, "quantity": 2, "unit_price_at_time": 50.00}
      ]
    }
    ```
* **Error Handling (404 Not Found):**
    ```json
    {
      "error": "Order not found"
    }
    ```
* **Error Handling (500 Internal Server Error):**
    ```json
    {
      "error": "Server error: Failed to retrieve order"
    }
    ```

### `POST /api/orders`

* **Description:** Creates a new order, including associated order items and updating product stock.
* **Method:** `POST`
* **Request Body (application/json):**
    ```json
    {
      "customer_id": 12346,
      "invoice_no": "636561",
      "order_date": "2023-11-15T14:30:00Z",
      "items": [
        {
          "product_id": 1,
          "quantity": 2
        },
        {
          "product_id": 2,
          "quantity": 1
        }
      ]
    }
    ```
    * `customer_id` (Integer, Required): The ID of the customer placing the order.
    * `invoice_no` (String, Optional): A unique invoice number for the order.
    * `order_date` (String, Optional, `ISO 8601` format): The date and time the order was placed. Defaults to current timestamp if not provided.
    * `items` (Array of Objects, Required): A list of products included in the order.
        * Each item object requires:
            * `product_id` (Integer, Required): The ID of the product.
            * `quantity` (Integer, Required): The quantity of the product ordered.
* **Example Response (201 Created):**
    ```json
    {
      "message": "Order created successfully",
      "order_id": 201
    }
    ```
* **Error Handling (400 Bad Request):** (e.g., insufficient stock, invalid customer/product IDs)
    ```json
    {
      "error": "Invalid input: Insufficient stock for product ID 1"
    }
    ```
* **Error Handling (500 Internal Server Error):**
    ```json
    {
      "error": "Server error: Failed to create order"
    }
    ```

### `DELETE /api/orders/:id`

* **Description:** Cancels an order by its unique ID. This operation might also trigger stock reversal depending on business rules.
* **Method:** `DELETE`
* **Parameters:**
    * `id` (Path Parameter, Integer): The unique identifier of the order to cancel.
* **Example Request:**
    ```
    DELETE http://localhost:3000/api/orders/5
    ```
* **Example Response (204 No Content):**
    *(Successful cancellation typically returns a 204 status code with no response body)*
* **Error Handling (404 Not Found):**
    ```json
    {
      "error": "Order not found"
    }
    ```
* **Error Handling (409 Conflict):** (e.g., if order cannot be cancelled due to its current status)
    ```json
    {
      "error": "Order cannot be cancelled in its current status"
    }
    ```
* **Error Handling (500 Internal Server Error):**
    ```json
    {
      "error": "Server error: Failed to cancel order"
    }
    ```

---

## 4. Analytics APIs

Endpoints for retrieving business intelligence and sales performance metrics.

### `GET /api/analytics/sales-summary`

* **Description:** Provides a summary of sales data, aggregated by a specified period.
* **Method:** `GET`
* **Query Parameters:**
    * `period` (String, Optional): The aggregation period (e.g., `daily`, `weekly`, `monthly`, `yearly`). Defaults to `monthly`.
* **Example Request:**
    ```
    GET http://localhost:3000/api/analytics/sales-summary?period=monthly
    ```
* **Example Response (200 OK):**
    ```json
    [
      {
        "period": "2023-11",
        "total_sales": 5678.99,
        "total_orders": 45,
        "average_order_value": 126.19
      },
      {
        "period": "2023-12",
        "total_sales": 7890.12,
        "total_orders": 60,
        "average_order_value": 131.50
      }
    ]
    ```
* **Error Handling (500 Internal Server Error):**
    ```json
    {
      "error": "Server error: Failed to retrieve sales summary"
    }
    ```

### `GET /api/analytics/top-products`

* **Description:** Retrieves a list of top-selling products based on sales volume or revenue.
* **Method:** `GET`
* **Query Parameters:**
    * `limit` (Integer, Optional): The maximum number of top products to return. Defaults to 10.
    * `sortBy` (String, Optional): The metric to sort by (e.g., `revenue`, `quantity`). Defaults to `revenue`.
* **Example Request:**
    ```
    GET http://localhost:3000/api/analytics/top-products?limit=3
    ```
* **Example Response (200 OK):**
    ```json
    [
      {
        "product_id": 1,
        "description": "Laptop Pro X",
        "total_quantity_sold": 150,
        "total_revenue": 180000.00
      },
      {
        "product_id": 10,
        "description": "Product A",
        "total_quantity_sold": 120,
        "total_revenue": 6000.00
      },
      {
        "product_id": 2,
        "description": "Wireless Ergonomic Mouse",
        "total_quantity_sold": 100,
        "total_revenue": 2599.00
      }
    ]
    ```
* **Error Handling (500 Internal Server Error):**
    ```json
    {
      "error": "Server error: Failed to retrieve top products"
    }
    ```

### `GET /api/analytics/customer-segments`

* **Description:** Provides data for customer segmentation, categorizing customers based on defined criteria (e.g., purchase history, activity level).
* **Method:** `GET`
* **Parameters:** None (or potential query parameters for specific segmentation criteria if implemented)
* **Example Request:**
    ```
    GET http://localhost:3000/api/analytics/customer-segments
    ```
* **Example Response (200 OK):**
    ```json
    [
      {
        "segment_name": "High-Value Customers",
        "description": "Customers with total purchases over $1000 and multiple orders.",
        "customer_count": 50,
        "example_customer_ids": [123456, 123478, 123501]
      },
      {
        "segment_name": "New Customers",
        "description": "Customers registered within the last 30 days with 1-2 orders.",
        "customer_count": 120,
        "example_customer_ids": [123555, 123556, 123557]
      }
    ]
    ```
* **Error Handling (500 Internal Server Error):**
    ```json
    {
      "error": "Server error: Failed to retrieve customer segments"
    }
    ```

---

## 5. Health Check

Basic endpoint to verify the API server's operational status.

### `GET /health`

* **Description:** Checks the health and availability of the API server.
* **Method:** `GET`
* **Parameters:** None
* **Example Request:**
    ```
    GET http://localhost:3000/health
    ```
* **Example Response (200 OK):**
    ```json
    {
      "status": "UP",
      "timestamp": "2025-08-01T04:07:00Z",
      "database_connection": "OK"
    }
    ```
* **Error Handling (500 Internal Server Error):**
    ```json
    {
      "status": "DOWN",
      "timestamp": "2025-08-01T04:07:00Z",
      "error": "Database connection failed"
    }
    ```
