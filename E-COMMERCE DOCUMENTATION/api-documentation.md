# API Documentation

This document provides detailed information about the RESTful API endpoints for the Online Retail Platform. It covers customer, order, product, seller, order item, order payment, order review, and analytics management, reflecting the latest API contract.

---

## 1. Customer Management APIs

Endpoints for managing customer data, including registration, retrieval, updates, and order history.

### `GET /api/customers`

* **Description:** Retrieves a paginated list of all registered customers.
* **Method:** `GET`
* **Query Parameters:**
    * `page` (Integer, Optional): The page number to retrieve. Defaults to 1.
    * `limit` (Integer, Optional): The number of records per page. Defaults to a system-defined value.
* **Example Request:**
    ```
    GET {{base_url}}/api/customers?page=1&limit=20
    ```
* **Example Response (200 OK):**
    ```json
    {
      "success": true,
      "data": [
        {
          "customer_id": "06b8999e2fba1a1fbc88172c00ba8bc7",
          "customer_unique_id": "861eff4711a542e45b93894da79ae50c",
          "customer_zip_code_prefix": 14409,
          "customer_city": "franca",
          "customer_state": "SP"
        },
        {
          "customer_id": "189da79e2c6085a363799638b7937746",
          "customer_unique_id": "290c77bc529b7ac9fb1c05c753d517dc",
          "customer_zip_code_prefix": 97900,
          "customer_city": "sao gabriel",
          "customer_state": "RS"
        }
      ],
      "pagination": {
        "page": 1,
        "limit": 20,
        "total": 100000
      }
    }
    ```
* **Error Handling (500 Internal Server Error):**
    ```json
    {
      "success": false,
      "error": "Server error: Failed to retrieve customers"
    }
    ```

### `POST /api/customers`

* **Description:** Creates a new customer record.
* **Method:** `POST`
* **Request Body (application/json):**
    ```json
    {
      "customer_id": "new1234",
      "customer_unique_id": "unique1234",
      "customer_zip_code_prefix": 12345,
      "customer_city": "Sao Paulo",
      "customer_state": "SP"
    }
    ```
    * `customer_id` (String, Required): A unique identifier for the customer.
    * `customer_unique_id` (String, Required): A unique identifier for the customer across multiple purchases.
    * `customer_zip_code_prefix` (Integer, Required): The first five digits of the customer's zip code.
    * `customer_city` (String, Required): The customer's city.
    * `customer_state` (String, Required): The customer's state (UF).
* **Example Response (201 Created):**
    ```json
    {
      "success": true,
      "message": "Customer created successfully",
      "data": {
        "customer_id": "new1234",
        "customer_unique_id": "unique1234",
        "customer_zip_code_prefix": 12345,
        "customer_city": "Sao Paulo",
        "customer_state": "SP"
      }
    }
    ```
* **Error Handling (400 Bad Request):** (e.g., if required fields are missing or IDs are not unique)
    ```json
    {
      "success": false,
      "error": "Invalid input: customer_id or customer_unique_id already exists"
    }
    ```
* **Error Handling (500 Internal Server Error):**
    ```json
    {
      "success": false,
      "error": "Server error: Failed to create customer"
    }
    ```

### `GET /api/customers/:id`

* **Description:** Retrieves a single customer by their unique `customer_id`.
* **Method:** `GET`
* **Parameters:**
    * `id` (Path Parameter, String): The unique identifier (`customer_id`) of the customer.
* **Example Request:**
    ```
    GET {{base_url}}/api/customers/06b8999e2fba1a1fbc88172c00ba8bc7
    ```
* **Example Response (200 OK):**
    ```json
    {
      "success": true,
      "data": {
        "customer_id": "06b8999e2fba1a1fbc88172c00ba8bc7",
        "customer_unique_id": "861eff4711a542e45b93894da79ae50c",
        "customer_zip_code_prefix": 14409,
        "customer_city": "franca",
        "customer_state": "SP"
      }
    }
    ```
* **Error Handling (404 Not Found):**
    ```json
    {
      "success": false,
      "error": "Customer not found"
    }
    ```
* **Error Handling (500 Internal Server Error):**
    ```json
    {
      "success": false,
      "error": "Server error: Failed to retrieve customer"
    }
    ```

### `PUT /api/customers/:id`

* **Description:** Updates an existing customer's details by their unique `customer_id`.
* **Method:** `PUT`
* **Parameters:**
    * `id` (Path Parameter, String): The unique identifier (`customer_id`) of the customer to update.
* **Request Body (application/json):**
    ```json
    {
      "customer_city": "Rio de Janeiro"
    }
    ```
    * `customer_zip_code_prefix` (Integer, Optional): The updated zip code prefix.
    * `customer_city` (String, Optional): The updated city.
    * `customer_state` (String, Optional): The updated state (UF).
* **Example Request:**
    ```
    PUT {{base_url}}/api/customers/06b8999e2fba1a1fbc88172c00ba8bc7
    ```
* **Example Response (200 OK):**
    ```json
    {
      "success": true,
      "message": "Customer updated successfully",
      "data": {
        "customer_id": "06b8999e2fba1a1fbc88172c00ba8bc7",
        "customer_unique_id": "861eff4711a542e45b93894da79ae50c",
        "customer_zip_code_prefix": 14409,
        "customer_city": "Rio de Janeiro",
        "customer_state": "SP"
      }
    }
    ```
* **Error Handling (404 Not Found):**
    ```json
    {
      "success": false,
      "error": "Customer not found"
    }
    ```
* **Error Handling (400 Bad Request):** (e.g., invalid input format)
    ```json
    {
      "success": false,
      "error": "Invalid input: customer_city must be a string"
    }
    ```
* **Error Handling (500 Internal Server Error):**
    ```json
    {
      "success": false,
      "error": "Server error: Failed to update customer"
    }
    ```

### `DELETE /api/customers/:id`

* **Description:** Deletes a customer record by their unique `customer_id`. This operation might also cascade to delete associated orders or set them to a null customer, depending on database foreign key constraints.
* **Method:** `DELETE`
* **Parameters:**
    * `id` (Path Parameter, String): The unique identifier (`customer_id`) of the customer to delete.
* **Example Request:**
    ```
    DELETE {{base_url}}/api/customers/000598caf2ef4117407665ac33275130
    ```
* **Example Response (204 No Content):**
    *(Successful deletion typically returns a 204 status code with no response body)*
* **Error Handling (404 Not Found):**
    ```json
    {
      "success": false,
      "error": "Customer not found"
    }
    ```
* **Error Handling (500 Internal Server Error):**
    ```json
    {
      "success": false,
      "error": "Server error: Failed to delete customer"
    }
    ```

### `GET /api/customers/:id/orders`

* **Description:** Retrieves all orders placed by a specific customer using their `customer_id`.
* **Method:** `GET`
* **Parameters:**
    * `id` (Path Parameter, String): The unique identifier (`customer_id`) of the customer.
* **Example Request:**
    ```
    GET {{base_url}}/api/customers/06b8999e2fba1a1fbc88172c00ba8bc7/orders
    ```
* **Example Response (200 OK):**
    ```json
    {
      "success": true,
      "data": [
        {
          "order_id": "00010242fe8c561fd1ff652164d23447",
          "customer_id": "06b8999e2fba1a1fbc88172c00ba8bc7",
          "order_status": "delivered",
          "order_purchase_timestamp": "2017-09-13T08:59:02Z",
          "order_approved_at": "2017-09-13T09:45:35Z",
          "order_delivered_carrier_date": "2017-09-19T18:34:16Z",
          "order_delivered_customer_date": "2017-09-20T23:43:48Z",
          "order_estimated_delivery_date": "2017-09-28T00:00:00Z"
        }
      ]
    }
    ```
* **Error Handling (404 Not Found):**
    ```json
    {
      "success": false,
      "error": "Customer not found or no orders for this customer"
    }
    ```
* **Error Handling (500 Internal Server Error):**
    ```json
    {
      "success": false,
      "error": "Server error: Failed to retrieve customer orders"
    }
    ```

