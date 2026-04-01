import React, { useState, useEffect } from "react";
import COG from "../../assets/COG.png";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { UserCircle } from "lucide-react";
import { useAuth } from "../../context/AuthContext";

const Navbar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, logout } = useAuth();

  const role = user ? user.role : "externalMember";

  const [showMenu, setShowMenu] = useState(false);
  const [showDonate, setShowDonate] = useState(false);

  useEffect(() => {
    setShowMenu(false);
    setShowDonate(false);
  }, [location.pathname]);

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <nav className="flex items-center justify-between py-6 px-4 md:px-16 bg-background text-foreground fixed top-0 left-0 w-full z-50 border-b border-line">
      {/* Logo */}
      <div className="flex items-center gap-3">
        <Link to="/">
          <img src={COG} alt="COG Logo" className="w-10 h-10 object-contain" />
        </Link>
        <Link to="/" className="font-serif text-2xl md:text-3xl font-bold tracking-tight text-foreground">
          Church of God
        </Link>
      </div>

      {/* NAV LINKS */}
      <div className="hidden md:flex gap-8 items-center text-[10px] sm:text-[11px] font-bold uppercase tracking-widest font-sans">
        {role !== "admin" && (
          <Link to="/" className="text-foreground hover:text-accent transition-colors">
            HOME
          </Link>
        )}

        {/* ================= ADMIN NAV ================= */}
        {role === "admin" && (
          <div className="flex gap-6">
            {[
              ["Dashboard", "/admin/dashboard"],
              ["Users", "/admin/users"],
              ["Donation Campaigns", "/admin/campaigns"],
              ["Donations", "/admin/donations"],
              ["Merchandise", "/admin/products"],
              ["Orders", "/admin/orders"],
              ["Payments", "/admin/payments"],
              ["Announcements", "/admin/announcements"],
            ].map(([label, path]) => (
              <Link key={path} to={path} className="text-foreground hover:text-accent transition-colors">
                {label}
              </Link>
            ))}
          </div>
        )}

        {/* ================= COMMON LINKS ================= */}
        {(role === "churchMember" || role === "externalMember") && (
          <Link to="/shop" className="text-foreground hover:text-accent transition-colors">
            SHOP
          </Link>
        )}

        {role === "churchMember" && (
          <Link to="/announcements" className="text-foreground hover:text-accent transition-colors">
            ANNOUNCEMENTS
          </Link>
        )}
      </div>

      {/* RIGHT ACTION BUTTONS */}
      <div className="flex items-center gap-6">
        {/* ================= DONATE DROPDOWN ================= */}
        {(role === "churchMember" || role === "externalMember") && (
          <div className="relative">
            <button
              onClick={() => setShowDonate(!showDonate)}
              className="bg-accent text-background border border-accent px-6 py-2.5 text-[11px] font-bold uppercase tracking-widest font-sans transition-colors hover:bg-foreground hover:border-foreground"
            >
              Donate Now
            </button>

            {showDonate && (
              <div className="absolute right-0 mt-2 w-56 border border-line bg-background z-50 shadow-md">
                <button
                  onClick={() => navigate("/ExtDon")}
                  className="block w-full text-left px-6 py-3 text-[10px] font-bold uppercase tracking-widest font-sans hover:bg-line transition-colors"
                >
                  Donate for a Cause
                </button>

                {role === "churchMember" && (
                  <button
                    onClick={() => navigate("/IntDon")}
                    className="block w-full text-left px-6 py-3 text-[10px] font-bold uppercase tracking-widest font-sans hover:bg-line transition-colors border-t border-line"
                  >
                    Donate for Church
                  </button>
                )}
              </div>
            )}
          </div>
        )}

        {/* ================= PROFILE DROPDOWN ================= */}
        <div className="relative">
          <button
            onClick={() => setShowMenu(!showMenu)}
            className="text-foreground hover:text-accent transition-colors flex items-center justify-center"
          >
            <UserCircle size={24} strokeWidth={1.5} />
          </button>

          {showMenu && (
            <div className="absolute right-0 mt-2 w-48 border border-line bg-background z-50 shadow-md">
              {!user ? (
                <>
                  <button
                    onClick={() => navigate("/login")}
                    className="block w-full text-left px-6 py-3 text-[10px] font-bold uppercase tracking-widest font-sans hover:bg-line transition-colors"
                  >
                    Login
                  </button>

                  <button
                    onClick={() => navigate("/register")}
                    className="block w-full text-left px-6 py-3 text-[10px] font-bold uppercase tracking-widest font-sans hover:bg-line transition-colors border-t border-line"
                  >
                    Register
                  </button>
                </>
              ) : (
                <>
                  <button
                    onClick={() => navigate("/profile")}
                    className="block w-full text-left px-6 py-3 text-[10px] font-bold uppercase tracking-widest font-sans hover:bg-line transition-colors"
                  >
                    Profile
                  </button>

                  <button
                    onClick={handleLogout}
                    className="block w-full text-left px-6 py-3 text-[10px] font-bold uppercase tracking-widest font-sans text-red-600 hover:bg-line transition-colors border-t border-line"
                  >
                    Logout
                  </button>
                </>
              )}
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
