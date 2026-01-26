// src/components/CommonUserForm/CommonUserForm.jsx

import React, { useState } from "react";
import {validateUserForm} from '../utils/ValidateUser';

const initialState = {
  fullName: "",
  email: "",
  phoneNo: "",
  password: "",
  confirmPassword: "",
  gender: "",
  dob: "",
};

const CommonUserForm = ({
  onSubmit,
  isAdmin = false,
  onClose,
  submitText = "Register",
}) => {
  const [formInput, setFormInput] = useState(initialState);
  const [formError, setFormError] = useState({});

  const handleChange = (e) => {
    setFormInput({ ...formInput, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const errors = validateUserForm(formInput);
    setFormError(errors);

    if (Object.keys(errors).length === 0) {
      onSubmit(formInput);
      setFormInput(initialState);
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md w-full max-w-md relative">

      {/* Admin Close Button */}
      {isAdmin && (
        <button
          onClick={onClose}
          className="absolute top-2 right-2 text-gray-500 hover:text-black"
        >
          ✕
        </button>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <input name="fullName" placeholder="Full Name" onChange={handleChange} />
        <p className="text-red-500">{formError.fullName}</p>

        <input name="email" placeholder="Email" onChange={handleChange} />
        <p className="text-red-500">{formError.email}</p>

        <input name="phoneNo" placeholder="Phone Number" onChange={handleChange} />
        <p className="text-red-500">{formError.phoneNo}</p>

        <input
          type="password"
          name="password"
          placeholder="Password"
          onChange={handleChange}
        />
        <p className="text-red-500">{formError.password}</p>

        <input
          type="password"
          name="confirmPassword"
          placeholder="Confirm Password"
          onChange={handleChange}
        />
        <p className="text-red-500">{formError.confirmPassword}</p>

        <select name="gender" onChange={handleChange}>
          <option value="">Select Gender</option>
          <option>Male</option>
          <option>Female</option>
          <option>Other</option>
        </select>
        <p className="text-red-500">{formError.gender}</p>

        <input type="date" name="dob" onChange={handleChange} />
        <p className="text-red-500">{formError.dob}</p>

        <button
          type="submit"
          className="bg-black text-white w-full py-2 rounded"
        >
          {submitText}
        </button>
      </form>
    </div>
  );
};

export default CommonUserForm;
