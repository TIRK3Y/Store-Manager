// server/routes/items.js
const express = require("express");
const router = express.Router();
const db = require("../database");

// Get all items
router.get("/", (req, res) => {
  db.query("SELECT * FROM items", (err, results) => {
    if (err) {
      console.error("Error fetching items:", err);
      return res.status(500).json({ error: "Database error" });
    }
    res.json(results);
  });
});

// Add new item
router.post("/", (req, res) => {
  const { name, description, price, stock } = req.body;
  const sql = "INSERT INTO items (name, description, price, stock) VALUES (?, ?, ?, ?)";
  db.query(sql, [name, description, price, stock], (err, result) => {
    if (err) {
      console.error("Error adding item:", err);
      return res.status(500).json({ error: "Database insert error" });
    }
    res.json({ success: true, id: result.insertId });
  });
});

// Update item
router.put("/:id", (req, res) => {
  const { name, description, price, stock } = req.body;
  const sql = "UPDATE items SET name = ?, description = ?, price = ?, stock = ? WHERE id = ?";
  db.query(sql, [name, description, price, stock, req.params.id], (err) => {
    if (err) {
      console.error("Error updating item:", err);
      return res.status(500).json({ error: "Database update error" });
    }
    res.json({ success: true });
  });
});

// Delete item
router.delete("/:id", (req, res) => {
  db.query("DELETE FROM items WHERE id = ?", [req.params.id], (err) => {
    if (err) {
      console.error("Error deleting item:", err);
      return res.status(500).json({ error: "Database delete error" });
    }
    res.json({ success: true });
  });
});

module.exports = router;
