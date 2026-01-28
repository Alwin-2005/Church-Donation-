import React, { useState, useEffect } from "react";

const EventForm = ({ onClose, onSubmit, initialData }) => {
  const [formData, setFormData] = useState({
    title: "",
    date: "",
    time: "",
    note: "",
    verse: "",
    status: "visible",
  });

  useEffect(() => {
    if (initialData) {
      setFormData({
        title: initialData.title || "",
        date: initialData.date || "",
        time: initialData.time || "",
        note: initialData.note || "",
        verse: initialData.verse || "",
        status: initialData.status || "visible",
      });
    }
  }, [initialData]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
    onClose();
  };

  return (
    <div className="bg-white rounded-xl shadow-xl p-6 max-w-3xl mx-auto">
      <h2 className="text-2xl font-bold mb-6">
        {initialData ? "Edit Event" : "Add New Event"}
      </h2>

      <form onSubmit={handleSubmit} className="grid gap-4">
        <input
          name="title"
          placeholder="Event Title"
          value={formData.title}
          onChange={handleChange}
          className="border rounded-lg p-3"
          required
        />

        <div className="grid grid-cols-2 gap-4">
          <input
            type="date"
            name="date"
            value={formData.date}
            onChange={handleChange}
            className="border rounded-lg p-3"
            required
          />
          <input
            type="time"
            name="time"
            value={formData.time}
            onChange={handleChange}
            className="border rounded-lg p-3"
            required
          />
        </div>

        <input
          name="note"
          placeholder="Short Note"
          value={formData.note}
          onChange={handleChange}
          className="border rounded-lg p-3"
        />

        <textarea
          name="verse"
          placeholder="Verse / Scripture"
          value={formData.verse}
          onChange={handleChange}
          rows={3}
          className="border rounded-lg p-3"
        />

        <select
          name="status"
          value={formData.status}
          onChange={handleChange}
          className="border rounded-lg p-3"
        >
          <option value="visible">Visible</option>
          <option value="hidden">Hidden</option>
        </select>

        <div className="flex justify-end gap-3 pt-4">
          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2 border rounded-lg"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-5 py-2 bg-black text-white rounded-lg"
          >
            Save Event
          </button>
        </div>
      </form>
    </div>
  );
};

export default EventForm;
