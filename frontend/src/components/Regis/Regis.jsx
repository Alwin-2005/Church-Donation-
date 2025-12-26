import React from "react";
import Login from "../../assets/Login.jpg";
import COG from "../../assets/COG.png";
import { useNavigate, Link } from "react-router-dom";

const Regis = () => {
  const navigate = useNavigate();

  const handleLogin = (e) => {
    e.preventDefault();
    navigate("/home");
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

      {/* Reg Card */}
      <div className="relative z-10 h-full flex items-center justify-center">
        <div className="w-[380px] backdrop-blur-xl bg-white/10 border border-white/20 rounded-2xl px-10 py-12 shadow-2xl">

          <h1 className="text-3xl font-bold text-white mb-6 text-center">
            Registration
          </h1>

          <form onSubmit={handleLogin} className="flex flex-col gap-5">

          <input
              type="text"
              placeholder="Full Name"
              className="px-4 py-2 rounded bg-white/90 text-black font-medium focus:outline-none focus:ring-2 focus:ring-white"
            />

            <input
              type="email"
              placeholder="Email"
              className="px-4 py-2 rounded bg-white/90 text-black font-medium focus:outline-none focus:ring-2 focus:ring-white"
            />

            <input
              type="tel"
              placeholder="Email"
              className="px-4 py-2 rounded bg-white/90 text-black font-medium focus:outline-none focus:ring-2 focus:ring-white"
            />

            <input
              type="gender"
              placeholder="Gender"
              className="px-4 py-2 rounded bg-white/90 text-black font-medium focus:outline-none focus:ring-2 focus:ring-white"
            />

            <input
              type="date"
              placeholder="DOB"
              className="px-4 py-2 rounded bg-white/90 text-black font-medium focus:outline-none focus:ring-2 focus:ring-white"
            />

  

            <input
              type="password"
              placeholder="Password"
              className="px-4 py-2 rounded bg-white/90 text-black font-medium focus:outline-none focus:ring-2 focus:ring-white"
            />

            <button
              type="submit"
              className="mt-2 bg-black text-white rounded py-2 font-semibold hover:bg-gray-900 active:scale-95 transition-all"
            >
              Reg
            </button>
          </form>

          

        </div>
      </div>
    </div>
  );
};

export default Regis;
