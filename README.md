# Online Retail Database
A PostgreSQL database system for managing online retail operations, built from CSV data analysis and designed for e-commerce insights.

## Overview

This project contains a complete database schema for an online retail system, including customer management, product catalog, order processing, and sales analytics. The database is populated from real retail transaction data and includes automated categorization and customer segmentation.

## Database Schema

### Tables
- **Countries** - Customer location data
- **Categories** - Product categorization system
- **Customers** - Customer profiles with segmentation
- **Products** - Product catalog with stock management
- **Orders** - Order tracking and status
- **Order Items** - Individual line items per order

### Key Features
- Automated customer segmentation (VIP, Premium, Regular, New)
- Product categorization using keyword matching
- Order status tracking
- Sales analytics and reporting capabilities

## Setup Instructions

### Prerequisites
- PostgreSQL 12+ 
- CSV data files (`./database/inputs`)

### Database Setup

1. **Create the database:**
   ```sql
   CREATE DATABASE online_retail_db;
   ```

2. **Run the schema creation:**
   ```bash
   psql -d online_retail_db -f schema.sql
   ```

3. **Populate with data:**
   ```bash
   psql -d online_retail_db -f populate_data.sql
   ```


## File Structure

```
online-retail-database/
├── README.md
├── schema.sql              # Database structure
├── populate_data.sql       # Data import script
├── sample_queries.sql      # Example analytics queries
└── database/
    └── inputs
         └── *.csv
```

## Data Processing

The system includes:
- **Data cleaning** - Removes invalid records and cancelled orders
- **Customer segmentation** - Automatic classification based on spending
- **Product categorization** - Smart categorization using description keywords
- **Order aggregation** - Consolidates transaction data into meaningful orders

## Analytics Features

- Customer lifetime value analysis
- Product performance metrics
- Geographic sales distribution
- Seasonal trend analysis
- Customer segmentation insights

# E-commerce documentation

## Project Overview

Welcome to the Online Retail Platform project! This repository hosts the foundational code and documentation for a scalable e-commerce system. Our goal is to develop a robust platform capable of handling customer management, product catalogs, order processing, real-time inventory updates, and comprehensive customer analytics.

This project emphasizes modularity, performance, and clear documentation to facilitate cross-team collaboration and future expansion.

## Getting Started

To get a local copy of this project up and running, follow these steps:

### Prerequisites

Before you begin, ensure you have the following installed on your machine:

* **Node.js** (LTS version recommended)
* **npm** (Node Package Manager, comes with Node.js)
* **PostgreSQL** (Database server)
* **Git**
* **VS Code** (Recommended code editor)
* **GitHub Desktop** (Recommended Git client for ease of use)

### Installation and Setup

1.  **Fork the Repository:**
    * Navigate to the [main `online-retail-project` repository on GitHub](https://github.com/original-owner/online-retail-project) (replace `original-owner` with the actual owner's username/organization).
    * Click the **"Fork"** button in the top-right corner to create your personal copy of the repository.

2.  **Clone Your Fork:**
    * Open **GitHub Desktop**.
    * Go to `File > Clone Repository...`
    * Select the **"GitHub.com"** tab, find your forked `online-retail-project` (under your username), and choose a local path on your computer.
    * Click **"Clone"**.

3.  **Open in VS Code:**
    * After cloning, GitHub Desktop will usually prompt you to "Open in Visual Studio Code." Click this button.

4.  **Add Upstream Remote (Optional but Recommended for Syncing):**
    * While GitHub Desktop handles syncing, if you ever need to manually configure the upstream (original) repository for command-line use or deeper understanding:
        * Open your terminal/Command Prompt.
        * Navigate to your cloned project directory: `cd path/to/your/online-retail-project`
        * Add the upstream remote:
            ```bash
            git remote add upstream [https://github.com/original-owner/online-retail-project.git](https://github.com/original-owner/online-retail-project.git)
            ```
            (Again, replace `original-owner` with the actual owner's username/organization).

5.  **Install Dependencies:**
    * Open the integrated terminal in VS Code (`Ctrl+`` or `View > Terminal`).
    * Run:
        ```bash
        npm install
        ```

6.  **Set up Environment Variables:**
    * In the root of your project, create a file named `.env`.
    * Copy the content from `.env.example` into your new `.env` file.
    * **Crucially, replace the placeholder values with your actual PostgreSQL database credentials and desired application port.**
        ```env
        PGUSER=your_actual_db_username
        PGPASSWORD=your_actual_db_password
        PGHOST=localhost
        PGDATABASE=your_actual_database_name
        PGPORT=5432
        PORT=3000
        ```
    * **Remember:** The `.env` file should **NEVER** be committed to Git, as it contains sensitive information. The `.gitignore` file should already prevent this.

7.  **Start the Server:**
    * In the VS Code terminal, run:
        ```bash
        node server.js
        ```
    * The server should start, and you'll see a message indicating the port it's running on (e.g., "Server running on port 3000").
    * You can access the API documentation by navigating to `http://localhost:3000/api-docs` in your web browser.

## Team and Roles

This project is a collaborative effort, with each member focusing on key areas:

* **Member 1 (Database Design & Optimization):** Designs customer, product, and order schemas; implements tables, relationships, and indexes; optimizes for high-volume transactions; performs performance analysis for retail queries.
* **Member 2 (API Development):** Sets up Node.js project; develops basic customer, product catalog, order, search, filtering, and analytics APIs; performs final API optimization and testing.
* **Member 3 (Data & Analytics):** Analyzes retail datasets, plans data structures; populates database with retail data and basic procedures; creates sales analysis procedures and inventory triggers; implements advanced analytics and customer segmentation.
* **Member 4 (Documentation & Integration):** Creates GitHub repo, plans e-commerce documentation; documents all APIs; plans and facilitates integration testing; prepares for final integration and demo.

## Project Phases

Our project is structured into four weekly phases to ensure systematic development and delivery:

### Week 1: E-commerce Foundation
* **Focus:** Initial setup, database schema design, basic customer APIs, and project documentation planning.

### Week 2: Core E-commerce Features
* **Focus:** Database implementation, core product catalog and order APIs, data population, and initial API documentation.

### Week 3: Advanced Retail Features
* **Focus:** Database optimization, advanced search/filtering/analytics APIs, sales analysis, inventory triggers, and comprehensive API documentation with integration testing.

### Week 4: E-commerce Optimization
* **Focus:** Performance analysis, final API optimization, advanced analytics implementation, complete system integration, and demo preparation.

---

## Documentation

* **API Documentation:** Detailed information on all API endpoints, including request/response formats and error handling. (See `docs/api-documentation.md` and the live Swagger UI at `/api-docs`).
* **Business Workflow Documentation:** Guides on customer journey, order processing, inventory management, and analytics. (See the `docs/` directory).
* **Integration Testing Scenarios:** Comprehensive test cases to validate end-to-end system functionality. (See `docs/integration-testing.md`).

