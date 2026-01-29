import React, { useState, useEffect } from "react";
import Navbar from "./NavBar/NavBar";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import Cookies from "js-cookie";
import api from "../api/axios";

const Profile = () => {
  const [activeTab, setActiveTab] = useState("donations");
  const { user, setUser, logout } = useAuth();
  const navigate = useNavigate();

  const [profileData, setProfileData] = useState(null);
  const [donations, setDonations] = useState([]);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [msg, setMsg] = useState("");

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
        const userData = userRes.data;

        if (Array.isArray(userData) && userData.length > 0) {
          setProfileData(userData[0]);
        } else {
          setProfileData(userData);
        }

        // 2. Donations
        const donRes = await api.get("/users/donations/view", { headers });
        setDonations(donRes.data.result || []);

        // 3. Orders
        const ordRes = await api.get("/users/orders/view", { headers });
        // Backend key is { Result: [...] }
        setOrders(ordRes.data.Result || []);

      } catch (error) {
        console.error("Error fetching profile data:", error);
        setMsg("Failed to load profile data.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [user]);

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

  const handleLogout = () => {
    logout();
    navigate("/");
  };


  if (loading) return <div className="mt-32 text-center text-gray-500 animate-pulse">Loading profile...</div>;
  if (!profileData) return (
    <div className="mt-32 text-center">
      <p className="text-gray-500 mb-4">Please log in to view your profile.</p>
      <button onClick={() => navigate("/login")} className="bg-black text-white px-6 py-2 rounded-lg font-bold">
        Go to Login
      </button>
    </div>
  );

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gray-50 px-6 pt-32 pb-20">

        <div className="max-w-4xl mx-auto">
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-3xl font-bold">My Profile</h1>
            <button onClick={handleLogout} className="text-red-600 font-medium hover:underline">
              Logout
            </button>
          </div>

          {/* Profile Info Card */}
          <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 flex flex-col md:flex-row gap-8 items-start animate-scaleIn">
            <div className="w-24 h-24 bg-gray-200 rounded-full flex items-center justify-center text-2xl font-bold text-gray-400 uppercase">
              {profileData.fullname ? profileData.fullname[0] : "U"}
            </div>
            <div className="flex-1 space-y-2">
              <h2 className="text-2xl font-bold text-gray-900">{profileData.fullname}</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-500 mt-4">
                <p><span className="font-semibold text-gray-900">Email:</span> {profileData.email}</p>
                <p><span className="font-semibold text-gray-900">Phone:</span> {profileData.phoneNo || "N/A"}</p>
                <p><span className="font-semibold text-gray-900">Address:</span> {profileData.address || "N/A"}</p>
                <p><span className="font-semibold text-gray-900">DOB:</span> {profileData.dob ? new Date(profileData.dob).toDateString() : "N/A"}</p>
              </div>
            </div>
          </div>

          {/* Tabs */}
          <div className="mt-10">
            <div className="flex border-b border-gray-200">
              {["donations", "orders", "edit"].map(tab => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`px-8 py-4 font-medium transition-all relative ${activeTab === tab
                    ? "text-black"
                    : "text-gray-400 hover:text-gray-600"
                    }`}
                >
                  {tab === "donations" && "Donations"}
                  {tab === "orders" && "Orders"}
                  {tab === "edit" && "Edit Profile"}
                  {activeTab === tab && (
                    <div className="absolute bottom-0 left-0 w-full h-0.5 bg-black" />
                  )}
                </button>
              ))}
            </div>

            {/* Tab Content */}
            <div className="bg-white min-h-[400px] border border-gray-100 border-t-0 rounded-b-2xl p-8 shadow-sm">
              {activeTab === "donations" && (
                <div className="space-y-4">
                  {donations.length === 0 ? <p className="text-gray-400 text-center py-10">No donations found.</p> :
                    donations.map(d => (
                      <div key={d._id} className="border border-gray-100 p-6 rounded-xl flex justify-between items-center hover:bg-gray-50 transition-colors">
                        <div>
                          <p className="font-bold text-gray-900 text-lg">
                            {d.donationCampaignId ? d.donationCampaignId.title : "General Donation"}
                          </p>
                          <p className="text-xs text-gray-400 uppercase tracking-wider mt-1">Receipt: {d.receiptNo}</p>
                        </div>
                        <div className="text-right">
                          <p className="font-bold text-xl text-emerald-600">₹{d.amount}</p>
                          <p className="text-xs text-gray-400">{new Date(d.createdAt).toLocaleDateString()}</p>
                        </div>
                      </div>
                    ))}
                </div>
              )}

              {activeTab === "orders" && (
                <div className="space-y-6">
                  {orders.length === 0 ? <p className="text-gray-400 text-center py-10">No orders found.</p> :
                    orders.map(o => (
                      <div key={o._id} className="border border-gray-100 p-6 rounded-xl">
                        <div className="flex justify-between items-center mb-4 border-b border-gray-50 pb-4">
                          <div>
                            <p className="text-sm font-bold text-gray-900">Order #{o._id.slice(-6).toUpperCase()}</p>
                            <p className="text-xs text-gray-400">{new Date(o.createdAt).toLocaleDateString()}</p>
                          </div>
                          <span className={`px-3 py-1 rounded-full text-xs font-bold capitalize ${o.status === 'completed' || o.status === 'confirmed' ? 'bg-emerald-100 text-emerald-700' : 'bg-gray-100 text-gray-600'
                            }`}>
                            {o.status}
                          </span>
                        </div>

                        <div className="space-y-2">
                          {/* Order Endpoint returns populated items? Usually need to check. Assuming simple structure for now. */}
                          <p className="text-sm text-gray-600">Total Amount: <span className="font-bold text-gray-900">₹{o.totalAmount}</span></p>
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
                        className="w-full border border-gray-200 p-3 rounded-lg focus:ring-2 focus:ring-black outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold uppercase text-gray-400 mb-1">Email (Read Only)</label>
                      <input
                        name="email"
                        defaultValue={profileData.email}
                        readOnly
                        className="w-full border border-gray-200 p-3 rounded-lg bg-gray-50 text-gray-500 cursor-not-allowed"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold uppercase text-gray-400 mb-1">Phone</label>
                      <input
                        name="phoneNo"
                        defaultValue={profileData.phoneNo}
                        className="w-full border border-gray-200 p-3 rounded-lg focus:ring-2 focus:ring-black outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold uppercase text-gray-400 mb-1">DOB</label>
                      {/* Format Date for Input Date */}
                      <input
                        name="dob"
                        type="date"
                        defaultValue={profileData.dob ? new Date(profileData.dob).toISOString().split('T')[0] : ""}
                        className="w-full border border-gray-200 p-3 rounded-lg focus:ring-2 focus:ring-black outline-none"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase text-gray-400 mb-1">Address</label>
                    <textarea
                      name="address"
                      defaultValue={profileData.address}
                      className="w-full border border-gray-200 p-3 rounded-lg focus:ring-2 focus:ring-black outline-none min-h-[100px]"
                    />
                  </div>

                  <div className="pt-4">
                    <button className="w-full bg-black text-white p-4 rounded-xl font-bold shadow-lg hover:bg-gray-800 transition-transform active:scale-95">
                      Save Changes
                    </button>
                    {msg && <p className="text-center mt-4 text-sm font-medium text-emerald-600 animate-pulse">{msg}</p>}
                  </div>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Profile;
