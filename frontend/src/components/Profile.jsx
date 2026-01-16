import React, { useState } from "react";
import Navbar from "./NavBar/NavBar";
import Footer from "./Footer/Footer";
const Profile = () => {
  const [activeTab, setActiveTab] = useState("donations");

  const user = {
    fullName: "John Doe",
    email: "john@example.com",
    phone: "9876543210",
    address: "Ahmedabad",
    gender: "Male",
    dob: "23-08-2005"
  };

  const donations = [
    { id: 1, cause: "Church Building Fund", amount: 2000, date: "12 Jan 2026" },
    { id: 2, cause: "Orphan Support", amount: 1500, date: "02 Feb 2026" },
  ];

  const orders = [
    { id: 1, item: "Bible", total: 799, date: "15 Jan 2026" },
    { id: 2, item: "Cross Pendant", total: 499, date: "28 Jan 2026" },
  ];

  return (
    <>
    <Navbar/>
    <div className="min-h-screen bg-gray-100 px-6 py-10">
      {/* Profile Info */}
      <div className="bg-white p-6 rounded-lg shadow">
        <h2 className="text-xl font-semibold">{user.fullName}</h2>
        <p className="text-gray-500">{user.email}</p>

        <div className="mt-4 text-sm text-gray-600 space-y-1">
          <p><strong>Phone:</strong> {user.phone}</p>
          <p><strong>Address:</strong> {user.address}</p>
          <p><strong>DOB: </strong>{user.dob}</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="mt-8 bg-white rounded-lg shadow">
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
            <div className="space-y-4">
              {donations.map(d => (
                <div key={d.id} className="border p-4 rounded">
                  <p className="font-medium">{d.cause}</p>
                  <p className="text-sm text-gray-500">
                    ₹{d.amount} • {d.date}
                  </p>
                </div>
              ))}
            </div>
          )}

          {activeTab === "orders" && (
            <div className="space-y-4">
              {orders.map(o => (
                <div key={o.id} className="border p-4 rounded">
                  <p className="font-medium">{o.item}</p>
                  <p className="text-sm text-gray-500">
                    ₹{o.total} • {o.date}
                  </p>
                </div>
              ))}
            </div>
          )}

          {activeTab === "edit" && (
            <form className="max-w-md space-y-4">
              <input
                type="text"
                defaultValue={user.fullName}
                className="w-full border p-2 rounded"
                placeholder="Full Name"
              />

              <input
                type="email"
                defaultValue={user.email}
                className="w-full border p-2 rounded"
                placeholder="Email"
              />

              <input
                type="text"
                defaultValue={user.phone}
                className="w-full border p-2 rounded"
                placeholder="Phone"
              />

              <button className="bg-black text-white px-4 py-2 rounded">
                Save Changes
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
    <Footer/>
    </>
  );
};

export default Profile;
