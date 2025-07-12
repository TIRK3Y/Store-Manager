const express = require("express");
const cors = require("cors");
const app = express();
const db = require("./database");

const itemRoutes = require("./routes/items");
const purchaseRoutes = require("./routes/purchases");

app.use(cors());
app.use(express.json());

app.use("/api/items", itemRoutes);
app.use("/api/purchases", purchaseRoutes);

app.get("/", (req, res) => {
  res.send("✅ Store App API is running!");
});

const PORT = 3001;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);

  if (app._router && app._router.stack) {
    app._router.stack.forEach((middleware) => {
      if (middleware.route) {
        console.log("Route registered:", middleware.route.path);
      } else if (middleware.name === "router") {
        middleware.handle.stack.forEach((handler) => {
          if (handler.route) {
            console.log("Route registered:", handler.route.path);
          }
        });
      }
    });
  } else {
    console.log("No routes registered yet");
  }
});
