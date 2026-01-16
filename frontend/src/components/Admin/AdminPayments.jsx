const AdminPayments = () => {
  const payments = [
    { id: "pay_101", user: "John Doe", amount: 2000, method: "UPI", date: "12 Jan 2026", status: "Success" },
    { id: "pay_102", user: "Mary Smith", amount: 1500, method: "Card", date: "15 Jan 2026", status: "Success" },
    { id: "pay_103", user: "Paul Raj", amount: 1000, method: "UPI", date: "20 Jan 2026", status: "Failed" },
  ];

  return (
    <div className="mt-24 px-6">
      <h1 className="text-2xl font-semibold mb-6">Payments</h1>

      <div className="bg-white shadow rounded-lg overflow-x-auto">
        <table className="w-full text-left">
          <thead className="bg-gray-100 text-sm">
            <tr>
              <th className="p-3">Payment ID</th>
              <th className="p-3">User</th>
              <th className="p-3">Amount</th>
              <th className="p-3">Method</th>
              <th className="p-3">Date</th>
              <th className="p-3">Status</th>
            </tr>
          </thead>
          <tbody>
            {payments.map(p => (
              <tr key={p.id} className="border-t text-sm">
                <td className="p-3">{p.id}</td>
                <td className="p-3">{p.user}</td>
                <td className="p-3">₹{p.amount}</td>
                <td className="p-3">{p.method}</td>
                <td className="p-3">{p.date}</td>
                <td className={`p-3 font-medium ${p.status === "Success" ? "text-green-600" : "text-red-500"}`}>
                  {p.status}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminPayments;