### `GET /api/customers/segment/:segment`

* **Description:** Retrieves customers belonging to a specific segmentation tier (e.g., Premium, Regular, New). This segmentation is based on an automated process (`update_customer_segments()` database function).
* **Method:** `GET`
* **Parameters:**
    * `segment` (Path Parameter, String): The name of the customer segment (e.g., `Premium`, `Regular`, `New`).
* **Example Request:**
    ```
    GET {{base_url}}/api/customers/segment/Premium
    ```
* **Example Response (200 OK):**
    ```json
    {
      "success": true,
      "data": [
        {
          "customer_id": "06b8999e2fba1a1fbc88172c00ba8bc7",
          "customer_unique_id": "861eff4711a542e45b93894da79ae50c",
          "customer_city": "franca",
          "customer_state": "SP",
          "segment": "Premium"
        }
      ]
    }
    ```
* **Error Handling (400 Bad Request):** (e.g., invalid segment name)
    ```json
    {
      "success": false,
      "error": "Invalid customer segment provided"
    }
    ```
* **Error Handling (404 Not Found):**
    ```json
    {
      "success": false,
      "error": "No customers found for this segment"
    }
    ```
* **Error Handling (500 Internal Server Error):**
    ```json
    {
      "success": false,
      "error": "Server error: Failed to retrieve customers by segment"
    }
    ```

---

## 2. Order Management APIs

Endpoints for creating, retrieving, updating, and managing customer orders.

### `GET /api/orders`

* **Description:** Retrieves a paginated list of all orders, with optional filtering.
* **Method:** `GET`
* **Query Parameters:**
    * `page` (Integer, Optional): The page number to retrieve. Defaults to 1.
    * `limit` (Integer, Optional): The number of records per page. Defaults to a system-defined value.
    * `status` (String, Optional): Filter orders by their current status (e.g., `delivered`, `invoiced`, `shipped`).
    * `startDate` (String, Optional, `YYYY-MM-DD`): Filter orders placed on or after this date.
    * `endDate` (String, Optional, `YYYY-MM-DD`): Filter orders placed on or before this date.
* **Example Request:**
    ```
    GET {{base_url}}/api/orders?page=1&limit=20
    ```
* **Example Response (200 OK):**
    ```json
    {
      "success": true,
      "data": [
        {
          "order_id": "00010242fe8c561fd1ff652164d23447",
          "customer_id": "06b8999e2fba1a1fbc88172c00ba8bc7",
          "order_status": "delivered",
          "order_purchase_timestamp": "2017-09-13T08:59:02Z",
          "order_approved_at": "2017-09-13T09:45:35Z",
          "order_delivered_carrier_date": "2017-09-19T18:34:16Z",
          "order_delivered_customer_date": "2017-09-20T23:43:48Z",
          "order_estimated_delivery_date": "2017-09-28T00:00:00Z"
        }
      ],
      "pagination": {
        "page": 1,
        "limit": 20,
        "total": 99441
      }
    }
    ```
* **Error Handling (500 Internal Server Error):**
    ```json
    {
      "success": false,
      "error": "Server error: Failed to retrieve orders"
    }
    ```

### `GET /api/orders/:id`

* **Description:** Retrieves a single order by its unique `order_id`.
* **Method:** `GET`
* **Parameters:**
    * `id` (Path Parameter, String): The unique identifier (`order_id`) of the order.
* **Example Request:**
    ```
    GET {{base_url}}/api/orders/10a045cdf6a5650c21e9cfeb60384c16
    ```
* **Example Response (200 OK):**
    ```json
    {
      "success": true,
      "data": {
        "order_id": "10a045cdf6a5650c21e9cfeb60384c16",
        "customer_id": "b3e0455a73e6183e8954203102377b63",
        "order_status": "delivered",
        "order_purchase_timestamp": "2017-08-04T10:04:15Z",
        "order_approved_at": "2017-08-04T10:15:15Z",
        "order_delivered_carrier_date": "2017-08-07T14:45:00Z",
        "order_delivered_customer_date": "2017-08-10T14:52:00Z",
        "order_estimated_delivery_date": "2017-08-28T00:00:00Z"
      }
    }
    ```
* **Error Handling (404 Not Found):**
    ```json
    {
      "success": false,
      "error": "Order not found"
    }
    ```
* **Error Handling (500 Internal Server Error):**
    ```json
    {
      "success": false,
      "error": "Server error: Failed to retrieve order"
    }
    ```

### `POST /api/orders`

* **Description:** Creates a new order, including associated order items, payments, and reviews. This API call directly triggers real-time inventory deduction via the `trg_update_inventory` database trigger.
* **Method:** `POST`
* **Request Body (application/json):**
    ```json
    {
      "customer_id": "000379cdec625522490c315e70c7a9fb",
      "order_status": "invoiced",
      "items": [
        {
          "product_id": "00066f42aeeb9f3007548bb9d3f33c38",
          "seller_id": "3442f8959a84dea7ee197c632cb2df15",
          "price": 100.0,
          "freight_value": 15.50
        }
      ],
      "payments": [
        {
          "payment_sequential": 1,
          "payment_type": "credit_card",
          "payment_installments": 3,
          "payment_value": 115.50
        }
      ],
      "reviews": [
        {
          "review_score": 5,
          "review_comment_title": "Great Product",
          "review_comment_message": "Fast delivery and great quality."
        }
      ]
    }
    ```
    * `customer_id` (String, Required): The ID of the customer placing the order.
    * `order_status` (String, Required): The initial status of the order (e.g., `pending`, `invoiced`, `processing`).
    * `items` (Array of Objects, Required): A list of products included in the order.
        * Each item object requires:
            * `product_id` (String, Required): The ID of the product.
            * `seller_id` (String, Required): The ID of the seller for this product.
            * `price` (Number, Required): The price of the product at the time of order.
            * `freight_value` (Number, Required): The freight value for this item.
    * `payments` (Array of Objects, Required): A list of payment details for the order.
        * Each payment object requires:
            * `payment_sequential` (Integer, Required): Sequential number of the payment.
            * `payment_type` (String, Required): Type of payment (e.g., `credit_card`, `boleto`).
            * `payment_installments` (Integer, Required): Number of installments.
            * `payment_value` (Number, Required): The value of this payment.
    * `reviews` (Array of Objects, Optional): A list of initial review details for the order.
        * Each review object requires:
            * `review_score` (Integer, Required): The rating given (1-5).
            * `review_comment_title` (String, Optional): Title of the review.
            * `review_comment_message` (String, Optional): Full review comment.
* **Example Response (201 Created):**
    ```json
    {
      "success": true,
      "message": "Order created successfully",
      "data": {
        "order_id": "new_order_id_generated_by_system"
      }
    }
    ```
* **Error Handling (400 Bad Request):** (e.g., if required fields are missing, invalid customer/product/seller IDs, or **insufficient stock**).
    * **Specific to Inventory Trigger:** If the ordered quantity exceeds available stock, the database trigger will prevent the order and return an error.
    ```json
    {
      "success": false,
      "error": "Server error: Failed to create order (Inventory below zero for product ID!)"
    }
    ```
    * General Bad Request example:
    ```json
    {
      "success": false,
      "error": "Invalid input: Customer ID and items are required"
    }
    ```
* **Error Handling (500 Internal Server Error):**
    ```json
    {
      "success": false,
      "error": "Server error: Failed to create order"
    }
    ```

### `PUT /api/orders/:id`

* **Description:** Updates an existing order's details by its unique `order_id`. Note: This typically applies to non-status fields or before an order is processed.
* **Method:** `PUT`
* **Parameters:**
    * `id` (Path Parameter, String): The unique identifier (`order_id`) of the order to update.
* **Request Body (application/json):**
    ```json
    {
      "order_status": "processing"
      // Other fields can be updated if supported by API
    }
    ```
    * `order_status` (String, Optional): The updated status of the order.
    * `order_approved_at` (String, Optional, `ISO 8601`): Timestamp when the order was approved.
    * `order_delivered_carrier_date` (String, Optional, `ISO 8601`): Timestamp when the order was handed to carrier.
    * `order_delivered_customer_date` (String, Optional, `ISO 8601`): Timestamp when the order was delivered to customer.
    * `order_estimated_delivery_date` (String, Optional, `ISO 8601`): Estimated delivery timestamp.
