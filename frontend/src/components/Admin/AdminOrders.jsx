import React, { useState, useEffect } from "react";
import api from "../../api/axios";
import { toast } from "react-hot-toast";

const STATUS_OPTIONS = [
  "all",
  "paid",
  "failed",
];

const AdminOrders = () => {
  const [selectedStatus, setSelectedStatus] = useState("all");
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");


  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const res = await api.get("admin/orders/view");
      setOrders(res.data.Result || []);
    } catch (err) {
      console.error(err);
      setError("Failed to fetch orders");
    } finally {
      setLoading(false);
    }
  };


  const filteredOrders =
    selectedStatus === "all"
      ? orders
      : orders.filter(o => o.status === selectedStatus);

  const formatDate = date =>
    new Date(date).toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });

  const statusColor = status => {
    switch (status) {
      case "paid":
        return "bg-green-100 text-green-700";
      case "failed":
        return "bg-red-100 text-red-700";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  if (loading) return <div className="pt-[96px] px-4 md:px-16 min-h-screen">Loading orders...</div>;
  if (error) return <div className="pt-[96px] px-4 md:px-16 text-red-500">{error}</div>;

  return (
    <div className="pt-[96px] px-4 md:px-16 py-10 bg-muted min-h-screen">
      {/* Header + Filter */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6 gap-4">
        <h1 className="text-2xl font-semibold">Orders Status</h1>

        <div className="flex items-center gap-2">
          <span className="text-sm font-medium">Filter by status:</span>
          <select
            value={selectedStatus}
            onChange={e => setSelectedStatus(e.target.value)}
            className="border rounded px-3 py-2 text-sm"
          >
            {STATUS_OPTIONS.map(s => (
              <option key={s} value={s}>
                {s.charAt(0).toUpperCase() + s.slice(1)}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Orders Table */}
      <div className="bg-card shadow rounded-lg overflow-x-auto animate-scaleIn">
        <table className="w-full text-left text-sm">
          <thead className="bg-muted">
            <tr>
              <th className="p-3">Order ID</th>
              <th className="p-3">Customer</th>
              <th className="p-3">Items</th>
              <th className="p-3">Total</th>
              <th className="p-3">Order Date</th>
              <th className="p-3">Status</th>
            </tr>
          </thead>

          <tbody>
            {filteredOrders.length === 0 ? (
              <tr>
                <td colSpan="6" className="p-6 text-center text-muted-foreground">
                  No orders found for this status
                </td>
              </tr>
            ) : (
              filteredOrders.map(o => (
                <tr key={o._id} className="border-t hover:bg-background">
                  <td className="p-3 font-mono text-xs">{o._id}</td>

                  <td className="p-3">
                    <div className="font-medium text-foreground">{o.userId?.fullname || "Unknown Customer"}</div>
                    <div className="text-xs text-muted-foreground">{o.userId?.email || "N/A"}</div>
                  </td>

                  <td className="p-3">{o.items?.length || 1}</td>

                  <td className="p-3 font-semibold">₹{o.totalAmount}</td>

                  <td className="p-3">{formatDate(o.orderDate)}</td>

                  <td className="p-3">
                    <span className={`px-2 py-1 rounded text-[10px] font-bold uppercase tracking-wider ${statusColor(o.status)}`}>
                      {o.status}
                    </span>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminOrders;
