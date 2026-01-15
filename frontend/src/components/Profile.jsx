import React, { useEffect, useState } from "react";
import axios from "axios";

const Profile = () => {
  const [activeTab, setActiveTab] = useState("donations");
  const [user, setUser] = useState({});
  const [donations, setDonations] = useState([]);
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    // axios.get("http://localhost:4000/me", { withCredentials: true })
    //   .then(res => setUser(res.data.user));

    // axios.get("http://localhost:4000/donations/my", { withCredentials: true })
    //   .then(res => setDonations(res.data));

    // axios.get("http://localhost:4000/orders/my", { withCredentials: true })
    //   .then(res => setOrders(res.data));
  }, []);

  return (
    <div className="min-h-screen bg-gray-100 px-6 py-10">
      {/* Profile Header */}
      <div className="bg-white p-6 rounded-xl shadow-md flex items-center gap-6">
        <div className="h-20 w-20 rounded-full bg-gray-300 flex items-center justify-center text-2xl font-bold">
          {user?.fullName?.[0]}
        </div>
        <div>
          <h2 className="text-xl font-semibold">{user?.fullName}</h2>
          <p className="text-gray-500">{user?.email}</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="mt-8 bg-white rounded-xl shadow-md">
        <div className="flex border-b">
          {["donations", "orders", "edit"].map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`flex-1 py-3 font-medium ${
                activeTab === tab
                  ? "border-b-2 border-black"
                  : "text-gray-500"
              }`}
            >
              {tab === "donations" && "Donations"}
              {tab === "orders" && "Orders"}
              {tab === "edit" && "Edit Profile"}
            </button>
          ))}
        </div>

        {/* Tab Content */}
        <div className="p-6">
          {activeTab === "donations" && (
            <DonationList donations={donations} />
          )}
          {activeTab === "orders" && (
            <OrderList orders={orders} />
          )}
          {activeTab === "edit" && (
            <EditProfile user={user} setUser={setUser} />
          )}
        </div>
      </div>
    </div>
  );
};

export default Profile;
