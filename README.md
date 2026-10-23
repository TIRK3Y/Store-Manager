# Store Manager

A full-stack inventory and purchase management application for a small store. The React front end lets staff maintain an item catalogue, record multi-item purchases and browse purchase history, while an Express API persists the data in MySQL and validates stock levels inside a database transaction.

## Features

- Item management: create, edit and delete items with name, description, price, stock and category
- Deletion protection for items that are referenced by existing purchases
- Multi-item purchases with customer name and shipping address
- Stock validation that rejects out-of-stock or insufficient quantities, and automatic stock deduction
- Purchase creation wrapped in a MySQL transaction with rollback on failure
- Purchase history with search by customer name, date filtering and pagination
- Snackbar notifications for success and error feedback

## Tech stack

| Layer | Technology |
| --- | --- |
| Front end | React 19, Vite 7, React Router 7, Material UI 7, Axios, react-icons |
| Back end | Node.js, Express 5, cors |
| Database | MySQL (via the `mysql` driver) |

## Getting started

### Prerequisites

- Node.js and npm
- A running MySQL server

### Database setup

Create a database named `store_db` and the following tables:

```sql
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
```

The connection settings (host, user, password, database) are defined directly in `server/database.js`. Update them to match your MySQL installation.

### Run the API

```bash
cd server
npm install
node server.js
```

The API listens on http://localhost:3001.

### Run the client

```bash
cd client
npm install
npm run dev
```

Open the URL printed by Vite (http://localhost:5173 by default).

## API

| Method | Endpoint | Description |
| --- | --- | --- |
| GET | `/api/items` | List all items |
| POST | `/api/items` | Create an item |
| PUT | `/api/items/:id` | Update an item |
| DELETE | `/api/items/:id` | Delete an item |
| GET | `/api/purchases` | List purchases with their line items |
| POST | `/api/purchases` | Create a purchase and deduct stock |

## Project structure

```
client/
  src/
    App.jsx           Routes and navigation
    pages/            Items, new purchase and purchase history pages
    styles/           Page styles
server/
  server.js           Express app (port 3001)
  database.js         MySQL connection
  routes/             Item and purchase routes
```

## Notes

- The client calls the API at the hard-coded address `http://localhost:3001`.
- Database credentials are hard-coded in `server/database.js`; move them to environment variables before deploying.

## License

No license has been specified for this project.
