import { useState } from "react";
import ProfileCard from "../ProfileCard"
import EditUserModal from "./EditUserModal";
import AddUserModal from "./AddUserModal";
import api from "../../api/axios";

const AdminUsers = ({ users }) => {
  const [selectedUser, setSelectedUser] = useState(null);
  const [showEdit, setShowEdit] = useState(false);
  const [showAdd, setShowAdd] = useState(false);

  return (
    <div className="grid grid-cols-3 gap-6">
      
      {/* Users list */}
      <div className="col-span-1">
        {users.map(user => (
          <div
            key={user._id}
            className="p-3 bg-white rounded shadow cursor-pointer hover:bg-gray-100"
            onClick={() => setSelectedUser(user)}
          >
            {user.fullname}
          </div>
        ))}

        <button
          onClick={() => setShowAdd(true)}
          className="mt-4 w-full bg-green-600 text-white py-2 rounded"
        >
          + Add User
        </button>
      </div>

      {/* Profile Preview */}
      <div className="col-span-2">
        {selectedUser && (
          <>
            <ProfileCard
              user={selectedUser}
              isEditable={false}
              isAdmin={true}
            />

            <button
              onClick={() => setShowEdit(true)}
              className="mt-4 bg-blue-600 text-white px-4 py-2 rounded"
            >
              Edit User
            </button>
          </>
        )}
      </div>

      {/* Modals */}
      {showEdit && (
        <EditUserModal
          user={selectedUser}
          onClose={() => setShowEdit(false)}
        />
      )}

      {showAdd && (
        <AddUserModal
          onClose={() => setShowAdd(false)}
        />
      )}
    </div>
  );
};

export default AdminUsers;
