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
  const [downloadingId, setDownloadingId] = useState(null);
  const [selectedTimePeriod, setSelectedTimePeriod] = useState("all");

  const TIME_PERIODS = [
    { label: "All Time", value: "all" },
    { label: "Today", value: "today" },
    { label: "Yesterday", value: "yesterday" },
    { label: "Last 7 Days", value: "last7" },
    { label: "Last 30 Days", value: "last30" },
  ];


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


  const filteredOrders = orders.filter(o => {
    // Status filter
    const statusMatch = selectedStatus === "all" || o.status === selectedStatus;
    if (!statusMatch) return false;

    // Time period filter
    if (selectedTimePeriod === "all") return true;

    const orderDate = new Date(o.orderDate);
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());

    switch (selectedTimePeriod) {
      case "today":
        return orderDate >= today;
      case "yesterday":
        const yesterday = new Date(today);
        yesterday.setDate(yesterday.getDate() - 1);
        return orderDate >= yesterday && orderDate < today;
      case "last7":
        const last7Days = new Date(today);
        last7Days.setDate(last7Days.getDate() - 7);
        return orderDate >= last7Days;
      case "last30":
        const last30Days = new Date(today);
        last30Days.setDate(last30Days.getDate() - 30);
        return orderDate >= last30Days;
      default:
        return true;
    }
  });

  const formatDate = date =>
    new Date(date).toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });

  const downloadReceipt = async (id) => {
    setDownloadingId(id);
    try {
      const response = await api.get(`admin/orders/${id}/receipt`, { responseType: 'blob' });
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `order_receipt_${id}.pdf`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      toast.success("Receipt downloaded successfully");
    } catch (err) {
      console.error(err);
      toast.error("Failed to download receipt");
    } finally {
      setDownloadingId(null);
    }
  };

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
          <span className="text-sm font-medium">Time period:</span>
          <select
            value={selectedTimePeriod}
            onChange={e => setSelectedTimePeriod(e.target.value)}
            className="border rounded px-3 py-2 text-sm"
          >
            {TIME_PERIODS.map(tp => (
              <option key={tp.value} value={tp.value}>
                {tp.label}
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
              <th className="p-3 text-right">Actions</th>
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

                  <td className="p-3 text-right">
                    <button
                      onClick={() => downloadReceipt(o._id)}
                      disabled={downloadingId === o._id}
                      className="inline-flex items-center gap-1 px-3 py-1.5 rounded-md bg-black text-white text-xs font-medium hover:bg-gray-800 active:scale-95 transition-all disabled:opacity-60 disabled:cursor-not-allowed"
                    >
                      {downloadingId === o._id ? (
                        <>
                          <svg className="animate-spin h-3 w-3" viewBox="0 0 24 24" fill="none">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                          </svg>
                          Downloading…
                        </>
                      ) : (
                        <>↓ Receipt</>
                      )}
                    </button>
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
