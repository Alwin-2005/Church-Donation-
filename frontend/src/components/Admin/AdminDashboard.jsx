import React, { useState, useEffect } from "react";
import api from "../../api/axios";
import { Users, ShoppingCart, TrendingUp, Package, Heart, Calendar } from "lucide-react";

const AdminDashboard = () => {
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalOrders: 0,
    totalRevenue: 0,
    totalDonations: 0,
    activeCampaigns: 0,
    totalProducts: 0
  });
  const [recentActivity, setRecentActivity] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      // Fetch all data in parallel
      const [usersRes, ordersRes, donationsRes, campaignsRes, productsRes] = await Promise.all([
        api.get("/admin/users/view"),
        api.get("/admin/orders/view"),
        api.get("/admin/donations/view"),
        api.get("/admin/donationcampaigns/view"),
        api.get("/admin/merch/view")
      ]);

      const users = usersRes.data.Result || [];
      const orders = ordersRes.data.Result || [];
      const donations = donationsRes.data || [];
      const campaigns = campaignsRes.data.Result || [];
      const products = productsRes.data.Result || [];

      // Calculate stats
      const totalRevenue = orders.reduce((sum, order) => sum + (order.totalAmount || 0), 0);
      const totalDonationAmount = donations.reduce((sum, donation) => sum + (donation.amount || 0), 0);
      const activeCampaigns = campaigns.filter(c => c.status === 'active').length;

      setStats({
        totalUsers: users.length,
        totalOrders: orders.length,
        totalRevenue,
        totalDonations: totalDonationAmount,
        activeCampaigns,
        totalProducts: products.length
      });

      // Build recent activity
      const activity = [];

      // Recent orders
      orders.slice(-3).reverse().forEach(order => {
        activity.push({
          type: 'order',
          icon: '🛒',
          text: `Order #${order._id.slice(-6)} - ${order.status}`,
          time: new Date(order.createdAt).toLocaleDateString()
        });
      });

      // Recent donations
      donations.slice(-3).reverse().forEach(donation => {
        activity.push({
          type: 'donation',
          icon: '💝',
          text: `Donation of ₹${donation.amount}`,
          time: new Date(donation.createdAt).toLocaleDateString()
        });
      });

      // Recent users
      users.slice(-2).reverse().forEach(user => {
        activity.push({
          type: 'user',
          icon: '👤',
          text: `New user: ${user.fullname}`,
          time: new Date(user.createdAt).toLocaleDateString()
        });
      });

      // Sort by most recent and limit to 8
      setRecentActivity(activity.slice(0, 8));

    } catch (error) {
      console.error("Error fetching dashboard data:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <main className="flex-1 p-8 overflow-y-auto">
        <div className="flex items-center justify-center h-64">
          <div className="text-gray-400 animate-pulse">Loading dashboard...</div>
        </div>
      </main>
    );
  }

  return (
    <main className="flex-1 p-8 overflow-y-auto bg-gray-50">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold mb-8 text-gray-900">Dashboard Overview</h1>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-10">
          <StatCard
            title="Total Users"
            value={stats.totalUsers}
            icon={<Users className="w-6 h-6" />}
            color="blue"
          />
          <StatCard
            title="Total Orders"
            value={stats.totalOrders}
            icon={<ShoppingCart className="w-6 h-6" />}
            color="green"
          />
          <StatCard
            title="Revenue"
            value={`₹${stats.totalRevenue.toLocaleString()}`}
            icon={<TrendingUp className="w-6 h-6" />}
            color="purple"
          />
          <StatCard
            title="Total Donations"
            value={`₹${stats.totalDonations.toLocaleString()}`}
            icon={<Heart className="w-6 h-6" />}
            color="red"
          />
          <StatCard
            title="Active Campaigns"
            value={stats.activeCampaigns}
            icon={<Calendar className="w-6 h-6" />}
            color="orange"
          />
          <StatCard
            title="Products"
            value={stats.totalProducts}
            icon={<Package className="w-6 h-6" />}
            color="indigo"
          />
        </div>

        {/* Recent Activity */}
        <section className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-bold text-gray-900">Recent Activity</h2>
            <button
              onClick={fetchDashboardData}
              className="text-sm text-gray-600 hover:text-black transition-colors"
            >
              Refresh
            </button>
          </div>

          {recentActivity.length === 0 ? (
            <p className="text-gray-400 text-center py-8">No recent activity</p>
          ) : (
            <ul className="space-y-3">
              {recentActivity.map((activity, index) => (
                <li
                  key={index}
                  className="flex items-start gap-3 p-3 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <span className="text-2xl">{activity.icon}</span>
                  <div className="flex-1">
                    <p className="text-sm text-gray-900 font-medium">{activity.text}</p>
                    <p className="text-xs text-gray-500 mt-1">{activity.time}</p>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </section>
      </div>
    </main>
  );
};

const StatCard = ({ title, value, icon, color }) => {
  const colorClasses = {
    blue: 'bg-blue-50 text-blue-600',
    green: 'bg-emerald-50 text-emerald-600',
    purple: 'bg-purple-50 text-purple-600',
    red: 'bg-red-50 text-red-600',
    orange: 'bg-orange-50 text-orange-600',
    indigo: 'bg-indigo-50 text-indigo-600'
  };

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
      <div className="flex items-center justify-between mb-4">
        <div className={`p-3 rounded-xl ${colorClasses[color]}`}>
          {icon}
        </div>
      </div>
      <h3 className="text-sm text-gray-500 font-medium uppercase tracking-wider">{title}</h3>
      <p className="text-3xl font-bold mt-2 text-gray-900">{value}</p>
    </div>
  );
};

export default AdminDashboard;
