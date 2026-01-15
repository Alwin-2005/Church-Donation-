import React, { useState } from "react";
import Login from "../../assets/Login.jpg";
import COG from "../../assets/COG.png";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";

const initialForm = {
  fullName: "",
  email: "",
  phoneNo: "",
  gender: "",
  dob: "",
  password: "",
  confirmPassword: ""
};

const initialError = {
  fullName: "",
  email: "",
  phoneNo: "",
  gender: "",
  dob: "",
  password: ""
};

const Regis = () => {
  const navigate = useNavigate();

  const [formInput, setFormInput] = useState(initialForm);
  const [formError, setFormError] = useState(initialError);

  const handleInput = (name, value) => {
  setFormInput(prev => ({
    ...prev,
    [name]: value
  }));
};


  const handleFormValidation = (e) => {
  e.preventDefault();

  const inputError = {};

  if (!formInput.fullName?.trim()) {
    inputError.fullName = "Full name is required";
  } else if (formInput.fullName.trim().length < 3) {
    inputError.fullName = "Full name must be at least 3 characters long";
  } else if (!/^[a-zA-Z\s]+$/.test(formInput.fullName)) {
    inputError.fullName = "Full name should contain only letters";
  }

  if (!formInput.email?.trim()) {
    inputError.email = "Email is required";
  } else if (
    !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formInput.email)
  ) {
    inputError.email = "Please enter a valid email address";
  }

  if (!formInput.phoneNo?.trim()) {
    inputError.phoneNo = "Phone number is required";
  } else if (!/^\d{10}$/.test(formInput.phoneNo)) {
    inputError.phoneNo = "Phone number must be exactly 10 digits";
  }

  if (!formInput.password) {
    inputError.password = "Password is required";
  } else if (formInput.password.length < 8) {
    inputError.password = "Password must be at least 8 characters long";
  } else if (
    !/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&]).+$/.test(formInput.password)
  ) {
    inputError.password =
      "Password must contain uppercase, lowercase, number & special character";
  }

  if (!formInput.confirmPassword) {
    inputError.Password = "Confirm password is required";
  } else if (formInput.password !== formInput.confirmPassword) {
    inputError.Password = "Passwords do not match";
  }

  if (!formInput.gender) {
    inputError.gender = "Please select gender";
  }

  if (!formInput.dob) {
    inputError.dob = "Date of birth is required";
  } else {
    const dob = new Date(formInput.dob);
    const today = new Date();
    const age = today.getFullYear() - dob.getFullYear();
    const monthDiff = today.getMonth() - dob.getMonth();

    if (
      age < 18 ||
      (age === 18 && monthDiff < 0)
    ) {
      inputError.dob = "You must be at least 18 years old";
    }
  }

  setFormError({
    ...initialError,
    ...inputError,
  });

  if (Object.keys(inputError).length === 0) {
    handleRegistration();
  }
};


  const handleRegistration = async() => {
    const {fullName,email,phoneNo,gender,dob,password} = formInput;
    try{
    const result = await axios.post("http://localhost:4000/api/register",
        {fullName,email,phoneNo,gender,dob,password});
      navigate("/");
    }
    catch(err){console.log("Error : ",err)}
    //navigate("/home");
    console.log("Form submitted : ",formInput);
  }
    
  return (
    <div
      className="h-screen w-full bg-cover bg-center relative"
      style={{ backgroundImage: `url(${Login})` }}
    >
      {/* Dark Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/50 to-black/80"></div>

      {/* Logo */}
      <img
        src={COG}
        className="absolute top-6 left-8 h-16 z-10"
        alt="Logo"
      />

      {/* Registration Card */}
      <div className="relative z-10 h-full flex items-center justify-center">
        <div className="w-[380px] max-h-[90vh] overflow-y-auto backdrop-blur-xl bg-white/10 border border-white/20 rounded-2xl px-10 py-12 shadow-2xl">


          <h1 className="text-3xl font-bold text-white mb-6 text-center">
            Registration
          </h1>

          <form  className="flex flex-col gap-5"
                 onSubmit={handleFormValidation}
          >
          <div className="flex flex-col gap-1">
          <input
              name="fullName"
              type="text"
              placeholder="Full Name"
              value= {formInput.fullName}
              onChange = {(e) => {handleInput(e.target.name,e.target.value)}}
              className="px-4 py-2 rounded bg-white/90 text-black font-medium focus:outline-none focus:ring-2 focus:ring-white"
            />

            <p
              className="min-h-[20px] text-red-600 text-sm font-medium px-2"
            >{formError.fullName}</p>

            </div>

            <div className="flex flex-col gap-1">
            <input
              name="email"
              type="email"
              placeholder="Email"
              value= {formInput.email}
              onChange = {(e) => {handleInput(e.target.name,e.target.value)}}
              className="px-4 py-2 rounded bg-white/90 text-black font-medium focus:outline-none focus:ring-2 focus:ring-white"
            />

            <p 
            className="min-h-[20px] text-red-600 text-sm font-medium px-2"
            >{formError.email}</p>
            </div>

            <div className="flex flex-col gap-1">
            <input
              name="phoneNo"
              type="tel"
              placeholder="Phone No."
              value = {formInput.phoneNo}
              onChange = {(e) => {handleInput(e.target.name,e.target.value)}}
              className="px-4 py-2 rounded bg-white/90 text-black font-medium focus:outline-none focus:ring-2 focus:ring-white"
            />

            <p
              className="min-h-[20px] text-red-600 text-sm font-medium px-2"
            >{formError.phoneNo}</p>
            </div>


            <div className="flex flex-col gap-1">
            <select
            name="gender"
            className="px-4 py-2 rounded bg-white/90 text-black font-medium focus:outline-none focus:ring-2 focus:ring-white"
            value={formInput.gender}
            onChange = {(e) => {handleInput(e.target.name,e.target.value)}}
            >
              <option value="">Select gender</option>
              <option value={"Male"}>Male</option>
              <option value={"Female"}>Female</option>
              <option value={"Other"}>Other</option>
            </select>

            <p
              className="min-h-[20px] text-red-600 text-sm font-medium px-2"
            >{formError.gender}</p>
            </div>


            <div className="flex flex-col gap-1">
            <input
              name="dob"
              type="date"
              placeholder="DOB"
              value = {formInput.dob}
              onChange = {(e) => {handleInput(e.target.name,e.target.value)}}
              className="px-4 py-2 rounded bg-white/90 text-black font-medium focus:outline-none focus:ring-2 focus:ring-white"
            />
            <p
              className="min-h-[20px] text-red-600 text-sm font-medium px-2"
            >{formError.dob}</p>
            </div>
  
            <div className="flex flex-col gap-1">
            <input
              name="password"
              type="password"
              placeholder="Create Password"
              value = {formInput.password}
              onChange = {(e) => {handleInput(e.target.name,e.target.value)}}
              className="px-4 py-2 rounded bg-white/90 text-black font-medium focus:outline-none focus:ring-2 focus:ring-white"
            />


            <input
              name="confirmPassword"
              type="password"
              placeholder="Confirm Password"
              value = {formInput.confirmPassword}
              onChange = {(e) => {handleInput(e.target.name,e.target.value)}}
              className="px-4 py-2 rounded bg-white/90 text-black font-medium focus:outline-none focus:ring-2 focus:ring-white"
            />

            <p
              className="min-h-[20px] text-red-600 text-sm font-medium px-2"
            >{formError.password}</p>

            </div>

            <button
              type="submit"
              className="mt-2 bg-black text-white rounded py-2 font-semibold hover:bg-gray-900 active:scale-95 transition-all"
            >
              Register
            </button>
          </form>

        </div>
      </div>
    </div>
  );
};

export default Regis;
