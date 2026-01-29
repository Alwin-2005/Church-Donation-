import React, { useState, useEffect } from "react";
import { X, Calendar, Clock, FileText, Check } from "lucide-react";

const EventForm = ({ onClose, onSubmit, initialData }) => {
  const [formData, setFormData] = useState({
    title: "",
    date: "",
    time: "",
    note: "",
    status: "visible",
    type: "event",
  });

  useEffect(() => {
    if (initialData) {
      setFormData({
        title: initialData.title || "",
        date: initialData.date || "",
        time: initialData.time || "",
        note: initialData.note || "",
        status: initialData.status || "visible",
        type: initialData.type || "event",
      });
    }
  }, [initialData]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <div className="bg-white/95 backdrop-blur-xl rounded-3xl shadow-2xl w-full max-w-xl overflow-hidden border border-white animate-scaleIn">
      {/* Header */}
      <div className="px-8 py-6 bg-gray-50/50 border-b border-gray-100 flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-black text-gray-900 tracking-tight">
            {initialData ? "Edit Announcement" : "New Announcement"}
          </h2>
          <p className="text-xs font-semibold text-gray-400 uppercase tracking-widest mt-1">Announcement Configuration</p>
        </div>
        <button
          onClick={onClose}
          className="p-2 hover:bg-white hover:shadow-sm rounded-full transition-all text-gray-400 hover:text-black"
        >
          <X size={20} />
        </button>
      </div>

      <form onSubmit={handleSubmit} className="p-8 space-y-6">
        <div>
          <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-2 flex items-center gap-2">
            <FileText size={14} className="text-blue-500" /> Announcement Title
          </label>
          <input
            name="title"
            placeholder="e.g. Grand Sunday Celebration"
            value={formData.title}
            onChange={handleChange}
            className="w-full bg-gray-50 border border-gray-200 rounded-2xl p-4 focus:ring-2 focus:ring-black outline-none transition-all font-medium text-gray-900"
            required
          />
        </div>

        <div className="grid grid-cols-2 gap-6">
          <div>
            <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-2 flex items-center gap-2">
              <Calendar size={14} className="text-purple-500" /> Date
            </label>
            <input
              type="date"
              name="date"
              value={formData.date}
              onChange={handleChange}
              className="w-full bg-gray-50 border border-gray-200 rounded-2xl p-4 focus:ring-2 focus:ring-black outline-none transition-all font-medium"
              required
            />
          </div>
          <div>
            <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-2 flex items-center gap-2">
              <Clock size={14} className="text-pink-500" /> Time
            </label>
            <input
              type="time"
              name="time"
              value={formData.time}
              onChange={handleChange}
              className="w-full bg-gray-50 border border-gray-200 rounded-2xl p-4 focus:ring-2 focus:ring-black outline-none transition-all font-medium"
              required
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">Location / Short Note</label>
          <input
            name="note"
            placeholder="e.g. Main Sanctuary"
            value={formData.note}
            onChange={handleChange}
            className="w-full bg-gray-50 border border-gray-200 rounded-2xl p-4 focus:ring-2 focus:ring-black outline-none transition-all font-medium"
          />
        </div>



        <div className="flex gap-6 items-center pt-4 border-t border-gray-100">
          <div className="flex-1">
            <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">Visibility</label>
            <select
              name="status"
              value={formData.status}
              onChange={handleChange}
              className="w-full bg-white border border-gray-200 rounded-2xl p-4 focus:ring-2 focus:ring-black outline-none transition-all font-bold"
            >
              <option value="visible">Public Exposure</option>
              <option value="hidden">Draft Context</option>
            </select>
          </div>

          <button
            type="submit"
            className="mt-6 px-10 py-4 bg-black hover:bg-gray-800 text-white rounded-2xl font-black text-sm tracking-widest uppercase transition-all shadow-xl hover:shadow-black/20 active:scale-95 flex items-center gap-2"
          >
            <Check size={18} /> {initialData ? "Apply" : "Create"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default EventForm;
