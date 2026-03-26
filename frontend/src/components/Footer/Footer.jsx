import React from "react";
import COG from "../../assets/COG.png";
import {Link } from "react-router-dom";


const Footer = () => {
  return (
    <footer className="bg-black text-gray-300">
      
      {/* Main Footer Content */}
      <div className="max-w-7xl mx-auto px-8 py-12 grid grid-cols-1 md:grid-cols-3 gap-10">

        {/* Logo & Brand */}
        <div className="flex flex-col gap-4">
          <img src={COG} alt="COG Logo" className="h-16 w-16" />
          <p className="text-sm text-gray-400 leading-relaxed">
            Built with faith, purpose, and integrity.
            Serving people through technology.
          </p>
        </div>

        {/* Contact Section */}
        <div>
          <h2 className="text-primary-foreground text-lg font-semibold mb-4">
            Contact Us
          </h2>
          <p className="text-sm mb-2">
            📞 <span className="ml-2">8980793485</span>
          </p>
          <p className="text-sm">
            ✉️ <span className="ml-2">aaronsinai2005@gmail.com</span>
          </p>
          <p className="text-sm mt-2 flex items-start">
            📍 <span className="ml-2">Church of God Full Gospel In India, Ahmedabad, Christian Society, 29B, opp. Vinay Vihar, Behrampura, Ahmedabad, Gujarat 380022</span>
          </p>
        </div>

        {/* Legal / Links */}
        <div>
          <h2 className="text-primary-foreground text-lg font-semibold mb-4">
            Legal
          </h2>
          <Link to="/TermsCon" className="text-sm hover:text-primary-foreground cursor-pointer transition">
            Terms & Conditions
          </Link>
        </div>

      </div>

      {/* Bottom Bar */}
      <div className="border-t border-gray-700 py-4 text-center text-sm text-muted-foreground">
        © {new Date().getFullYear()} All rights reserved.
      </div>

    </footer>
  );
};

export default Footer;
