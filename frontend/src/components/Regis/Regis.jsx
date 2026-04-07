import React, { useState } from "react";
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
    } else if (!/^\d{10}$/.test(formInput.phoneNo)) {
      inputError.phoneNo = "Phone number must be a valid 10-digit number";
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
      inputError.confirmPassword = "Confirm password is required";
    } else if (formInput.password !== formInput.confirmPassword) {
      inputError.confirmPassword = "Passwords do not match";
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
      setOtpSuccess("Identity confirmed. Redirecting to sign in...");
      setTimeout(() => {
        navigate("/login");
      }, 2000);
    } catch (err) {
      console.log("OTP verification error:", err);
      const msg = err.response?.data?.message || "Invalid code. Please try again.";
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
      setOtpSuccess("A new confirmation code has been sent.");
    }
  };

  return (
    <div className="min-h-screen w-full bg-background flex flex-col items-center justify-center p-6 py-20">
      {/* Branding */}
      <div className="mb-12 animate-fadeIn">
        <Link to="/" className="flex flex-col items-center gap-4 group">
          <img
            src={COG}
            className="h-14 w-auto grayscale group-hover:grayscale-0 transition-all duration-700"
            alt="Logo"
          />
          <span className="font-serif text-xl font-bold tracking-tight text-foreground transition-colors uppercase text-center">Church of God</span>
        </Link>
      </div>

      {/* Registration Card */}
      <div className="w-full max-w-[550px] bg-card border border-border p-10 md:p-16 animate-scaleIn">
        <div className="mb-12 text-center">
          <span className="text-[10px] font-black uppercase tracking-[0.2em] text-accent mb-4 block">New Identity</span>
          <h1 className="text-5xl md:text-6xl font-serif font-bold text-foreground tracking-tight">
            Register
          </h1>
        </div>

        <form className="flex flex-col gap-8" onSubmit={handleFormValidation}>
          {formError.backend && (
            <div className="text-red-600 text-[10px] font-bold uppercase tracking-widest text-center bg-red-50/50 py-3 border border-red-100 animate-fadeIn">
              {formError.backend}
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="flex flex-col gap-2">
              <label className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground ml-1">Full Name</label>
              <input
                name="fullName"
                type="text"
                placeholder="Full Name"
                value={formInput.fullName}
                onChange={(e) => handleInput(e.target.name, e.target.value)}
                className="px-4 py-4 border border-border bg-background text-foreground font-sans focus:outline-none focus:border-accent transition-colors placeholder:text-muted-foreground/20 rounded-none shadow-sm"
              />
              <p className="min-h-[14px] text-accent text-[9px] font-black uppercase tracking-widest px-1">{formError.fullName}</p>
            </div>

            <div className="flex flex-col gap-2">
              <label className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground ml-1">Email Address</label>
              <input
                name="email"
                type="email"
                placeholder="email@gmail.com"
                value={formInput.email}
                onChange={(e) => handleInput(e.target.name, e.target.value)}
                className="px-4 py-4 border border-border bg-background text-foreground font-sans focus:outline-none focus:border-accent transition-colors placeholder:text-muted-foreground/20 rounded-none shadow-sm"
              />
              <p className="min-h-[14px] text-accent text-[9px] font-black uppercase tracking-widest px-1">{formError.email}</p>
            </div>

            <div className="flex flex-col gap-2">
              <label className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground ml-1">Phone Number</label>
              <input
                name="phoneNo"
                type="tel"
                placeholder="10-digit number"
                value={formInput.phoneNo}
                onChange={(e) => handleInput(e.target.name, e.target.value)}
                className="px-4 py-4 border border-border bg-background text-foreground font-sans focus:outline-none focus:border-accent transition-colors placeholder:text-muted-foreground/20 rounded-none shadow-sm"
              />
              <p className="min-h-[14px] text-accent text-[9px] font-black uppercase tracking-widest px-1">{formError.phoneNo}</p>
            </div>

            <div className="flex flex-col gap-2">
              <label className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground ml-1">Gender</label>
              <select
                name="gender"
                className="px-4 py-4 border border-border bg-background text-foreground font-sans focus:outline-none focus:border-accent transition-colors appearance-none rounded-none shadow-sm"
                value={formInput.gender}
                onChange={(e) => handleInput(e.target.name, e.target.value)}
              >
                <option value="">Select Gender</option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Other">Other</option>
              </select>
              <p className="min-h-[14px] text-accent text-[9px] font-black uppercase tracking-widest px-1">{formError.gender}</p>
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground ml-1">Date of Birth</label>
            <input
              name="dob"
              type="date"
              value={formInput.dob}
              onChange={(e) => handleInput(e.target.name, e.target.value)}
              className="px-4 py-4 border border-border bg-background text-foreground font-sans focus:outline-none focus:border-accent transition-colors rounded-none shadow-sm"
            />
            <p className="min-h-[14px] text-accent text-[9px] font-black uppercase tracking-widest px-1">{formError.dob}</p>
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground ml-1">Home Address</label>
            <textarea
              name="address"
              placeholder="Your complete address..."
              rows={3}
              value={formInput.address}
              onChange={(e) => handleInput(e.target.name, e.target.value)}
              className="px-4 py-4 border border-border bg-background text-foreground font-sans focus:outline-none focus:border-accent transition-colors placeholder:text-muted-foreground/20 resize-none rounded-none shadow-sm"
            />
            <p className="min-h-[14px] text-accent text-[9px] font-black uppercase tracking-widest px-1">{formError.address}</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="flex flex-col gap-2">
              <label className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground ml-1">Password</label>
              <input
                name="password"
                type="password"
                placeholder="••••••••"
                value={formInput.password}
                onChange={(e) => handleInput(e.target.name, e.target.value)}
                className="px-4 py-4 border border-border bg-background text-foreground font-sans focus:outline-none focus:border-accent transition-colors placeholder:text-muted-foreground/20 rounded-none shadow-sm"
              />
            </div>
            <div className="flex flex-col gap-2">
              <label className="text-[10px] font-bold uppercase tracking-widest text-[#1C1C1C]/40 ml-1">Confirm</label>
              <input
                name="confirmPassword"
                type="password"
                placeholder="••••••••"
                value={formInput.confirmPassword}
                onChange={(e) => handleInput(e.target.name, e.target.value)}
                className="px-4 py-3.5 border border-line bg-background text-[#1C1C1C] font-sans focus:outline-none focus:border-[#C06C4C] transition-colors placeholder:text-[#1C1C1C]/20"
              />
            </div>
          </div>
          <p className="min-h-[14px] text-red-600 text-[9px] font-bold uppercase tracking-wider px-1 text-center">{formError.password || formError.confirmPassword}</p>

          <button
            type="submit"
            disabled={sendingOtp}
            className="bg-accent hover:bg-foreground text-background py-5 text-xs font-black uppercase tracking-[0.2em] transition-all active:scale-[0.98] disabled:opacity-50 shadow-lg shadow-accent/10 border-none"
          >
            {sendingOtp ? "Sending Confirmation Code..." : "Register"}
          </button>
        </form>

        <div className="mt-12 pt-10 border-t border-border text-center">
          <Link to="/login" className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground hover:text-accent transition">
            Already registered? Sign In
          </Link>
        </div>
      </div>

      {/* OTP Modal */}
      {showOtpModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <div className="w-full max-w-[450px] bg-card border border-border p-10 md:p-16 animate-scaleIn text-center rounded-none shadow-2xl">
            <h2 className="font-serif text-3xl font-bold text-[#1C1C1C] mb-6 tracking-tight">Enter OTP</h2>
            <p className="text-[11px] font-sans text-[#1C1C1C]/60 mb-10 leading-relaxed uppercase tracking-wider">
              We've sent a code to <span className="text-[#C06C4C] font-bold">{formInput.email}</span>.
              Enter it below to finalize your profile.
            </p>

            <input
              type="text"
              maxLength={6}
              placeholder="000000"
              value={otp}
              onChange={(e) => setOtp(e.target.value.replace(/\D/, ""))}
              className="w-full text-center tracking-[0.5em] text-3xl px-4 py-5 border border-line bg-background text-[#1C1C1C] font-serif font-bold placeholder:tracking-normal placeholder:text-[#1C1C1C]/10 focus:outline-none focus:border-[#C06C4C] transition-colors mb-4"
            />

            {otpError && (
              <p className="text-red-600 text-[10px] font-bold uppercase tracking-widest mb-6 animate-fadeIn">{otpError}</p>
            )}
            {otpSuccess && (
              <p className="text-emerald-600 text-[10px] font-bold uppercase tracking-widest mb-6 animate-fadeIn">{otpSuccess}</p>
            )}

            <button
              onClick={handleVerifyOtp}
              disabled={otpLoading}
              className="w-full bg-[#C06C4C] hover:bg-[#1C1C1C] text-white py-4 text-[11px] font-bold uppercase tracking-widest transition-all mb-8 disabled:opacity-50"
            >
              {otpLoading ? "Confirming..." : "Submit"}
            </button>

            <div className="flex flex-col gap-4 pt-8 border-t border-line">
              <button
                onClick={handleResendOtp}
                disabled={sendingOtp}
                className="text-[9px] font-bold uppercase tracking-widest text-[#1C1C1C]/40 hover:text-[#C06C4C] transition underline"
              >
                {sendingOtp ? "Resending..." : "Resend Confirmation Code"}
              </button>
              <button
                onClick={() => { setShowOtpModal(false); setOtpError(""); setOtpSuccess(""); }}
                className="text-[9px] font-bold uppercase tracking-widest text-[#1C1C1C]/40 hover:text-red-600 transition"
              >
                Cancel Registration
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Footer Note */}
      <p className="mt-12 text-[9px] font-bold uppercase tracking-[0.2em] text-[#1C1C1C]/20 text-center pb-12">
        &copy; {new Date().getFullYear()} Church of God Full Gospel In India
      </p>
    </div>
  );
};

export default Regis;