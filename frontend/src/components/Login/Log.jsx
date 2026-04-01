import React, { useState } from "react";
import COG from "../../assets/COG.png";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import api from "../../api/axios";
import Cookies from "js-cookie";
import { getUserFromToken } from "../../utils/auth";

const Log = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loginError, setLoginError] = useState("");
  const { setUser } = useAuth();

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoginError("");

    try {
      const res = await api.post("/login", { email, password }, { withCredentials: true });
      const token = res.data.token;
      if (token) {
        Cookies.set("token", token, { expires: 1 });
      }
      const decodedUser = getUserFromToken();
      setUser(decodedUser);

      if (decodedUser?.role === "admin") {
        navigate("/admin/dashboard");
      } else {
        navigate("/");
      }
    }
    catch (err) {
      console.log(err);
      setLoginError("Invalid credentials. Please try again.");
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
          <span className="font-serif text-xl font-bold tracking-tight text-foreground transition-colors uppercase">Church of God</span>
        </Link>
      </div>

      {/* Login Card */}
      <div className="w-full max-w-[450px] bg-card border border-border p-10 md:p-16 animate-scaleIn">
        <div className="mb-12 text-center">
          <span className="text-[10px] font-black uppercase tracking-[0.2em] text-accent mb-4 block">Sanctuary Access</span>
          <h1 className="text-5xl md:text-6xl font-serif font-bold text-foreground tracking-tight">
            Sign In
          </h1>
        </div>

        <form onSubmit={handleLogin} className="flex flex-col gap-8">
          <div className="flex flex-col gap-2">
            <label className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground ml-1">Email Address</label>
            <input
              type="email"
              placeholder="email@gmail.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="px-4 py-4 border border-border bg-background text-foreground font-sans focus:outline-none focus:border-accent transition-colors placeholder:text-muted-foreground/20 rounded-none shadow-sm"
              required
            />
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground ml-1">Password</label>
            <input
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="px-4 py-4 border border-border bg-background text-foreground font-sans focus:outline-none focus:border-accent transition-colors placeholder:text-muted-foreground/20 rounded-none shadow-sm"
              required
            />
          </div>

          {loginError && (
            <div className="text-red-600 text-[10px] font-bold uppercase tracking-widest text-center bg-red-50/50 py-3 border border-red-100 animate-fadeIn">
              {loginError}
            </div>
          )}

          <button
            type="submit"
            className="bg-accent hover:bg-foreground text-background border-none py-5 text-xs font-black uppercase tracking-[0.2em] transition-all active:scale-[0.98] shadow-lg shadow-accent/10"
          >
            Login
          </button>
        </form>

        <div className="mt-12 pt-10 border-t border-border flex flex-col gap-6 text-center">
          <Link
            to="/register"
            className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground hover:text-accent transition"
          >
            Create an Account
          </Link>
          <Link
            to="/forgotpass"
            className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground hover:text-accent transition"
          >
            Forgot Password?
          </Link>
        </div>
      </div>

      {/* Footer Note */}
      <p className="mt-12 text-[9px] font-bold uppercase tracking-[0.2em] text-[#1C1C1C]/20 text-center">
        &copy; {new Date().getFullYear()} Church of God Full Gospel In India
      </p>
    </div>
  );
};

export default Log;
