# Database Schema Documentation: Queens Club

This document provides a detailed breakdown of the "Queens Club" relational database architecture.

---

## 1. Relationship Visualizer (ERD)

The diagram below shows how tables connect through **Primary Keys (PK)** and **Foreign Keys (FK)**.

- `||--||` = **1:1** Relationship (One-to-One)
- `||--o{` = **1:N** Relationship (One-to-Many)

```mermaid
erDiagram
    USER ||--|| CUSTOMER_PROFILE : "1:1"
    USER ||--|o TENANT : "1:1"
    USER ||--o{ ORDER : "1:N"
    USER ||--o{ WISHLIST : "1:N"
    
    TENANT ||--o{ PRODUCT : "1:N"
    TENANT ||--o{ EVENT : "1:N"
    
    ORDER ||--o{ ORDER_ITEM : "1:N"
    PRODUCT ||--o{ ORDER_ITEM : "1:N"
    PRODUCT ||--o{ WISHLIST : "1:N"

    USER {
        int id PK
        string username
        string email
        string password_hash
        string role
        datetime created_at
    }

    TENANT {
        int id PK
        int user_id FK
        string shop_name
        string category
        string shop_number
        string image_url
        text description
        float account_balance
        boolean is_approved
    }

    CUSTOMER_PROFILE {
        int id PK
        int user_id FK
        int loyalty_points
        string tier
        datetime joined_at
    }

    PRODUCT {
        int id PK
        int tenant_id FK
        string name
        text description
        float price
        int stock
        string image_url
    }

    ORDER {
        int id PK
        int user_id FK
        float total_amount
        string status
        string delivery_address
        string contact_number
        datetime delivery_time
        datetime created_at
    }

    ORDER_ITEM {
        int id PK
        int order_id FK
        int product_id FK
        int quantity
        float price_at_purchase
    }

    EVENT {
        int id PK
        int tenant_id FK
        string name
        text description
        datetime date
        string image_url
    }

    WISHLIST {
        int id PK
        int user_id FK
        int product_id FK
    }
```

---

## 2. Table Structures & Definitions

### **Table: `user`**
Stores core authentication and profile management data.

| Column | Type | Key | Notes |
| :--- | :--- | :--- | :--- |
| `id` | Integer | **PK** | Unique identifier for each user |
| `username` | String | | Unique login name |
| `email` | String | | Unique contact email |
| `password_hash` | String | | Encrypted security password |
| `role` | String | | `admin`, `tenant`, or `customer` |
| `created_at` | DateTime | | Auto-generated timestamp |

---

### **Table: `tenant`**
Stores boutique and shop-specific metadata.

| Column | Type | Key | Notes |
| :--- | :--- | :--- | :--- |
| `id` | Integer | **PK** | |
| `user_id` | Integer | **FK** | Links to `user.id` (1:1 Relationship) |
| `shop_name` | String | | |
| `category` | String | | `Fashion`, `Electronics`, etc. |
| `shop_number` | String | | Physical location ID |
| `account_balance` | Float | | Accumulated revenue |
| `is_approved` | Boolean | | Admin approval status |

---

### **Table: `product`**
Stores the inventory items for each boutique.

| Column | Type | Key | Notes |
| :--- | :--- | :--- | :--- |
| `id` | Integer | **PK** | |
| `tenant_id` | Integer | **FK** | Links to `tenant.id` (1:N Relationship) |
| `name` | String | | |
| `description` | Text | | |
| `price` | Float | | |
| `stock` | Integer | | Quantity available |

---

### **Table: `order`**
Tracks transactions and delivery status.

| Column | Type | Key | Notes |
| :--- | :--- | :--- | :--- |
| `id` | Integer | **PK** | |
| `user_id` | Integer | **FK** | Customer who placed order (`user.id`) |
| `total_amount` | Float | | |
| `status` | String | | `Pending`, `Completed`, `Cancelled` |
| `delivery_address`| String | | |
| `created_at` | DateTime | | Transaction timestamp |

---

### **Table: `order_item`**
Junction table mapping products to specific orders.

| Column | Type | Key | Notes |
| :--- | :--- | :--- | :--- |
| `id` | Integer | **PK** | |
| `order_id` | Integer | **FK** | Links to `order.id` |
| `product_id` | Integer | **FK** | Links to `product.id` |
| `quantity` | Integer | | |
| `price_at_purchase`| Float | | Price snapshot at time of order |

---

### **Table: `customer_profile`**
Loyalty-specific data for customers.

| Column | Type | Key | Notes |
| :--- | :--- | :--- | :--- |
| `id` | Integer | **PK** | |
| `user_id` | Integer | **FK** | Links to `user.id` (1:1 Relationship) |
| `loyalty_points`| Integer | | |
| `tier` | String | | `Bronze`, `Silver`, `Gold`, `Platinum` |

---

### **Table: `wishlist`**
Saves items for later purchase.

| Column | Type | Key | Notes |
| :--- | :--- | :--- | :--- |
| `id` | Integer | **PK** | |
| `user_id` | Integer | **FK** | Links to `user.id` |
| `product_id` | Integer | **FK** | Links to `product.id` |
