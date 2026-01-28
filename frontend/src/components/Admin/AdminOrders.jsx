import React, { useState } from "react";

const STATUS_OPTIONS = [
  "all",
  "pending",
  "confirmed",
  "shipped",
  "completed",
  "cancelled",
];

const AdminOrders = () => {
  const [selectedStatus, setSelectedStatus] = useState("all");

  const [orders, setOrders] = useState([
    {
      _id: "ORD001",
      user: { name: "John Doe", email: "john@gmail.com" },
      items: 2,
      totalAmount: 1298,
      orderDate: "2026-01-18T10:30:00",
      status: "completed",
    },
    {
      _id: "ORD002",
      user: { name: "Mary Smith", email: "mary@gmail.com" },
      items: 1,
      totalAmount: 799,
      orderDate: "2026-01-20T12:00:00",
      status: "pending",
    },
    {
      _id: "ORD003",
      user: { name: "Alex Paul", email: "alex@gmail.com" },
      items: 3,
      totalAmount: 1599,
      orderDate: "2026-01-22T15:10:00",
      status: "confirmed",
    },
  ]);

  const handleStatusChange = (orderId, newStatus) => {
    setOrders(orders.map(order =>
      order._id === orderId
        ? { ...order, status: newStatus }
        : order
    ));
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
      case "pending":
        return "bg-yellow-100 text-yellow-700";
      case "confirmed":
        return "bg-blue-100 text-blue-700";
      case "shipped":
        return "bg-purple-100 text-purple-700";
      case "completed":
        return "bg-green-100 text-green-700";
      case "cancelled":
        return "bg-red-100 text-red-700";
      default:
        return "";
    }
  };

  return (
    <div className="pt-[96px] px-4 md:px-16 py-10 bg-gray-100 min-h-screen">
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
      <div className="bg-white shadow rounded-lg overflow-x-auto animate-scaleIn">
        <table className="w-full text-left text-sm">
          <thead className="bg-gray-100">
            <tr>
              <th className="p-3">Order ID</th>
              <th className="p-3">Customer</th>
              <th className="p-3">Items</th>
              <th className="p-3">Total</th>
              <th className="p-3">Order Date</th>
              <th className="p-3">Status</th>
              <th className="p-3">Action</th>
            </tr>
          </thead>

          <tbody>
            {filteredOrders.length === 0 ? (
              <tr>
                <td colSpan="7" className="p-6 text-center text-gray-500">
                  No orders found for this status
                </td>
              </tr>
            ) : (
              filteredOrders.map(o => (
                <tr key={o._id} className="border-t hover:bg-gray-50">
                  <td className="p-3 font-mono text-xs">{o._id}</td>

                  <td className="p-3">
                    <div className="font-medium">{o.user.name}</div>
                    <div className="text-xs text-gray-500">{o.user.email}</div>
                  </td>

                  <td className="p-3">{o.items}</td>

                  <td className="p-3 font-semibold">₹{o.totalAmount}</td>

                  <td className="p-3">{formatDate(o.orderDate)}</td>

                  <td className="p-3">
                    <span
                      className={`px-2 py-1 rounded text-xs font-medium capitalize ${statusColor(
                        o.status
                      )}`}
                    >
                      {o.status}
                    </span>
                  </td>

                  <td className="p-3">
                    <select
                      value={o.status}
                      onChange={e =>
                        handleStatusChange(o._id, e.target.value)
                      }
                      className="border rounded px-2 py-1 text-sm"
                    >
                      {STATUS_OPTIONS.filter(s => s !== "all").map(s => (
                        <option key={s} value={s}>
                          {s}
                        </option>
                      ))}
                    </select>
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
