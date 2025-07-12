import { useEffect, useState } from "react";
import axios from "axios";
import "../styles/ItemPage.css";
import { FaBoxes, FaPlus, FaListUl } from "react-icons/fa";

import Snackbar from "@mui/material/Snackbar";
import MuiAlert from "@mui/material/Alert";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import IconButton from "@mui/material/IconButton";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";

function ItemPage() {
  const [items, setItems] = useState([]);
  const [form, setForm] = useState({
    name: "",
    description: "",
    price: "",
    stock: "",
    id: null,
  });
  const [toast, setToast] = useState({
    open: false,
    message: "",
    severity: "success",
  });
  const [anchorEl, setAnchorEl] = useState(null);
  const [menuItemId, setMenuItemId] = useState(null);

  const showToast = (message, severity = "success") =>
    setToast({ open: true, message, severity });

  const resetForm = () =>
    setForm({ name: "", description: "", price: "", stock: "", id: null });

  const fetchItems = async () => {
    try {
      const res = await axios.get("http://localhost:3001/api/items");
      setItems(res.data);
    } catch (err) {
      showToast("Failed to load items", "error");
    }
  };

  useEffect(() => {
    fetchItems();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const payload = {
      name: form.name.trim(),
      description: form.description?.trim() || "",
      price: parseFloat(form.price),
      stock: parseInt(form.stock),
    };

    if (!payload.name || isNaN(payload.price) || isNaN(payload.stock)) {
      showToast("Please fill all fields correctly", "error");
      return;
    }

    try {
      if (form.id) {
        await axios.put(`http://localhost:3001/api/items/${form.id}`, payload);
        showToast("Item updated successfully");
      } else {
        await axios.post("http://localhost:3001/api/items", payload);
        showToast("Item added successfully");
      }
      resetForm();
      fetchItems();
    } catch (err) {
      console.error("Submit error:", err.response?.data || err.message);
      showToast("Error submitting item", "error");
    }
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:3001/api/items/${id}`);
      showToast("Item deleted");
      fetchItems();
    } catch (err) {
      showToast("Failed to delete item", "error");
    }
  };

  const handleEdit = (item) => setForm(item);

  const handleMenuOpen = (event, id) => {
    setAnchorEl(event.currentTarget);
    setMenuItemId(id);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    setMenuItemId(null);
  };

  return (
    <div className="page">
      <div className="page-header">
        <h2>Inventory Management</h2>
        <form className="item-form" onSubmit={handleSubmit}>
          <TextField
            label="Name"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            required
            size="small"
          />
          <TextField
            label="Description"
            value={form.description}
            onChange={(e) =>
              setForm({ ...form, description: e.target.value })
            }
            size="small"
          />
          <TextField
            label="Price"
            type="number"
            value={form.price}
            onChange={(e) => setForm({ ...form, price: e.target.value })}
            required
            size="small"
          />
          <TextField
            label="Stock"
            type="number"
            value={form.stock}
            onChange={(e) => setForm({ ...form, stock: e.target.value })}
            required
            size="small"
          />
          <Button
            variant="contained"
            color={form.id ? "warning" : "primary"}
            type="submit"
          >
            {form.id ? "Update" : "Add"}
          </Button>
        </form>
      </div>

      <div style={{ overflowX: "auto" }}>
        <table className="item-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Description</th>
              <th>Price (₹)</th>
              <th>Stock</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {items.map((item) => (
              <tr key={item.id}>
                <td>{item.name}</td>
                <td>{item.description}</td>
                <td>{item.price}</td>
                <td>{item.stock}</td>
                <td>
                  <IconButton
                    size="small"
                    onClick={(e) => handleMenuOpen(e, item.id)}
                  >
                    <MoreVertIcon />
                  </IconButton>
                  <Menu
                    anchorEl={anchorEl}
                    open={menuItemId === item.id}
                    onClose={handleMenuClose}
                  >
                    <MenuItem
                      onClick={() => {
                        handleEdit(item);
                        handleMenuClose();
                      }}
                    >
                      Edit
                    </MenuItem>
                    <MenuItem
                      onClick={() => {
                        handleDelete(item.id);
                        handleMenuClose();
                      }}
                    >
                      Delete
                    </MenuItem>
                  </Menu>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <Snackbar
        open={toast.open}
        autoHideDuration={3000}
        onClose={() => setToast({ ...toast, open: false })}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <MuiAlert
          onClose={() => setToast({ ...toast, open: false })}
          severity={toast.severity}
          sx={{ width: "100%" }}
          variant="filled"
        >
          {toast.message}
        </MuiAlert>
      </Snackbar>
    </div>
  );
}

export default ItemPage;
