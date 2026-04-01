import React, { useState, useEffect } from "react";
import EventCard from "./EventCard";
import api from "../../api/axios";
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
    <div className="w-full min-h-screen bg-background text-foreground font-sans">
      {/* HERO SECTION */}
      <div className="pt-32 pb-16 px-4 md:px-16 border-b border-line text-center">
        <span className="text-[10px] md:text-[11px] font-bold uppercase tracking-widest text-accent mb-6 block">
          Upcoming Gatherings
        </span>
        <h1 className="font-serif text-5xl md:text-7xl font-bold tracking-tight mb-6">
          Announcements
        </h1>
        <p className="text-base md:text-lg font-sans max-w-2xl mx-auto text-foreground/80 leading-relaxed">
          Join our community in spiritual growth, celebration, and service. Your presence makes our gathering complete.
        </p>
      </div>

      {/* EVENTS GRID */}
      <div className="py-24 px-4 md:px-16 max-w-7xl mx-auto">
        {loading ? (
          <div className="flex flex-col items-center justify-center py-20 border border-line">
            <Loader2 className="animate-spin mb-4 text-accent" size={32} />
            <p className="font-bold tracking-widest text-[10px] uppercase text-foreground/50">Loading Announcements...</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {events.length === 0 ? (
              <div className="col-span-full py-24 border border-line text-center">
                <p className="font-serif text-2xl font-bold mb-2">No Announcements Yet</p>
                <p className="text-sm text-foreground/70">Check back soon for the latest church updates and news.</p>
              </div>
            ) : (
              events.map(event => (
                <div key={event._id} className="border border-line hover:border-foreground transition-colors p-6">
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