* **Example Request:**
    ```
    PUT {{base_url}}/api/orders/10a045cdf6a5650c21e9cfeb60384c16
    ```
* **Example Response (200 OK):**
    ```json
    {
      "success": true,
      "message": "Order updated successfully",
      "data": {
        "order_id": "10a045cdf6a5650c21e9cfeb60384c16",
        "order_status": "processing"
      }
    }
    ```
* **Error Handling (404 Not Found):**
    ```json
    {
      "success": false,
      "error": "Order not found"
    }
    ```
* **Error Handling (400 Bad Request):**
    ```json
    {
      "success": false,
      "error": "Invalid input: Invalid status value"
    }
    ```
* **Error Handling (500 Internal Server Error):**
    ```json
    {
      "success": false,
      "error": "Server error: Failed to update order"
    }
    ```

### `PATCH /api/orders/:id/status`

* **Description:** Updates the status of a specific order.
* **Method:** `PATCH`
* **Parameters:**
    * `id` (Path Parameter, String): The unique identifier (`order_id`) of the order.
* **Request Body (application/json):**
    ```json
    {
      "status": "shipped"
    }
    ```
    * `status` (String, Required): The new status for the order. Allowed values: `created`, `approved`, `invoiced`, `processing`, `shipped`, `delivered`, `unavailable`, `canceled`.
* **Example Request:**
    ```
    PATCH {{base_url}}/api/orders/10a045cdf6a5650c21e9cfeb60384c16/status
    ```
* **Example Response (200 OK):**
    ```json
    {
      "success": true,
      "message": "Order status updated successfully",
      "data": {
        "order_id": "10a045cdf6a5650c21e9cfeb60384c16",
        "order_status": "shipped"
      }
    }
    ```
* **Error Handling (404 Not Found):**
    ```json
    {
      "success": false,
      "error": "Order not found"
    }
    ```
* **Error Handling (400 Bad Request):** (e.g., invalid status value)
    ```json
    {
      "success": false,
      "error": "Invalid status value provided"
    }
    ```
* **Error Handling (409 Conflict):** (e.g., attempting to change status to an invalid next state)
    ```json
    {
      "success": false,
      "error": "Cannot change order status from pending to delivered directly"
    }
    ```
* **Error Handling (500 Internal Server Error):**
    ```json
    {
      "success": false,
      "error": "Server error: Failed to update order status"
    }
    ```

### `DELETE /api/orders/:id`

* **Description:** Deletes an order by its unique `order_id`. This operation might also trigger stock reversal depending on business rules and order status.
* **Method:** `DELETE`
* **Parameters:**
    * `id` (Path Parameter, String): The unique identifier (`order_id`) of the order to delete.
* **Example Request:**
    ```
    DELETE {{base_url}}/api/orders/10a045cdf6a5650c21e9cfeb60384c16
    ```
* **Example Response (204 No Content):**
    *(Successful deletion typically returns a 204 status code with no response body)*
* **Error Handling (404 Not Found):**
    ```json
    {
      "success": false,
      "error": "Order not found"
    }
    ```
* **Error Handling (409 Conflict):** (e.g., if order cannot be deleted due to its current status)
    ```json
    {
      "success": false,
      "error": "Order cannot be deleted in its current status"
    }
    ```
* **Error Handling (500 Internal Server Error):**
    ```json
    {
      "success": false,
      "error": "Server error: Failed to delete order"
    }
    ```

### `GET /api/orders/:id/items`

* **Description:** Retrieves all items associated with a specific order.
* **Method:** `GET`
* **Parameters:**
    * `id` (Path Parameter, String): The unique identifier (`order_id`) of the order.
* **Example Request:**
    ```
    GET {{base_url}}/api/orders/10a045cdf6a5650c21e9cfeb60384c16/items
    ```
* **Example Response (200 OK):**
    ```json
    {
      "success": true,
      "data": [
        {
          "order_id": "10a045cdf6a5650c21e9cfeb60384c16",
          "order_item_id": "0001_item_1",
          "product_id": "00066f42aeeb9f3007548bb9d3f33c38",
          "seller_id": "3442f8959a84dea7ee197c632cb2df15",
          "shipping_limit_date": "2017-09-19T18:34:16Z",
          "price": 100.0,
          "freight_value": 15.50
        }
      ]
    }
    ```
* **Error Handling (404 Not Found):**
    ```json
    {
      "success": false,
      "error": "Order not found or no items for this order"
    }
    ```
* **Error Handling (500 Internal Server Error):**
    ```json
    {
      "success": false,
      "error": "Server error: Failed to retrieve order items"
    }
    ```

### `GET /api/orders/:id/payments`

* **Description:** Retrieves payment records associated with a specific order.
* **Method:** `GET`
* **Parameters:**
    * `id` (Path Parameter, String): The unique identifier (`order_id`) of the order.
* **Example Request:**
    ```
    GET {{base_url}}/api/orders/10a045cdf6a5650c21e9cfeb60384c16/payments
    ```
* **Example Response (200 OK):**
    ```json
    {
      "success": true,
      "data": [
        {
          "order_id": "10a045cdf6a5650c21e9cfeb60384c16",
          "payment_sequential": 1,
          "payment_type": "credit_card",
          "payment_installments": 3,
          "payment_value": 115.50
        }
      ]
    }
    ```
* **Error Handling (404 Not Found):**
    ```json
    {
      "success": false,
      "error": "Order not found or no payments for this order"
    }
    ```
* **Error Handling (500 Internal Server Error):**
    ```json
    {
      "success": false,
      "error": "Server error: Failed to retrieve order payments"
    }
    ```

### `GET /api/orders/:id/reviews`

* **Description:** Retrieves customer reviews associated with a specific order.
* **Method:** `GET`
* **Parameters:**
    * `id` (Path Parameter, String): The unique identifier (`order_id`) of the order.
* **Example Request:**
    ```
    GET {{base_url}}/api/orders/10a045cdf6a5650c21e9cfeb60384c16/reviews
    ```
* **Example Response (200 OK):**
    ```json
    {
      "success": true,
      "data": [
        {
          "review_id": "7bc75510618b14a74288424905988e44",
          "order_id": "10a045cdf6a5650c21e9cfeb60384c16",
          "review_score": 5,
          "review_comment_title": "Great Product",
          "review_comment_message": "Fast delivery and great quality.",
          "review_creation_date": "2017-08-11T10:00:00Z",
          "review_answer_timestamp": "2017-08-12T11:00:00Z"
        }
      ]
    }
    ```
* **Error Handling (404 Not Found):**
    ```json
    {
      "success": false,
      "error": "Order not found or no reviews for this order"
    }
    ```
* **Error Handling (500 Internal Server Error):**
    ```json
    {
      "success": false,
      "error": "Server error: Failed to retrieve order reviews"
    }
    ```

---

## 3. Product Catalog APIs

Endpoints for managing the product catalog, including listing, creating, updating, deleting, and filtering products.

### `GET /api/products`

* **Description:** Retrieves a paginated list of all products, with optional filtering.
* **Method:** `GET`
* **Query Parameters:**
    * `page` (Integer, Optional): The page number to retrieve. Defaults to 1.
    * `limit` (Integer, Optional): The number of records per page. Defaults to a system-defined value.
    * `category` (String, Optional): Filter products by their `product_category_name`.
    * `minWeight` (Integer, Optional): Filter products with a minimum `product_weight_g`.
    * `maxWeight` (Integer, Optional): Filter products with a maximum `product_weight_g`.
* **Example Request:**
    ```
    GET {{base_url}}/api/products?page=1&limit=20&category=electronics&minWeight=100&maxWeight=1000
    ```
