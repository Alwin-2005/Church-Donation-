import React, { useState, useEffect } from "react";
import EventCard from "./EventCard";
import api from "../../api/axios";
import evimg from "../../assets/evimg.jpg";
import { Loader2 } from "lucide-react";

const Event = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    try {
      setLoading(true);
      const res = await api.get("/home/content/view?type=event");
      // Members only see visible content
      const visible = (res.data.result || []).filter(e => e.status === "visible");
      setEvents(visible);
    } catch (error) {
      console.error("Error fetching events:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="pt-20 bg-gray-900 min-h-screen">
      {/* HERO SECTION */}
      <div className="relative min-h-[60vh] w-full flex items-center justify-center overflow-hidden">
        {/* BACKGROUND IMAGE WITH OVERLAY */}
        <div className="absolute inset-0">
          <img
            src={evimg}
            className="h-full w-full object-cover scale-105"
            alt="Events background"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/80 via-black/40 to-gray-900" />
        </div>

        {/* HERO CONTENT */}
        <div className="relative z-20 text-center px-6 max-w-4xl animate-fadeIn">
          <h1 className="text-5xl md:text-7xl font-black text-white tracking-tighter mb-4 uppercase italic">
            ANNOUNCEMENTS
          </h1>
          <p className="text-gray-300 text-lg md:text-xl font-medium tracking-wide max-w-2xl mx-auto">
            Join our community in spiritual growth, celebration, and service.
            Your presence makes our gathering complete.
          </p>
        </div>
      </div>

      {/* EVENTS GRID */}
      <div className="relative z-10 -mt-20 pb-20 px-6 max-w-7xl mx-auto">
        {loading ? (
          <div className="flex flex-col items-center justify-center py-20 text-blue-500 bg-white/5 backdrop-blur-xl rounded-3xl border border-white/10">
            <Loader2 className="animate-spin mb-4" size={40} />
            <p className="font-bold tracking-widest text-xs uppercase text-gray-400">Opening Sanctuary Doors...</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {events.length === 0 ? (
              <div className="col-span-full py-20 bg-white/5 backdrop-blur-xl rounded-3xl border border-white/10 text-center">
                <p className="text-gray-400 font-bold text-xl uppercase tracking-tighter">No Announcements Yet</p>
                <p className="text-gray-500 mt-2">Check back soon for the latest church updates and news.</p>
              </div>
            ) : (
              events.map(event => (
                <div key={event._id} className="animate-scaleIn">
                  <EventCard event={event} isAdmin={false} />
                </div>
              ))
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Event;
