import { Routes, Route, NavLink } from "react-router-dom";
import { FaBoxes, FaPlus, FaListUl } from "react-icons/fa";
import ItemPage from "./pages/ItemPage";
import PurchasePage from "./pages/PurchasePage";
import PurchaseListPage from "./pages/PurchaseListPage";
import "./styles/Header.css";

function App() {
  return (
    <div className="app-container">
      <header className="app-header">
        <div className="logo">🛒 Store Manager</div>
        <nav className="nav-links">
          <NavLink to="/" end className="nav-link">
            <FaBoxes className="nav-icon" /> Items
          </NavLink>
          <NavLink to="/purchase" className="nav-link">
            <FaPlus className="nav-icon" /> New Purchase
          </NavLink>
          <NavLink to="/purchases" className="nav-link">
            <FaListUl className="nav-icon" /> View Purchases
          </NavLink>
        </nav>
      </header>

      <main className="app-main">
        <Routes>
          <Route path="/" element={<ItemPage />} />
          <Route path="/purchase" element={<PurchasePage />} />
          <Route path="/purchases" element={<PurchaseListPage />} />
        </Routes>
      </main>
    </div>
  );
}

export default App;