* **Example Response (200 OK):**
    ```json
    {
      "success": true,
      "data": [
        {
          "product_id": "1e9e8ef04dbcff4541ed26657ea517e5",
          "product_category_name": "perfumaria",
          "product_name_length": 40,
          "product_description_length": 287,
          "product_photos_qty": 1,
          "product_weight_g": 225,
          "product_length_cm": 16,
          "product_height_cm": 10,
          "product_width_cm": 14,
          "stock": 100
        }
      ],
      "pagination": {
        "page": 1,
        "limit": 20,
        "total": 32951
      }
    }
    ```
* **Error Handling (500 Internal Server Error):**
    ```json
    {
      "success": false,
      "error": "Server error: Failed to retrieve products"
    }
    ```

### `GET /api/products/:id`

* **Description:** Retrieves a single product by its unique `product_id`.
* **Method:** `GET`
* **Parameters:**
    * `id` (Path Parameter, String): The unique identifier (`product_id`) of the product.
* **Example Request:**
    ```
    GET {{base_url}}/api/products/1e9e8ef04dbcff4541ed26657ea517e5
    ```
* **Example Response (200 OK):**
    ```json
    {
      "success": true,
      "data": {
        "product_id": "1e9e8ef04dbcff4541ed26657ea517e5",
        "product_category_name": "perfumaria",
        "product_name_length": 40,
        "product_description_length": 287,
        "product_photos_qty": 1,
        "product_weight_g": 225,
        "product_length_cm": 16,
        "product_height_cm": 10,
        "product_width_cm": 14,
        "stock": 100
      }
    }
    ```
* **Error Handling (404 Not Found):**
    ```json
    {
      "success": false,
      "error": "Product not found"
    }
    ```
* **Error Handling (500 Internal Server Error):**
    ```json
    {
      "success": false,
      "error": "Server error: Failed to retrieve product"
    }
    ```

### `POST /api/products`

* **Description:** Adds a new product to the catalog.
* **Method:** `POST`
* **Request Body (application/json):**
    ```json
    {
      "product_category_name": "electronics",
      "product_name_length": 35,
      "product_description_length": 500,
      "product_photos_qty": 3,
      "product_weight_g": 500,
      "product_length_cm": 20,
      "product_height_cm": 10,
      "product_width_cm": 15,
      "stock": 50
    }
    ```
    * `product_category_name` (String, Required): The category name of the product.
    * `product_name_length` (Integer, Optional): Length of the product name.
    * `product_description_length` (Integer, Optional): Length of the product description.
    * `product_photos_qty` (Integer, Optional): Number of photos for the product.
    * `product_weight_g` (Integer, Optional): Weight of the product in grams.
    * `product_length_cm` (Integer, Optional): Length of the product in cm.
    * `product_height_cm` (Integer, Optional): Height of the product in cm.
    * `product_width_cm` (Integer, Optional): Width of the product in cm.
    * `stock` (Integer, Required): The initial quantity in stock.
* **Example Response (201 Created):**
    ```json
    {
      "success": true,
      "message": "Product created successfully",
      "data": {
        "product_id": "new_product_id_generated_by_system",
        "product_category_name": "electronics",
        "stock": 50
      }
    }
    ```
* **Error Handling (400 Bad Request):** (e.g., if required fields are missing)
    ```json
    {
      "success": false,
      "error": "Invalid input: product_category_name and stock are required"
    }
    ```
* **Error Handling (500 Internal Server Error):**
    ```json
    {
      "success": false,
      "error": "Server error: Failed to add product"
    }
    ```

### `PUT /api/products/:id`

* **Description:** Updates an existing product's details by its unique `product_id`.
* **Method:** `PUT`
* **Parameters:**
    * `id` (Path Parameter, String): The unique identifier (`product_id`) of the product to update.
* **Request Body (application/json):**
    ```json
    {
      "product_weight_g": 600,
      "stock": 45
    }
    ```
    * `product_category_name` (String, Optional): The updated category name.
    * `product_name_length` (Integer, Optional): Updated product name length.
    * `product_description_length` (Integer, Optional): Updated product description length.
    * `product_photos_qty` (Integer, Optional): Updated number of photos.
    * `product_weight_g` (Integer, Optional): Updated weight in grams.
    * `product_length_cm` (Integer, Optional): Updated length in cm.
    * `product_height_cm` (Integer, Optional): Updated height in cm.
    * `product_width_cm` (Integer, Optional): Updated width in cm.
    * `stock` (Integer, Optional): The updated stock quantity.
* **Example Request:**
    ```
    PUT {{base_url}}/api/products/1e9e8ef04dbcff4541ed26657ea517e5
    ```
* **Example Response (200 OK):**
    ```json
    {
      "success": true,
      "message": "Product updated successfully",
      "data": {
        "product_id": "1e9e8ef04dbcff4541ed26657ea517e5",
        "product_weight_g": 600,
        "stock": 45
      }
    }
    ```
* **Error Handling (404 Not Found):**
    ```json
    {
      "success": false,
      "error": "Product not found"
    }
    ```
* **Error Handling (400 Bad Request):** (e.g., invalid input)
    ```json
    {
      "success": false,
      "error": "Invalid input: stock must be a positive number"
    }
    ```
* **Error Handling (500 Internal Server Error):**
    ```json
    {
      "success": false,
      "error": "Server error: Failed to update product"
    }
    ```

### `DELETE /api/products/:id`

* **Description:** Deletes a product from the catalog by its unique `product_id`.
* **Method:** `DELETE`
* **Parameters:**
    * `id` (Path Parameter, String): The unique identifier (`product_id`) of the product to delete.
* **Example Request:**
    ```
    DELETE {{base_url}}/api/products/1e9e8ef04dbcff4541ed26657ea517e5
    ```
* **Example Response (204 No Content):**
    *(Successful deletion typically returns a 204 status code with no response body)*
* **Error Handling (404 Not Found):**
    ```json
    {
      "success": false,
      "error": "Product not found"
    }
    ```
* **Error Handling (500 Internal Server Error):**
    ```json
    {
      "success": false,
      "error": "Server error: Failed to delete product"
    }
    ```

### `GET /api/products/category/:category`

* **Description:** Retrieves products belonging to a specific category name.
* **Method:** `GET`
* **Parameters:**
    * `category` (Path Parameter, String): The name of the product category (e.g., `electronics`, `perfumaria`).
* **Query Parameters:**
    * `page` (Integer, Optional): The page number to retrieve. Defaults to 1.
    * `limit` (Integer, Optional): The number of records per page.
* **Example Request:**
    ```
    GET {{base_url}}/api/products/category/electronics?page=1&limit=10
    ```
* **Example Response (200 OK):**
    ```json
    {
      "success": true,
      "data": [
        {
          "product_id": "00066f42aeeb9f3007548bb9d3f33c38",
          "product_category_name": "perfumaria",
          "product_weight_g": 1200,
          "stock": 80
        }
      ],
      "pagination": {
        "page": 1,
        "limit": 10,
        "total": 1500
      }
    }
    ```
* **Error Handling (404 Not Found):**
    ```json
    {
      "success": false,
      "error": "No products found for this category"
    }
    ```
* **Error Handling (500 Internal Server Error):**
    ```json
    {
      "success": false,
      "error": "Server error: Failed to retrieve products by category"
    }
    ```

### `GET /api/products/low-stock`

* **Description:** Retrieves a paginated list of products that are currently low in stock (below a predefined threshold).
* **Method:** `GET`
* **Query Parameters:**
    * `page` (Integer, Optional): The page number to retrieve. Defaults to 1.
    * `limit` (Integer, Optional): The number of records per page.
* **Example Request:**
    ```
    GET {{base_url}}/api/products/low-stock?page=1&limit=10
    ```
* **Example Response (200 OK):**
    ```json
    {
      "success": true,
      "data": [
        {
          "product_id": "product_low_stock_1",
          "product_category_name": "electronics",
          "stock": 5
        },
        {
          "product_id": "product_low_stock_2",
          "product_category_name": "fashion",
          "stock": 0
        }
      ],
      "pagination": {
        "page": 1,
        "limit": 10,
        "total": 50
      }
    }
    ```
