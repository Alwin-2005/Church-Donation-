import React, { useState } from "react";
import Navbar from "../NavBar/NavBar";
import Footer from "../Footer/Footer";
import EventCard from "../Events/EventCard";
import EventForm from "../Events/EventForm";

const AdminEvent = () => {
  const [showForm, setShowForm] = useState(false);

  const events = [
    {
      id: 1,
      month: "MAR",
      day: "05",
      title: "Fasting Prayer",
      time: "Monday · 7:30 PM",
      note: "Join this Friday",
      verse: "Joel 2:12 — Return to me with all your heart",
    },
    {
      id: 2,
      month: "APR",
      day: "12",
      title: "Youth Worship Night",
      time: "Friday · 6:00 PM",
      note: "Open for all youth",
      verse: "Psalm 95:1 — Come, let us sing for joy",
    },
  ];

  return (
    <div>
      <Navbar />

      <div className="pt-32 px-10 min-h-screen bg-gray-100">
        {/* HEADER */}
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">Manage Events</h1>

          <button
            onClick={() => setShowForm(!showForm)}
            className="px-5 py-2 bg-black text-white rounded hover:opacity-80"
          >
            {showForm ? "Close Form" : "+ Add Event"}
          </button>
        </div>

        {/* ADD EVENT FORM (POP OUT) */}
        {showForm && (
          <div className="mb-10">
            <EventForm onClose={() => setShowForm(false)} />
          </div>
        )}

        {/* EVENTS LIST */}
        <div className="flex flex-col items-center gap-10">
          {events.map((event) => (
            <EventCard key={event.id} {...event} />
          ))}
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default AdminEvent;
