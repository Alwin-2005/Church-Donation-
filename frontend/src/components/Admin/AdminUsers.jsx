import React, { useEffect, useState } from "react";
import AdminUserCard from "./AdminUserCard";

const AdminUsers = () => {
  const [users, setUsers] = useState([]);
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState("all");

  // 🔽 ADDED STATE (nothing else changed)
  const [showAddMenu, setShowAddMenu] = useState(false);
  const [showSingleUserModal, setShowSingleUserModal] = useState(false);
  const [showCSVModal, setShowCSVModal] = useState(false);

  // 🔹 Dummy data for now (replace with API later)
  useEffect(() => {
    setUsers([
      {
        _id: "1",
        fullname: "John Doe",
        email: "john@gmail.com",
        phoneNo: "9876543210",
        gender: "Male",
        role: "churchMember",
        status: "enabled",
        createdAt: "2025-01-01",
        updatedAt: "2025-01-20",
      },
      {
        _id: "2",
        fullname: "Mary Smith",
        email: "mary@gmail.com",
        phoneNo: "",
        gender: "Female",
        role: "externalMember",
        status: "disabled",
        createdAt: "2025-01-05",
        updatedAt: "2025-01-18",
      },
    ]);
  }, []);

  // 🔹 Handlers
  const handleToggleStatus = (id) => {
    setUsers(prev =>
      prev.map(user =>
        user._id === id
          ? { ...user, status: user.status === "enabled" ? "disabled" : "enabled" }
          : user
      )
    );
  };

  const handleViewUser = (user) => {
    console.log("View user:", user);
  };

  // 🔹 Filtering logic
  const filteredUsers = users.filter(user => {
    const matchesSearch =
      user.fullname.toLowerCase().includes(search.toLowerCase()) ||
      user.email.toLowerCase().includes(search.toLowerCase());

    const matchesRole =
      roleFilter === "all" || user.role === roleFilter;

    return matchesSearch && matchesRole;
  });

  return (
    <>

      <div className="pt-24 px-6 max-w-7xl mx-auto">
        
        {/* Header */}
        <div className="mb-6 flex justify-between items-start">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">
              User Management
            </h1>
            <p className="text-gray-600 text-sm">
              Manage church members and external users
            </p>
          </div>

          {/* 🔽 ADDED: Add User Button */}
          <div className="relative">
            <button
              onClick={() => setShowAddMenu(prev => !prev)}
              className="bg-black text-white px-4 py-2 rounded-md hover:scale-105 transition"
            >
              + Add User
            </button>

            {showAddMenu && (
              <div className="absolute right-0 mt-2 w-48 bg-white border rounded-md shadow-lg z-10">
                <button
                  onClick={() => {
                    setShowSingleUserModal(true);
                    setShowAddMenu(false);
                  }}
                  className="w-full text-left px-4 py-2 hover:bg-gray-100 text-sm"
                >
                  Add Single User
                </button>

                <button
                  onClick={() => {
                    setShowCSVModal(true);
                    setShowAddMenu(false);
                  }}
                  className="w-full text-left px-4 py-2 hover:bg-gray-100 text-sm"
                >
                  Upload CSV
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Filters */}
        <div className="flex flex-col md:flex-row gap-4 mb-8">
          <input
            type="text"
            placeholder="Search by name or email"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="border rounded-md px-4 py-2 w-full md:w-1/3"
          />

          <select
            value={roleFilter}
            onChange={(e) => setRoleFilter(e.target.value)}
            className="border rounded-md px-4 py-2 w-full md:w-1/4"
          >
            <option value="all">All Roles</option>
            <option value="admin">Admin</option>
            <option value="churchMember">Church Member</option>
            <option value="externalMember">External Member</option>
          </select>
        </div>

        {/* User Cards */}
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {filteredUsers.length > 0 ? (
            filteredUsers.map(user => (
              <AdminUserCard
                key={user._id}
                user={user}
                onToggleStatus={handleToggleStatus}
                onView={handleViewUser}
              />
            ))
          ) : (
            <p className="text-gray-500">No users found.</p>
          )}
        </div>

      </div>

      {/* 🔽 ADDED: Single User Modal */}
      {showSingleUserModal && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-20">
          <div className="bg-white p-6 rounded-lg w-full max-w-md">
            <h2 className="text-lg font-semibold mb-4">Add Single User</h2>
            <p className="text-sm text-gray-600">
              Single user form goes here.
            </p>
            <button
              onClick={() => setShowSingleUserModal(false)}
              className="mt-4 px-4 py-2 bg-black text-white rounded-md"
            >
              Close
            </button>
          </div>
        </div>
      )}

      {/* 🔽 ADDED: CSV Upload Modal */}
      {showCSVModal && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-20">
          <div className="bg-white p-6 rounded-lg w-full max-w-md">
            <h2 className="text-lg font-semibold mb-4">Upload Users via CSV</h2>
            <p className="text-sm text-gray-600">
              CSV upload logic goes here.
            </p>
            <button
              onClick={() => setShowCSVModal(false)}
              className="mt-4 px-4 py-2 bg-black text-white rounded-md"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default AdminUsers;