* **Error Handling (500 Internal Server Error):**
    ```json
    {
      "success": false,
      "error": "Server error: Failed to retrieve low stock products"
    }
    ```

---

## 4. Sellers APIs

Endpoints for managing seller information and their associated products.

### `GET /api/sellers`

* **Description:** Retrieves a paginated list of all registered sellers.
* **Method:** `GET`
* **Query Parameters:**
    * `page` (Integer, Optional): The page number to retrieve. Defaults to 1.
    * `limit` (Integer, Optional): The number of records per page.
* **Example Request:**
    ```
    GET {{base_url}}/api/sellers?page=1&limit=20
    ```
* **Example Response (200 OK):**
    ```json
    {
      "success": true,
      "data": [
        {
          "seller_id": "d1b65fc7debc3361ea86b5f14c68d2e2",
          "seller_zip_code_prefix": 13023,
          "seller_city": "campinas",
          "seller_state": "SP"
        },
        {
          "seller_id": "656e0828a2a4378216d9fa271c5f0616",
          "seller_zip_code_prefix": 13023,
          "seller_city": "campinas",
          "seller_state": "SP"
        }
      ],
      "pagination": {
        "page": 1,
        "limit": 20,
        "total": 3095
      }
    }
    ```
* **Error Handling (500 Internal Server Error):**
    ```json
    {
      "success": false,
      "error": "Server error: Failed to retrieve sellers"
    }
    ```

### `GET /api/sellers/:id`

* **Description:** Retrieves a single seller by their unique `seller_id`.
* **Method:** `GET`
* **Parameters:**
    * `id` (Path Parameter, String): The unique identifier (`seller_id`) of the seller.
* **Example Request:**
    ```
    GET {{base_url}}/api/sellers/d1b65fc7debc3361ea86b5f14c68d2e2
    ```
* **Example Response (200 OK):**
    ```json
    {
      "success": true,
      "data": {
        "seller_id": "d1b65fc7debc3361ea86b5f14c68d2e2",
        "seller_zip_code_prefix": 13023,
        "seller_city": "campinas",
        "seller_state": "SP"
      }
    }
    ```
* **Error Handling (404 Not Found):**
    ```json
    {
      "success": false,
      "error": "Seller not found"
    }
    ```
* **Error Handling (500 Internal Server Error):**
    ```json
    {
      "success": false,
      "error": "Server error: Failed to retrieve seller"
    }
    ```

### `POST /api/sellers`

* **Description:** Creates a new seller record.
* **Method:** `POST`
* **Request Body (application/json):**
    ```json
    {
      "seller_zip_code_prefix": 22222,
      "seller_city": "Seller City",
      "seller_state": "CA"
    }
    ```
    * `seller_zip_code_prefix` (Integer, Required): The first five digits of the seller's zip code.
    * `seller_city` (String, Required): The seller's city.
    * `seller_state` (String, Required): The seller's state (UF).
* **Example Response (201 Created):**
    ```json
    {
      "success": true,
      "message": "Seller created successfully",
      "data": {
        "seller_id": "new_seller_id_generated_by_system",
        "seller_zip_code_prefix": 22222,
        "seller_city": "Seller City",
        "seller_state": "CA"
      }
    }
    ```
* **Error Handling (400 Bad Request):** (e.g., missing required fields)
    ```json
    {
      "success": false,
      "error": "Invalid input: All seller fields are required"
    }
    ```
* **Error Handling (500 Internal Server Error):**
    ```json
    {
      "success": false,
      "error": "Server error: Failed to create seller"
    }
    ```

### `PUT /api/sellers/:id`

* **Description:** Updates an existing seller's details by their unique `seller_id`.
* **Method:** `PUT`
* **Parameters:**
    * `id` (Path Parameter, String): The unique identifier (`seller_id`) of the seller to update.
* **Request Body (application/json):**
    ```json
    {
      "seller_city": "Updated Seller City"
    }
    ```
    * `seller_zip_code_prefix` (Integer, Optional): The updated zip code prefix.
    * `seller_city` (String, Optional): The updated city.
    * `seller_state` (String, Optional): The updated state (UF).
* **Example Request:**
    ```
    PUT {{base_url}}/api/sellers/d1b65fc7debc3361ea86b5f14c68d2e2
    ```
* **Example Response (200 OK):**
    ```json
    {
      "success": true,
      "message": "Seller updated successfully",
      "data": {
        "seller_id": "d1b65fc7debc3361ea86b5f14c68d2e2",
        "seller_zip_code_prefix": 13023,
        "seller_city": "Updated Seller City",
        "seller_state": "SP"
      }
    }
    ```
* **Error Handling (404 Not Found):**
    ```json
    {
      "success": false,
      "error": "Seller not found"
    }
    ```
* **Error Handling (400 Bad Request):**
    ```json
    {
      "success": false,
      "error": "Invalid input: seller_city must be a string"
    }
    ```
* **Error Handling (500 Internal Server Error):**
    ```json
    {
      "success": false,
      "error": "Server error: Failed to update seller"
    }
    ```

### `DELETE /api/sellers/:id`

* **Description:** Deletes a seller record by their unique `seller_id`. This operation might cascade to products sold by this seller or set them to a null seller.
* **Method:** `DELETE`
* **Parameters:**
    * `id` (Path Parameter, String): The unique identifier (`seller_id`) of the seller to delete.
* **Example Request:**
    ```
    DELETE {{base_url}}/api/sellers/d1b65fc7debc3361ea86b5f14c68d2e2
    ```
* **Example Response (204 No Content):**
    *(Successful deletion typically returns a 204 status code with no response body)*
* **Error Handling (404 Not Found):**
    ```json
    {
      "success": false,
      "error": "Seller not found"
    }
    ```
* **Error Handling (500 Internal Server Error):**
    ```json
    {
      "success": false,
      "error": "Server error: Failed to delete seller"
    }
    ```

### `GET /api/sellers/:id/products`

* **Description:** Retrieves all products sold by a specific seller using their `seller_id`.
* **Method:** `GET`
* **Parameters:**
    * `id` (Path Parameter, String): The unique identifier (`seller_id`) of the seller.
* **Example Request:**
    ```
    GET {{base_url}}/api/sellers/d1b65fc7debc3361ea86b5f14c68d2e2/products
    ```
* **Example Response (200 OK):**
    ```json
    {
      "success": true,
      "data": [
        {
          "product_id": "1e9e8ef04dbcff4541ed26657ea517e5",
          "product_category_name": "perfumaria",
          "product_weight_g": 225,
          "stock": 100
        }
      ]
    }
    ```
* **Error Handling (404 Not Found):**
    ```json
    {
      "success": false,
      "error": "Seller not found or no products from this seller"
    }
    ```
* **Error Handling (500 Internal Server Error):**
    ```json
    {
      "success": false,
      "error": "Server error: Failed to retrieve products for seller"
    }
    ```

---

## 5. Order Items APIs

Endpoints for managing individual items within an order.

### `GET /api/order-items`

* **Description:** Retrieves a paginated list of all order items across all orders.
* **Method:** `GET`
* **Query Parameters:**
    * `page` (Integer, Optional): The page number to retrieve. Defaults to 1.
    * `limit` (Integer, Optional): The number of records per page.
    * `orderId` (String, Optional): Filter order items by `order_id`.
    * `productId` (String, Optional): Filter order items by `product_id`.
* **Example Request:**
    ```
    GET {{base_url}}/api/order-items?page=1&limit=10&orderId=00010242fe8c561fd1ff652164d23447
    ```
* **Example Response (200 OK):**
    ```json
    {
      "success": true,
      "data": [
        {
          "order_id": "00010242fe8c561fd1ff652164d23447",
          "order_item_id": "0001_item_1",
          "product_id": "4244733ee8966863693db50785c206d7",
          "seller_id": "48436dade18eb59f592df1fed0024063",
          "shipping_limit_date": "2017-09-19T18:34:16Z",
          "price": 50.00,
          "freight_value": 15.50
        }
      ],
      "pagination": {
        "page": 1,
        "limit": 10,
        "total": 112660
      }
    }
    ```
