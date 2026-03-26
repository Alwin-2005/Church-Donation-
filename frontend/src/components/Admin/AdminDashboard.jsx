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
  const [reportType, setReportType] = useState("monthly"); // "monthly", "yearly", "financial", "custom"
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [financialYear, setFinancialYear] = useState("");
  const [dateRange, setDateRange] = useState({ start: "", end: "" });
  const [showReportOptions, setShowReportOptions] = useState(false);
  const [exportFormat, setExportFormat] = useState("pdf"); // "pdf" or "excel"
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

      // Recent users
      users.slice(-5).reverse().forEach(user => {
        const readableRole = user.role === 'churchMember' ? 'Church Member' : 
                            user.role === 'externalMember' ? 'External Member' : 
                            user.role;
        activity.push({
          type: 'user',
          icon: '👤',
          text: `New user: ${user.fullname} (${readableRole})`,
          time: new Date(user.createdAt).toLocaleDateString()
        });
      });

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

      // Limit to 8
      setRecentActivity(activity.slice(0, 8));

    } catch (error) {
      console.error("Error fetching dashboard data:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDownloadReport = async () => {
    try {
      setShowReportOptions(false); 
      
      let queryParams = "";
      if (reportType === "monthly") {
        queryParams = `?year=${selectedYear}`;
        if (selectedMonths.length > 0) queryParams += `&months=${selectedMonths.join(',')}`;
      } else if (reportType === "yearly") {
        queryParams = `?year=${selectedYear}`;
      } else if (reportType === "financial") {
        if (!financialYear) {
          toast.error("Please select a financial year");
          return;
        }
        const startYear = parseInt(financialYear.split("-")[0]);
        queryParams = `?startDate=${startYear}-04-01&endDate=${startYear + 1}-03-31`;
      } else if (reportType === "custom") {
        if (!dateRange.start || !dateRange.end) {
          toast.error("Please select both start and end dates");
          return;
        }
        queryParams = `?startDate=${dateRange.start}&endDate=${dateRange.end}`;
      }
      
      queryParams += queryParams ? `&format=${exportFormat}` : `?format=${exportFormat}`;

      const response = await api.get(`/admin/report/download${queryParams}`, {
        responseType: 'blob'
      });
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      
      const extension = exportFormat === "excel" ? "xlsx" : "pdf";
      const reportName = `Admin_Report_${new Date().toISOString().split('T')[0]}.${extension}`;
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
            Generate Report
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
            <div className="relative bg-card w-full max-w-2xl rounded-3xl shadow-2xl border border-border overflow-hidden animate-in fade-in zoom-in duration-200">
              <div className="p-8">
                <div className="flex justify-between items-center mb-6">
                  <div>
                    <h3 className="text-2xl font-black text-foreground tracking-tight">Generate Report</h3>
                    <p className="text-muted-foreground text-sm mt-1">Configure your analytics summary</p>
                  </div>
                  <button 
                    onClick={() => setShowReportOptions(false)}
                    className="p-2 hover:bg-muted rounded-full transition-colors"
                  >
                    <span className="text-xl">✕</span>
                  </button>
                </div>

                {/* Report Type Tabs */}
                <div className="flex bg-muted p-1 rounded-2xl mb-8 overflow-x-auto no-scrollbar">
                  {["monthly", "yearly", "financial", "custom"].map((type) => (
                    <button
                      key={type}
                      onClick={() => setReportType(type)}
                      className={`flex-1 min-w-[100px] py-2.5 rounded-xl text-xs font-bold capitalize transition-all whitespace-nowrap ${
                        reportType === type 
                          ? "bg-card text-foreground shadow-sm" 
                          : "text-muted-foreground hover:text-foreground"
                      }`}
                    >
                      {type === "financial" ? "Financial Year" : type === "custom" ? "Custom Duration" : type}
                    </button>
                  ))}
                </div>

                {/* Export Format Selection */}
                <div className="mb-8">
                  <label className="block text-xs font-bold text-muted-foreground uppercase tracking-widest mb-3">Export Format</label>
                  <div className="flex gap-4">
                    <button
                      onClick={() => setExportFormat("pdf")}
                      className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl border-2 transition-all ${
                        exportFormat === "pdf"
                          ? "border-black bg-black text-white"
                          : "border-border text-muted-foreground hover:border-black/20"
                      }`}
                    >
                      <span className="font-bold">PDF Report</span>
                      <span className="text-[10px] opacity-70">(Summary & Charts)</span>
                    </button>
                    <button
                      onClick={() => setExportFormat("excel")}
                      className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl border-2 transition-all ${
                        exportFormat === "excel"
                          ? "border-black bg-black text-white"
                          : "border-border text-muted-foreground hover:border-black/20"
                      }`}
                    >
                      <span className="font-bold">Excel Sheet</span>
                      <span className="text-[10px] opacity-70">(Detailed Data)</span>
                    </button>
                  </div>
                </div>
                
                {/* Tab Content */}
                <div className="min-h-[220px]">
                  {reportType === "monthly" && (
                    <div className="space-y-6 animate-in slide-in-from-bottom-2 duration-300">
                      <div>
                        <label className="block text-xs font-bold text-muted-foreground uppercase tracking-widest mb-3">Select Year</label>
                        <select 
                          value={selectedYear}
                          onChange={(e) => setSelectedYear(Number(e.target.value))}
                          className="w-full bg-background border border-border px-4 py-3 rounded-xl font-bold focus:ring-2 focus:ring-black outline-none"
                        >
                          {[2024, 2025, 2026].map(y => <option key={y} value={y}>{y}</option>)}
                        </select>
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-muted-foreground uppercase tracking-widest mb-3">Select Month</label>
                        <select 
                          value={selectedMonths[0] || ""}
                          onChange={(e) => setSelectedMonths(e.target.value ? [Number(e.target.value)] : [])}
                          className="w-full bg-background border border-border px-4 py-3 rounded-xl font-bold focus:ring-2 focus:ring-black outline-none"
                        >
                          <option value="">All Months (Full Year)</option>
                          {monthsList.map(month => (
                            <option key={month.id} value={month.id}>{month.name}</option>
                          ))}
                        </select>
                      </div>
                    </div>
                  )}

                  {reportType === "yearly" && (
                    <div className="space-y-6 animate-in slide-in-from-bottom-2 duration-300">
                      <div>
                        <label className="block text-xs font-bold text-muted-foreground uppercase tracking-widest mb-3">Select Year</label>
                        <select 
                          value={selectedYear}
                          onChange={(e) => setSelectedYear(Number(e.target.value))}
                          className="w-full bg-background border border-border px-4 py-3 rounded-xl font-bold focus:ring-2 focus:ring-black outline-none"
                        >
                          {[2024, 2025, 2026].map(y => <option key={y} value={y}>{y}</option>)}
                        </select>
                        <p className="text-muted-foreground text-xs mt-4">
                          This will generate a full comprehensive report for all activity in {selectedYear}.
                        </p>
                      </div>
                    </div>
                  )}

                  {reportType === "financial" && (
                    <div className="space-y-6 animate-in slide-in-from-bottom-2 duration-300">
                      <div>
                        <label className="block text-xs font-bold text-muted-foreground uppercase tracking-widest mb-3">Select Financial Year</label>
                        <select 
                          value={financialYear}
                          onChange={(e) => setFinancialYear(e.target.value)}
                          className="w-full bg-background border border-border px-4 py-3 rounded-xl font-bold focus:ring-2 focus:ring-black outline-none"
                        >
                          <option value="">Select range...</option>
                          <option value="2023-2024">2023–2024</option>
                          <option value="2024-2025">2024–2025</option>
                          <option value="2025-2026">2025–2026</option>
                        </select>
                        <p className="text-muted-foreground text-xs mt-4 flex items-center gap-2">
                          <span className="w-1.5 h-1.5 bg-primary rounded-full"></span>
                          Financial year runs from April 1 to March 31
                        </p>
                      </div>
                    </div>
                  )}

                  {reportType === "custom" && (
                    <div className="space-y-6 animate-in slide-in-from-bottom-2 duration-300">
                      <div>
                        <label className="block text-xs font-bold text-muted-foreground uppercase tracking-widest mb-3">Quick Selection</label>
                        <div className="flex flex-wrap gap-2">
                          {[
                            { label: "Today", days: 0 },
                            { label: "Last 7 Days", days: 7 },
                            { label: "Last 30 Days", days: 30 },
                            { label: "This Month", type: 'thisMonth' }
                          ].map((opt) => (
                            <button
                              key={opt.label}
                              type="button"
                              onClick={() => {
                                const end = new Date();
                                let start = new Date();
                                if (opt.type === 'thisMonth') {
                                  start = new Date(end.getFullYear(), end.getMonth(), 1);
                                } else {
                                  start.setDate(end.getDate() - opt.days);
                                }
                                setDateRange({
                                  start: start.toISOString().split('T')[0],
                                  end: end.toISOString().split('T')[0]
                                });
                              }}
                              className="px-4 py-2 rounded-lg bg-muted text-foreground text-xs font-bold hover:bg-border transition-colors border border-transparent hover:border-muted-foreground/20"
                            >
                              {opt.label}
                            </button>
                          ))}
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-xs font-bold text-muted-foreground uppercase tracking-widest mb-3">Start Date</label>
                          <input 
                            type="date"
                            value={dateRange.start}
                            onChange={(e) => setDateRange(prev => ({ ...prev, start: e.target.value }))}
                            className="w-full bg-background border border-border px-4 py-3 rounded-xl font-bold focus:ring-2 focus:ring-black outline-none"
                          />
                        </div>
                        <div>
                          <label className="block text-xs font-bold text-muted-foreground uppercase tracking-widest mb-3">End Date</label>
                          <input 
                            type="date"
                            value={dateRange.end}
                            onChange={(e) => setDateRange(prev => ({ ...prev, end: e.target.value }))}
                            className="w-full bg-background border border-border px-4 py-3 rounded-xl font-bold focus:ring-2 focus:ring-black outline-none"
                          />
                        </div>
                      </div>
                      <p className="text-muted-foreground text-xs">
                        Specify a custom time frame to track growth and performance across specific events or campaigns.
                      </p>
                    </div>
                  )}
                </div>

                <div className="flex items-center justify-between pt-8 mt-4 border-t border-border">
                  <button 
                    onClick={() => {
                      setSelectedMonths([]);
                      setDateRange({ start: "", end: "" });
                    }}
                    className="text-sm font-bold text-red-500 hover:text-red-600 transition-colors uppercase tracking-widest"
                  >
                    Reset
                  </button>
                  <button
                    onClick={handleDownloadReport}
                    className="flex items-center gap-2 bg-black text-white px-10 py-4 rounded-2xl font-black hover:bg-secondary transition shadow-xl active:scale-95 group"
                  >
                    <Download className="w-5 h-5 group-hover:translate-y-0.5 transition-transform" />
                    Download {exportFormat.toUpperCase()}
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
