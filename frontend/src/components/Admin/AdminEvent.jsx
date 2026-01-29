import React, { useState, useEffect } from "react";
import EventForm from "../Events/EventForm";
import EventCard from "../Events/EventCard";
import api from "../../api/axios";
import { Plus, Filter, Loader2 } from "lucide-react";

const AdminEvents = () => {
  const [events, setEvents] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editingEvent, setEditingEvent] = useState(null);
  const [filter, setFilter] = useState("all");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    try {
      setLoading(true);
      const res = await api.get("/admin/content/view?type=event");
      setEvents(res.data.result || []);
    } catch (error) {
      console.error("Error fetching events:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async (data) => {
    try {
      if (editingEvent) {
        await api.patch(`/admin/content/update/${editingEvent._id}`, data);
      } else {
        await api.post("/admin/content/add", { ...data, type: "event" });
      }
      setShowForm(false);
      setEditingEvent(null);
      fetchEvents();
    } catch (error) {
      console.error("Error saving event:", error);
      alert("Failed to save event");
    }
  };

  const handleDelete = async (id) => {
    if (!confirm("Are you sure you want to delete this event?")) return;
    try {
      await api.delete(`/admin/content/delete/${id}`);
      fetchEvents();
    } catch (error) {
      console.error("Error deleting event:", error);
      alert("Failed to delete event");
    }
  };

  const filteredEvents = filter === "all"
    ? events
    : events.filter(e => e.status === filter);

  return (
    <div className="mt-24 px-6 mb-20">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-4">
        <div>
          <h1 className="text-4xl font-black text-gray-900 tracking-tight">Manage Announcements</h1>
          <p className="text-gray-500 font-medium mt-1">Schedule and organize spiritual updates and news</p>
        </div>

        <div className="flex gap-4 w-full md:w-auto">
          <div className="relative flex-1 md:flex-none">
            <Filter className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
            <select
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              className="w-full border-gray-200 border rounded-xl pl-10 pr-4 py-2.5 bg-white text-sm font-bold shadow-sm outline-none appearance-none"
            >
              <option value="all">All Status</option>
              <option value="visible">Visible</option>
              <option value="hidden">Hidden</option>
            </select>
          </div>

          <button
            onClick={() => { setShowForm(true); setEditingEvent(null); }}
            className="bg-black hover:bg-gray-800 text-white px-6 py-2.5 rounded-xl shadow-lg hover:shadow-black/20 transition-all font-bold text-sm flex items-center gap-2 whitespace-nowrap"
          >
            <Plus size={18} /> Add Announcement
          </button>
        </div>
      </div>

      {loading ? (
        <div className="flex flex-col items-center justify-center py-20 text-gray-400">
          <Loader2 className="animate-spin mb-4" size={40} />
          <p className="font-bold tracking-widest text-xs uppercase">Connecting to Sanctuary...</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 animate-fadeIn">
          {filteredEvents.length === 0 ? (
            <div className="col-span-full py-20 bg-white rounded-3xl border-2 border-dashed border-gray-100 flex flex-col items-center">
              <p className="text-gray-400 font-bold">No announcements found in this category</p>
            </div>
          ) : (
            filteredEvents.map(event => (
              <EventCard
                key={event._id}
                event={event}
                isAdmin={true}
                isCompact={true}
                onEdit={() => {
                  setEditingEvent(event);
                  setShowForm(true);
                }}
                onDelete={() => handleDelete(event._id)}
              />
            ))
          )}
        </div>
      )}

      {showForm && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-md flex items-center justify-center z-50 p-4 animate-fadeIn">
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
