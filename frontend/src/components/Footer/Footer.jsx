import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

const Footer = () => {
  const navigate = useNavigate();
  const [amount, setAmount] = useState("");

  const handleDonate = () => {
    navigate("/ExtDon");
  };

  return (
    <footer className="w-full bg-background border-t border-line text-foreground font-sans">
      <div className="flex flex-col md:flex-row">
        
        {/* Left Section: Quick Give Widget */}
        <div className="flex-1 p-8 md:p-16 border-b md:border-b-0 md:border-r border-line">
          <h2 className="font-serif text-3xl font-bold mb-6">Quick Give</h2>
          <p className="text-sm text-foreground/70 mb-8 max-w-sm">
            Support our mission instantly. Choose an amount or enter your own.
          </p>
          
          <div className="flex flex-wrap gap-4 mb-6">
            {[50, 100, 250].map((amt) => (
              <button
                key={amt}
                onClick={() => setAmount(amt)}
                className={`py-3 px-6 text-[10px] md:text-[11px] font-bold tracking-widest border border-line transition-colors ${
                  amount === amt ? "bg-foreground text-background" : "bg-background text-foreground hover:bg-line"
                }`}
              >
                ${amt}
              </button>
            ))}
          </div>
          
          <div className="flex flex-col sm:flex-row gap-4 max-w-md">
            <input
              type="number"
              placeholder="Custom Amount"
              value={amount}
              onChange={(e) => setAmount(Number(e.target.value))}
              className="flex-1 bg-transparent border border-line px-4 py-3 text-sm focus:outline-none focus:border-foreground transition-colors"
            />
            <button
              onClick={handleDonate}
              className="bg-accent text-background border border-accent px-8 py-3 text-[10px] md:text-[11px] font-bold uppercase tracking-widest transition-colors hover:bg-foreground hover:border-foreground shrink-0"
            >
              Donate
            </button>
          </div>
        </div>

        {/* Right Section: Links */}
        <div className="flex-1 p-8 md:p-16 grid grid-cols-2 md:grid-cols-3 gap-8">
          <div>
            <h3 className="font-serif text-lg font-bold mb-6">Explore</h3>
            <div className="flex flex-col gap-4 text-sm text-foreground/70">
              <Link to="/" className="hover:text-accent transition-colors">Home</Link>
              <Link to="/about" className="hover:text-accent transition-colors">About Us</Link>
              <Link to="/announcements" className="hover:text-accent transition-colors">Events</Link>
              <Link to="/contact" className="hover:text-accent transition-colors">Stories</Link>
            </div>
          </div>
          <div>
            <h3 className="font-serif text-lg font-bold mb-6">Ministries</h3>
            <div className="flex flex-col gap-4 text-sm text-foreground/70">
              <Link to="/youth" className="hover:text-accent transition-colors">Youth</Link>
              <Link to="/outreach" className="hover:text-accent transition-colors">Outreach</Link>
              <Link to="/global" className="hover:text-accent transition-colors">Global Missions</Link>
              <Link to="/worship" className="hover:text-accent transition-colors">Worship</Link>
            </div>
          </div>
          <div className="col-span-2 md:col-span-1">
            <h3 className="font-serif text-lg font-bold mb-6">Resources</h3>
            <div className="flex flex-col gap-4 text-sm text-foreground/70">
              <Link to="/TermsCon" className="hover:text-accent transition-colors">Terms & Conditions</Link>
              <Link to="/privacy" className="hover:text-accent transition-colors">Privacy Policy</Link>
              <Link to="/support" className="hover:text-accent transition-colors">Support</Link>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-line py-6 px-4 md:px-16 flex flex-col sm:flex-row items-center justify-between text-[10px] sm:text-[11px] font-bold uppercase tracking-widest text-foreground/50">
        <span>© {new Date().getFullYear()} Church of God. All Rights Reserved.</span>
        <div className="flex gap-4 mt-4 sm:mt-0">
          <span>8980793485</span>
          <span>aaronsinai2005@gmail.com</span>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
