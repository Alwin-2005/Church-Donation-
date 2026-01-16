import Navbar from "../NavBar/NavBar";
import EventCard from "./EventCard";
import Footer from "../Footer/Footer";
import React from "react";
import evimg from "../../assets/evimg.jpg";

const Event = () => {
  return (
    <div>
      <Navbar />

      {/* HERO SECTION */}
      <div className="relative min-h-screen w-full">

        {/* Background image */}
        <img
          src={evimg}
          className="absolute inset-0 h-full w-full object-cover opacity-95  z-0 shadow-lg"
        />

        {/* Heading */}
        <h1 className="absolute top-44 w-full text-center text-4xl font-bold text-white z-20 [text-shadow:2px_2px_6px_rgba(0,0,0,1)]">
          Upcoming Events
          <hr className="w-40 mx-auto mt-2" />
        </h1>

        {/* Event cards */}
        <div className="relative z-20 pt-75 pb-20 flex flex-col items-center gap-12">
          <EventCard month="MAR" day="05"
          title="Fasting Prayer"
          time="Monday .7:30PM"
          note="Join this Friday"
          verse='Joel 2:12 - ""Even now,” declares the Lord, “return to me with all your heart, with fasting and weeping and mourning""' />
          <EventCard  month="APR"
    day="12"
    title="Youth Worship Night"
    time="Friday · 6:00 PM"
    note="Open for all youth"
    verse='Psalm 95:1 — “Come, let us sing for joy to the Lord;
    let us shout aloud to the Rock of our salvation.' />

    <EventCard
  month="MAY"
  day="18"
  title="Sunday Worship Service"
  time="Sunday · 10:00 AM"
  note="All are welcome"
  verse='Psalm 122:1 — “I rejoiced with those who said to me, ‘Let us go to the house of the Lord.’”'
/>
        </div>
       
      </div>

      <div>
        
      </div>

       <Footer/>
    </div>
  );
};

export default Event;
