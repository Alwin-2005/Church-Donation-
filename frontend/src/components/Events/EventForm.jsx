import React, { useState } from "react";

const EventForm = ({ onClose }) => {
  const [formData, setFormData] = useState({
    title: "",
    month: "",
    day: "",
    time: "",
    note: "",
    verse: "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("New Event:", formData);
    onClose(); // hide form after submit
  };

  return (
    <div className="bg-white shadow-lg rounded-lg p-6 max-w-2xl mx-auto">
      <h2 className="text-xl font-bold mb-4">Add New Event</h2>

      <form onSubmit={handleSubmit} className="grid gap-4">
        <input
          name="title"
          placeholder="Event Title"
          className="border p-2 rounded"
          onChange={handleChange}
        />

        <div className="flex gap-4">
          <input
            name="month"
            placeholder="Month (MAR)"
            className="border p-2 rounded w-1/2"
            onChange={handleChange}
          />
          <input
            name="day"
            placeholder="Day (05)"
            className="border p-2 rounded w-1/2"
            onChange={handleChange}
          />
        </div>

        <input
          name="time"
          placeholder="Time (Friday · 6:00 PM)"
          className="border p-2 rounded"
          onChange={handleChange}
        />

        <input
          name="note"
          placeholder="Note"
          className="border p-2 rounded"
          onChange={handleChange}
        />

        <textarea
          name="verse"
          placeholder="Verse"
          className="border p-2 rounded"
          rows={3}
          onChange={handleChange}
        />

        <div className="flex justify-end gap-4">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 border rounded"
          >
            Cancel
          </button>

          <button
            type="submit"
            className="px-4 py-2 bg-black text-white rounded"
          >
            Add Event
          </button>
        </div>
      </form>
    </div>
  );
};

export default EventForm;
