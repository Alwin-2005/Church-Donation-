import React, { useState } from "react";
import COG from "../../assets/COG.png";
import { useNavigate, useParams, Link } from "react-router-dom";
import api from "../../api/axios";

const ResetPass = () => {
  const navigate = useNavigate();
  const { token } = useParams();
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleReset = async (e) => {
    e.preventDefault();
    setMessage("");
    setError("");

    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    setLoading(true);

    try {
      await api.post(`/reset-password/${token}`, { password }, { withCredentials: true });
      setMessage("Your access has been restored. Redirecting to sign in...");
      setTimeout(() => {
        navigate("/login");
      }, 3000);
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.msg || "The link may have expired or is invalid.");
    } finally {
      setLoading(false);
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

      {/* Reset Password Card */}
      <div className="w-full max-w-[450px] bg-card border border-border p-10 md:p-16 animate-scaleIn">
        <div className="mb-12 text-center">
          <span className="text-[10px] font-black uppercase tracking-[0.2em] text-accent mb-4 block">Security Update</span>
          <h1 className="text-5xl md:text-6xl font-serif font-bold text-foreground tracking-tight">
            Reset Password
          </h1>
        </div>

        <p className="text-[11px] font-sans text-muted-foreground text-center mb-10 leading-relaxed uppercase tracking-wider">
          Create a secure new password for your profile.
        </p>

        <form onSubmit={handleReset} className="flex flex-col gap-8">
          <div className="flex flex-col gap-2">
            <label className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground ml-1">New Password</label>
            <input
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="px-4 py-4 border border-border bg-background text-foreground font-sans focus:outline-none focus:border-accent transition-colors placeholder:text-muted-foreground/20 rounded-none shadow-sm"
              required
            />
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground ml-1">Confirm</label>
            <input
              type="password"
              placeholder="••••••••"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="px-4 py-4 border border-border bg-background text-foreground font-sans focus:outline-none focus:border-accent transition-colors placeholder:text-muted-foreground/20 rounded-none shadow-sm"
              required
            />
          </div>

          {message && (
            <div className="text-emerald-600 text-[10px] font-bold uppercase tracking-widest text-center bg-emerald-50/50 py-3 border border-emerald-100 animate-fadeIn">
              {message}
            </div>
          )}
          {error && (
            <div className="text-red-600 text-[10px] font-bold uppercase tracking-widest text-center bg-red-50/50 py-3 border border-red-100 animate-fadeIn">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="bg-accent hover:bg-foreground text-background border-none py-5 text-xs font-black uppercase tracking-[0.2em] transition-all active:scale-[0.98] disabled:opacity-50 shadow-lg shadow-accent/10"
          >
            {loading ? "Updating Identity..." : "Update Identity"}
          </button>
        </form>

        <div className="mt-12 pt-10 border-t border-border flex flex-col gap-6 text-center">
          <Link
            to="/login"
            className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground hover:text-accent transition"
          >
            Return to Sign In
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

export default ResetPass;
