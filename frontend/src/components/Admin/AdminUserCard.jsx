const roleColors = {
  admin: "bg-purple-100 text-purple-700",
  churchMember: "bg-blue-100 text-primary",
  externalMember: "bg-yellow-100 text-yellow-700",
};

const AdminUserCard = ({ user, onToggleStatus, onView }) => {
  return (
    <div className="bg-card rounded-xl shadow p-4 border hover:shadow-lg transitionb animate-scaleIn hover-scale">
      
      {/* Top */}
      <div className="flex justify-between items-center mb-2">
        <h2 className="font-semibold text-sm text-foreground truncate pl-1">
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
      <div className="text-xs text-muted-foreground space-y-1 pl-1">
        <p><span className="font-medium text-foreground">Email:</span> {user.email}</p>
        <p><span className="font-medium text-foreground">Phone:</span> {user.phoneNo || "—"}</p>
        <p><span className="font-medium text-foreground">Gender:</span> {user.gender}</p>
      </div>

      {/* Role */}
      <div className="mt-2 pl-1">
        <span className={`text-[10px] px-2 py-0.5 rounded-full ${roleColors[user.role]}`}>
          {user.role}
        </span>
      </div>

      {/* Actions */}
      <div className="flex justify-start items-center mt-4 pl-1">

        <button
          onClick={() => onToggleStatus(user._id)}
          className={`text-xs px-3 py-1 rounded-md transition-colors font-medium
            ${user.status === "enabled"
              ? "bg-muted text-muted-foreground hover:bg-red-600 hover:text-white"
              : "bg-green-600 text-white hover:bg-green-700"}
          `}
        >
          {user.status === "enabled" ? "Disable" : "Enable"}
        </button>
      </div>
    </div>
  );
};

export default AdminUserCard;
