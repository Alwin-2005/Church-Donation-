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
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-3xl font-bold">My Profile</h1>
            <button onClick={handleLogout} className="text-red-600 font-medium hover:underline">
              Logout
            </button>
          </div>

          {/* Profile Info Card */}
          <div className="bg-card p-8 rounded-2xl shadow-sm border border-gray-100 flex flex-col md:flex-row gap-8 items-start animate-scaleIn">
            <div className="w-24 h-24 bg-gray-200 rounded-full flex items-center justify-center text-2xl font-bold text-gray-400 uppercase">
              {profileData.fullname ? profileData.fullname[0] : "U"}
            </div>
            <div className="flex-1 space-y-2">
              <h2 className="text-2xl font-bold text-foreground">{profileData.fullname}</h2>
              <p className="text-xs font-black uppercase tracking-widest text-primary bg-blue-50 px-3 py-1 rounded-full w-fit">
                {profileData.role || "Member"}
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-muted-foreground mt-4">
                <p><span className="font-semibold text-foreground">Email:</span> {profileData.email}</p>
                <p><span className="font-semibold text-foreground">Phone:</span> {profileData.phoneNo || "N/A"}</p>
                <p><span className="font-semibold text-foreground">Address:</span> {profileData.address || "N/A"}</p>
                <p><span className="font-semibold text-foreground">DOB:</span> {profileData.dob ? new Date(profileData.dob).toDateString() : "N/A"}</p>
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
                  className={`px-8 py-4 font-medium transition-all relative whitespace-nowrap ${activeTab === tab.id
                    ? "text-foreground"
                    : "text-gray-400 hover:text-muted-foreground"
                    }`}
                >
                  {tab.label}
                  {activeTab === tab.id && (
                    <div className="absolute bottom-0 left-0 w-full h-0.5 bg-black" />
                  )}
                </button>
              ))}
            </div>

            {/* Tab Content */}
            <div className="bg-card min-h-[400px] border border-gray-100 border-t-0 rounded-b-2xl p-8 shadow-sm">
              {activeTab === "donations" && !isAdmin && (
                <div className="space-y-3">
                  {donations.length === 0 ? <p className="text-gray-400 text-center py-10">No donations found.</p> :
                    donations.map(d => (
                      <div key={d._id} className="border border-gray-100 p-4 rounded-xl flex justify-between items-center hover:bg-background transition-colors">
                        <div>
                          <p className="font-bold text-foreground">
                            {d.donationCampaignId ? d.donationCampaignId.title : "General Donation"}
                          </p>
                          <p className="text-xs text-gray-400 mt-0.5">{new Date(d.createdAt).toLocaleDateString()}</p>
                        </div>
                        <div className="flex items-center gap-4">
                          <p className="font-bold text-lg text-emerald-600">₹{d.amount}</p>
                          <button
                            onClick={() => setSelectedDonation(d)}
                            className="text-xs font-bold text-primary border border-blue-200 bg-blue-50 hover:bg-blue-100 px-3 py-1.5 rounded-lg transition-colors"
                          >
                            View Details
                          </button>
                        </div>
                      </div>
                    ))}
                </div>
              )}

              {activeTab === "orders" && !isAdmin && (
                <div className="space-y-3">
                  {orders.length === 0 ? <p className="text-gray-400 text-center py-10">No orders found.</p> :
                    orders.map(o => (
                      <div key={o._id} className="border border-gray-100 p-4 rounded-xl flex justify-between items-center hover:bg-background transition-colors">
                        <div>
                          <p className="font-bold text-foreground">Order #{o._id.slice(-6).toUpperCase()}</p>
                          <p className="text-xs text-gray-400 mt-0.5">{new Date(o.createdAt).toLocaleDateString()} · {o.items?.length} item(s)</p>
                        </div>
                        <div className="flex items-center gap-4">
                          <div className="text-right">
                            <span className={`text-xs font-bold capitalize px-2 py-0.5 rounded-full ${
                              o.status === 'completed' || o.status === 'confirmed' ? 'bg-emerald-100 text-emerald-700' : 'bg-muted text-muted-foreground'
                            }`}>{o.status}</span>
                            <p className="font-bold text-foreground mt-1">₹{o.totalAmount}</p>
                          </div>
                          <button
                            onClick={() => setSelectedOrder(o)}
                            className="text-xs font-bold text-primary border border-blue-200 bg-blue-50 hover:bg-blue-100 px-3 py-1.5 rounded-lg transition-colors"
                          >
                            View Details
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
                      <label className="block text-xs font-bold uppercase text-gray-400 mb-1">Full Name</label>
                      <input
                        name="fullname"
                        defaultValue={profileData.fullname}
                        className="w-full border border-border p-3 rounded-lg focus:ring-2 focus:ring-black outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold uppercase text-gray-400 mb-1">Email (Read Only)</label>
                      <input
                        name="email"
                        defaultValue={profileData.email}
                        readOnly
                        className="w-full border border-border p-3 rounded-lg bg-background text-muted-foreground cursor-not-allowed"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold uppercase text-gray-400 mb-1">Phone</label>
                      <input
                        name="phoneNo"
                        defaultValue={profileData.phoneNo}
                        className="w-full border border-border p-3 rounded-lg focus:ring-2 focus:ring-black outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold uppercase text-gray-400 mb-1">DOB</label>
                      {/* Format Date for Input Date */}
                      <input
                        name="dob"
                        type="date"
                        defaultValue={profileData.dob ? new Date(profileData.dob).toISOString().split('T')[0] : ""}
                        className="w-full border border-border p-3 rounded-lg focus:ring-2 focus:ring-black outline-none"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase text-gray-400 mb-1">Address</label>
                    <textarea
                      name="address"
                      defaultValue={profileData.address}
                      className="w-full border border-border p-3 rounded-lg focus:ring-2 focus:ring-black outline-none min-h-[100px]"
                    />
                  </div>

                  <div className="pt-4">
                    <button className="w-full bg-black text-primary-foreground p-4 rounded-xl font-bold shadow-lg hover:bg-secondary transition-transform active:scale-95">
                      Save Changes
                    </button>
                    {msg && <p className="text-center mt-4 text-sm font-medium text-emerald-600 animate-pulse">{msg}</p>}
                  </div>
                </form>
              )}

              {activeTab === "security" && (
                <form onSubmit={handleChangePassword} className="max-w-sm mx-auto space-y-6">
                  <h3 className="text-lg font-bold text-foreground border-b pb-2 mb-6 uppercase tracking-widest text-xs text-gray-400">Security Credentials</h3>
                  <div>
                    <label className="block text-xs font-bold uppercase text-gray-400 mb-1">Current Password</label>
                    <input type="password" name="currentPassword" required className="w-full border border-border p-3 rounded-lg focus:ring-2 focus:ring-black outline-none" />
                  </div>
                  <div>
                    <label className="block text-xs font-bold uppercase text-gray-400 mb-1">New Password</label>
                    <input type="password" name="newPassword" required className="w-full border border-border p-3 rounded-lg focus:ring-2 focus:ring-black outline-none" />
                  </div>
                  <div>
                    <label className="block text-xs font-bold uppercase text-gray-400 mb-1">Confirm New Password</label>
                    <input type="password" name="confirmPassword" required className="w-full border border-border p-3 rounded-lg focus:ring-2 focus:ring-black outline-none" />
                  </div>
                  <div className="pt-4">
                    <button disabled={passwordLoading} className="w-full bg-black text-primary-foreground p-4 rounded-xl font-bold shadow-lg hover:bg-secondary transition-transform active:scale-95 disabled:bg-gray-400">
                      {passwordLoading ? "Processing..." : "Update Password"}
                    </button>
                    {passwordMsg && <p className={`text-center mt-4 text-sm font-medium ${passwordMsg.includes("successfully") ? "text-emerald-600" : "text-rose-600"} animate-pulse`}>{passwordMsg}</p>}
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
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={onClose}>
      <div className="bg-card rounded-2xl w-full max-w-md shadow-2xl p-6 animate-scaleIn" onClick={e => e.stopPropagation()}>
        <div className="flex justify-between items-center mb-5 border-b border-gray-100 pb-4">
          <h3 className="text-lg font-black text-foreground">Donation Details</h3>
          <button onClick={onClose} className="text-gray-400 hover:text-foreground text-xl transition-colors">✕</button>
        </div>
        <div className="space-y-3 text-sm">
          <Row label="Campaign" value={d.donationCampaignId?.title || "General Donation"} />
          <Row label="Amount" value={`₹${d.amount}`} highlight />
          <Row label="Payment Status" value={d.paymentStatus} />
          <Row label="Receipt No" value={d.receiptNo} />
          <Row label="Date" value={new Date(d.createdAt).toLocaleDateString()} />
          {d.donationCampaignId && (
            <>
              <Row label="Campaign Type" value={d.donationCampaignId.donationType} />
              <Row label="Campaign Status" value={d.donationCampaignId.status} />
            </>
          )}
        </div>
        <button
          onClick={() => { onDownload('donation', d._id); onClose(); }}
          className="mt-6 w-full bg-black text-primary-foreground py-2.5 rounded-xl font-bold text-sm hover:bg-secondary transition-colors"
        >
          Download Receipt
        </button>
      </div>
    </div>
  );
};

// ─── Order Detail Modal ──────────────────────────────────────────────────────
const OrderModal = ({ order, onClose, onDownload }) => {
  if (!order) return null;
  const o = order;
  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={onClose}>
      <div className="bg-card rounded-2xl w-full max-w-lg shadow-2xl p-6 animate-scaleIn max-h-[90vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
        <div className="flex justify-between items-center mb-5 border-b border-gray-100 pb-4">
          <div>
            <h3 className="text-lg font-black text-foreground">Order Details</h3>
            <p className="text-xs text-gray-400 mt-0.5">#{o._id.slice(-6).toUpperCase()} · {new Date(o.createdAt).toLocaleDateString()}</p>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-foreground text-xl transition-colors">✕</button>
        </div>

        <div className="flex items-center justify-between mb-4">
          <span className="text-xs font-bold uppercase tracking-wider text-gray-400">Status</span>
          <span className={`text-xs font-bold capitalize px-3 py-1 rounded-full ${
            o.status === 'completed' || o.status === 'confirmed' ? 'bg-emerald-100 text-emerald-700' : 'bg-muted text-muted-foreground'
          }`}>{o.status}</span>
        </div>

        <div className="space-y-3 mb-5">
          {o.items?.map((item, idx) => (
            <div key={idx} className="flex items-center gap-3 border border-gray-100 p-3 rounded-xl">
              {item.itemId?.url ? (
                <img src={item.itemId.url} alt={item.itemId.itemName} className="w-14 h-14 object-cover rounded-lg bg-gray-100" />
              ) : (
                <div className="w-14 h-14 bg-gray-100 rounded-lg flex items-center justify-center text-xs text-gray-400">IMG</div>
              )}
              <div className="flex-1">
                <p className="text-sm font-bold text-foreground">{item.itemId?.itemName || "Unknown Item"}</p>
                <p className="text-xs text-gray-400">{item.itemId?.category || ""}</p>
                <p className="text-xs text-muted-foreground mt-1">Qty: {item.quantity}</p>
              </div>
              <div className="text-right">
                <p className="text-sm font-bold text-foreground">₹{item.price * item.quantity}</p>
                <p className="text-xs text-gray-400">₹{item.price}/ea</p>
              </div>
            </div>
          ))}
        </div>

        <div className="border-t border-dashed border-gray-100 pt-4 flex justify-between items-center mb-4">
          <span className="font-bold text-foreground">Total</span>
          <span className="font-black text-xl text-foreground">₹{o.totalAmount}</span>
        </div>

        <button
          onClick={() => { onDownload('order', o._id); onClose(); }}
          className="w-full bg-black text-primary-foreground py-2.5 rounded-xl font-bold text-sm hover:bg-secondary transition-colors"
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
    <span className="text-gray-400 font-medium">{label}</span>
    <span className={`font-bold text-right ${highlight ? 'text-emerald-600 text-base' : 'text-foreground'}`}>{value}</span>
  </div>
);

export default Profile;
