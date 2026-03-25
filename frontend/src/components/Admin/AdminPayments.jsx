import React, { useState, useEffect } from "react";
import api from "../../api/axios";
import { toast } from "react-hot-toast";

const STATUS_FILTERS = ["all", "paid", "pending", "failed", "refunded"];

const AdminPayments = () => {
  const [selectedStatus, setSelectedStatus] = useState("all");
  const [payments, setPayments] = useState([]);
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
    fetchPayments();
  }, []);

  const fetchPayments = async () => {
    try {
      const res = await api.get("admin/payments/view");
      setPayments(res.data.result || []);
    } catch (err) {
      console.error(err);
      setError("Failed to fetch payments");
    } finally {
      setLoading(false);
    }
  };

  const handleDownloadReceipt = async (payment) => {
    setDownloadingId(payment._id);
    try {
      const res = await api.get(`admin/payments/${payment._id}/receipt`, {
        responseType: "blob",
        withCredentials: true,
      });
      const url = window.URL.createObjectURL(new Blob([res.data], { type: "application/pdf" }));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", `payment_receipt_${payment.transactionNo}.pdf`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
    } catch (err) {
      console.error("Receipt download failed:", err);
      toast.error("Failed to download receipt. Please try again.");
    } finally {
      setDownloadingId(null);
    }
  };

  const filteredPayments = payments.filter(p => {
    // Status filter
    const statusMatch = selectedStatus === "all" || p.status === selectedStatus;
    if (!statusMatch) return false;

    // Time period filter
    if (selectedTimePeriod === "all") return true;

    const paymentDate = new Date(p.paymentDate);
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());

    switch (selectedTimePeriod) {
      case "today":
        return paymentDate >= today;
      case "yesterday":
        const yesterday = new Date(today);
        yesterday.setDate(yesterday.getDate() - 1);
        return paymentDate >= yesterday && paymentDate < today;
      case "last7":
        const last7Days = new Date(today);
        last7Days.setDate(last7Days.getDate() - 7);
        return paymentDate >= last7Days;
      case "last30":
        const last30Days = new Date(today);
        last30Days.setDate(last30Days.getDate() - 30);
        return paymentDate >= last30Days;
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

  const statusBadge = status => {
    switch (status) {
      case "paid":
        return "bg-green-100 text-green-700";
      case "pending":
        return "bg-yellow-100 text-yellow-700";
      case "failed":
        return "bg-red-100 text-red-700";
      case "refunded":
        return "bg-gray-200 text-foreground";
      default:
        return "";
    }
  };

  if (loading) return <div className="pt-[96px] px-4 md:px-16 min-h-screen">Loading payments...</div>;
  if (error) return <div className="pt-[96px] px-4 md:px-16 text-red-500">{error}</div>;

  return (
    <div className="pt-[96px] px-4 md:px-16 py-10 bg-muted min-h-screen">
      {/* Header + Filter */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6 gap-4">
        <h1 className="text-2xl font-semibold">Payments</h1>



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

      {/* Payments Table */}
      <div className="bg-card shadow rounded-lg overflow-x-auto animate-scaleIn">
        <table className="w-full text-left text-sm">
          <thead className="bg-muted">
            <tr>
              <th className="p-3">Transaction</th>
              <th className="p-3">Order</th>
              <th className="p-3">User</th>
              <th className="p-3">Amount</th>
              <th className="p-3">Method</th>
              <th className="p-3">Date</th>
              <th className="p-3">Status</th>
              <th className="p-3">Action</th>
            </tr>
          </thead>

          <tbody>
            {filteredPayments.length === 0 ? (
              <tr>
                <td colSpan="8" className="p-6 text-center text-muted-foreground">
                  No payments found
                </td>
              </tr>
            ) : (
              filteredPayments.map(p => (
                <tr key={p._id} className="border-t hover:bg-background">
                  <td className="p-3 font-mono text-xs">{p.transactionNo}</td>

                  <td className="p-3 font-mono text-xs">{p.orderId?._id || "N/A"}</td>

                  <td className="p-3">
                    <div className="font-medium">{p.orderId?.userId?.fullname || "Unknown User"}</div>
                    <div className="text-xs text-muted-foreground">{p.orderId?.userId?.email || "N/A"}</div>
                  </td>

                  <td className="p-3 font-semibold">₹{p.amount}</td>

                  <td className="p-3 uppercase">{p.method}</td>

                  <td className="p-3">{formatDate(p.paymentDate)}</td>

                  <td className="p-3">
                    <span
                      className={`px-2 py-1 rounded text-xs font-medium capitalize ${statusBadge(
                        p.status
                      )}`}
                    >
                      {p.status}
                    </span>
                  </td>

                  <td className="p-3">
                    {p.status === "paid" && (
                      <button
                        onClick={() => handleDownloadReceipt(p)}
                        disabled={downloadingId === p._id}
                        className="inline-flex items-center gap-1 px-3 py-1.5 rounded-md bg-black text-white text-xs font-medium hover:bg-gray-800 active:scale-95 transition-all disabled:opacity-60 disabled:cursor-not-allowed"
                      >
                        {downloadingId === p._id ? (
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
                    )}
                    {p.status === "failed" && (
                      <span className="text-gray-400 text-xs">No Action</span>
                    )}
                    {p.status === "pending" && (
                      <span className="text-yellow-600 text-xs">Awaiting</span>
                    )}
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

export default AdminPayments;
