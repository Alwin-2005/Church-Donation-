import React from "react";

const UserCard = ({ user, isAdmin, onEdit }) => {
  return (
    <div className="w-full max-w-sm bg-card rounded-xl border shadow-sm p-4 hover:shadow-md transition">
      
      <div className="flex items-center justify-between">
        <h3 className="text-base font-semibold text-foreground">
          {user.fullname}
        </h3>

        <span
          className={`px-2 py-0.5 rounded-full text-xs font-medium
          ${
            user.status === "enabled"
              ? "bg-green-100 text-green-700"
              : "bg-red-100 text-red-700"
          }`}
        >
          {user.status}
        </span>
      </div>

      <p className="text-sm text-muted-foreground mt-1 truncate">{user.email}</p>
      <p className="text-sm text-muted-foreground mt-1">📞 {user.phoneNo}</p>

      <div className="mt-3 flex justify-between items-center">
        <span className="bg-muted text-xs px-2 py-1 rounded-md">
          Role: {user.role}
        </span>

        {isAdmin && (
          <button
            onClick={onEdit}
            className="text-sm text-primary hover:underline"
          >
            Edit
          </button>
        )}
      </div>
    </div>
  );
};

export default UserCard;