* **Error Handling (500 Internal Server Error):**
    ```json
    {
      "success": false,
      "error": "Server error: Failed to retrieve order items"
    }
    ```

### `GET /api/order-items/:orderId/:itemId`

* **Description:** Retrieves a specific order item within a given order using its `order_id` and `order_item_id`.
* **Method:** `GET`
* **Parameters:**
    * `orderId` (Path Parameter, String): The ID of the order.
    * `itemId` (Path Parameter, String): The ID of the specific order item.
* **Example Request:**
    ```
    GET {{base_url}}/api/order-items/00010242fe8c561fd1ff652164d23447/0001_item_1
    ```
* **Example Response (200 OK):**
    ```json
    {
      "success": true,
      "data": {
        "order_id": "00010242fe8c561fd1ff652164d23447",
        "order_item_id": "0001_item_1",
        "product_id": "4244733ee8966863693db50785c206d7",
        "seller_id": "48436dade18eb59f592df1fed0024063",
        "shipping_limit_date": "2017-09-19T18:34:16Z",
        "price": 50.00,
        "freight_value": 15.50
      }
    }
    ```
* **Error Handling (404 Not Found):**
    ```json
    {
      "success": false,
      "error": "Order item not found for the given order"
    }
    ```
* **Error Handling (500 Internal Server Error):**
    ```json
    {
      "success": false,
      "error": "Server error: Failed to retrieve order item"
    }
    ```

### `POST /api/order-items`

* **Description:** Adds a new item to an existing order. This would typically be used for modifying an order *before* it's finalized, and would trigger inventory updates.
* **Method:** `POST`
* **Request Body (application/json):**
    ```json
    {
      "order_id": "00010242fe8c561fd1ff652164d23447",
      "product_id": "00066f42aeeb9f3007548bb9d3f33c38",
      "seller_id": "3442f8959a84dea7ee197c632cb2df15",
      "shipping_limit_date": "2024-08-10T10:00:00Z",
      "price": 100.0,
      "freight_value": 15.50
    }
    ```
    * `order_id` (String, Required): The ID of the order to add the item to.
    * `product_id` (String, Required): The ID of the product to add.
    * `seller_id` (String, Required): The ID of the seller for this product.
    * `shipping_limit_date` (String, Required, `ISO 8601`): The date by which the item must be shipped.
    * `price` (Number, Required): The price of the product at the time of order.
    * `freight_value` (Number, Required): The freight value for this item.
* **Example Response (201 Created):**
    ```json
    {
      "success": true,
      "message": "Order item added successfully",
      "data": {
        "order_item_id": "new_order_item_id_generated_by_system",
        "order_id": "00010242fe8c561fd1ff652164d23447",
        "product_id": "00066f42aeeb9f3007548bb9d3f33c38"
      }
    }
    ```
* **Error Handling (400 Bad Request):** (e.g., invalid order ID, insufficient stock)
    ```json
    {
      "success": false,
      "error": "Invalid input or insufficient stock"
    }
    ```
* **Error Handling (500 Internal Server Error):**
    ```json
    {
      "success": false,
      "error": "Server error: Failed to add order item"
    }
    ```

### `PUT /api/order-items/:orderId/:itemId`

* **Description:** Updates the details of a specific order item within a given order. This would also trigger inventory adjustments if quantity changes.
* **Method:** `PUT`
* **Parameters:**
    * `orderId` (Path Parameter, String): The ID of the order.
    * `itemId` (Path Parameter, String): The ID of the specific order item.
* **Request Body (application/json):**
    ```json
    {
      "price": 110.0,
      "freight_value": 18.0
    }
    ```
    * `price` (Number, Optional): The updated price of the product.
    * `freight_value` (Number, Optional): The updated freight value.
    * `shipping_limit_date` (String, Optional, `ISO 8601`): The updated shipping limit date.
* **Example Request:**
    ```
    PUT {{base_url}}/api/order-items/00010242fe8c561fd1ff652164d23447/0001_item_1
    ```
* **Example Response (200 OK):**
    ```json
    {
      "success": true,
      "message": "Order item updated successfully",
      "data": {
        "order_item_id": "0001_item_1",
        "order_id": "00010242fe8c561fd1ff652164d23447",
        "price": 110.0,
        "freight_value": 18.0
      }
    }
    ```
* **Error Handling (404 Not Found):**
    ```json
    {
      "success": false,
      "error": "Order item not found"
    }
    ```
* **Error Handling (400 Bad Request):** (e.g., invalid price)
    ```json
    {
      "success": false,
      "error": "Invalid input: Price must be a positive number"
    }
    ```
* **Error Handling (500 Internal Server Error):**
    ```json
    {
      "success": false,
      "error": "Server error: Failed to update order item"
    }
    ```

### `DELETE /api/order-items/:orderId/:itemId`

* **Description:** Deletes a specific item from an order. This would typically trigger stock reversal.
* **Method:** `DELETE`
* **Parameters:**
    * `orderId` (Path Parameter, String): The ID of the order.
    * `itemId` (Path Parameter, String): The ID of the specific order item.
* **Example Request:**
    ```
    DELETE {{base_url}}/api/order-items/00010242fe8c561fd1ff652164d23447/0001_item_1
    ```
* **Example Response (204 No Content):**
    *(Successful deletion typically returns a 204 status code with no response body)*
* **Error Handling (404 Not Found):**
    ```json
    {
      "success": false,
      "error": "Order item not found"
    }
    ```
* **Error Handling (500 Internal Server Error):**
    ```json
    {
      "success": false,
      "error": "Server error: Failed to delete order item"
    }
    ```

---

## 6. Order Payments APIs

Endpoints for managing payment records associated with orders.

### `GET /api/payments`

* **Description:** Retrieves a paginated list of all payment records.
* **Method:** `GET`
* **Query Parameters:**
    * `page` (Integer, Optional): The page number to retrieve. Defaults to 1.
    * `limit` (Integer, Optional): The number of records per page.
    * `type` (String, Optional): Filter payments by `payment_type` (e.g., `credit_card`, `boleto`).
    * `status` (String, Optional): Filter payments by status (e.g., `paid`, `refunded`, `pending`).
* **Example Request:**
    ```
    GET {{base_url}}/api/payments?page=1&limit=10&type=credit_card
    ```
* **Example Response (200 OK):**
    ```json
    {
      "success": true,
      "data": [
        {
          "order_id": "00010242fe8c561fd1ff652164d23447",
          "payment_sequential": 1,
          "payment_type": "credit_card",
          "payment_installments": 3,
          "payment_value": 115.50
        }
      ],
      "pagination": {
        "page": 1,
        "limit": 10,
        "total": 103886
      }
    }
    ```
* **Error Handling (500 Internal Server Error):**
    ```json
    {
      "success": false,
      "error": "Server error: Failed to retrieve payments"
    }
    ```

### `GET /api/payments/:orderId`

* **Description:** Retrieves all payment records for a specific order using its `order_id`.
* **Method:** `GET`
* **Parameters:**
    * `orderId` (Path Parameter, String): The ID of the order.
* **Example Request:**
    ```
    GET {{base_url}}/api/payments/10a045cdf6a5650c21e9cfeb60384c16
    ```
* **Example Response (200 OK):**
    ```json
    {
      "success": true,
      "data": [
        {
          "order_id": "10a045cdf6a5650c21e9cfeb60384c16",
          "payment_sequential": 1,
          "payment_type": "credit_card",
          "payment_installments": 3,
          "payment_value": 115.50
        }
      ]
    }
    ```
* **Error Handling (404 Not Found):**
    ```json
    {
      "success": false,
      "error": "Order not found or no payments for this order"
    }
    ```
* **Error Handling (500 Internal Server Error):**
    ```json
    {
      "success": false,
      "error": "Server error: Failed to retrieve order payments"
    }
    ```

### `POST /api/payments`

