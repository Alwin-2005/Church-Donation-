import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../api/axios";
import { Users, Heart, Calendar, Download, RefreshCw } from "lucide-react";
import { toast } from "react-hot-toast";

// Modular Components
import Filters from "./Dashboard/Filters";
import CampaignChart from "./Dashboard/CampaignChart";
import DonationTrendChart from "./Dashboard/DonationTrendChart";
import CategoryDistributionChart from "./Dashboard/CategoryDistributionChart";

const AdminDashboard = () => {
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalOrders: 0,
    totalRevenue: 0,
    totalDonations: 0,
    activeCampaigns: 0,
    totalProducts: 0
  });
  
  const [chartData, setChartData] = useState({
    campaignData: [],
    donationTrend: [],
    userGrowth: [],
    distribution: []
  });

  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  
  // Filters State
  const [duration, setDuration] = useState("monthly");
  const [dateRange, setDateRange] = useState({
    startDate: new Date(new Date().getFullYear(), new Date().getMonth(), 1).toISOString().split('T')[0],
    endDate: new Date().toISOString().split('T')[0]
  });

  // Report Modal State
  const [showReportOptions, setShowReportOptions] = useState(false);
  const [reportType, setReportType] = useState("monthly");
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [selectedMonths, setSelectedMonths] = useState([]);
  const [financialYear, setFinancialYear] = useState("");
  const [reportDateRange, setReportDateRange] = useState({ start: "", end: "" });
  const [exportFormat, setExportFormat] = useState("pdf");

  const navigate = useNavigate();

  useEffect(() => {
    fetchDashboardStats();
  }, [duration, dateRange]);

  const fetchDashboardStats = async () => {
    setRefreshing(true);
    try {
      let params = {};
      
      if (duration === "monthly") {
        const now = new Date();
        params.startDate = new Date(now.getFullYear(), now.getMonth(), 1).toISOString();
        params.endDate = now.toISOString();
      } else if (duration === "yearly") {
        params.startDate = new Date(new Date().getFullYear(), 0, 1).toISOString();
        params.endDate = new Date().toISOString();
      } else if (duration === "financialYear") {
        const now = new Date();
        const startYear = now.getMonth() < 3 ? now.getFullYear() - 1 : now.getFullYear();
        params.startDate = new Date(startYear, 3, 1).toISOString();
        params.endDate = new Date().toISOString();
      } else if (duration === "custom") {
        params.startDate = new Date(dateRange.startDate).toISOString();
        params.endDate = new Date(dateRange.endDate).toISOString();
      }

      const res = await api.get("/admin/dashboard/stats", { params });
      const { campaignData, donationTrend, userGrowth, distribution, stats: overallStats } = res.data;
      
      setChartData({
        campaignData,
        donationTrend,
        userGrowth,
        distribution
      });
      setStats(overallStats);
    } catch (error) {
      console.error("Error fetching dashboard stats:", error);
      toast.error("Failed to fetch dashboard analytics");
    } finally {
      setLoading(false);
      setRefreshing(false);
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
        if (!reportDateRange.start || !reportDateRange.end) {
          toast.error("Please select both start and end dates");
          return;
        }
        queryParams = `?startDate=${reportDateRange.start}&endDate=${reportDateRange.end}`;
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
      toast.error("Failed to download report.");
    }
  };

  if (loading) {
    return (
      <main className="flex-1 p-8 bg-background h-screen flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <RefreshCw className="w-10 h-10 text-primary animate-spin" />
          <p className="text-muted-foreground font-bold animate-pulse">Initializing Analytics...</p>
        </div>
      </main>
    );
  }

  return (
    <main className="flex-1 p-8 overflow-y-auto bg-background">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
          <div>
            <h1 className="text-3xl font-black text-foreground tracking-tight">Admin Dashboard</h1>
            <p className="text-muted-foreground font-medium mt-1 flex items-center gap-1">
              {refreshing ? <RefreshCw className="w-3 h-3 animate-spin"/> : <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"/>}
              Real-time system analytics
            </p>
          </div>
          <button
            onClick={() => setShowReportOptions(true)}
            className="flex items-center gap-2 bg-black text-primary-foreground px-6 py-3 rounded-2xl font-black hover:bg-secondary transition active:scale-95 shadow-xl shadow-black/10 group"
          >
            <Download className="w-5 h-5 group-hover:translate-y-0.5 transition-transform" />
            Generate Report
          </button>
        </div>

        <Filters 
          duration={duration} 
          setDuration={setDuration}
          dateRange={dateRange}
          setDateRange={setDateRange}
        />

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
          <StatCard
            title="Total Members"
            value={stats.totalUsers}
            icon={<Users className="w-6 h-6" />}
            color="blue"
            onClick={() => navigate("/admin/users")}
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
        </div>

        {/* Charts Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
          <DonationTrendChart data={chartData.donationTrend} />
          <CampaignChart data={chartData.campaignData} />
          <div className="lg:col-span-2">
            <CategoryDistributionChart data={chartData.distribution} />
          </div>
        </div>

        {/* Report Options Modal */}
        {showReportOptions && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6">
            <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setShowReportOptions(false)} />
            <div className="relative bg-card w-full max-w-2xl rounded-3xl shadow-2xl border border-border overflow-hidden animate-in fade-in zoom-in duration-200">
              <div className="p-8">
                <div className="flex justify-between items-center mb-6">
                  <div>
                    <h3 className="text-2xl font-black text-foreground tracking-tight">Generate Report</h3>
                    <p className="text-muted-foreground text-sm mt-1">Configure your analytics summary for export</p>
                  </div>
                  <button onClick={() => setShowReportOptions(false)} className="p-2 hover:bg-muted rounded-full transition-colors">✕</button>
                </div>

                <div className="flex bg-muted p-1 rounded-2xl mb-8 overflow-x-auto no-scrollbar">
                  {["monthly", "yearly", "financial", "custom"].map((type) => (
                    <button
                      key={type}
                      onClick={() => setReportType(type)}
                      className={`flex-1 min-w-[100px] py-2.5 rounded-xl text-xs font-bold capitalize transition-all whitespace-nowrap ${
                        reportType === type ? "bg-card text-foreground shadow-sm" : "text-muted-foreground hover:text-foreground"
                      }`}
                    >
                      {type === "financial" ? "Financial Year" : type === "custom" ? "Custom Range" : type}
                    </button>
                  ))}
                </div>


                
                <div className="min-h-[220px]">
                  {reportType === "monthly" && (
                    <div className="space-y-6">
                      <select value={selectedYear} onChange={(e) => setSelectedYear(Number(e.target.value))} className="w-full bg-background border border-border px-4 py-3 rounded-xl font-bold">
                        {[2024, 2025, 2026].map(y => <option key={y} value={y}>{y}</option>)}
                      </select>
                      <select value={selectedMonths[0] || ""} onChange={(e) => setSelectedMonths(e.target.value ? [Number(e.target.value)] : [])} className="w-full bg-background border border-border px-4 py-3 rounded-xl font-bold">
                        <option value="">Full Year</option>
                        {[
                          "January", "February", "March", "April", "May", "June", 
                          "July", "August", "September", "October", "November", "December"
                        ].map((m, i) => <option key={i+1} value={i+1}>{m}</option>)}
                      </select>
                    </div>
                  )}

                  {reportType === "yearly" && (
                    <div className="space-y-6">
                      <select value={selectedYear} onChange={(e) => setSelectedYear(Number(e.target.value))} className="w-full bg-background border border-border px-4 py-3 rounded-xl font-bold">
                        {[2023, 2024, 2025, 2026].map(y => <option key={y} value={y}>{y}</option>)}
                      </select>
                    </div>
                  )}

                  {reportType === "financial" && (
                    <select value={financialYear} onChange={(e) => setFinancialYear(e.target.value)} className="w-full bg-background border border-border px-4 py-3 rounded-xl font-bold">
                      <option value="">Select Financial Year...</option>
                      {["2023-2024", "2024-2025", "2025-2026"].map(fy => <option key={fy} value={fy}>{fy}</option>)}
                    </select>
                  )}

                  {reportType === "custom" && (
                    <div className="grid grid-cols-2 gap-4">
                      <input type="date" value={reportDateRange.start} onChange={(e) => setReportDateRange(prev => ({ ...prev, start: e.target.value }))} className="w-full bg-background border border-border px-4 py-3 rounded-xl font-bold" />
                      <input type="date" value={reportDateRange.end} onChange={(e) => setReportDateRange(prev => ({ ...prev, end: e.target.value }))} className="w-full bg-background border border-border px-4 py-3 rounded-xl font-bold" />
                    </div>
                  )}
                </div>

                <div className="flex items-center justify-between pt-8 mt-4 border-t border-border">
                  <button onClick={() => setShowReportOptions(false)} className="text-sm font-bold text-muted-foreground hover:text-foreground">Cancel</button>
                  <button
                    onClick={handleDownloadReport}
                    className="flex items-center gap-2 bg-black text-white px-10 py-4 rounded-2xl font-black hover:opacity-90 transition active:scale-95"
                  >
                    <Download className="w-5 h-5" />
                    Download {exportFormat.toUpperCase()}
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </main>
  );
};

const StatCard = ({ title, value, icon, color, onClick }) => {
  const colorClasses = {
    blue: 'bg-blue-50 text-blue-600',
    green: 'bg-emerald-50 text-emerald-600',
    purple: 'bg-purple-50 text-purple-600',
    red: 'bg-red-50 text-red-600',
    orange: 'bg-orange-50 text-orange-600',
    indigo: 'bg-indigo-50 text-indigo-600'
  };

  return (
    <div 
      onClick={onClick}
      className={`bg-card rounded-2xl shadow-sm border border-border p-6 hover:shadow-md transition-all cursor-pointer hover:scale-[1.02] active:scale-[0.98]`}
    >
      <div className={`w-12 h-12 rounded-xl ${colorClasses[color]} flex items-center justify-center mb-4`}>
        {icon}
      </div>
      <h3 className="text-xs text-muted-foreground font-bold uppercase tracking-widest">{title}</h3>
      <p className="text-2xl font-black mt-1 text-foreground">{value}</p>
    </div>
  );
};

export default AdminDashboard;
