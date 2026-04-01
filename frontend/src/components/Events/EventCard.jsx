import React from "react";
import { Clock, Edit3 } from "lucide-react";

const EventCard = ({ event, isAdmin = false, isCompact = false, onEdit }) => {
  const { title, date, time, note, status, type } = event;

  const formatDate = (dateStr) => {
    if (!dateStr) return { day: "--", month: "---" };
    const d = new Date(dateStr);
    return {
      day: d.getDate().toString().padStart(2, '0'),
      month: d.toLocaleDateString("en-IN", { month: "short" }).toUpperCase(),
    };
  };

  const formatTime = (timeStr) => {
    if (!timeStr) return "--:--";
    const [hour, minute] = timeStr.split(":");
    const d = new Date();
    d.setHours(parseInt(hour), parseInt(minute));
    return d.toLocaleTimeString("en-IN", { hour: "numeric", minute: "2-digit", hour12: true });
  };

  const { day, month } = formatDate(date);

  const typeColors = {
    event: "bg-primary text-primary-foreground",
    notice: "bg-amber-600 text-primary-foreground",
    blog: "bg-purple-600 text-primary-foreground",
    other: "bg-gray-600 text-primary-foreground"
  };

  return (
    <div
      className={`group relative flex flex-col bg-background transition-all duration-500 h-full ${isCompact ? "max-w-sm" : ""}`}
    >
      {/* Visual Identity Section - Emphasized Date */}
      <div className={`relative ${isCompact ? "h-24" : "h-56"} bg-foreground overflow-hidden flex-shrink-0 border border-border`}>
        <div className="absolute inset-0 bg-accent/10 mix-blend-overlay" />
        <div className={`absolute inset-0 flex ${isCompact ? "flex-row gap-3 items-center justify-start pl-8" : "flex-col items-center justify-center"} text-background pointer-events-none transition-transform duration-700 group-hover:scale-105`}>
          <span className={`${isCompact ? "text-4xl" : "text-8xl"} font-serif font-black tracking-tighter tabular-nums drop-shadow-2xl`}>{day}</span>
          <span className={`${isCompact ? "text-[10px]" : "text-xl"} font-black tracking-[0.5em] opacity-80 uppercase ${isCompact ? "" : "mb-2"}`}>{month}</span>
        </div>

        {/* Floating Type Badge */}
        <div className={`absolute ${isCompact ? "top-3 right-20" : "top-6 left-6"}`}>
          <span className={`px-4 py-1.5 rounded-none text-[8px] sm:text-[9px] font-black uppercase tracking-[0.2em] shadow-xl border border-white/20 ${typeColors[type] || "bg-accent text-background"}`}>
            {type || 'Update'}
          </span>
        </div>

        {isAdmin && (
          <div className={`absolute flex gap-2 ${isCompact ? "top-3 right-3" : "top-6 right-6"}`}>
            <button onClick={(e) => { e.stopPropagation(); onEdit(); }} className={`bg-background/20 backdrop-blur-md rounded-none text-background hover:bg-background hover:text-foreground transition-all shadow-xl border border-white/10 flex items-center justify-center ${isCompact ? "w-8 h-8" : "w-12 h-12"}`}>
              <Edit3 size={isCompact ? 14 : 20} />
            </button>
          </div>
        )}
      </div>

      {/* Content Section */}
      <div className={`${isCompact ? "pt-6" : "pt-8"} flex-1 flex flex-col justify-between relative bg-background`}>
        <div className="relative z-10">
          <div className={`flex items-center gap-3 ${isCompact ? "mb-3" : "mb-6"}`}>
            <div className={`flex items-center gap-2 border border-border px-3 py-1.5 rounded-none bg-card shadow-sm`}>
              <Clock size={isCompact ? 10 : 12} className="text-accent" />
              <span className={`${isCompact ? "text-[10px]" : "text-xs"} font-black uppercase tracking-widest text-foreground`}>{formatTime(time)}</span>
            </div>
            {isAdmin && (
              <span className={`text-[10px] font-black uppercase tracking-[0.2em] ${status === 'visible' ? 'text-accent' : 'text-muted-foreground'}`}>
                {status}
              </span>
            )}
          </div>

          <h3 className={`${isCompact ? "text-xl mb-2 leading-tight" : "text-3xl mb-4 leading-[1.1]"} font-serif font-black text-foreground group-hover:text-accent transition-colors line-clamp-2`}>
            {title}
          </h3>

          <p className={`text-muted-foreground font-medium border-l-2 border-border pl-4 py-1 italic ${isCompact ? "text-xs leading-normal line-clamp-2" : "text-sm leading-relaxed line-clamp-3"}`}>
            {note}
          </p>
        </div>
      </div>
    </div>
  );
};

export default EventCard;
