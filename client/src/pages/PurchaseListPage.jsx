import { useEffect, useState } from "react";
import axios from "axios";
import "../styles/PurchaseListPage.css";

function PurchaseListPage() {
  const [purchases, setPurchases] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [search, setSearch] = useState("");
  const [dateFilter, setDateFilter] = useState("");

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  useEffect(() => {
    fetchPurchases();
  }, []);

  const fetchPurchases = async () => {
    try {
      const res = await axios.get("http://localhost:3001/api/purchases");
      setPurchases(res.data);
      setFiltered(res.data);
    } catch (err) {
      console.error("Error fetching purchases:", err);
    }
  };

  useEffect(() => {
    filterResults();
  }, [search, dateFilter]);

  const filterResults = () => {
    const filteredData = purchases.filter((purchase) => {
      const nameMatch = purchase.customer_name.toLowerCase().includes(search.toLowerCase());
      const itemMatch = purchase.items.some((item) =>
        item.name.toLowerCase().includes(search.toLowerCase())
      );
      const dateOnly = new Date(purchase.created_at).toISOString().split("T")[0];
      const dateMatch = dateFilter === "" || dateOnly === dateFilter;

      return (nameMatch || itemMatch) && dateMatch;
    });

    setFiltered(filteredData);
    setCurrentPage(1); // Reset to first page on new filter
  };

  // Pagination slicing
  const totalPages = Math.ceil(filtered.length / itemsPerPage);
  const paginatedData = filtered.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const goToPage = (pageNum) => {
    if (pageNum >= 1 && pageNum <= totalPages) setCurrentPage(pageNum);
  };

  return (
    <div className="purchase-page">
      <div className="purchase-header">
        <h2>🧾 Purchase History</h2>
        <div className="purchase-filters">
          <input
            type="text"
            placeholder="Search by customer or item"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <input
            type="date"
            value={dateFilter}
            onChange={(e) => setDateFilter(e.target.value)}
          />
        </div>
      </div>

      {paginatedData.length === 0 ? (
        <p className="no-data">No purchases found.</p>
      ) : (
        <div className="purchase-list">
          {paginatedData.map((purchase) => {
            const createdAt = new Date(purchase.created_at);
            const date = createdAt.toLocaleDateString();
            const time = createdAt.toLocaleTimeString();
            const total = purchase.items.reduce(
              (sum, item) => sum + item.quantity * item.price,
              0
            );

            return (
              <div className="purchase-card" key={purchase.id}>
                <div className="purchase-card-header">
                  <div><strong>Customer:</strong> {purchase.customer_name}</div>
                  <div className="datetime">
                    <span>{date}</span>
                    <span className="time">{time}</span>
                  </div>
                </div>
                <div className="address">
                  <strong>Shipping:</strong> {purchase.shipping_address}
                </div>
                <table className="item-table">
                  <thead>
                    <tr>
                      <th>Item</th>
                      <th>Qty</th>
                      <th>Price</th>
                      <th>Total</th>
                    </tr>
                  </thead>
                  <tbody>
                    {purchase.items.map((item) => (
                      <tr key={item.item_id}>
                        <td>{item.name}</td>
                        <td>{item.quantity}</td>
                        <td>₹{item.price}</td>
                        <td>₹{item.quantity * item.price}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                <div className="purchase-total">
                  <strong>Total: ₹{total}</strong>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Pagination Controls */}
      {totalPages > 1 && (
        <div className="pagination">
          <button onClick={() => goToPage(currentPage - 1)} disabled={currentPage === 1}>
            ⬅ Prev
          </button>
          {Array.from({ length: totalPages }, (_, i) => (
            <button
              key={i}
              onClick={() => goToPage(i + 1)}
              className={currentPage === i + 1 ? "active" : ""}
            >
              {i + 1}
            </button>
          ))}
          <button onClick={() => goToPage(currentPage + 1)} disabled={currentPage === totalPages}>
            Next ➡
          </button>
        </div>
      )}
    </div>
  );
}

export default PurchaseListPage;
