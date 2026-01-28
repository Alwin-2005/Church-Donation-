import React from "react";

const EventCard = ({ event, isAdmin = false, onEdit }) => {
  const { title, date, time, note, verse, status } = event;

  // Format date nicely for display
  const formatDate = (dateStr) => {
    if (!dateStr) return "";
    const options = { day: "2-digit", month: "short", year: "numeric" };
    return new Date(dateStr).toLocaleDateString("en-IN", options);
  };

  // Format time nicely for display
  const formatTime = (timeStr) => {
    if (!timeStr) return "";
    const [hour, minute] = timeStr.split(":");
    const date = new Date();
    date.setHours(hour, minute);
    return date.toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" });
  };

  return (
    <div className="flex flex-col md:flex-row bg-white rounded-xl shadow-md overflow-hidden">
      {/* Date */}
      <div className="w-full md:w-28 bg-black text-white flex flex-col items-center justify-center p-4">
        <span className="text-sm uppercase">{formatDate(date).split(" ")[1]}</span>
        <span className="text-3xl font-bold">{formatDate(date).split(" ")[0]}</span>
      </div>

      {/* Content */}
      <div className="flex-1 p-5 relative">
        <div className="flex justify-between items-start">
          <div>
            <h3 className="text-xl font-bold">{title}</h3>
            <p className="text-sm text-gray-600">{formatTime(time)}</p>
          </div>

          {isAdmin && (
            <span
              className={`text-xs px-2 py-1 rounded ${
                status === "visible"
                  ? "bg-green-100 text-green-700"
                  : "bg-red-100 text-red-700"
              }`}
            >
              {status}
            </span>
          )}
        </div>

        {note && <p className="mt-2 text-gray-700">{note}</p>}

        {verse && (
          <blockquote className="mt-4 italic text-gray-600 border-l-4 pl-4">
            {verse}
          </blockquote>
        )}

        {isAdmin && onEdit && (
          <button
            onClick={onEdit}
            className="absolute top-5 right-5 text-sm px-3 py-1 border rounded hover:bg-black hover:text-white"
          >
            Edit
          </button>
        )}
      </div>
    </div>
  );
};

export default EventCard;
