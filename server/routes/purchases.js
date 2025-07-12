const express = require("express");
const router = express.Router();
const db = require("../database");

// GET all purchases with item details (now includes item type)
router.get("/", (req, res) => {
  const query = `
    SELECT p.id, p.customer_name, p.shipping_address, p.created_at,
           pi.item_id, pi.quantity,
           i.name AS item_name, i.price, i.type AS item_type
    FROM purchases p
    LEFT JOIN purchase_items pi ON p.id = pi.purchase_id
    LEFT JOIN items i ON pi.item_id = i.id
    ORDER BY p.created_at DESC;
  `;

  db.query(query, (err, results) => {
    if (err) {
      console.error("DB Query Error:", err);
      return res.status(500).json({ error: err.message });
    }

    const purchasesMap = new Map();

    for (const row of results) {
      if (!purchasesMap.has(row.id)) {
        purchasesMap.set(row.id, {
          id: row.id,
          customer_name: row.customer_name,
          shipping_address: row.shipping_address,
          created_at: row.created_at,
          items: [],
        });
      }

      if (row.item_id) {
        purchasesMap.get(row.id).items.push({
          item_id: row.item_id,
          name: row.item_name,
          price: row.price,
          quantity: row.quantity,
          type: row.item_type || "Unknown",
        });
      }
    }

    res.json(Array.from(purchasesMap.values()));
  });
});

// POST create a new purchase (with stock validation and deduction)
router.post("/", (req, res) => {
  const { customer_name, shipping_address, items } = req.body;

  if (!customer_name || !shipping_address || !Array.isArray(items) || items.length === 0) {
    return res.status(400).json({ error: "Please provide customer name, shipping address and at least one item." });
  }

  db.beginTransaction((err) => {
    if (err) return res.status(500).json({ error: "Transaction failed to start" });

    const itemIds = items.map(i => i.item_id);
    const placeholders = itemIds.map(() => '?').join(',');

    db.query(`SELECT id, stock, name FROM items WHERE id IN (${placeholders})`, itemIds, (err, stockResults) => {
      if (err) return db.rollback(() => res.status(500).json({ error: err.message }));

      const stockMap = new Map(stockResults.map(item => [item.id, item]));

      for (const { item_id, quantity } of items) {
        const item = stockMap.get(item_id);
        if (!item) {
          return db.rollback(() => res.status(400).json({ error: `Invalid item ID: ${item_id}` }));
        }
        if (item.stock < quantity) {
          return db.rollback(() =>
            res.status(400).json({
              error: `Not enough stock for item "${item.name}". Available: ${item.stock}, Requested: ${quantity}`
            })
          );
        }
      }

      const purchaseQuery = `
        INSERT INTO purchases (customer_name, shipping_address)
        VALUES (?, ?)
      `;
      db.query(purchaseQuery, [customer_name, shipping_address], (err, result) => {
        if (err) return db.rollback(() => res.status(500).json({ error: err.message }));

        const purchaseId = result.insertId;
        const purchaseItems = items.map(({ item_id, quantity }) => [purchaseId, item_id, quantity]);
        const insertPurchaseItemsQuery = `
          INSERT INTO purchase_items (purchase_id, item_id, quantity)
          VALUES ?
        `;

        db.query(insertPurchaseItemsQuery, [purchaseItems], (err2) => {
          if (err2) return db.rollback(() => res.status(500).json({ error: err2.message }));

          const updateStockPromises = items.map(({ item_id, quantity }) => {
            return new Promise((resolve, reject) => {
              db.query(`UPDATE items SET stock = stock - ? WHERE id = ?`, [quantity, item_id], (err3) => {
                if (err3) reject(err3);
                else resolve();
              });
            });
          });

          Promise.all(updateStockPromises)
            .then(() => {
              db.commit((commitErr) => {
                if (commitErr) return db.rollback(() => res.status(500).json({ error: commitErr.message }));
                res.json({ success: true, purchaseId });
              });
            })
            .catch((updateErr) => {
              db.rollback(() => res.status(500).json({ error: updateErr.message }));
            });
        });
      });
    });
  });
});

module.exports = router;
