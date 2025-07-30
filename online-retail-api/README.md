
# Online Retail API Documentation

## Table of Contents
- [Installation](#installation)
  - [Prerequisites](#prerequisites)
  - [Setting Up on Ubuntu](#setting-up-on-ubuntu)
  - [Setting Up on Windows](#setting-up-on-windows)
- [Environment Setup](#environment-setup)
- [Running the Application](#running-the-application)
- [API Endpoints](#api-endpoints)
  - [Customer Management](#customer-management)
  - [Product Catalog](#product-catalog)
  - [Order Management](#order-management)
  - [Analytics](#analytics)
- [Testing](#testing)
- [Contributing](#contributing)
- [License](#license)

## 1. Installation

### Prerequisites
- Node.js (v16 or later)
- npm (comes with Node.js)
- PostgreSQL (or another SQL database if configured)
- Git (for cloning the repository)

### Setting Up on Ubuntu

1. **Install Node.js & npm**
   ```bash
   curl -fsSL https://deb.nodesource.com/setup_16.x | sudo -E bash -
   sudo apt-get install -y nodejs
   node -v  # Verify Node.js installation
   npm -v   # Verify npm installation
   ```

2. **Install PostgreSQL**
   ```bash
   sudo apt-get install postgresql postgresql-contrib
   sudo systemctl start postgresql
   sudo systemctl enable postgresql
   ```

3. **Clone the Repository**
   ```bash
   git clone https://github.com/your-repo/online-retail-api.git
   cd online-retail-api
   ```

4. **Install Dependencies**
   ```bash
   npm install
   ```

### Setting Up on Windows

1. **Install Node.js & npm**  
   Download Node.js from [https://nodejs.org](https://nodejs.org) (LTS version recommended).  
   Run the installer and follow the steps.  
   Verify installation:
   ```bash
   node -v
   npm -v
   ```

2. **Install PostgreSQL**  
   Download PostgreSQL from [https://www.postgresql.org/download/windows/](https://www.postgresql.org/download/windows/).  
   Follow the installation wizard and remember your credentials.  
   Start the PostgreSQL service (via pgAdmin or Windows Services).

3. **Clone the Repository**
   ```bash
   git clone https://github.com/your-repo/online-retail-api.git
   cd online-retail-api
   ```

4. **Install Dependencies**
   ```bash
   npm install
   ```

## 2. Environment Setup

Create `.env` file (copy from `.env.example`):

```env
PORT=3000
DATABASE_URL=postgresql://<user>:<password>@localhost:5432/online_retail_db
```

Run the app in development mode:

```bash
npm run dev
```

For production:

```bash
npm start
```

## 3. Running the Application

**Development mode (with hot reload):**
```bash
npm run dev
```

**Production mode:**
```bash
npm start
```

Access Swagger Docs (API Documentation):  
Open [http://localhost:3000/api-docs](http://localhost:3000/api-docs)

## 4. API Endpoints

### Customer Management

| Endpoint | Method | Description |
|----------|--------|-------------|
| /api/customers | GET | Get all customers (paginated) |
| /api/customers/:id | GET | Get a single customer |
| /api/customers | POST | Create a new customer |
| /api/customers/:id | PUT | Update a customer |
| /api/customers/:id/orders | GET | Get a customer’s orders |

### Product Catalog

| Endpoint | Method | Description |
|----------|--------|-------------|
| /api/products | GET | Get all products (filterable) |
| /api/products/:id | GET | Get a single product |
| /api/products | POST | Add a new product |
| /api/products/:id | PUT | Update a product |
| /api/products/:id | DELETE | Delete a product |

### Order Management

| Endpoint | Method | Description |
|----------|--------|-------------|
| /api/orders | GET | Get all orders (filterable) |
| /api/orders/:id | GET | Get a single order |
| /api/orders | POST | Create a new order |
| /api/orders/:id/status | PUT | Update order status |
| /api/orders/:id | DELETE | Cancel an order |

### Analytics

| Endpoint | Method | Description |
|----------|--------|-------------|
| /api/analytics/sales-summary | GET | Get sales summary |
| /api/analytics/top-products | GET | Get top-selling products |
| /api/analytics/customer-segments | GET | Get customer segments |

## 5. Testing

Run unit tests:

```bash
npm test
```

**Postman Collection:**  
Import `Online_Retail.postman_collection.json` into Postman for API testing.

## 6. Contributing

1. Fork the repository.
2. Create a new branch:
   ```bash
   git checkout -b feature-branch
   ```
3. Commit changes:
   ```bash
   git commit -m "Add new feature"
   ```
4. Push to the branch:
   ```bash
   git push origin feature-branch
   ```
5. Open a Pull Request.

## License

This project is licensed under the MIT License.

> This documentation provides a complete guide for setting up, running, and using the Online Retail API. For further assistance, refer to the Swagger docs or open an issue in the repository. �
