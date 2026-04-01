import React, { useState, useEffect } from "react";
import Navbar from "./NavBar/NavBar";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import Cookies from "js-cookie";
import { toast } from "react-hot-toast";
import api from "../api/axios";

const Profile = () => {
  const { user, setUser, logout } = useAuth();
  const isAdmin = user?.role === "admin";
  const [activeTab, setActiveTab] = useState(isAdmin ? "edit" : "donations");
  const navigate = useNavigate();

  const [profileData, setProfileData] = useState(null);
  const [donations, setDonations] = useState([]);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [msg, setMsg] = useState("");
  const [passwordMsg, setPasswordMsg] = useState("");
  const [passwordLoading, setPasswordLoading] = useState(false);
  const [selectedDonation, setSelectedDonation] = useState(null);
  const [selectedOrder, setSelectedOrder] = useState(null);

  // FETCH DATA
  useEffect(() => {
    const fetchData = async () => {
      const token = Cookies.get("token");
      if (!token) {
        setLoading(false);
        return;
      }

      try {
        const headers = { Authorization: `Bearer ${token}` };

        // 1. User Profile
        const userRes = await api.get("/users/profile/view", { headers });
        const userData = Array.isArray(userRes.data) ? userRes.data[0] : userRes.data;
        setProfileData(userData);

        // 2. Fetch donations/orders ONLY if not admin
        if (!isAdmin) {
          const [donRes, ordRes] = await Promise.all([
            api.get("/users/donations/view", { headers }),
            api.get("/users/orders/view", { headers })
          ]);
          setDonations(donRes.data.result || []);
          setOrders(ordRes.data.Result || []);
        }

      } catch (error) {
        console.error("Error fetching profile data:", error);
        setMsg("Failed to load profile data.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [user, isAdmin]);

  // UPDATE PROFILE
  const handleUpdate = async (e) => {
    e.preventDefault();
    const token = Cookies.get("token");
    setMsg("");

    // Construct payload from form
    const formData = new FormData(e.target);
    const updates = Object.fromEntries(formData.entries());

    try {
      await api.patch("/users/profile/update", updates, {
        headers: { Authorization: `Bearer ${token}` }
      });

      setMsg("Profile updated successfully!");
      setProfileData(prev => ({ ...prev, ...updates }));

    } catch (err) {
      console.error(err);
      setMsg("Error updating profile.");
    }
  };

  // CHANGE PASSWORD
  const handleChangePassword = async (e) => {
    e.preventDefault();
    const token = Cookies.get("token");
    setPasswordMsg("");
    setPasswordLoading(true);

    const formData = new FormData(e.target);
    const data = Object.fromEntries(formData.entries());

    if (data.newPassword !== data.confirmPassword) {
      setPasswordMsg("New passwords do not match");
      setPasswordLoading(false);
      return;
    }

    try {
      await api.patch("/users/profile/change-password", data, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setPasswordMsg("Password changed successfully!");
      e.target.reset();
    } catch (err) {
      console.error(err);
      setPasswordMsg(err.response?.data?.msg || "Error changing password.");
    } finally {
      setPasswordLoading(false);
    }
  };

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  const handleDownloadReceipt = async (type, id) => {
    const token = Cookies.get("token");
    try {
      const response = await api.get(`/users/receipts/${type}/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
        responseType: 'blob'
      });
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `${type}_receipt_${id}.pdf`);
      document.body.appendChild(link);
      link.click();
      link.parentNode.removeChild(link);
    } catch (error) {
      console.error("Error downloading receipt:", error);
      toast.error("Failed to download receipt.");
    }
  };


  if (loading) return <div className="mt-32 text-center text-muted-foreground animate-pulse">Loading profile...</div>;
  if (!profileData) return (
    <div className="mt-32 text-center">
      <p className="text-muted-foreground mb-4">Please log in to view your profile.</p>
      <button onClick={() => navigate("/login")} className="bg-black text-primary-foreground px-6 py-2 rounded-lg font-bold">
        Go to Login
      </button>
    </div>
  );

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-background px-6 pt-32 pb-20">

        <div className="max-w-4xl mx-auto">
          <div className="flex justify-between items-end mb-12 border-b-2 border-foreground pb-4">
            <h1 className="text-5xl font-serif font-black tracking-tight uppercase">My Profile</h1>
            <button onClick={handleLogout} className="text-xs font-black uppercase tracking-[0.2em] text-muted-foreground hover:text-accent transition-colors pb-2">
              Logout
            </button>
          </div>

          {/* Profile Info Card */}
          <div className="bg-card p-10 border border-border flex flex-col md:flex-row gap-10 items-start animate-fadeIn">
            <div className="w-32 h-32 bg-muted border border-border flex items-center justify-center text-4xl font-serif font-bold text-foreground/20 uppercase shrink-0">
              {profileData.fullname ? profileData.fullname[0] : "U"}
            </div>
            <div className="flex-1 space-y-4">
              <div>
                <h2 className="text-4xl font-serif font-black text-foreground tracking-tight">{profileData.fullname}</h2>
              </div>
              <p className="text-[10px] font-black uppercase tracking-[0.2em] text-background bg-accent px-4 py-1.5 w-fit shadow-lg shadow-accent/10">
                {profileData.role || "Member"}
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-4 pt-4 border-t border-border/50">
                <div className="space-y-1">
                  <span className="text-[9px] font-black uppercase tracking-widest text-muted-foreground block">Email</span>
                  <p className="text-sm font-medium text-foreground">{profileData.email}</p>
                </div>
                <div className="space-y-1">
                  <span className="text-[9px] font-black uppercase tracking-widest text-muted-foreground block">Phone</span>
                  <p className="text-sm font-medium text-foreground">{profileData.phoneNo || "N/A"}</p>
                </div>
                <div className="space-y-1">
                  <span className="text-[9px] font-black uppercase tracking-widest text-muted-foreground block">Address</span>
                  <p className="text-sm font-medium text-foreground">{profileData.address || "N/A"}</p>
                </div>
                <div className="space-y-1">
                  <span className="text-[9px] font-black uppercase tracking-widest text-muted-foreground block">DOB</span>
                  <p className="text-sm font-medium text-foreground">{profileData.dob ? new Date(profileData.dob).toDateString() : "N/A"}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Tabs */}
          <div className="mt-10">
            <div className="flex border-b border-border overflow-x-auto">
              {[
                ...(!isAdmin ? [{ id: "donations", label: "Donations" }, { id: "orders", label: "Orders" }] : []),
                { id: "edit", label: "Edit Profile" },
                { id: "security", label: "Security" }
              ].map(tab => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`px-10 py-5 text-[10px] font-black uppercase tracking-[0.25em] transition-all relative whitespace-nowrap ${activeTab === tab.id
                    ? "text-accent bg-card border-t border-l border-r border-border -mb-[1px] z-10"
                    : "text-muted-foreground hover:text-foreground hover:bg-muted/30"
                    }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            {/* Tab Content */}
            <div className="bg-card border border-border p-10 min-h-[400px] animate-fadeIn">
              {activeTab === "donations" && !isAdmin && (
                <div className="space-y-3">
                  {donations.length === 0 ? <p className="text-muted-foreground text-[10px] font-black uppercase tracking-widest text-center py-20 border border-dashed border-border">No records in the sanctuary ledger.</p> :
                    donations.map(d => (
                      <div key={d._id} className="border border-border p-6 flex justify-between items-center hover:bg-muted/30 transition-all group">
                        <div className="space-y-1">
                          <p className="font-serif text-lg font-bold text-foreground group-hover:text-accent transition-colors">
                            {d.donationCampaignId ? d.donationCampaignId.title : "General Donation"}
                          </p>
                          <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">{new Date(d.createdAt).toLocaleDateString("en-IN")}</p>
                        </div>
                        <div className="flex items-center gap-8">
                          <p className="font-serif text-2xl font-bold text-foreground tracking-tight">₹{d.amount}</p>
                          <button
                            onClick={() => setSelectedDonation(d)}
                            className="text-[10px] font-black uppercase tracking-[0.2em] text-accent border border-accent/20 hover:bg-accent hover:text-background px-6 py-2.5 transition-all"
                          >
                            Details
                          </button>
                        </div>
                      </div>
                    ))}
                </div>
              )}

              {activeTab === "orders" && !isAdmin && (
                <div className="space-y-3">
                  {orders.length === 0 ? <p className="text-muted-foreground text-[10px] font-black uppercase tracking-widest text-center py-20 border border-dashed border-border">No sanctuary acquisitions found.</p> :
                    orders.map(o => (
                      <div key={o._id} className="border border-border p-6 flex justify-between items-center hover:bg-muted/30 transition-all group">
                        <div className="space-y-1">
                          <p className="font-serif text-lg font-bold text-foreground group-hover:text-accent transition-colors">Order #{o._id.slice(-6).toUpperCase()}</p>
                          <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">{new Date(o.createdAt).toLocaleDateString("en-IN")} · {o.items?.length} item(s)</p>
                        </div>
                        <div className="flex items-center gap-8">
                          <div className="text-right space-y-1">
                            <span className={`text-[9px] font-black uppercase tracking-[0.2em] px-3 py-1 border ${
                              o.status === 'completed' || o.status === 'confirmed' ? 'border-accent text-accent' : 'border-border text-muted-foreground'
                            }`}>{o.status}</span>
                            <p className="font-serif text-xl font-bold text-foreground tracking-tight">₹{o.totalAmount}</p>
                          </div>
                          <button
                            onClick={() => setSelectedOrder(o)}
                            className="text-[10px] font-black uppercase tracking-[0.2em] text-accent border border-accent/20 hover:bg-accent hover:text-background px-6 py-2.5 transition-all"
                          >
                            Details
                          </button>
                        </div>
                      </div>
                    ))}
                </div>
              )}

              {activeTab === "edit" && (
                <form onSubmit={handleUpdate} className="max-w-lg mx-auto space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground mb-2 ml-1">Full Name</label>
                      <input
                        name="fullname"
                        defaultValue={profileData.fullname}
                        className="w-full border border-border p-4 rounded-none focus:border-accent outline-none font-medium transition-colors"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground mb-2 ml-1">Email</label>
                      <input
                        name="email"
                        defaultValue={profileData.email}
                        readOnly
                        className="w-full border border-border p-4 rounded-none bg-muted/50 text-muted-foreground cursor-not-allowed font-medium"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground mb-2 ml-1">Phone</label>
                      <input
                        name="phoneNo"
                        defaultValue={profileData.phoneNo}
                        className="w-full border border-border p-4 rounded-none focus:border-accent outline-none font-medium transition-colors"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground mb-2 ml-1">DOB</label>
                      <input
                        name="dob"
                        type="date"
                        defaultValue={profileData.dob ? new Date(profileData.dob).toISOString().split('T')[0] : ""}
                        className="w-full border border-border p-4 rounded-none focus:border-accent outline-none font-medium transition-colors"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground mb-2 ml-1">Address</label>
                    <textarea
                      name="address"
                      defaultValue={profileData.address}
                      className="w-full border border-border p-4 rounded-none focus:border-accent outline-none min-h-[120px] font-medium transition-colors"
                    />
                  </div>

                  <div className="pt-6">
                    <button className="w-full bg-accent hover:bg-foreground text-background p-5 rounded-none text-xs font-black uppercase tracking-[0.2em] transition-all active:scale-[0.98] shadow-lg shadow-accent/10">
                      Save Changes
                    </button>
                    {msg && <p className="text-center mt-6 text-[10px] font-black uppercase tracking-widest text-accent animate-pulse">{msg}</p>}
                  </div>
                </form>
              )}

              {activeTab === "security" && (
                <form onSubmit={handleChangePassword} className="max-w-sm mx-auto space-y-6">
                  <div className="mb-10 text-center">
                    <h3 className="text-2xl font-serif font-bold text-foreground">Update Password</h3>
                  </div>

                  <div>
                    <label className="block text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground mb-2 ml-1">Current Password</label>
                    <input type="password" name="currentPassword" required className="w-full border border-border p-4 rounded-none focus:border-accent outline-none font-medium" />
                  </div>
                  <div>
                    <label className="block text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground mb-2 ml-1">New Password</label>
                    <input type="password" name="newPassword" required className="w-full border border-border p-4 rounded-none focus:border-accent outline-none font-medium" />
                  </div>
                  <div>
                    <label className="block text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground mb-2 ml-1">Confirm New Password</label>
                    <input type="password" name="confirmPassword" required className="w-full border border-border p-4 rounded-none focus:border-accent outline-none font-medium" />
                  </div>
                  <div className="pt-6">
                    <button disabled={passwordLoading} className="w-full bg-accent hover:bg-foreground text-background p-5 rounded-none text-xs font-black uppercase tracking-[0.2em] transition-all active:scale-[0.98] disabled:opacity-50 shadow-lg shadow-accent/10">
                      {passwordLoading ? "Processing..." : "Update Password"}
                    </button>
                    {passwordMsg && <p className={`text-center mt-6 text-[10px] font-black uppercase tracking-widest ${passwordMsg.includes("successfully") ? "text-accent" : "text-rose-600"} animate-pulse`}>{passwordMsg}</p>}
                  </div>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>
      {/* Detail Modals */}
      <DonationModal
        donation={selectedDonation}
        onClose={() => setSelectedDonation(null)}
        onDownload={handleDownloadReceipt}
      />
      <OrderModal
        order={selectedOrder}
        onClose={() => setSelectedOrder(null)}
        onDownload={handleDownloadReceipt}
      />
    </>
  );
};

// ─── Donation Detail Modal ───────────────────────────────────────────────────
const DonationModal = ({ donation, onClose, onDownload }) => {
  if (!donation) return null;
  const d = donation;
  return (
    <div className="fixed inset-0 bg-background/95 z-[100] flex items-center justify-center p-6 animate-fadeIn" onClick={onClose}>
      <div className="bg-card w-full max-w-lg border border-border p-10 md:p-16 relative overflow-hidden transition-all duration-500 shadow-2xl" onClick={e => e.stopPropagation()}>
        {/* Background Accent */}
        <div className="absolute top-0 right-0 w-32 h-32 bg-accent/5 -mr-16 -mt-16 rotate-45 pointer-events-none" />

        <div className="flex justify-between items-start mb-12 border-b border-border pb-6">
          <div>
            <h3 className="text-4xl font-serif font-black text-foreground tracking-tight">Donation Details</h3>
          </div>
          <button onClick={onClose} className="text-muted-foreground hover:text-accent transition-colors text-2xl">✕</button>
        </div>

        <div className="space-y-6">
          <Row label="Campaign" value={d.donationCampaignId?.title || "General Donation"} />
          <Row label="Amount" value={`₹${d.amount}`} highlight />
          <Row label="Payment Status" value={d.paymentStatus} />
          <Row label="Receipt No" value={d.receiptNo} />
          <Row label="Date" value={new Date(d.createdAt).toLocaleDateString("en-IN", { day: '2-digit', month: 'long', year: 'numeric' })} />

          {d.donationCampaignId && (
            <div className="pt-6 mt-6 border-t border-border/50">
              <Row label="Campaign Type" value={d.donationCampaignId.donationType} />
              <Row label="Campaign Status" value={d.donationCampaignId.status} />
            </div>
          )}
        </div>

        <button
          onClick={() => { onDownload('donation', d._id); onClose(); }}
          className="mt-12 w-full bg-accent hover:bg-foreground text-background py-5 text-xs font-black uppercase tracking-[0.2em] transition-all active:scale-[0.98] shadow-lg shadow-accent/10"
        >
          Download Receipt
        </button>
      </div>
    </div>
  );
};

const OrderModal = ({ order, onClose, onDownload }) => {
  if (!order) return null;
  const o = order;
  return (
    <div className="fixed inset-0 bg-background/95 z-[100] flex items-center justify-center p-6 animate-fadeIn" onClick={onClose}>
      <div className="bg-card w-full max-w-2xl border border-border p-10 md:p-16 relative transition-all duration-500 shadow-2xl max-h-[90vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
        <div className="flex justify-between items-start mb-12 border-b border-border pb-6">
          <div>
            <h3 className="text-4xl font-serif font-black text-foreground tracking-tight">Order Details</h3>
            <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground mt-2">#{o._id.slice(-6).toUpperCase()} · {new Date(o.createdAt).toLocaleDateString("en-IN")}</p>
          </div>
          <button onClick={onClose} className="text-muted-foreground hover:text-accent transition-colors text-2xl">✕</button>
        </div>

        <div className="flex items-center justify-between mb-10 border border-border p-4 bg-muted/20">
          <span className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground">Status</span>
          <span className={`text-[10px] font-black uppercase tracking-[0.2em] px-4 py-1.5 border border-border bg-card ${
            o.status === 'completed' || o.status === 'confirmed' ? 'text-accent' : 'text-muted-foreground'
          }`}>{o.status}</span>
        </div>

        <div className="space-y-4 mb-10">
          <span className="text-[10px] font-black uppercase tracking-[0.3em] text-muted-foreground mb-4 block underline underline-offset-4">Items</span>
          {o.items?.map((item, idx) => (
            <div key={idx} className="flex items-center gap-6 border-b border-border/50 pb-4 last:border-0 hover:bg-muted/10 transition-colors p-2 -mx-2">
              <div className="w-20 h-20 bg-muted overflow-hidden border border-border shrink-0">
                {item.itemId?.url ? (
                  <img src={item.itemId.url} alt={item.itemId.itemName} className="w-full h-full object-cover filter grayscale hover:grayscale-0 transition-all duration-700" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-[10px] font-black uppercase text-foreground/20 italic">No Visual</div>
                )}
              </div>
              <div className="flex-1">
                <p className="font-serif text-lg font-bold text-foreground leading-tight">{item.itemId?.itemName || "Unknown Item"}</p>
                <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground mt-1">{item.itemId?.category || "Article"}</p>
                <p className="text-xs font-medium text-foreground/60 mt-2">Qty: {item.quantity}</p>
              </div>
              <div className="text-right">
                <p className="font-serif text-xl font-bold text-foreground tracking-tight">₹{item.price * item.quantity}</p>
                <p className="text-[9px] font-black uppercase tracking-widest text-muted-foreground">₹{item.price}/ea</p>
              </div>
            </div>
          ))}
        </div>

        <div className="border-t border-2 border-foreground pt-6 flex justify-between items-center mb-10">
          <span className="text-[10px] font-black uppercase tracking-[0.3em] text-foreground">Total</span>
          <span className="text-4xl font-serif font-black text-foreground tracking-tighter">₹{o.totalAmount}</span>
        </div>

        <button
          onClick={() => { onDownload('order', o._id); onClose(); }}
          className="w-full bg-accent hover:bg-foreground text-background py-5 text-xs font-black uppercase tracking-[0.2em] transition-all active:scale-[0.98] shadow-lg shadow-accent/10"
        >
          Download Receipt
        </button>
      </div>
    </div>
  );
};

// ─── Helper Row ──────────────────────────────────────────────────────────────
const Row = ({ label, value, highlight }) => (
  <div className="flex justify-between items-center">
    <span className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground">{label}</span>
    <span className={`font-serif font-black text-right ${highlight ? 'text-accent text-2xl tracking-tighter' : 'text-foreground'}`}>{value}</span>
  </div>
);

export default Profile;
