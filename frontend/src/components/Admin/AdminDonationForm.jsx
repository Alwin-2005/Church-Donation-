import React, { useState } from "react";

const AdminDonationForm = ({ onSubmit, initialData = null }) => {
  const [formData, setFormData] = useState({
    donationType: initialData?.donationType || "internal",
    title: initialData?.title || "",
    description: initialData?.description || "",
    goalAmount: initialData?.goalAmount || "",
    startDate: initialData?.startDate
      ? initialData.startDate.split("T")[0]
      : "",
    endDate: initialData?.endDate
      ? initialData.endDate.split("T")[0]
      : "",
    status: initialData?.status || "active",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!formData.title || !formData.goalAmount || !formData.startDate) {
      alert("Please fill all required fields");
      return;
    }

    onSubmit({
      ...formData,
      goalAmount: Number(formData.goalAmount),
    });
  };

  return (
    <div className="max-w-2xl bg-white shadow rounded-xl p-6">
      <h2 className="text-xl font-semibold mb-6">
        {initialData ? "Edit Donation Campaign" : "Create Donation Campaign"}
      </h2>

      <form onSubmit={handleSubmit} className="space-y-4">

        {/* Donation Type */}
        <div>
          <label className="block text-sm font-medium mb-1">
            Donation Type *
          </label>
          <select
            name="donationType"
            value={formData.donationType}
            onChange={handleChange}
            className="w-full border rounded px-3 py-2"
          >
            <option value="internal">Internal (Church)</option>
            <option value="external">External</option>
          </select>
        </div>

        {/* Title */}
        <div>
          <label className="block text-sm font-medium mb-1">
            Campaign Title *
          </label>
          <input
            type="text"
            name="title"
            value={formData.title}
            onChange={handleChange}
            className="w-full border rounded px-3 py-2"
            placeholder="e.g. Church Building Renovation"
            required
          />
        </div>

        {/* Description */}
        <div>
          <label className="block text-sm font-medium mb-1">
            Description
          </label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            className="w-full border rounded px-3 py-2"
            rows="4"
            placeholder="Describe the purpose of this campaign"
          />
        </div>

        {/* Goal Amount */}
        <div>
          <label className="block text-sm font-medium mb-1">
            Goal Amount (₹) *
          </label>
          <input
            type="number"
            name="goalAmount"
            value={formData.goalAmount}
            onChange={handleChange}
            className="w-full border rounded px-3 py-2"
            min="0"
            required
          />
        </div>

        {/* Dates */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">
              Start Date *
            </label>
            <input
              type="date"
              name="startDate"
              value={formData.startDate}
              onChange={handleChange}
              className="w-full border rounded px-3 py-2"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">
              End Date
            </label>
            <input
              type="date"
              name="endDate"
              value={formData.endDate}
              onChange={handleChange}
              className="w-full border rounded px-3 py-2"
            />
          </div>
        </div>

        {/* Status */}
        <div>
          <label className="block text-sm font-medium mb-1">
            Campaign Status
          </label>
          <select
            name="status"
            value={formData.status}
            onChange={handleChange}
            className="w-full border rounded px-3 py-2"
          >
            <option value="active">Active</option>
            <option value="paused">Paused</option>
            <option value="closed">Closed</option>
          </select>
        </div>

        {/* ACTIONS */}
        <div className="flex justify-end gap-3 pt-4">
          <button
            type="reset"
            onClick={() => setFormData({
              donationType: "internal",
              title: "",
              description: "",
              goalAmount: "",
              startDate: "",
              endDate: "",
              status: "active",
            })}
            className="px-4 py-2 rounded border"
          >
            Reset
          </button>

          <button
            type="submit"
            className="px-6 py-2 rounded bg-green-600 text-white hover:bg-green-700"
          >
            {initialData ? "Update Campaign" : "Create Campaign"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default AdminDonationForm;