* **Description:** Creates a new payment record for an order.
* **Method:** `POST`
* **Request Body (application/json):**
    ```json
    {
      "order_id": "00010242fe8c561fd1ff652164d23447",
      "payment_sequential": 2,
      "payment_type": "voucher",
      "payment_installments": 1,
      "payment_value": 20.00
    }
    ```
    * `order_id` (String, Required): The ID of the order the payment is for.
    * `payment_sequential` (Integer, Required): Sequential number of the payment.
    * `payment_type` (String, Required): Type of payment (e.g., `credit_card`, `boleto`, `voucher`).
    * `payment_installments` (Integer, Required): Number of installments.
    * `payment_value` (Number, Required): The value of this payment.
* **Example Response (201 Created):**
    ```json
    {
      "success": true,
      "message": "Payment record created successfully",
      "data": {
        "payment_id": "new_payment_id_generated_by_system",
        "order_id": "00010242fe8c561fd1ff652164d23447"
      }
    }
    ```
* **Error Handling (400 Bad Request):** (e.g., invalid order ID, missing fields)
    ```json
    {
      "success": false,
      "error": "Invalid input: Order ID and payment type are required"
    }
    ```
* **Error Handling (500 Internal Server Error):**
    ```json
    {
      "success": false,
      "error": "Server error: Failed to create payment record"
    }
    ```

### `PUT /api/payments/:id`

* **Description:** Updates an existing payment record by its unique `payment_id`.
* **Method:** `PUT`
* **Parameters:**
    * `id` (Path Parameter, String): The unique identifier (`payment_id`) of the payment record to update.
* **Request Body (application/json):**
    ```json
    {
      "payment_value": 120.00
    }
    ```
    * `payment_sequential` (Integer, Optional): Updated sequential number.
    * `payment_type` (String, Optional): Updated payment method.
    * `payment_installments` (Integer, Optional): Updated number of installments.
    * `payment_value` (Number, Optional): Updated payment amount.
* **Example Request:**
    ```
    PUT {{base_url}}/api/payments/501
    ```
* **Example Response (200 OK):**
    ```json
    {
      "success": true,
      "message": "Payment record updated successfully",
      "data": {
        "payment_id": "501",
        "payment_value": 120.00
      }
    }
    ```
* **Error Handling (404 Not Found):**
    ```json
    {
      "success": false,
      "error": "Payment record not found"
    }
    ```
* **Error Handling (400 Bad Request):**
    ```json
    {
      "success": false,
      "error": "Invalid input: Payment value must be positive"
    }
    ```
* **Error Handling (500 Internal Server Error):**
    ```json
    {
      "success": false,
      "error": "Server error: Failed to update payment record"
    }
    ```

### `DELETE /api/payments/:id`

* **Description:** Deletes a payment record by its unique `payment_id`.
* **Method:** `DELETE`
* **Parameters:**
    * `id` (Path Parameter, String): The unique identifier (`payment_id`) of the payment record to delete.
* **Example Request:**
    ```
    DELETE {{base_url}}/api/payments/501
    ```
* **Example Response (204 No Content):**
    *(Successful deletion typically returns a 204 status code with no response body)*
* **Error Handling (404 Not Found):**
    ```json
    {
      "success": false,
      "error": "Payment record not found"
    }
    ```
* **Error Handling (500 Internal Server Error):**
    ```json
    {
      "success": false,
      "error": "Server error: Failed to delete payment record"
    }
    ```

---

## 7. Order Reviews APIs

Endpoints for managing customer reviews associated with orders and products.

### `GET /api/reviews`

* **Description:** Retrieves a paginated list of all customer reviews.
* **Method:** `GET`
* **Query Parameters:**
    * `page` (Integer, Optional): The page number to retrieve. Defaults to 1.
    * `limit` (Integer, Optional): The number of records per page.
    * `orderId` (String, Optional): Filter reviews by `order_id`.
    * `productId` (String, Optional): Filter reviews by `product_id`.
    * `customerId` (String, Optional): Filter reviews by `customer_id`.
* **Example Request:**
    ```
    GET {{base_url}}/api/reviews?page=1&limit=10&orderId=10a045cdf6a5650c21e9cfeb60384c16
    ```
* **Example Response (200 OK):**
    ```json
    {
      "success": true,
      "data": [
        {
          "review_id": "7bc75510618b14a74288424905988e44",
          "order_id": "10a045cdf6a5650c21e9cfeb60384c16",
          "review_score": 5,
          "review_comment_title": "Great Product",
          "review_comment_message": "Fast delivery and great quality.",
          "review_creation_date": "2017-08-11T10:00:00Z",
          "review_answer_timestamp": "2017-08-12T11:00:00Z"
        }
      ],
      "pagination": {
        "page": 1,
        "limit": 10,
        "total": 99224
      }
    }
    ```
* **Error Handling (500 Internal Server Error):**
    ```json
    {
      "success": false,
      "error": "Server error: Failed to retrieve reviews"
    }
    ```

### `GET /api/reviews/:id`

* **Description:** Retrieves a single customer review by its unique `review_id`.
* **Method:** `GET`
* **Parameters:**
    * `id` (Path Parameter, String): The unique identifier (`review_id`) of the review.
* **Example Request:**
    ```
    GET {{base_url}}/api/reviews/7bc75510618b14a74288424905988e44
    ```
* **Example Response (200 OK):**
    ```json
    {
      "success": true,
      "data": {
        "review_id": "7bc75510618b14a74288424905988e44",
        "order_id": "10a045cdf6a5650c21e9cfeb60384c16",
        "review_score": 5,
        "review_comment_title": "Great Product",
        "review_comment_message": "Fast delivery and great quality.",
        "review_creation_date": "2017-08-11T10:00:00Z",
        "review_answer_timestamp": "2017-08-12T11:00:00Z"
      }
    }
    ```
* **Error Handling (404 Not Found):**
    ```json
    {
      "success": false,
      "error": "Review not found"
    }
    ```
* **Error Handling (500 Internal Server Error):**
    ```json
    {
      "success": false,
      "error": "Server error: Failed to retrieve review"
    }
    ```

### `POST /api/reviews`

* **Description:** Creates a new customer review for an order or product.
* **Method:** `POST`
* **Request Body (application/json):**
    ```json
    {
      "order_id": "00010242fe8c561fd1ff652164d23447",
      "review_score": 5,
      "review_comment_title": "Excellent!",
      "review_comment_message": "Product arrived quickly and is exactly as described."
    }
    ```
    * `order_id` (String, Required): The ID of the order the review is associated with.
    * `review_score` (Integer, Required): The rating given (1-5).
    * `review_comment_title` (String, Optional): Title of the review.
    * `review_comment_message` (String, Optional): Full review comment.
* **Example Response (201 Created):**
    ```json
    {
      "success": true,
      "message": "Review created successfully",
      "data": {
        "review_id": "new_review_id_generated_by_system",
        "order_id": "00010242fe8c561fd1ff652164d23447"
      }
    }
    ```
* **Error Handling (400 Bad Request):** (e.g., invalid rating, missing required fields)
    ```json
    {
      "success": false,
      "error": "Invalid input: Rating must be between 1 and 5"
    }
    ```
* **Error Handling (500 Internal Server Error):**
    ```json
    {
      "success": false,
      "error": "Server error: Failed to create review"
    }
    ```

### `PUT /api/reviews/:id`

* **Description:** Updates an existing customer review by its unique `review_id`.
* **Method:** `PUT`
* **Parameters:**
    * `id` (Path Parameter, String): The unique identifier (`review_id`) of the review to update.
* **Request Body (application/json):**
    ```json
    {
      "review_score": 4,
      "review_comment_message": "Still good, but delivery was a bit slow."
    }
    ```
    * `review_score` (Integer, Optional): The updated rating.
    * `review_comment_title` (String, Optional): The updated title.
    * `review_comment_message` (String, Optional): The updated comment.
* **Example Request:**
    ```
    PUT {{base_url}}/api/reviews/7bc75510618b14a74288424905988e44
    ```
* **Example Response (200 OK):**
    ```json
    {
      "success": true,
      "message": "Review updated successfully",
      "data": {
        "review_id": "7bc75510618b14a74288424905988e44",
        "review_score": 4,
        "review_comment_message": "Still good, but delivery was a bit slow."
      }
    }
    ```
