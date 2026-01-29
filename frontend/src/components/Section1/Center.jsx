import React from "react";
import middle from "../../assets/middle.png";
import footer2 from "../../assets/footer2.jpg";
import DonationCarousel from "../Donation/DonationCarousel";

const Center = () => {
  return (
    <div
      className="relative min-h-screen w-full bg-cover bg-center flex flex-col justify-between overflow-x-hidden"
      style={{ backgroundImage: `url(${footer2})` }}
    >
      {/* Dark Overlay for better text readability */}
      <div className="absolute inset-0 bg-black/40 z-0" />

      {/* Hero Content */}
      <div className="relative z-10 flex flex-col items-center justify-center text-center px-6 pt-32 pb-10 flex-grow">
        <h1 className="text-white text-lg font-bold mb-4 animate-fade-in-up">Bible Engaged, Spirit Empowered, Missions Participating</h1>

        <h1 className="text-white text-4xl md:text-6xl font-extrabold mb-6 tracking-tight drop-shadow-lg">
          Welcome to the Church of God
        </h1>

        <h1 className="text-white text-xl md:text-3xl font-medium max-w-4xl leading-relaxed drop-shadow-md">
          Join us in our mission to see a healthy, Spirit-empowered church in every community!
        </h1>
      </div>

      {/* Donation Carousel Section - Blended */}
      <div className="relative z-10 w-full bg-gradient-to-t from-black/80 to-transparent pb-10 pt-10">
        <DonationCarousel />
      </div>

    </div>
  )
}

export default Center
