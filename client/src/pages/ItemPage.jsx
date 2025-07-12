import { useEffect, useState } from "react";
import axios from "axios";
import "../styles/ItemPage.css";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import Snackbar from "@mui/material/Snackbar";
import MuiAlert from "@mui/material/Alert";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import IconButton from "@mui/material/IconButton";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import { FormControl, InputLabel, Select } from "@mui/material";

function ItemPage() {
  const [items, setItems] = useState([]);
  const [form, setForm] = useState({
    name: "",
    description: "",
    price: "",
    stock: "",
    type: "General",
    id: null,
  });

  const itemTypes = ["General", "Electronics", "Grocery", "Clothing", "Stationery"];
  const [toast, setToast] = useState({ open: false, message: "", severity: "success" });
  const [anchorEl, setAnchorEl] = useState(null);
  const [menuItemId, setMenuItemId] = useState(null);

  const showToast = (message, severity = "success") =>
    setToast({ open: true, message, severity });

  const resetForm = () =>
    setForm({ name: "", description: "", price: "", stock: "", type: "General", id: null });

  const fetchItems = async () => {
    try {
      const res = await axios.get("http://localhost:3001/api/items");
      setItems(res.data);
    } catch {
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
      type: form.type,
    };

    if (!payload.name || isNaN(payload.price) || isNaN(payload.stock)) {
      showToast("Please fill all fields correctly", "error");
      return;
    }

    try {
      if (form.id) {
        await axios.put(`http://localhost:3001/api/items/${form.id}`, payload);
        showToast("Item updated");
      } else {
        await axios.post("http://localhost:3001/api/items", payload);
        showToast("Item added");
      }
      resetForm();
      fetchItems(); // 🔁 ensures updated data is fetched including type
    } catch {
      showToast("Error saving item", "error");
    }
  };

  const handleDelete = async (id) => {
  try {
    await axios.delete(`http://localhost:3001/api/items/${id}`);
    showToast("Item deleted");
    fetchItems();
  } catch (err) {
    const msg =
      err.response?.data?.error ||
      "Delete failed";
    showToast(msg, "error");
  }
};


  const handleEdit = (item) => {
  console.log("Editing item:", item); // ✅ Add this for debugging
  setForm(item);
};

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
            onChange={(e) => setForm({ ...form, description: e.target.value })}
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
          <FormControl size="small" style={{ minWidth: 140 }}>
            <InputLabel>Type</InputLabel>
            <Select
              native
              value={form.type}
              onChange={(e) => setForm({ ...form, type: e.target.value })}
            >
              {itemTypes.map((type, i) => (
                <option value={type} key={i}>
                  {type}
                </option>
              ))}
            </Select>
          </FormControl>
          <Button variant="contained" color={form.id ? "warning" : "primary"} type="submit">
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
              <th>Type</th>
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
                <td>{item.type || "General"}</td>
                <td>{item.price}</td>
                <td>{item.stock}</td>
                <td>
                  <IconButton size="small" onClick={(e) => handleMenuOpen(e, item.id)}>
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
