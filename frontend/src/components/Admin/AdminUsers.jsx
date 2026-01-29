import React, { useEffect, useState } from "react";
import AdminUserCard from "./AdminUserCard";
import api from "../../api/axios";
import Papa from "papaparse";
import bcrypt from "bcryptjs";
import { Upload, X, UserPlus, Users } from "lucide-react";

const AdminUsers = () => {
  const [users, setUsers] = useState([]);
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState("all");
  const [loading, setLoading] = useState(true);

  const [showAddMenu, setShowAddMenu] = useState(false);
  const [showSingleUserModal, setShowSingleUserModal] = useState(false);
  const [showCSVModal, setShowCSVModal] = useState(false);

  // Single user form state
  const [formData, setFormData] = useState({
    fullname: "",
    email: "",
    phoneNo: "",
    gender: "Male",
    dob: "",
    address: "",
    role: "churchMember",
    password: ""
  });

  // CSV state
  const [csvFile, setCsvFile] = useState(null);
  const [csvData, setCsvData] = useState([]);
  const [uploadResult, setUploadResult] = useState(null);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const res = await api.get("/admin/users/view");
      setUsers(res.data.Result || []);
    } catch (error) {
      console.error("Error fetching users:", error);
    } finally {
      setLoading(false);
    }
  };

  // Single user handlers
  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmitSingleUser = async (e) => {
    e.preventDefault();
    try {
      await api.post("/admin/users/add", formData);
      alert("User created successfully!");
      setShowSingleUserModal(false);
      setFormData({
        fullname: "",
        email: "",
        phoneNo: "",
        gender: "Male",
        dob: "",
        address: "",
        role: "churchMember",
        password: ""
      });
      fetchUsers();
    } catch (error) {
      alert(error.response?.data?.message || "Failed to create user");
    }
  };

  // CSV handlers
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setCsvFile(file);
      parseCSV(file);
    }
  };

  const parseCSV = (file) => {
    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      complete: (results) => {
        setCsvData(results.data);
      },
      error: (error) => {
        alert("Error parsing CSV: " + error.message);
      }
    });
  };

  const handleBulkUpload = async () => {
    if (csvData.length === 0) {
      alert("No data to upload");
      return;
    }

    try {
      const res = await api.post("/admin/users/bulk", { users: csvData });
      setUploadResult(res.data);
      fetchUsers();
    } catch (error) {
      alert("Bulk upload failed: " + (error.response?.data?.message || error.message));
    }
  };

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

  const filteredUsers = users.filter(user => {
    const matchesSearch =
      user.fullname.toLowerCase().includes(search.toLowerCase()) ||
      user.email.toLowerCase().includes(search.toLowerCase());

    const matchesRole =
      roleFilter === "all" || user.role === roleFilter;

    return matchesSearch && matchesRole;
  });

  if (loading) {
    return (
      <div className="pt-24 px-6 max-w-7xl mx-auto">
        <div className="text-center text-gray-400 animate-pulse">Loading users...</div>
      </div>
    );
  }

  return (
    <>
      <div className="pt-24 px-6 max-w-7xl mx-auto pb-12">

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

          {/* Add User Button */}
          <div className="relative">
            <button
              onClick={() => setShowAddMenu(prev => !prev)}
              className="bg-black text-white px-4 py-2 rounded-lg hover:bg-gray-800 transition flex items-center gap-2"
            >
              <UserPlus className="w-4 h-4" />
              Add User
            </button>

            {showAddMenu && (
              <div className="absolute right-0 mt-2 w-48 bg-white border rounded-lg shadow-lg z-10">
                <button
                  onClick={() => {
                    setShowSingleUserModal(true);
                    setShowAddMenu(false);
                  }}
                  className="w-full text-left px-4 py-2 hover:bg-gray-100 text-sm rounded-t-lg"
                >
                  Add Single User
                </button>

                <button
                  onClick={() => {
                    setShowCSVModal(true);
                    setShowAddMenu(false);
                  }}
                  className="w-full text-left px-4 py-2 hover:bg-gray-100 text-sm rounded-b-lg"
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
            className="border rounded-lg px-4 py-2 w-full md:w-1/3 focus:ring-2 focus:ring-black outline-none"
          />

          <select
            value={roleFilter}
            onChange={(e) => setRoleFilter(e.target.value)}
            className="border rounded-lg px-4 py-2 w-full md:w-1/4 focus:ring-2 focus:ring-black outline-none"
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

      {/* Single User Modal */}
      {showSingleUserModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b flex justify-between items-center sticky top-0 bg-white">
              <h2 className="text-xl font-bold">Add Single User</h2>
              <button onClick={() => setShowSingleUserModal(false)}>
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmitSingleUser} className="p-6 space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Full Name *</label>
                  <input
                    name="fullname"
                    value={formData.fullname}
                    onChange={handleInputChange}
                    required
                    className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-black outline-none"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">Email *</label>
                  <input
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    required
                    className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-black outline-none"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">Phone Number</label>
                  <input
                    name="phoneNo"
                    value={formData.phoneNo}
                    onChange={handleInputChange}
                    placeholder="9876543210"
                    className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-black outline-none"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">Gender *</label>
                  <select
                    name="gender"
                    value={formData.gender}
                    onChange={handleInputChange}
                    required
                    className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-black outline-none"
                  >
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Other">Other</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">Date of Birth</label>
                  <input
                    name="dob"
                    type="date"
                    value={formData.dob}
                    onChange={handleInputChange}
                    className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-black outline-none"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">Role *</label>
                  <select
                    name="role"
                    value={formData.role}
                    onChange={handleInputChange}
                    required
                    className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-black outline-none"
                  >
                    <option value="churchMember">Church Member</option>
                    <option value="externalMember">External Member</option>
                    <option value="admin">Admin</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Address</label>
                <textarea
                  name="address"
                  value={formData.address}
                  onChange={handleInputChange}
                  rows="2"
                  className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-black outline-none"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Password *</label>
                <input
                  name="password"
                  type="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  required
                  className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-black outline-none"
                />
              </div>

              <button
                type="submit"
                className="w-full bg-black text-white py-3 rounded-lg font-bold hover:bg-gray-800 transition"
              >
                Create User
              </button>
            </form>
          </div>
        </div>
      )}

      {/* CSV Upload Modal */}
      {showCSVModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b flex justify-between items-center sticky top-0 bg-white">
              <h2 className="text-xl font-bold">Upload Users via CSV</h2>
              <button onClick={() => {
                setShowCSVModal(false);
                setCsvFile(null);
                setCsvData([]);
                setUploadResult(null);
              }}>
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 space-y-4">
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
                <Upload className="w-12 h-12 mx-auto mb-4 text-gray-400" />
                <input
                  type="file"
                  accept=".csv"
                  onChange={handleFileChange}
                  className="hidden"
                  id="csv-upload"
                />
                <label
                  htmlFor="csv-upload"
                  className="cursor-pointer text-black font-medium hover:underline"
                >
                  Click to upload CSV
                </label>
                <p className="text-sm text-gray-500 mt-2">
                  Required columns: fullname, email, phoneNo, gender, dob, address, role, password
                </p>
              </div>

              {csvFile && (
                <div className="bg-gray-50 p-4 rounded-lg">
                  <p className="font-medium">File: {csvFile.name}</p>
                  <p className="text-sm text-gray-600">Rows: {csvData.length}</p>
                </div>
              )}

              {csvData.length > 0 && (
                <div className="border rounded-lg overflow-hidden">
                  <div className="max-h-64 overflow-y-auto">
                    <table className="w-full text-sm">
                      <thead className="bg-gray-100 sticky top-0">
                        <tr>
                          <th className="px-4 py-2 text-left">Name</th>
                          <th className="px-4 py-2 text-left">Email</th>
                          <th className="px-4 py-2 text-left">Role</th>
                        </tr>
                      </thead>
                      <tbody>
                        {csvData.slice(0, 10).map((row, i) => (
                          <tr key={i} className="border-t">
                            <td className="px-4 py-2">{row.fullname}</td>
                            <td className="px-4 py-2">{row.email}</td>
                            <td className="px-4 py-2">{row.role}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                  {csvData.length > 10 && (
                    <div className="bg-gray-50 px-4 py-2 text-sm text-gray-600">
                      Showing 10 of {csvData.length} rows
                    </div>
                  )}
                </div>
              )}

              {uploadResult && (
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <p className="font-medium">{uploadResult.message}</p>
                  {uploadResult.results.errors.length > 0 && (
                    <div className="mt-2 text-sm">
                      <p className="font-medium text-red-600">Errors:</p>
                      <ul className="list-disc list-inside">
                        {uploadResult.results.errors.map((err, i) => (
                          <li key={i}>{err.error}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              )}

              <button
                onClick={handleBulkUpload}
                disabled={csvData.length === 0}
                className="w-full bg-black text-white py-3 rounded-lg font-bold hover:bg-gray-800 transition disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Upload {csvData.length} Users
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default AdminUsers;
