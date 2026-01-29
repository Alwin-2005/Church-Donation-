import React, { useState } from "react";
import Login from "../../assets/Login.jpg";
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
            const res = await api.post(`/reset-password/${token}`, { password }, { withCredentials: true });
            setMessage("Password reset successfully! Redirecting to login...");
            setTimeout(() => {
                navigate("/login");
            }, 3000);
        } catch (err) {
            console.error(err);
            setError(err.response?.data?.msg || "Something went wrong. Please try again.");
        } finally {
            setLoading(false);
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

            {/* Reset Password Card */}
            <div className="relative z-10 h-full flex items-center justify-center">
                <div className="w-[380px] backdrop-blur-xl bg-white/10 border border-white/20 rounded-2xl px-10 py-12 shadow-2xl">

                    <h1 className="text-3xl font-bold text-white mb-6 text-center">
                        Reset Password
                    </h1>

                    <p className="text-white/80 text-center mb-4 text-sm">
                        Create a strong new password for your account.
                    </p>

                    <form onSubmit={handleReset} className="flex flex-col gap-5">
                        <input
                            type="password"
                            placeholder="New Password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="px-4 py-2 rounded bg-white/90 text-black font-medium focus:outline-none focus:ring-2 focus:ring-white"
                            required
                        />

                        <input
                            type="password"
                            placeholder="Confirm New Password"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            className="px-4 py-2 rounded bg-white/90 text-black font-medium focus:outline-none focus:ring-2 focus:ring-white"
                            required
                        />

                        {message && <p className="px-2 text-green-400 font-medium text-sm">{message}</p>}
                        {error && <p className="px-2 text-red-400 font-medium text-sm">{error}</p>}

                        <button
                            type="submit"
                            disabled={loading}
                            className="mt-2 bg-black text-white rounded py-2 font-semibold hover:bg-gray-900 active:scale-95 transition-all disabled:bg-gray-600"
                        >
                            {loading ? "Updating..." : "Update Password"}
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
                    </div>

                </div>
            </div>
        </div>
    );
};

export default ResetPass;
