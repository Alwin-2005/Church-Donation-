import React from "react";
import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer className="w-full bg-background border-t border-line text-foreground font-sans">
      <div className="max-w-7xl mx-auto px-8 md:px-16 py-16 md:py-24">
        {/* Main Content Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-12 md:gap-16">
          {/* Mission Column */}
          <div className="lg:col-span-1">
            <h2 className="font-serif text-2xl font-bold mb-6">Church of God</h2>
            <p className="text-sm leading-relaxed text-foreground/60 italic">
              "Built with faith, purpose and integrity. Serving people through technology"
            </p>
          </div>

          {/* Explore Column */}
          <div>
            <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-muted-foreground mb-8">Explore</h3>
            <div className="flex flex-col gap-4 text-sm font-medium">
              <Link to="/" className="hover:text-accent transition-colors">Home</Link>
              <Link to="/about" className="hover:text-accent transition-colors">About Us</Link>
              <Link to="/shop" className="hover:text-accent transition-colors">Shop</Link>
            </div>
          </div>

          {/* Ministries/Resources Column */}
          <div>
            <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-muted-foreground mb-8">Ministries</h3>
            <div className="flex flex-col gap-4 text-sm font-medium">
              <Link to="/TermsCon" className="hover:text-accent transition-colors">Terms & Conditions</Link>
              <Link to="/privacy" className="hover:text-accent transition-colors">Privacy Policy</Link>
            </div>
          </div>

          {/* Contact Column */}
          <div>
            <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-muted-foreground mb-8">Contact Us</h3>
            <div className="flex flex-col gap-5 text-sm font-medium">
              <div className="space-y-1">
                <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/50">Phone</p>
                <p className="text-foreground hover:text-accent transition-colors cursor-default">8980793485</p>
              </div>
              <div className="space-y-1">
                <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/50">Email</p>
                <p className="text-foreground hover:text-accent transition-colors cursor-default lowercase tracking-tighter decoration-accent/30 underline underline-offset-4">aaronsinai2005@gmail.com</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-line py-8 px-8 md:px-16 flex flex-col sm:flex-row items-center justify-between text-[10px] font-black uppercase tracking-[0.2em] text-foreground/40 text-center sm:text-left">
        <span>© {new Date().getFullYear()} Church of God Full Gospel In India.</span>
        <span className="mt-4 sm:mt-0 opacity-50 font-serif normal-case italic font-medium">Sanctuary Platform v4.0</span>
      </div>
    </footer>
  );
};

export default Footer;
