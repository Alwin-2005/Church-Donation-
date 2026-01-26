const AdminOrders = () => {
  const orders = [
    { id: "ORD001", user: "John Doe", total: 1298, items: 2, date: "18 Jan 2026", status: "Delivered" },
    { id: "ORD002", user: "Mary Smith", total: 799, items: 1, date: "20 Jan 2026", status: "Pending" },
  ];

  return (
    <div className="pt-[96px] px-4 md:px-16 py-10 bg-gray-100 min-h-screen">
      <h1 className="text-2xl font-semibold mb-6">Orders</h1>

      <div className="bg-white shadow rounded-lg overflow-x-auto">
        <table className="w-full text-left">
          <thead className="bg-gray-100 text-sm">
            <tr>
              <th className="p-3">Order ID</th>
              <th className="p-3">User</th>
              <th className="p-3">Items</th>
              <th className="p-3">Total</th>
              <th className="p-3">Date</th>
              <th className="p-3">Status</th>
            </tr>
          </thead>

          <tbody>
            {orders.map(o => (
              <tr key={o.id} className="border-t text-sm hover:bg-gray-50">
                <td className="p-3">{o.id}</td>
                <td className="p-3">{o.user}</td>
                <td className="p-3">{o.items}</td>
                <td className="p-3">₹{o.total}</td>
                <td className="p-3">{o.date}</td>
                <td className="p-3 font-medium">{o.status}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminOrders;
