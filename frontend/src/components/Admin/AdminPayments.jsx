import React, { useState } from "react";

const STATUS_FILTERS = ["all", "paid", "pending", "failed", "refunded"];

const AdminPayments = () => {
  const [selectedStatus, setSelectedStatus] = useState("all");

  const payments = [
    {
      _id: "PMT001",
      transactionNo: "TXN_101",
      orderId: "ORD001",
      user: { name: "John Doe", email: "john@gmail.com" },
      amount: 2000,
      method: "UPI",
      paymentDate: "2026-01-12T10:30:00",
      status: "paid",
    },
    {
      _id: "PMT002",
      transactionNo: "TXN_102",
      orderId: "ORD002",
      user: { name: "Mary Smith", email: "mary@gmail.com" },
      amount: 1500,
      method: "card",
      paymentDate: "2026-01-15T12:00:00",
      status: "paid",
    },
    {
      _id: "PMT003",
      transactionNo: "TXN_103",
      orderId: "ORD003",
      user: { name: "Paul Raj", email: "paul@gmail.com" },
      amount: 1000,
      method: "UPI",
      paymentDate: "2026-01-20T14:45:00",
      status: "failed",
    },
  ];

  const filteredPayments =
    selectedStatus === "all"
      ? payments
      : payments.filter(p => p.status === selectedStatus);

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
        return "bg-gray-200 text-gray-700";
      default:
        return "";
    }
  };

  return (
    <div className="pt-[96px] px-4 md:px-16 py-10 bg-gray-100 min-h-screen">
      {/* Header + Filter */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6 gap-4">
        <h1 className="text-2xl font-semibold">Payments</h1>

        <div className="flex items-center gap-2">
          <span className="text-sm font-medium">Filter by status:</span>
          <select
            value={selectedStatus}
            onChange={e => setSelectedStatus(e.target.value)}
            className="border rounded px-3 py-2 text-sm"
          >
            {STATUS_FILTERS.map(s => (
              <option key={s} value={s}>
                {s.charAt(0).toUpperCase() + s.slice(1)}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Payments Table */}
      <div className="bg-white shadow rounded-lg overflow-x-auto animate-scaleIn">
        <table className="w-full text-left text-sm">
          <thead className="bg-gray-100">
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
                <td colSpan="8" className="p-6 text-center text-gray-500">
                  No payments found
                </td>
              </tr>
            ) : (
              filteredPayments.map(p => (
                <tr key={p._id} className="border-t hover:bg-gray-50">
                  <td className="p-3 font-mono text-xs">{p.transactionNo}</td>

                  <td className="p-3 font-mono text-xs">{p.orderId}</td>

                  <td className="p-3">
                    <div className="font-medium">{p.user.name}</div>
                    <div className="text-xs text-gray-500">{p.user.email}</div>
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
                      <button className="text-blue-600 underline text-xs">
                        Refund
                      </button>
                    )}
                    {p.status === "failed" && (
                      <span className="text-gray-400 text-xs">
                        No Action
                      </span>
                    )}
                    {p.status === "pending" && (
                      <span className="text-yellow-600 text-xs">
                        Awaiting
                      </span>
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
