import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../api/axios";
import { Users, ShoppingCart, TrendingUp, Package, Heart, Calendar, Download } from "lucide-react";
import { toast } from "react-hot-toast";

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
  const [selectedMonths, setSelectedMonths] = useState([]);
  const [showReportOptions, setShowReportOptions] = useState(false);
  const navigate = useNavigate();

  const monthsList = [
    { id: 1, name: "January" }, { id: 2, name: "February" }, { id: 3, name: "March" },
    { id: 4, name: "April" }, { id: 5, name: "May" }, { id: 6, name: "June" },
    { id: 7, name: "July" }, { id: 8, name: "August" }, { id: 9, name: "September" },
    { id: 10, name: "October" }, { id: 11, name: "November" }, { id: 12, name: "December" }
  ];

  const toggleMonth = (id) => {
    setSelectedMonths(prev => 
      prev.includes(id) ? prev.filter(m => m !== id) : [...prev, id]
    );
  };


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
      setShowReportOptions(false); // Close modal
      // Use the 'api' instance to strictly pass authentication cookies/headers
      const queryParams = selectedMonths.length > 0 ? `?months=${selectedMonths.join(',')}` : '';
      const response = await api.get(`/admin/report/download${queryParams}`, {
        responseType: 'blob'
      });
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      
      const reportName = selectedMonths.length > 0 
        ? `Monthly_Report_${selectedMonths.join('_')}_${new Date().getFullYear()}.pdf` 
        : `Admin_Report_${new Date().toISOString().split('T')[0]}.pdf`;
      link.setAttribute('download', reportName);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Error downloading report:", error);
      toast.error("Failed to download report. Ensure you have admin access.");
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
            onClick={() => setShowReportOptions(true)}
            className="flex items-center gap-2 bg-black text-primary-foreground px-6 py-3 rounded-xl font-bold hover:bg-secondary transition active:scale-95 shadow-lg"
          >
            <Download className="w-5 h-5" />
            Generate PDF Report
          </button>
        </div>

        {/* Report Options Modal */}
        {showReportOptions && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6">
            {/* Backdrop */}
            <div 
              className="absolute inset-0 bg-black/60 backdrop-blur-sm"
              onClick={() => setShowReportOptions(false)}
            />
            
            {/* Modal Content */}
            <div className="relative bg-card w-full max-w-lg rounded-3xl shadow-2xl border border-border overflow-hidden animate-in fade-in zoom-in duration-200">
              <div className="p-8">
                <div className="flex justify-between items-center mb-6">
                  <h3 className="text-2xl font-black text-foreground tracking-tight">Report Settings</h3>
                  <button 
                    onClick={() => setShowReportOptions(false)}
                    className="p-2 hover:bg-muted rounded-full transition-colors"
                  >
                    <span className="text-2xl">✕</span>
                  </button>
                </div>
                
                <p className="text-muted-foreground mb-6">
                  Select the months you'd like to include in the report. Leave all unselected for a full system report.
                </p>

                <div className="flex flex-wrap gap-2.5 mb-8">
                  {monthsList.map(month => (
                    <button
                      key={month.id}
                      onClick={() => toggleMonth(month.id)}
                      className={`px-4 py-2.5 rounded-xl text-sm font-bold border transition-all ${
                        selectedMonths.includes(month.id)
                          ? "bg-black text-white border-black scale-105"
                          : "bg-background text-muted-foreground border-border hover:border-foreground"
                      }`}
                    >
                      {month.name}
                    </button>
                  ))}
                </div>

                <div className="flex items-center justify-between pt-6 border-t border-border">
                  <button 
                    onClick={() => setSelectedMonths([])}
                    className="text-sm font-bold text-red-500 hover:underline uppercase tracking-widest"
                  >
                    Clear Selection
                  </button>
                  <button
                    onClick={handleDownloadReport}
                    className="flex items-center gap-2 bg-black text-white px-8 py-3.5 rounded-2xl font-black hover:bg-secondary transition shadow-xl active:scale-95"
                  >
                    <Download className="w-5 h-5" />
                    Download PDF
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}


        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-10">
          <StatCard
            title="Total Users"
            value={stats.totalUsers}
            icon={<Users className="w-6 h-6" />}
            color="blue"
            onClick={() => navigate("/admin/users")}
          />
          <StatCard
            title="Total Orders"
            value={stats.totalOrders}
            icon={<ShoppingCart className="w-6 h-6" />}
            color="green"
            onClick={() => navigate("/admin/orders")}
          />
          <StatCard
            title="Revenue"
            value={`₹${stats.totalRevenue.toLocaleString()}`}
            icon={<TrendingUp className="w-6 h-6" />}
            color="purple"
            onClick={() => navigate("/admin/payments")}
          />
          <StatCard
            title="Total Donations"
            value={`₹${stats.totalDonations.toLocaleString()}`}
            icon={<Heart className="w-6 h-6" />}
            color="red"
            onClick={() => navigate("/admin/donations")}
          />
          <StatCard
            title="Active Campaigns"
            value={stats.activeCampaigns}
            icon={<Calendar className="w-6 h-6" />}
            color="orange"
            onClick={() => navigate("/admin/campaigns")}
          />
          <StatCard
            title="Products"
            value={stats.totalProducts}
            icon={<Package className="w-6 h-6" />}
            color="indigo"
            onClick={() => navigate("/admin/products")}
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

const StatCard = ({ title, value, icon, color, onClick }) => {
  const colorClasses = {
    blue: 'bg-blue-50 text-primary',
    green: 'bg-emerald-50 text-emerald-600',
    purple: 'bg-purple-50 text-purple-600',
    red: 'bg-red-50 text-red-600',
    orange: 'bg-orange-50 text-orange-600',
    indigo: 'bg-indigo-50 text-primary'
  };

  return (
    <div 
      onClick={onClick}
      className={`bg-card rounded-2xl shadow-sm border border-border p-6 hover:shadow-md transition-all cursor-pointer hover:border-primary/20 active:scale-[0.98]`}
    >
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
