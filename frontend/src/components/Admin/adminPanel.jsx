import React from "react";
import { Outlet } from "react-router-dom";
import Navbar from "../NavBar/NavBar"; // adjust path if needed

const AdminPanel = () => {
  return (
    <>
      {/* Top Navbar */}
      <Navbar />

      {/* Admin Content */}
      <main className="pt-28 px-6 min-h-screen bg-gray-100">
        <Outlet />
      </main>
    </>
  );
};

export default AdminPanel;
