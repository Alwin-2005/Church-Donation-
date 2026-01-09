import React from "react";

const AdminDashboard = () => {
  return (
    <main className="flex-1 p-8 overflow-y-auto">
      <h1 className="text-3xl font-bold mb-6">Dashboard</h1>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
        <StatCard title="Total Users" value="1,245" />
        <StatCard title="Total Orders" value="532" />
        <StatCard title="Revenue" value="₹2,45,000" />
      </div>

      {/* Recent Activity */}
      <section className="bg-white rounded-xl shadow p-6">
        <h2 className="text-xl font-semibold mb-4">Recent Activity</h2>

        <ul className="space-y-3 text-sm text-gray-700">
          <li>🟢 New user registered</li>
          <li>🟡 Order #452 pending approval</li>
          <li>🔵 Product stock updated</li>
        </ul>
      </section>
    </main>
  );
};

const StatCard = ({ title, value }) => (
  <div className="bg-white rounded-xl shadow p-6">
    <h3 className="text-sm text-gray-500">{title}</h3>
    <p className="text-2xl font-bold mt-2">{value}</p>
  </div>
);

export default AdminDashboard;
