import React from "react";
import { Outlet } from "react-router-dom";
import AdminSidebar from "./AdminSidebar";

const AdminPanel = () => {
  return (
    <div className="flex min-h-screen">
      <AdminSidebar />

      <main className="flex-1 p-6 bg-gray-100">
        
        <Outlet />
      </main>
    </div>
  );
};

export default AdminPanel;
