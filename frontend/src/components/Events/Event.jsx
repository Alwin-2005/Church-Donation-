import React from "react";
import EventCard from "./EventCard";
import evimg from "../../assets/evimg.jpg";

const Event = () => {
  const events = [
    {
      id: 1,
      title: "Sunday Worship",
      date: "2026-02-05",
      time: "18:00",
      note: "Join us for evening prayer",
      verse: "Psalm 23:1",
      status: "visible",
    },
    {
      id: 2,
      title: "Charity Drive",
      date: "2026-02-12",
      time: "10:00",
      note: "Collecting donations for orphanage",
      verse: "",
      status: "visible",
    },
  ];

  // Members see only visible events
  const visibleEvents = events.filter(e => e.status === "visible");

  return (
    <div className="pt-20"> {/* ✅ OFFSET FOR FIXED NAVBAR */}

      {/* HERO SECTION */}
      <div className="relative min-h-screen w-full">

        {/* BACKGROUND IMAGE */}
        <img
          src={evimg}
          className="absolute inset-0 h-full w-full object-cover"
          alt="Events background"
        />

        {/* CONTENT OVER IMAGE */}
        <div className="relative z-20 pt-40 px-6">
          <h1 className="text-4xl font-bold text-center text-white">
            Upcoming Events
          </h1>

          <hr className="w-40 mx-auto my-6 border-white" />

          <div className="flex flex-wrap justify-center gap-6">
            {visibleEvents.length === 0 ? (
              <p className="text-white text-lg text-center w-full">
                No events available
              </p>
            ) : (
              visibleEvents.map(event => (
                <EventCard
                  key={event.id}
                  event={event}
                  isAdmin={false} // member view
                />
              ))
            )}
          </div>
        </div>

      </div>
    </div>
  );
};

export default Event;
