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

    if(!formInput.fullName)
      inputError.fullName = "Full name is required, Please fill this field";

    if(!formInput.email)
      inputError.email = "Email is required";

    if(!formInput.phoneNo)
      inputError.phoneNo = "Phone Number is required";

    if(formInput.password !== formInput.confirmPassword || !formInput.password || ! formInput.confirmPassword)
      inputError.password = "Password and confirm password should be the same";

    if(!/^\d{10}$/.test(formInput.phoneNo))
      inputError.phoneNo =  "Phone Number should be of 10 digits only";

    if (!formInput.gender)
      inputError.gender = "Please select gender";

    if(!formInput.dob)
      inputError.dob = "Please enter date of birth"

      setFormError({
        ...initialError,
        ...inputError
      });

    if (Object.keys(inputError).length === 0) {
      handleRegistration();
    }

  }

  const handleRegistration = async() => {
    const {fullName,email,phoneNo,gender,dob,password} = formInput;
    try{
    const result = await axios.post("http://localhost:4000/api/register",
        {fullName,email,phoneNo,gender,dob,password});
      navigate("/");
    }
    catch(err){console.log("Error : ",err)}
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
        <div className="w-[380px] backdrop-blur-xl bg-white/10 border border-white/20 rounded-2xl px-10 py-12 shadow-2xl">

          <h1 className="text-3xl font-bold text-white mb-6 text-center">
            Registration
          </h1>

          <form  className="flex flex-col gap-5"
                 onSubmit={handleFormValidation}
          >

          <input
              name="fullName"
              type="text"
              placeholder="Full Name"
              value= {formInput.fullName}
              onChange = {(e) => {handleInput(e.target.name,e.target.value)}}
              className="px-4 py-2 rounded bg-white/90 text-black font-medium focus:outline-none focus:ring-2 focus:ring-white"
            />

            <p
              className="px-2  text-red-600 font-medium"
            >{formError.fullName}</p>

            <input
              name="email"
              type="email"
              placeholder="Email"
              value= {formInput.email}
              onChange = {(e) => {handleInput(e.target.name,e.target.value)}}
              className="px-4 py-2 rounded bg-white/90 text-black font-medium focus:outline-none focus:ring-2 focus:ring-white"
            />

            <p
              className="px-2  text-red-600 font-medium"
            >{formError.email}</p>

            <input
              name="phoneNo"
              type="tel"
              placeholder="Phone No."
              value = {formInput.phoneNo}
              onChange = {(e) => {handleInput(e.target.name,e.target.value)}}
              className="px-4 py-2 rounded bg-white/90 text-black font-medium focus:outline-none focus:ring-2 focus:ring-white"
            />

            <p
              className="px-2  text-red-600 font-medium"
            >{formError.phoneNo}</p>

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
              className="px-2  text-red-600 font-medium"
            >{formError.gender}</p>

            <input
              name="dob"
              type="date"
              placeholder="DOB"
              value = {formInput.dob}
              onChange = {(e) => {handleInput(e.target.name,e.target.value)}}
              className="px-4 py-2 rounded bg-white/90 text-black font-medium focus:outline-none focus:ring-2 focus:ring-white"
            />
            <p
              className="px-2  text-red-600 font-medium"
            >{formError.dob}</p>
  
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
              className="px-2  text-red-600 font-medium"
            >{formError.password}</p>

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
