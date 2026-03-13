import React from "react";
import { Clock, MapPin, Edit3, Trash2, BookOpen } from "lucide-react";

const EventCard = ({ event, isAdmin = false, isCompact = false, onEdit, onDelete }) => {
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
    <div className={`group relative bg-card rounded-[24px] shadow-sm hover:shadow-2xl transition-all duration-500 overflow-hidden border border-gray-100 flex flex-col h-full ${isCompact ? "max-w-sm" : ""}`}>
      {/* Visual Identity Section - Emphasized Date */}
      <div className={`relative ${isCompact ? "h-32" : "h-44"} bg-foreground overflow-hidden`}>
        <div className="absolute inset-0 bg-primary/20 mix-blend-overlay" />
        <div className="absolute inset-0 flex flex-col items-center justify-center text-primary-foreground pointer-events-none">
          <span className={`${isCompact ? "text-sm" : "text-xl"} font-bold tracking-[0.4em] opacity-70 mb-1`}>{month}</span>
          <span className={`${isCompact ? "text-5xl" : "text-7xl"} font-black tracking-tighter tabular-nums drop-shadow-2xl`}>{day}</span>
        </div>

        {/* Floating Type Badge */}
        <div className="absolute top-4 left-4">
          <span className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest shadow-lg ${typeColors[type] || typeColors.other}`}>
            {type || 'Update'}
          </span>
        </div>

        {isAdmin && (
          <div className="absolute top-4 right-4 flex gap-2">
            <button onClick={(e) => { e.stopPropagation(); onEdit(); }} className="p-2 bg-card/10 backdrop-blur-md rounded-full text-primary-foreground hover:bg-card hover:text-foreground transition-all shadow-xl border border-white/20">
              <Edit3 size={isCompact ? 14 : 16} />
            </button>
            <button onClick={(e) => { e.stopPropagation(); onDelete(); }} className="p-2 bg-card/10 backdrop-blur-md rounded-full text-primary-foreground hover:bg-rose-500 hover:text-primary-foreground transition-all shadow-xl border border-white/20">
              <Trash2 size={isCompact ? 14 : 16} />
            </button>
          </div>
        )}
      </div>

      {/* Content Section */}
      <div className={`${isCompact ? "p-5" : "p-8"} flex-1 flex flex-col justify-between relative bg-card`}>
        <div className="relative z-10">
          <div className="flex items-center gap-3 mb-4">
            <div className="flex items-center gap-1.5 px-3 py-1 bg-blue-50 rounded-full border border-blue-100">
              <Clock size={12} className="text-primary" />
              <span className="text-xs font-bold text-primary">{formatTime(time)}</span>
            </div>
            {isAdmin && (
              <span className={`text-[10px] font-black uppercase tracking-widest ${status === 'visible' ? 'text-emerald-500' : 'text-rose-500'}`}>
                ● {status}
              </span>
            )}
          </div>

          <h3 className={`${isCompact ? "text-xl" : "text-2xl"} font-black text-foreground leading-tight mb-3 group-hover:text-primary transition-colors`}>
            {title}
          </h3>

          <p className="text-muted-foreground text-sm font-medium leading-relaxed italic line-clamp-2">
            {note || "Gather with our community for spiritual growth and fellowship."}
          </p>
        </div>

        {/* Footer / Location */}
        <div className={`${isCompact ? "mt-4 pt-4" : "mt-8 pt-6"} border-t border-gray-50 flex items-center justify-between`}>
          <div className="flex items-center gap-2 text-gray-400">
            <MapPin size={14} />
            <span className="text-[10px] font-bold uppercase tracking-widest truncate max-w-[150px]">
              {note || "Main Sanctuary"}
            </span>
          </div>
          <div className="w-8 h-8 rounded-full bg-background flex items-center justify-center group-hover:bg-primary group-hover:text-primary-foreground transition-all duration-500">
            <BookOpen size={14} className="opacity-20 group-hover:opacity-100" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default EventCard;
