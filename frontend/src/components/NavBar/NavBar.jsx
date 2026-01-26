import React, { useEffect, useState } from "react";
import COG from "../../assets/COG.png";
import { Link, useNavigate } from "react-router-dom";
import Cookies from "js-cookie";
import { UserCircle } from "lucide-react";
import { getUserFromToken } from "../../../../Backend/services/getRole";

const Navbar = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [showMenu, setShowMenu] = useState(false);
  const [showDonate, setShowDonate] = useState(false);

  useEffect(() => {
    const decodedUser = getUserFromToken();
    setUser(decodedUser);
  }, []);

  const role = user?.role;

  const handleLogout = () => {
    Cookies.remove("token");
    setUser(null);
    navigate("/");
  };

  return (
    <div className="flex items-center py-6 px-4 md:px-16 font-sans bg-black text-white fixed top-0 left-0 w-full z-50">
      {/* Logo */}
      <img src={COG} className="h-10 w-auto" alt="COG" />
      <h1 className="ml-2 text-lg font-semibold">Church of God</h1>

      {/* NAV LINKS */}
      <div className="ml-auto flex gap-10 items-center text-base px-4">
        <Link to="/home" className="hover:scale-110 transition">
          HOME
        </Link>

        {/* ================= ADMIN NAV ================= */}
        {role === "admin" && (
          <>
            {[
              ["Dashboard", "/admin/dashboard"],
              ["Users", "/admin/users"],
              ["Donation Campaigns", "/admin/campaigns"],
              ["Donations", "/admin/donations"],
              ["Products", "/admin/products"],
              ["Orders", "/admin/orders"],
              ["Payments", "/admin/payments"],
              ["Events", "/admin/events"],
            ].map(([label, path]) => (
              <Link
                key={path}
                to={path}
                className="hover:scale-110 transition"
              >
                {label}
              </Link>
            ))}
          </>
        )}

        {/* ================= DONATE DROPDOWN (styled like first file) ================= */}
        {(role === "churchMember" || role === "externalMember") && (
          <div className="relative">
            <button
              onClick={() => setShowDonate(!showDonate)}
              className="hover:scale-110 transition"
            >
              DONATE
            </button>

            {showDonate && (
              <div className="absolute right-0 mt-2 w-56 bg-white text-black rounded shadow-lg">
                <button
                  onClick={() => navigate("/ExtDon")}
                  className="block w-full text-left px-4 py-2 hover:bg-gray-100"
                >
                  Donate for a Cause
                </button>

                {role === "churchMember" && (
                  <button
                    onClick={() => navigate("/IntDon")}
                    className="block w-full text-left px-4 py-2 hover:bg-gray-100"
                  >
                    Donate for Church
                  </button>
                )}
              </div>
            )}
          </div>
        )}

        {/* ================= COMMON LINKS ================= */}
        {(role === "churchMember" || role === "externalMember") && (
          <Link to="/shop" className="hover:scale-110 transition">
            SHOP
          </Link>
        )}

        {role === "churchMember" && (
          <Link to="/events" className="hover:scale-110 transition">
            EVENTS
          </Link>
        )}

        {/* ================= PROFILE DROPDOWN ================= */}
        <div className="relative">
          <button
            onClick={() => setShowMenu(!showMenu)}
            className="hover:scale-110 transition"
          >
            <UserCircle size={32} />
          </button>

          {showMenu && (
            <div className="absolute right-0 mt-2 w-44 bg-white text-black rounded shadow-lg">
              {!user ? (
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

                  {role === "admin" && (
                    <button
                      onClick={() => navigate("/admin/dashboard")}
                      className="block w-full text-left px-4 py-2 hover:bg-gray-100"
                    >
                      Admin Dashboard
                    </button>
                  )}

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
