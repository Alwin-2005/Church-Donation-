import React, { useState } from "react";
import EventForm from "../Events/EventForm"
import EventCard from "../Events/EventCard";

const AdminEvents = () => {
  const [events, setEvents] = useState([
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
      status: "hidden",
    },
  ]);
  const [showForm, setShowForm] = useState(false);
  const [editingEvent, setEditingEvent] = useState(null);
  const [filter, setFilter] = useState("all");

  const handleSave = (data) => {
    if (editingEvent) {
      setEvents(events.map(e => e.id === editingEvent.id ? { ...data, id: e.id } : e));
    } else {
      setEvents([...events, { ...data, id: Date.now() }]);
    }
    setEditingEvent(null);
  };

  const filteredEvents = filter === "all"
    ? events
    : events.filter(e => e.status === filter);

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Manage Events</h1>

        <div className="flex gap-3">
          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="border rounded px-3 py-2"
          >
            <option value="all">All</option>
            <option value="visible">Visible</option>
            <option value="hidden">Hidden</option>
          </select>

          <button
            onClick={() => setShowForm(true)}
            className="bg-black text-white px-4 py-2 rounded"
          >
            Add Event
          </button>
        </div>
      </div>

      <div className="grid gap-4">
        {filteredEvents.map(event => (
          <EventCard
            key={event.id}
            event={event}
            isAdmin={true}          // Admin sees status & edit button
            onEdit={() => {
              setEditingEvent(event);
              setShowForm(true);
            }}
          />
        ))}
      </div>

      {showForm && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <EventForm
            initialData={editingEvent}
            onClose={() => {
              setShowForm(false);
              setEditingEvent(null);
            }}
            onSubmit={handleSave}
          />
        </div>
      )}
    </div>
  );
};

export default AdminEvents;
