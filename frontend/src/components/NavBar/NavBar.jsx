import React, { useEffect, useState } from "react";
import COG from "../../assets/COG.png";
import { Link, useNavigate } from "react-router-dom";
import Cookies from "js-cookie";
import { UserCircle } from "lucide-react"; // optional icon library

const Navbar = () => {
  const navigate = useNavigate();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [showMenu, setShowMenu] = useState(false);

  // Check JWT token in cookies
  useEffect(() => {
    // const token = Cookies.get("token");
    const token = "asdd";
    setIsLoggedIn(!!token);
  }, []);

  const handleLogin = (e) => {
    const value = e.target.value;
    if (value) navigate(value);
  };

  const handleLogout = () => {
    Cookies.remove("token");
    setIsLoggedIn(false);
    navigate("/");
  };

  return (
    <div className="flex items-center py-6 px-4 md:px-16 font-sans bg-black text-white fixed top-0 left-0 w-full z-50">
      <img src={COG} className="h-10 w-auto" alt="COG" />
      <h1 className="ml-2 text-lg font-semibold">Church of God</h1>

      {/* Nav Links */}
      <div className="ml-auto flex gap-10 items-center text-base px-4">
        <Link to="/home" className="hover:scale-110 transition">
          HOME
        </Link>

        <select
          onChange={handleLogin}
          className="bg-black text-white rounded border border-white px-2"
        >
          <option value="">DONATE</option>
          <option value="/ExtDon">Donate for a Cause</option>
          <option value="/IntDon">Donate for a Church</option>
        </select>

        <Link to="/shop" className="hover:text-xl">SHOP</Link>
        <Link to="/events" className="hover:text-xl">EVENTS</Link>

        {/* Profile Section */}
        <div className="relative">
          <button
            onClick={() => setShowMenu(!showMenu)}
            className="hover:scale-110 transition"
          >
            <UserCircle size={32} />
          </button>

          {/* Dropdown */}
          {showMenu && (
            <div className="absolute right-0 mt-2 w-40 bg-white text-black rounded shadow-lg">
              {!isLoggedIn ? (
                <button
                  onClick={() => navigate("/")}
                  className="block w-full text-left px-4 py-2 hover:bg-gray-100"
                >
                  Login
                </button>
              ) : (
                <>
                  <button
                    onClick={() => navigate("/profile")}
                    className="block w-full text-left px-4 py-2 hover:bg-gray-100"
                  >
                    Profile
                  </button>

                  <button
                    onClick={() => navigate("/dashboard")}
                    className="block w-full text-left px-4 py-2 hover:bg-gray-100"
                  >
                    Dashboard
                  </button>

                  <button
                    onClick={handleLogout}
                    className="block w-full text-left px-4 py-2 text-red-600 hover:bg-gray-100"
                  >
                    Logout
                  </button>
                </>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Navbar;
