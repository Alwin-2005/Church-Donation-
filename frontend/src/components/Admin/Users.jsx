import React, { useState } from "react";
import UserCard from "./UserCard";
import AddUserModal from "./AddUserModal";
import EditUserModal from "./EditUserModal";

const Users = () => {

  const [showForm, setShowForm] = useState(false);
  const [users, setUsers] = useState([
    {
      _id: "1",
      fullname: "John Doe",
      email: "john@gmail.com",
      phoneNo: "9876543210",
      gender: "Male",
      role: "externalMember",
      status: "enabled",
    },
    {
      _id: "2",
      fullname: "Mary Thomas",
      email: "mary@gmail.com",
      phoneNo: "9123456780",
      gender: "Female",
      role: "internalMember",
      status: "disabled",
    },
  ]);

  const [openAdd, setOpenAdd] = useState(false);
  const [editUser, setEditUser] = useState(null);

  const handleAddUser = (newUser) => {
    setUsers([...users, { ...newUser, _id: Date.now().toString() }]);
  };

  const handleUpdateUser = (updatedUser) => {
    setUsers(
      users.map((u) => (u._id === updatedUser._id ? updatedUser : u))
    );
  };

  return (
    <>
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold">Church Members</h2>

        <button
          onClick={() => setOpenAdd(true)}
          className="bg-black text-white px-4 py-2 rounded-md hover:scale-105 transition"
        >
          + Add Member
        </button>
      </div>

      {/* Users Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {users.map((user) => (
          <UserCard
            key={user._id}
            user={user}
            isAdmin
            onEdit={() => setEditUser(user)}
          />
        ))}
      </div>

      {/* Modals */}
      {openAdd && (
        <AddUserModal
          onClose={() => setOpenAdd(false)}
          onAdd={handleAddUser}
        />
      )}

      {editUser && (
        <EditUserModal
          user={editUser}
          onClose={() => setEditUser(null)}
          onUpdate={handleUpdateUser}
        />
      )}
    </>
  );
};

export default Users;
