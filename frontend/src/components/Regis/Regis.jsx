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
  confirmPassword: "",
  address: ""
};

const initialError = {
  fullName: "",
  email: "",
  phoneNo: "",
  gender: "",
  dob: "",
  password: "",
  address: ""
};

const Regis = () => {
  const navigate = useNavigate();

  const [formInput, setFormInput] = useState(initialForm);
  const [formError, setFormError] = useState(initialError);

  // OTP modal state
  const [showOtpModal, setShowOtpModal] = useState(false);
  const [otp, setOtp] = useState("");
  const [otpError, setOtpError] = useState("");
  const [otpSuccess, setOtpSuccess] = useState("");
  const [otpLoading, setOtpLoading] = useState(false);
  const [sendingOtp, setSendingOtp] = useState(false);

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
    } else if (!/^[1-9]\d{9}$/.test(formInput.phoneNo)) {
      inputError.phoneNo = "Phone number must be exactly 10 digits and start with 1-9";
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

    if (!formInput.address?.trim()) {
      inputError.address = "Address is required";
    } else if (formInput.address.length < 10) {
      inputError.address = "Address must be more than 10 characters"
    }

    setFormError({
      ...initialError,
      ...inputError,
    });

    if (Object.keys(inputError).length === 0) {
      handleSendOtp();
    }
  };

  const handleSendOtp = async () => {
    setSendingOtp(true);
    setFormError(prev => ({ ...prev, backend: "" }));
    const { fullName, email, phoneNo, gender, dob, password, address } = formInput;
    try {
      await axios.post("http://localhost:4000/api/send-otp", {
        fullName, email, phoneNo, gender, dob, password, address
      });
      setShowOtpModal(true);
      setOtp("");
      setOtpError("");
      setOtpSuccess("");
    } catch (err) {
      console.log("Error sending OTP:", err);
      const msg = err.response?.data?.message || "Failed to send OTP. Please try again.";
      setFormError(prev => ({ ...prev, backend: msg }));
    } finally {
      setSendingOtp(false);
    }
  };

  const handleVerifyOtp = async () => {
    if (!otp.trim()) {
      setOtpError("Please enter the OTP");
      return;
    }
    setOtpLoading(true);
    setOtpError("");
    try {
      await axios.post("http://localhost:4000/api/verify-otp", {
        email: formInput.email,
        otp,
      });
      setOtpSuccess("Account created successfully! Redirecting to login...");
      setTimeout(() => {
        navigate("/login");
      }, 2000);
    } catch (err) {
      console.log("OTP verification error:", err);
      const msg = err.response?.data?.message || "Invalid OTP. Please try again.";
      setOtpError(msg);
    } finally {
      setOtpLoading(false);
    }
  };

  const handleResendOtp = async () => {
    setOtpError("");
    setOtpSuccess("");
    setOtp("");
    await handleSendOtp();
    if (!formError.backend) {
      setOtpSuccess("A new OTP has been sent to your email.");
    }
  };

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
        <div className="w-[380px] max-h-[90vh] overflow-y-auto backdrop-blur-xl bg-card/10 border border-white/20 rounded-2xl px-10 py-12 shadow-2xl">

          <h1 className="text-3xl font-bold text-primary-foreground mb-6 text-center">
            Registration
          </h1>

          <form className="flex flex-col gap-5"
            onSubmit={handleFormValidation}
          >
            {formError.backend && (
              <p className="text-red-600 text-sm font-bold text-center bg-red-100 p-2 rounded">
                {formError.backend}
              </p>
            )}
            <div className="flex flex-col gap-1">
              <input
                name="fullName"
                type="text"
                placeholder="Full Name"
                value={formInput.fullName}
                onChange={(e) => { handleInput(e.target.name, e.target.value) }}
                className="px-4 py-2 rounded bg-card/90 text-foreground font-medium focus:outline-none focus:ring-2 focus:ring-white"
              />
              <p className="min-h-[20px] text-red-600 text-sm font-medium px-2">{formError.fullName}</p>
            </div>

            <div className="flex flex-col gap-1">
              <input
                name="email"
                type="email"
                placeholder="Email"
                value={formInput.email}
                onChange={(e) => { handleInput(e.target.name, e.target.value) }}
                className="px-4 py-2 rounded bg-card/90 text-foreground font-medium focus:outline-none focus:ring-2 focus:ring-white"
              />
              <p className="min-h-[20px] text-red-600 text-sm font-medium px-2">{formError.email}</p>
            </div>

            <div className="flex flex-col gap-1">
              <input
                name="phoneNo"
                type="tel"
                placeholder="Phone No."
                value={formInput.phoneNo}
                onChange={(e) => { handleInput(e.target.name, e.target.value) }}
                className="px-4 py-2 rounded bg-card/90 text-foreground font-medium focus:outline-none focus:ring-2 focus:ring-white"
              />
              <p className="min-h-[20px] text-red-600 text-sm font-medium px-2">{formError.phoneNo}</p>
            </div>

            <div className="flex flex-col gap-1">
              <select
                name="gender"
                className="px-4 py-2 rounded bg-card/90 text-foreground font-medium focus:outline-none focus:ring-2 focus:ring-white"
                value={formInput.gender}
                onChange={(e) => { handleInput(e.target.name, e.target.value) }}
              >
                <option value="">Select gender</option>
                <option value={"Male"}>Male</option>
                <option value={"Female"}>Female</option>
                <option value={"Other"}>Other</option>
              </select>
              <p className="min-h-[20px] text-red-600 text-sm font-medium px-2">{formError.gender}</p>
            </div>

            <div className="flex flex-col gap-1">
              <input
                name="dob"
                type="date"
                placeholder="DOB"
                value={formInput.dob}
                onChange={(e) => { handleInput(e.target.name, e.target.value) }}
                className="px-4 py-2 rounded bg-card/90 text-foreground font-medium focus:outline-none focus:ring-2 focus:ring-white"
              />
              <p className="min-h-[20px] text-red-600 text-sm font-medium px-2">{formError.dob}</p>
            </div>

            <div className="flex flex-col gap-1">
              <input
                name="address"
                placeholder="Address"
                value={formInput.address}
                onChange={(e) => { handleInput(e.target.name, e.target.value) }}
                className="px-4 py-2 rounded bg-card/90 text-foreground font-medium focus:outline-none focus:ring-2 focus:ring-white"
              />
              <p className="min-h-[20px] text-red-600 text-sm font-medium px-2">{formError.address}</p>
            </div>

            <div className="flex flex-col gap-1">
              <input
                name="password"
                type="password"
                placeholder="Create Password"
                value={formInput.password}
                onChange={(e) => { handleInput(e.target.name, e.target.value) }}
                className="px-4 py-2 rounded bg-card/90 text-foreground font-medium focus:outline-none focus:ring-2 focus:ring-white"
              />
              <input
                name="confirmPassword"
                type="password"
                placeholder="Confirm Password"
                value={formInput.confirmPassword}
                onChange={(e) => { handleInput(e.target.name, e.target.value) }}
                className="px-4 py-2 rounded bg-card/90 text-foreground font-medium focus:outline-none focus:ring-2 focus:ring-white"
              />
              <p className="min-h-[20px] text-red-600 text-sm font-medium px-2">{formError.password}</p>
            </div>

            <button
              type="submit"
              disabled={sendingOtp}
              className="mt-2 bg-black text-primary-foreground rounded py-2 font-semibold hover:bg-foreground active:scale-95 transition-all disabled:opacity-60"
            >
              {sendingOtp ? "Sending OTP..." : "Register"}
            </button>
          </form>

          <div className="text-center mt-5">
            <Link to="/login" className="text-sm text-gray-300 hover:text-primary-foreground transition">
              Already have an account? Login
            </Link>
          </div>

        </div>
      </div>

      {/* OTP Modal */}
      {showOtpModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm">
          <div className="w-[340px] bg-white/10 border border-white/20 rounded-2xl px-8 py-10 shadow-2xl backdrop-blur-xl text-white flex flex-col gap-5">
            <h2 className="text-2xl font-bold text-center">Verify Your Email</h2>
            <p className="text-sm text-center text-white/80">
              We sent a 6-digit OTP to <span className="font-semibold">{formInput.email}</span>.
              <br />It expires in <span className="font-semibold">5 minutes</span>.
            </p>

            <input
              type="text"
              maxLength={6}
              placeholder="Enter OTP"
              value={otp}
              onChange={(e) => setOtp(e.target.value.replace(/\D/, ""))}
              className="text-center tracking-[0.4em] text-xl px-4 py-3 rounded bg-white/10 border border-white/30 text-white font-bold placeholder:tracking-normal placeholder:text-white/50 focus:outline-none focus:ring-2 focus:ring-white"
            />

            {otpError && (
              <p className="text-red-400 text-sm text-center font-medium">{otpError}</p>
            )}
            {otpSuccess && (
              <p className="text-green-400 text-sm text-center font-medium">{otpSuccess}</p>
            )}

            <button
              onClick={handleVerifyOtp}
              disabled={otpLoading}
              className="bg-black text-white rounded py-2 font-semibold hover:bg-gray-800 active:scale-95 transition-all disabled:opacity-60"
            >
              {otpLoading ? "Verifying..." : "Verify & Create Account"}
            </button>

            <div className="flex justify-between text-sm text-white/70">
              <button
                onClick={handleResendOtp}
                disabled={sendingOtp}
                className="hover:text-white transition underline underline-offset-2"
              >
                {sendingOtp ? "Sending..." : "Resend OTP"}
              </button>
              <button
                onClick={() => { setShowOtpModal(false); setOtpError(""); setOtpSuccess(""); }}
                className="hover:text-white transition"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Regis;