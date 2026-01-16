import React from "react";
import { Link } from "react-router-dom";

const AdminSidebar = () => {
  return (
    <aside className="w-64 bg-black text-white flex flex-col p-6">
      <h2 className="text-2xl font-bold mb-8">Admin Panel</h2>

      <nav className="flex flex-col gap-4 text-sm">
        <Link to="" className="hover:text-gray-300">
          Dashboard
        </Link>
        <Link to="users" className="hover:text-gray-300">
          Users
        </Link>
        <Link to="donationCampaign" className="hover:text-gray-300">
          Donation Campaigns
        </Link>
        <Link to="donation" className="hover:text-gray-300">
          Donation
        </Link>
        <Link to="products" className="hover:text-gray-300">
          Products
        </Link>
        <Link to="orders" className="hover:text-gray-300">
          Orders
        </Link>
        <Link to="payment" className="hover:text-gray-300">
          Payments
        </Link>
        <Link to="events" className="hover:text-gray-300">
          Events
        </Link>
        <Link to="settings" className="hover:text-gray-300">
          Settings
        </Link>
      </nav>
    </aside>
  );
};

export default AdminSidebar;