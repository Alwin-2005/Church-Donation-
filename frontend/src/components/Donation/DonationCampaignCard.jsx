import React from "react";
import { useAuth } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";
import {
  Calendar,
  Target,
  CreditCard,
  Edit,
  Trash2,
  TrendingUp,
  Clock,
  CheckCircle2,
  AlertCircle,
  ArrowRight
} from "lucide-react";

const DonationCampaignCard = ({
  campaign,
  role,
  onEdit,
  onDelete,
  onDonate,
  compact = false,
}) => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const handleDonateClick = () => {
    if (!user) {
      navigate('/login');
      return;
    }
    onDonate?.(campaign);
  };
  const {
    title,
    description,
    goalAmount,
    collectedAmount = 0,
    startDate,
    endDate,
    status,
  } = campaign;

  // Calculate progress percentage
  const percentage = Math.min(100, Math.max(0, Math.round((collectedAmount / goalAmount) * 100)));

  // Format currency
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(amount);
  };

  // Format date
  const formatDate = (dateUnparsed) => {
    if (!dateUnparsed) return '';
    return new Date(dateUnparsed).toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    });
  };

  const getStatusColor = (s) => {
    switch (s) {
      case 'active': return 'bg-muted text-foreground border-border';
      case 'paused': return 'bg-muted text-muted-foreground border-border';
      default: return 'bg-red-50 text-red-600 border-red-100'; // Keep Error red for critical alerts only
    }
  };

  return (
    <div className={`group relative w-full ${compact ? "sm:w-[280px]" : "sm:w-[350px]"} bg-background transition-all duration-300 border border-line overflow-hidden flex flex-col ${compact ? "h-[320px]" : ""}`}>

      {/* DECORATIVE HEADER */}
      <div className="h-1 bg-accent w-full" />

      <div className={`${compact ? "p-4" : "p-6"} flex-1 flex flex-col`}>
        {/* HEADER SECTION */}
        <div className="flex justify-between items-start mb-4">
          <div className="flex-1 pr-2">
            <h2 className={`font-serif font-bold text-foreground leading-tight tracking-tight group-hover:text-accent transition-colors ${compact ? "text-lg line-clamp-2" : "text-xl"}`}>
              {title}
            </h2>
            {role === "admin" && !compact && (
              <span className={`mt-2 inline-flex items-center px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-widest border ${getStatusColor(status)}`}>
                {status}
              </span>
            )}
          </div>
          {!compact && (
            <div className="text-accent/20 p-2">
              <CreditCard className="w-5 h-5" />
            </div>
          )}
        </div>

        {/* DESCRIPTION */}
        {!compact && (
          <p className="text-foreground/70 text-sm mb-6 line-clamp-3 leading-relaxed flex-1">
            {description}
          </p>
        )}

        {/* PROGRESS SECTION */}
        {campaign.isTithe ? (
          <div className="mb-6 p-6 border border-line bg-muted">
            <div className="flex items-center gap-2 text-accent">
              <TrendingUp className="w-5 h-5" />
              <span className="font-bold text-[10px] uppercase tracking-widest">Monthly Tithe</span>
            </div>
            <p className="text-xs text-foreground/60 mt-2 font-medium italic">Supporting our church's mission monthly</p>
          </div>
        ) : (
          <div className={compact ? "mt-auto mb-4" : "mb-6"}>
            <div className="flex justify-between text-[10px] font-bold uppercase tracking-widest mb-3">
              <span className="text-accent">Raised</span>
              <span className="text-foreground">{percentage}%</span>
            </div>

            {/* Progress Bar Background */}
            <div className="h-2 w-full bg-line overflow-hidden">
              {/* Progress Bar Fill */}
              <div
                className="h-full bg-accent transition-all duration-1000 ease-out relative"
                style={{ width: `${percentage}%` }}
              >
              </div>
            </div>

            <div className="flex justify-between mt-3">
              <div>
                <span className="block text-foreground/40 uppercase tracking-widest text-[9px] font-bold">Collected</span>
                <span className="font-serif text-lg font-bold text-foreground leading-none">{formatCurrency(collectedAmount)}</span>
              </div>
              <div className="text-right">
                <span className="block text-foreground/40 uppercase tracking-widest text-[9px] font-bold">Goal</span>
                <span className="font-serif text-lg font-bold text-foreground leading-none">{formatCurrency(goalAmount)}</span>
              </div>
            </div>
          </div>
        )}

        {/* DATES GRID */}
        {!compact && (
          <div className="grid grid-cols-2 gap-3 mb-6 pt-6 border-t border-line">
            <div className="flex items-center gap-3 text-xs">
              <Calendar className="w-4 h-4 text-accent" />
              <div className="flex flex-col">
                <span className="text-[9px] uppercase tracking-widest text-foreground/40 font-bold">Starts</span>
                <span className="font-medium text-foreground">{formatDate(startDate)}</span>
              </div>
            </div>

            {endDate && (
              <div className="flex items-center gap-3 text-xs">
                <Clock className="w-4 h-4 text-accent" />
                <div className="flex flex-col">
                  <span className="text-[9px] uppercase tracking-widest text-foreground/40 font-bold">Ends</span>
                  <span className="font-medium text-foreground">{formatDate(endDate)}</span>
                </div>
              </div>
            )}
          </div>
        )}

        {/* ACTIONS FOOTER */}
        <div className="mt-auto pt-2">
          {(role === "churchMember" || role === "externalMember" || !role) && (
            <button
              onClick={handleDonateClick}
              className={`w-full flex items-center justify-center gap-2 bg-accent hover:bg-foreground text-background font-bold tracking-widest uppercase transition-colors shadow-sm ${compact ? "py-3 text-[10px]" : "py-3.5 px-6 text-[11px]"}`}
            >
              Donate Now
              <ArrowRight className="w-4 h-4" />
            </button>
          )}

          {role === "admin" && (
            <div className="flex gap-2">
              <button
                onClick={() => onEdit?.(campaign)}
                className="flex-1 flex items-center justify-center gap-2 bg-background hover:bg-line text-foreground font-bold py-2.5 px-4 border border-line transition-colors text-[10px] uppercase tracking-widest"
              >
                <Edit className="w-4 h-4" /> Edit
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default DonationCampaignCard;
