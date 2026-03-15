import React, { useState, useEffect } from "react";
import api from "../../api/axios";
import { Users, ShoppingCart, TrendingUp, Package, Heart, Calendar, Download } from "lucide-react";

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

  const handleDownloadReport = async () => {
    try {
      // Use the 'api' instance to strictly pass authentication cookies/headers
      const response = await api.get('/admin/report/download', {
        responseType: 'blob'
      });
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      // Extract filename from Content-Disposition if needed, or fallback
      link.setAttribute('download', `Admin_Report_${new Date().toISOString().split('T')[0]}.pdf`);
      document.body.appendChild(link);
      link.click();
      link.parentNode.removeChild(link);
    } catch (error) {
      console.error("Error downloading report:", error);
      alert("Failed to download report. Ensure you have admin access.");
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
    <main className="flex-1 p-8 overflow-y-auto bg-background">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
          <h1 className="text-3xl font-bold text-foreground">Dashboard Overview</h1>
          <button
            onClick={handleDownloadReport}
            className="flex items-center gap-2 bg-black text-primary-foreground px-5 py-2.5 rounded-xl font-bold hover:bg-secondary transition active:scale-95 shadow-md"
          >
            <Download className="w-5 h-5" />
            Generate PDF Report
          </button>
        </div>

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
        <section className="bg-card rounded-2xl shadow-sm border border-border p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-bold text-foreground">Recent Activity</h2>
            <button
              onClick={fetchDashboardData}
              className="text-sm text-muted-foreground hover:text-foreground transition-colors"
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
                  className="flex items-start gap-3 p-3 rounded-lg hover:bg-background transition-colors"
                >
                  <span className="text-2xl">{activity.icon}</span>
                  <div className="flex-1">
                    <p className="text-sm text-foreground font-medium">{activity.text}</p>
                    <p className="text-xs text-muted-foreground mt-1">{activity.time}</p>
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
    blue: 'bg-blue-50 text-primary',
    green: 'bg-emerald-50 text-emerald-600',
    purple: 'bg-purple-50 text-purple-600',
    red: 'bg-red-50 text-red-600',
    orange: 'bg-orange-50 text-orange-600',
    indigo: 'bg-indigo-50 text-primary'
  };

  return (
    <div className="bg-card rounded-2xl shadow-sm border border-border p-6 hover:shadow-md transition-shadow">
      <div className="flex items-center justify-between mb-4">
        <div className={`p-3 rounded-xl ${colorClasses[color]}`}>
          {icon}
        </div>
      </div>
      <h3 className="text-sm text-muted-foreground font-medium uppercase tracking-wider">{title}</h3>
      <p className="text-3xl font-bold mt-2 text-foreground">{value}</p>
    </div>
  );
};

export default AdminDashboard;
