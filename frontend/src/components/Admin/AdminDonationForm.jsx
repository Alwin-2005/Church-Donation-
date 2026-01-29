import React, { useState } from "react";

const AdminDonationForm = ({ onSubmit, initialData = null, onClose }) => {
  const [formData, setFormData] = useState({
    type: initialData?.type || "internal",
    ctitle: initialData?.ctitle || "",
    desc: initialData?.desc || "",
    goalAmt: initialData?.goalAmt || "",
    startDate: initialData?.startDate
      ? initialData.startDate.split("T")[0]
      : "",
    endate: initialData?.endate
      ? initialData.endate.split("T")[0]
      : "",
    status: initialData?.status || "active",
    isTithe: initialData?.isTithe || false,
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!formData.ctitle || (!formData.isTithe && !formData.goalAmt) || !formData.startDate) {
      alert("Please fill all required fields");
      return;
    }

    onSubmit({
      ...formData,
      goalAmt: formData.isTithe ? 0 : Number(formData.goalAmt),
      donationType: formData.type // Sync naming with model if needed, though form uses 'type'
    });
  };

  return (
    <div className="relative max-w-2xl bg-white shadow rounded-xl p-6">

      {/* CLOSE BUTTON */}
      <button
        type="button"
        onClick={onClose}
        className="absolute top-3 right-3 text-gray-500 hover:text-black text-xl"
      >
        ×
      </button>

      <h2 className="text-xl font-semibold mb-6">
        {initialData ? "Edit Donation Campaign" : "Create Donation Campaign"}
      </h2>

      <form onSubmit={handleSubmit} className="space-y-4">

        {/* Donation Type & Tithe Toggle */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">
              Donation Type *
            </label>
            <select
              name="type"
              value={formData.type}
              onChange={handleChange}
              disabled={formData.isTithe}
              className="w-full border rounded px-3 py-2 disabled:bg-gray-100"
            >
              <option value="internal">Internal (Church)</option>
              <option value="external">External</option>
            </select>
          </div>

          <div className="flex items-center gap-2 mt-6">
            <input
              type="checkbox"
              id="isTithe"
              name="isTithe"
              checked={formData.isTithe}
              onChange={(e) => {
                const checked = e.target.checked;
                setFormData(prev => ({
                  ...prev,
                  isTithe: checked,
                  type: checked ? "internal" : prev.type
                }));
              }}
              className="w-5 h-5 accent-green-600"
            />
            <label htmlFor="isTithe" className="text-sm font-bold text-gray-700">
              Is Monthly Tithe?
            </label>
          </div>
        </div>

        {/* Title */}
        <div>
          <label className="block text-sm font-medium mb-1">
            Campaign Title *
          </label>
          <input
            type="text"
            name="ctitle"
            value={formData.ctitle}
            onChange={handleChange}
            className="w-full border rounded px-3 py-2"
            placeholder={formData.isTithe ? "e.g. Monthly Tithes" : "e.g. Church Building Renovation"}
            required
          />
        </div>

        {/* Description */}
        <div>
          <label className="block text-sm font-medium mb-1">
            Description
          </label>
          <textarea
            name="desc"
            value={formData.desc}
            onChange={handleChange}
            className="w-full border rounded px-3 py-2"
            rows="4"
            placeholder={formData.isTithe ? "General fund for church members monthly contributions" : "Describe the purpose of this campaign"}
          />
        </div>

        {/* Goal Amount */}
        {!formData.isTithe && (
          <div>
            <label className="block text-sm font-medium mb-1">
              Goal Amount (₹) *
            </label>
            <input
              type="number"
              name="goalAmt"
              value={formData.goalAmt}
              onChange={handleChange}
              className="w-full border rounded px-3 py-2"
              min="0"
              required
            />
          </div>
        )}

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
              End Date {formData.isTithe ? "(Optional)" : ""}
            </label>
            <input
              type="date"
              name="endate"
              value={formData.endate}
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
            onClick={() =>
              setFormData({
                type: "internal",
                ctitle: "",
                desc: "",
                goalAmt: "",
                startDate: "",
                endate: "",
                status: "active",
              })
            }
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
