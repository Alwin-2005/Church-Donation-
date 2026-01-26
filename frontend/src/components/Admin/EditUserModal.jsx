import React, { useState } from "react";

const EditUserModal = ({ user, onClose, onUpdate }) => {
  const [form, setForm] = useState(user);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onUpdate(form);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <form
        onSubmit={handleSubmit}
        className="bg-white rounded-xl p-6 w-full max-w-md"
      >
        <h3 className="text-lg font-semibold mb-4">Edit Member</h3>

        <input
          name="fullname"
          value={form.fullname}
          onChange={handleChange}
          className="w-full border p-2 rounded mb-2"
        />

        <input
          name="phoneNo"
          value={form.phoneNo}
          onChange={handleChange}
          className="w-full border p-2 rounded mb-2"
        />

        <select
          name="status"
          value={form.status}
          onChange={handleChange}
          className="w-full border p-2 rounded mb-4"
        >
          <option value="enabled">Enabled</option>
          <option value="disabled">Disabled</option>
        </select>

        <div className="flex justify-end gap-3">
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
            Save
          </button>
        </div>
      </form>
    </div>
  );
};

export default EditUserModal;