* **Error Handling (404 Not Found):**
    ```json
    {
      "success": false,
      "error": "Review not found"
    }
    ```
* **Error Handling (400 Bad Request):**
    ```json
    {
      "success": false,
      "error": "Invalid input: Rating out of range"
    }
    ```
* **Error Handling (500 Internal Server Error):**
    ```json
    {
      "success": false,
      "error": "Server error: Failed to update review"
    }
    ```

### `DELETE /api/reviews/:id`

* **Description:** Deletes a customer review by its unique `review_id`.
* **Method:** `DELETE`
* **Parameters:**
    * `id` (Path Parameter, String): The unique identifier (`review_id`) of the review to delete.
* **Example Request:**
    ```
    DELETE {{base_url}}/api/reviews/7bc75510618b14a74288424905988e44
    ```
* **Example Response (204 No Content):**
    *(Successful deletion typically returns a 204 status code with no response body)*
* **Error Handling (404 Not Found):**
    ```json
    {
      "success": false,
      "error": "Review not found"
    }
    ```
* **Error Handling (500 Internal Server Error):**
    ```json
    {
      "success": false,
      "error": "Server error: Failed to delete review"
    }
    ```

### `GET /api/reviews/average/:days`

* **Description:** Retrieves the average review score for products over the last X days.
* **Method:** `GET`
* **Parameters:**
    * `days` (Path Parameter, Integer): The number of past days to consider for the average.
* **Example Request:**
    ```
    GET {{base_url}}/api/reviews/average/30
    ```
* **Example Response (200 OK):**
    ```json
    {
      "success": true,
      "data": {
        "period_days": 30,
        "average_score": 4.7,
        "total_reviews": 150
      }
    }
    ```
* **Error Handling (400 Bad Request):** (e.g., invalid number of days)
    ```json
    {
      "success": false,
      "error": "Invalid input: Days must be a positive integer"
    }
    ```
* **Error Handling (500 Internal Server Error):**
    ```json
    {
      "success": false,
      "error": "Server error: Failed to retrieve average review score"
    }
    ```

---

## 8. Analytics APIs

Endpoints for retrieving various business intelligence and performance metrics.

### `GET /api/analytics/sales`

* **Description:** Provides aggregated sales data over a given time range, optionally filtered by state (UF). This endpoint is backed by the `get_sales_by_period` database function.
* **Method:** `GET`
* **Query Parameters:**
    * `startDate` (String, Optional, `YYYY-MM-DD`): The start date for the sales period.
    * `endDate` (String, Optional, `YYYY-MM-DD`): The end date for the sales period.
    * `country_filter` (String, Optional): Filter sales by state (UF).
* **Example Request:**
    ```
    GET {{base_url}}/api/analytics/sales?startDate=2017-01-01&endDate=2017-12-31&country_filter=SP
    ```
* **Example Response (200 OK):**
    ```json
    {
      "success": true,
      "data": {
        "start_date": "2017-01-01",
        "end_date": "2017-12-31",
        "country_filter": "SP",
        "total_revenue": 150000.75,
        "total_orders": 1200,
        "avg_order_value": 125.00,
        "unique_customers": 850
      }
    }
    ```
* **Error Handling (400 Bad Request):** (e.g., invalid date format, `startDate` after `endDate`)
    ```json
    {
      "success": false,
      "error": "Invalid date range provided"
    }
    ```
* **Error Handling (500 Internal Server Error):**
    ```json
    {
      "success": false,
      "error": "Server error: Failed to retrieve sales data"
    }
    ```

### `GET /api/analytics/customer-segments`

* **Description:** Provides an overview of customer segmentation data. This data is generated by the `update_customer_segments()` database function which automatically categorizes customers into tiers based on their spending.
* **Method:** `GET`
* **Parameters:** None (or potential query parameters for specific segmentation criteria if implemented)
* **Example Request:**
    ```
    GET {{base_url}}/api/analytics/customer-segments
    ```
* **Example Response (200 OK):**
    ```json
    {
      "success": true,
      "data": [
        {
          "segment_name": "Premium Customers",
          "description": "Customers with total purchases over $X and multiple orders.",
          "customer_count": 50,
          "example_customer_ids": ["06b8999e2fba1a1fbc88172c00ba8bc7", "customer_id_2", "customer_id_3"]
        },
        {
          "segment_name": "Regular Customers",
          "description": "Customers with moderate spending.",
          "customer_count": 500,
          "example_customer_ids": ["customer_id_4", "customer_id_5"]
        },
        {
          "segment_name": "New Customers",
          "description": "Customers registered within the last 30 days.",
          "customer_count": 120,
          "example_customer_ids": ["customer_id_6", "customer_id_7"]
        }
      ]
    }
    ```
* **Error Handling (500 Internal Server Error):**
    ```json
    {
      "success": false,
      "error": "Server error: Failed to retrieve customer segments"
    }
    ```

### `GET /api/analytics/product-performance`

* **Description:** Retrieves performance metrics for products, such as sales volume, revenue, and popularity.
* **Method:** `GET`
* **Query Parameters:**
    * `startDate` (String, Optional, `YYYY-MM-DD`): Start date for performance analysis.
    * `endDate` (String, Optional, `YYYY-MM-DD`): End date for performance analysis.
    * `limit` (Integer, Optional): Number of top/bottom products to return.
* **Example Request:**
    ```
    GET {{base_url}}/api/analytics/product-performance?startDate=2017-01-01&limit=5
    ```
* **Example Response (200 OK):**
    ```json
    {
      "success": true,
      "data": [
        {
          "product_id": "product_id_A",
          "product_category_name": "electronics",
          "total_sold": 500,
          "total_revenue": 600000.00,
          "average_rating": 4.8
        },
        {
          "product_id": "product_id_B",
          "product_category_name": "fashion",
          "total_sold": 300,
          "total_revenue": 7797.00,
          "average_rating": 4.2
        }
      ]
    }
    ```
* **Error Handling (500 Internal Server Error):**
    ```json
    {
      "success": false,
      "error": "Server error: Failed to retrieve product performance data"
    }
    ```

### `GET /api/analytics/geographic`

* **Description:** Provides sales data broken down by geographic location (e.g., country, state/UF).
* **Method:** `GET`
* **Query Parameters:**
    * `groupBy` (String, Optional): The geographic level to group by (e.g., `customer_state`, `customer_city`).
    * `startDate` (String, Optional, `YYYY-MM-DD`): Start date for analysis.
    * `endDate` (String, Optional, `YYYY-MM-DD`): End date for analysis.
* **Example Request:**
    ```
    GET {{base_url}}/api/analytics/geographic?groupBy=customer_state&startDate=2017-01-01
    ```
* **Example Response (200 OK):**
    ```json
    {
      "success": true,
      "data": [
        {
          "location": "SP",
          "total_sales": 500000.00,
          "total_orders": 4000
        },
        {
          "location": "RJ",
          "total_sales": 150000.00,
          "total_orders": 1200
        }
      ]
    }
    ```
* **Error Handling (400 Bad Request):** (e.g., invalid `groupBy` parameter)
    ```json
    {
      "success": false,
      "error": "Invalid geographic grouping parameter"
    }
    ```
* **Error Handling (500 Internal Server Error):**
    ```json
    {
      "success": false,
      "error": "Server error: Failed to retrieve geographic sales data"
    }
    ```

---

## 9. Health Check

Basic endpoint to verify the API server's operational status.

### `GET /health`

* **Description:** Checks the health and availability of the API server.
* **Method:** `GET`
* **Parameters:** None
* **Example Request:**
    ```
    GET {{base_url}}/health
    ```
* **Example Response (200 OK):**
    ```json
    {
      "success": true,
      "status": "UP",
      "timestamp": "2025-08-01T04:07:00Z",
      "database_connection": "OK"
    }
    ```
* **Error Handling (500 Internal Server Error):**
    ```json
    {
      "success": false,
      "status": "DOWN",
      "timestamp": "2025-08-01T04:07:00Z",
      "error": "Database connection failed"
    }
    ```
