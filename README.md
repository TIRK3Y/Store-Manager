# Store Management Web App

A full-stack web application built using **React**, **Node.js**, and **MySQL** that allows a small store to manage inventory, purchases, and stock efficiently. The app enables creating and updating items, making multi-item purchases, tracking stock levels, and viewing purchase history.

## Features

### Item Management
- Add, edit, and delete items
- Support for item type/category (e.g., Electronics, Grocery)
- Real-time stock tracking

### Purchases
- Create purchases with multiple items
- Shipping address and customer details
- Stock validation (prevents overselling)
- Automatic stock deduction upon purchase

### Purchase History
- View all past purchases
- Includes customer name, date, items, and totals
- Filter by customer, item name, or date
- Item type and availability shown per purchase

### Backend (Node.js + Express)
- RESTful API for all operations
- Data validation and error handling
- JOIN queries to fetch item and purchase details
- Uses MySQL database with normalized schema

### Database (MySQL)
- Tables: `items`, `purchases`, `purchase_items`
- Proper foreign keys and relational mapping
- JOINs used for fetching related data (e.g., item types with purchases)

### Frontend (React + MUI)
- Material UI for professional, responsive UI
- Toast notifications for feedback
- Dark mode compatible
- Clean, compact form and table layout
- Pagination and filtering



## Technologies Used

|----------------|---------------------------------|
| Tech           | Purpose                         |
|----------------|---------------------------------|
| React          | Frontend UI                     |
| Material UI    | UI Components                   |
| Axios          | API Calls                       |
| Node.js        | Backend server                  |
| Express        | Routing & API                   |
| MySQL          | Relational database             |
| Toast Alerts   | Notifications & Feedback        |
|----------------|---------------------------------|

## Setup Instructions

### Prerequisites
- Node.js & npm
- MySQL Server
- Git

### Backend Setup
```bash
cd server
npm install
node server.js


CREATE TABLE items (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  description TEXT,
  price DECIMAL(10,2) NOT NULL,
  stock INT NOT NULL,
  type VARCHAR(100) DEFAULT 'General'
);

CREATE TABLE purchases (
  id INT AUTO_INCREMENT PRIMARY KEY,
  customer_name VARCHAR(255) NOT NULL,
  shipping_address TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE purchase_items (
  id INT AUTO_INCREMENT PRIMARY KEY,
  purchase_id INT,
  item_id INT,
  quantity INT,
  FOREIGN KEY (purchase_id) REFERENCES purchases(id),
  FOREIGN KEY (item_id) REFERENCES items(id)
);


