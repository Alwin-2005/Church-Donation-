const roleColors = {
  admin: "bg-purple-100 text-purple-700",
  churchMember: "bg-blue-100 text-blue-700",
  externalMember: "bg-yellow-100 text-yellow-700",
};

const AdminUserCard = ({ user, onToggleStatus, onView }) => {
  return (
    <div className="bg-white rounded-xl shadow p-5 border hover:shadow-lg transitionb animate-scaleIn hover-scale">
      
      {/* Top */}
      <div className="flex justify-between items-center mb-3">
        <h2 className="font-semibold text-gray-800">
          {user.fullname}
        </h2>

        <span
          className={`text-xs px-2 py-1 rounded-full
            ${user.status === "enabled"
              ? "bg-green-100 text-green-700"
              : "bg-red-100 text-red-700"}
          `}
        >
          {user.status}
        </span>
      </div>

      {/* Info */}
      <div className="text-sm text-gray-700 space-y-1">
        <p><b>Email:</b> {user.email}</p>
        <p><b>Phone:</b> {user.phoneNo || "—"}</p>
        <p><b>Gender:</b> {user.gender}</p>
      </div>

      {/* Role */}
      <div className="mt-3">
        <span className={`text-xs px-3 py-1 rounded-full ${roleColors[user.role]}`}>
          {user.role}
        </span>
      </div>

      {/* Actions */}
      <div className="flex justify-between items-center mt-5">
        <button
          onClick={() => onView(user)}
          className="text-sm text-blue-600 hover:underline"
        >
          View Details
        </button>

        <button
          onClick={() => onToggleStatus(user._id)}
          className={`text-sm px-3 py-1 rounded-md text-white
            ${user.status === "enabled"
              ? "bg-red-600 hover:bg-red-700"
              : "bg-green-600 hover:bg-green-700"}
          `}
        >
          {user.status === "enabled" ? "Disable" : "Enable"}
        </button>
      </div>
    </div>
  );
};

export default AdminUserCard;
