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