import React from "react";
import { Clock, MapPin, Edit3, Trash2, BookOpen } from "lucide-react";

const EventCard = ({ event, isAdmin = false, isCompact = false, onEdit, onDelete }) => {
  const { title, date, time, note, status, type, link } = event;

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
      onClick={() => !isAdmin && link && window.open(link, '_blank')}
      className={`group relative bg-card rounded-[24px] shadow-sm hover:shadow-2xl transition-all duration-500 overflow-hidden border border-gray-100 flex flex-col h-full ${isCompact ? "max-w-sm" : ""} ${!isAdmin && link ? "cursor-pointer" : ""}`}
    >
      {/* Visual Identity Section - Emphasized Date */}
      <div className={`relative ${isCompact ? "h-20" : "h-44"} bg-foreground overflow-hidden flex-shrink-0`}>
        <div className="absolute inset-0 bg-primary/20 mix-blend-overlay" />
        <div className={`absolute inset-0 flex ${isCompact ? "flex-row gap-2 items-center justify-start pl-6" : "flex-col items-center justify-center"} text-primary-foreground pointer-events-none`}>
          <span className={`${isCompact ? "text-3xl" : "text-7xl"} font-black tracking-tighter tabular-nums drop-shadow-2xl`}>{day}</span>
          <span className={`${isCompact ? "text-xs" : "text-xl"} font-bold tracking-[0.4em] opacity-70 ${isCompact ? "" : "mb-1"}`}>{month}</span>
        </div>

        {/* Floating Type Badge */}
        <div className={`absolute ${isCompact ? "top-2 right-24" : "top-4 left-4"}`}>
          <span className={`px-2 py-1 rounded-full text-[8px] sm:text-[10px] font-black uppercase tracking-widest shadow-lg ${typeColors[type] || typeColors.other}`}>
            {type || 'Update'}
          </span>
        </div>

        {isAdmin && (
          <div className={`absolute flex gap-1.5 ${isCompact ? "top-2 right-2" : "top-4 right-4"}`}>
            <button onClick={(e) => { e.stopPropagation(); onEdit(); }} className={`bg-card/10 backdrop-blur-md rounded-full text-primary-foreground hover:bg-card hover:text-foreground transition-all shadow-xl border border-white/20 flex items-center justify-center ${isCompact ? "w-7 h-7" : "p-2"}`}>
              <Edit3 size={isCompact ? 12 : 16} />
            </button>
            <button onClick={(e) => { e.stopPropagation(); onDelete(); }} className={`bg-card/10 backdrop-blur-md rounded-full text-primary-foreground hover:bg-rose-500 hover:text-primary-foreground transition-all shadow-xl border border-white/20 flex items-center justify-center ${isCompact ? "w-7 h-7" : "p-2"}`}>
              <Trash2 size={isCompact ? 12 : 16} />
            </button>
          </div>
        )}
      </div>

      {/* Content Section */}
      <div className={`${isCompact ? "p-4" : "p-8"} flex-1 flex flex-col justify-between relative bg-card`}>
        <div className="relative z-10">
          <div className={`flex items-center gap-2 ${isCompact ? "mb-2" : "mb-4"}`}>
            <div className={`flex items-center gap-1.5 bg-blue-50 rounded-full border border-blue-100 ${isCompact ? "px-2 py-0.5" : "px-3 py-1"}`}>
              <Clock size={isCompact ? 10 : 12} className="text-primary" />
              <span className={`${isCompact ? "text-[10px]" : "text-xs"} font-bold text-primary`}>{formatTime(time)}</span>
            </div>
            {isAdmin && (
              <span className={`text-[9px] font-black uppercase tracking-widest ${status === 'visible' ? 'text-emerald-500' : 'text-rose-500'}`}>
                ● {status}
              </span>
            )}
          </div>

          <h3 className={`${isCompact ? "text-lg mb-1 leading-snug" : "text-2xl mb-3 leading-tight"} font-black text-foreground group-hover:text-primary transition-colors line-clamp-2`}>
            {title}
          </h3>

          <p className={`text-muted-foreground font-medium italic ${isCompact ? "text-xs leading-normal line-clamp-1" : "text-sm leading-relaxed line-clamp-2"}`}>
            {note}
          </p>
        </div>

        {/* Footer / Location */}
        <div className={`${isCompact ? "mt-3 pt-3" : "mt-8 pt-6"} border-t border-gray-50 flex items-center justify-between`}>
          <div className="flex items-center gap-1.5 text-gray-400">
            <MapPin size={isCompact ? 12 : 14} />
            <span className={`font-bold uppercase tracking-widest truncate max-w-[150px] ${isCompact ? "text-[9px]" : "text-[10px]"}`}>
              {note || "Main Sanctuary"}
            </span>
          </div>
          <div 
            title={link ? "Register" : "View Announcement"}
            className={`${isCompact ? "w-6 h-6" : "w-8 h-8"} rounded-full bg-background flex items-center justify-center group-hover:bg-primary group-hover:text-primary-foreground transition-all duration-500`}
          >
            <BookOpen size={isCompact ? 10 : 14} className="opacity-20 group-hover:opacity-100" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default EventCard;
