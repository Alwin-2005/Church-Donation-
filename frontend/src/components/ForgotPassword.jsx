import React, { useState } from "react";
import Login from "../assets/Login.jpg";
import COG from "../assets/COG.png";
import { useNavigate, Link } from "react-router-dom";
import api from "../api/axios";

const ForgotPassword = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    setError("");

    try {
      await api.post("/forgot-password", { email }, { withCredentials: true });
      setMessage("Password reset link sent to your email!");
    } catch (err) {
      console.log(err);
      setError("Failed to send reset link. Please check your email.");
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

      {/* Forgot Password Card */}
      <div className="relative z-10 h-full flex items-center justify-center">
        <div className="w-[380px] backdrop-blur-xl bg-white/10 border border-white/20 rounded-2xl px-10 py-12 shadow-2xl">

          <h1 className="text-3xl font-bold text-white mb-6 text-center">
            Forgot Password
          </h1>

          <p className="text-white/80 text-center mb-4">
            Enter your email to receive a password reset link
          </p>

          <form onSubmit={handleSubmit} className="flex flex-col gap-5">
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="px-4 py-2 rounded bg-white/90 text-black font-medium focus:outline-none focus:ring-2 focus:ring-white"
              required
            />

            {message && <p className="px-2 text-green-400 font-medium">{message}</p>}
            {error && <p className="px-2 text-red-600 font-medium">{error}</p>}

            <button
              type="submit"
              className="mt-2 bg-black text-white rounded py-2 font-semibold hover:bg-gray-900 active:scale-95 transition-all"
            >
              Send Reset Link
            </button>
          </form>

          {/* Extra Links */}
          <div className="text-center mt-5">
            <Link
              to="/login"
              className="text-sm text-gray-300 hover:text-white transition"
            >
              Back to Login
            </Link>
            <br />
            <Link
              to="/register"
              className="text-sm text-gray-300 hover:text-white transition"
            >
              Register Now
            </Link>
          </div>

        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;
