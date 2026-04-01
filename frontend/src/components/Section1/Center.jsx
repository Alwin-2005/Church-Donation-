import React from "react";
import DonationCarousel from "../Donation/DonationCarousel";

const Center = () => {
  return (
    <div className="w-full bg-background min-h-screen pt-32 pb-16 flex flex-col font-sans text-foreground">
      {/* Hero Section */}
      <div className="px-4 md:px-16 py-16 md:py-24 border-b border-line flex flex-col items-center justify-center text-center">
        <span className="text-[10px] md:text-[11px] font-bold uppercase tracking-widest text-accent mb-8">
          Bible Engaged, Spirit Empowered, Missions Participating
        </span>
        <h1 className="font-serif text-5xl md:text-7xl lg:text-8xl font-bold tracking-tight mb-8 text-foreground max-w-5xl">
          Welcome to the Church of God
        </h1>
        <p className="text-base md:text-lg font-sans max-w-2xl text-foreground/80 leading-relaxed mb-4">
          Join us in our mission to see a healthy, Spirit-empowered church in every community!
        </p>
      </div>

      {/* Stories Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 border-b border-line">
        {[
          {
            title: "Community Outreach",
            desc: "Serving our local neighborhoods with essential resources, food drives, and compassionate care.",
          },
          {
            title: "Global Missions",
            desc: "Supporting worldwide initiatives to bring hope, education, and spiritual guidance to all nations.",
          },
          {
            title: "Youth Ministry",
            desc: "Empowering the next generation through intentional mentorship, dynamic events, and faithful leadership.",
          },
        ].map((story, i) => (
          <div
            key={i}
            className={`p-12 flex flex-col justify-center items-start ${
              i !== 2 ? "md:border-r border-line border-b md:border-b-0" : ""
            }`}
          >
            <h3 className="font-serif text-2xl font-bold mb-4">{story.title}</h3>
            <p className="text-sm leading-relaxed text-foreground/70">{story.desc}</p>
          </div>
        ))}
      </div>

      {/* Impact Banner */}
      <div className="w-full bg-accent text-background py-24 md:py-32 px-4 text-center border-b border-line">
        <h2 className="font-serif text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight max-w-4xl mx-auto">
          Your Contribution Makes a Difference
        </h2>
      </div>

      {/* Donation Carousel Section */}
      <div className="w-full pt-24 px-4 md:px-16">
        <div className="mb-16 text-center">
          <span className="text-[10px] md:text-[11px] font-bold uppercase tracking-widest text-accent">
            Active Campaigns
          </span>
          <h2 className="font-serif text-3xl md:text-4xl font-bold mt-4">Support Our Causes</h2>
        </div>
        <DonationCarousel />
      </div>
    </div>
  );
};

export default Center;
