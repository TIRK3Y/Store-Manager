import { useEffect, useState } from "react";
import axios from "axios";
import "../styles/PurchasePage.css";

import {
  TextField,
  Button,
  Snackbar,
  Alert,
  Typography,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  MenuItem,
  Select,
} from "@mui/material";

function PurchasePage() {
  const [items, setItems] = useState([]);
  const [customerName, setCustomerName] = useState("");
  const [shippingAddress, setShippingAddress] = useState("");
  const [selectedItems, setSelectedItems] = useState([{ item_id: "", quantity: 1 }]);
  const [toast, setToast] = useState({ open: false, message: "", severity: "success" });

  useEffect(() => {
    axios
      .get("http://localhost:3001/api/items")
      .then((res) => setItems(res.data))
      .catch(() => showToast("Failed to load items", "error"));
  }, []);

  const showToast = (message, severity = "success") => {
    setToast({ open: true, message, severity });
  };

  const updateItem = (index, key, value) => {
    const updated = [...selectedItems];
    updated[index][key] = value;
    setSelectedItems(updated);
  };

  const addItem = () => {
    setSelectedItems([...selectedItems, { item_id: "", quantity: 1 }]);
  };

  const removeItem = (index) => {
    const updated = selectedItems.filter((_, i) => i !== index);
    setSelectedItems(updated);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!customerName || !shippingAddress || selectedItems.length === 0) {
      return showToast("Please fill all fields", "error");
    }

    try {
      await axios.post("http://localhost:3001/api/purchases", {
        customer_name: customerName,
        shipping_address: shippingAddress,
        items: selectedItems,
      });

      setCustomerName("");
      setShippingAddress("");
      setSelectedItems([{ item_id: "", quantity: 1 }]);
      showToast("Purchase created successfully!");
    } catch (err) {
      showToast("Failed to create purchase", "error");
    }
  };

  return (
    <div className="purchase-page">
      <Typography variant="h5" className="page-title">
        Create New Purchase
      </Typography>

      <form onSubmit={handleSubmit} className="form-grid">
        <div className="form-section">
          <TextField
            label="Customer Name"
            value={customerName}
            onChange={(e) => setCustomerName(e.target.value)}
            fullWidth
            required
            size="small"
          />
          <TextField
            label="Shipping Address"
            value={shippingAddress}
            onChange={(e) => setShippingAddress(e.target.value)}
            fullWidth
            multiline
            minRows={2}
            required
            size="small"
            sx={{ marginTop: "16px" }}
          />
        </div>

        <div className="table-section">
          <div className="table-header">
            <Typography variant="subtitle1">Items</Typography>
            <Button variant="outlined" onClick={addItem} size="small">
              Add Item
            </Button>
          </div>

          <Table size="small">
            <TableHead>
              <TableRow>
                <TableCell>Item</TableCell>
                <TableCell>Type</TableCell> {/* New column */}
                <TableCell>Quantity</TableCell>
                <TableCell>Price</TableCell>
                <TableCell>Total</TableCell>
                <TableCell>Action</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {selectedItems.map((item, index) => {
                const full = items.find((i) => i.id === item.item_id);
                const price = full?.price || 0;
                const total = price * item.quantity;

                return (
                  <TableRow key={index}>
                    <TableCell>
                      <Select
                        value={item.item_id}
                        onChange={(e) => updateItem(index, "item_id", e.target.value)}
                        displayEmpty
                        fullWidth
                        size="small"
                      >
                        <MenuItem value="" disabled>
                          Select Item
                        </MenuItem>
                        {items.map((i) => (
                          <MenuItem key={i.id} value={i.id}>
                            {i.name}
                          </MenuItem>
                        ))}
                      </Select>
                    </TableCell>

                    <TableCell>{full?.type || "Unknown"}</TableCell> {/* Type column */}

                    <TableCell>
                      <TextField
                        type="number"
                        value={item.quantity}
                        onChange={(e) =>
                          updateItem(index, "quantity", parseInt(e.target.value))
                        }
                        inputProps={{ min: 1 }}
                        size="small"
                      />
                    </TableCell>
                    <TableCell>₹{price}</TableCell>
                    <TableCell>₹{total}</TableCell>
                    <TableCell>
                      <Button
                        color="error"
                        size="small"
                        onClick={() => removeItem(index)}
                      >
                        Delete
                      </Button>
                    </TableCell>
                  </TableRow>
                );
              })}
              <TableRow>
                <TableCell colSpan={4} align="right">
                  <strong>Total</strong>
                </TableCell>
                <TableCell colSpan={2}>
                  ₹
                  {selectedItems.reduce((sum, item) => {
                    const p = items.find((i) => i.id === item.item_id)?.price || 0;
                    return sum + item.quantity * p;
                  }, 0)}
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </div>

        <Button variant="contained" type="submit" className="submit-button">
          Submit Purchase
        </Button>
      </form>

      <Snackbar
        open={toast.open}
        autoHideDuration={3000}
        onClose={() => setToast({ ...toast, open: false })}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert
          onClose={() => setToast({ ...toast, open: false })}
          severity={toast.severity}
          variant="filled"
          sx={{ width: "100%" }}
        >
          {toast.message}
        </Alert>
      </Snackbar>
    </div>
  );
}

export default PurchasePage;
