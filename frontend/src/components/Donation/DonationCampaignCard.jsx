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
  AlertCircle
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
      case 'active': return 'bg-gray-100 text-gray-800 border-gray-200';
      case 'paused': return 'bg-gray-100 text-gray-500 border-gray-200';
      default: return 'bg-red-50 text-red-600 border-red-100'; // Keep Error red for critical alerts only
    }
  };

  return (
    <div className={`group relative w-full ${compact ? "sm:w-[280px]" : "sm:w-[350px]"} bg-white/95 backdrop-blur-sm rounded-2xl shadow-sm hover:shadow-2xl transition-all duration-300 border border-gray-200 overflow-hidden flex flex-col ${compact ? "h-[320px]" : ""}`}>

      {/* DECORATIVE HEADER / STATUS */}
      <div className="h-2 bg-black w-full" />

      <div className={`${compact ? "p-4" : "p-6"} flex-1 flex flex-col`}>
        {/* HEADER SECTION */}
        <div className="flex justify-between items-start mb-4">
          <div className="flex-1 pr-2">
            <h2 className={`font-bold text-gray-900 leading-tight group-hover:text-black transition-colors ${compact ? "text-lg line-clamp-2" : "text-xl"}`}>
              {title}
            </h2>
            {role === "admin" && !compact && (
              <span className={`mt-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold uppercase tracking-wider border ${getStatusColor(status)}`}>
                {status}
              </span>
            )}
          </div>
          {!compact && (
            <div className="bg-gray-100 p-2 rounded-lg text-black">
              <CreditCard className="w-5 h-5" />
            </div>
          )}
        </div>

        {/* DESCRIPTION */}
        {!compact && (
          <p className="text-gray-500 text-sm mb-6 line-clamp-3 leading-relaxed flex-1">
            {description}
          </p>
        )}

        {/* PROGRESS SECTION */}
        {campaign.isTithe ? (
          <div className="mb-6 p-4 bg-yellow-50 rounded-xl border border-yellow-100">
            <div className="flex items-center gap-2 text-yellow-800">
              <TrendingUp className="w-5 h-5" />
              <span className="font-bold text-sm uppercase tracking-wider">Monthly Tithe</span>
            </div>
            <p className="text-xs text-yellow-700 mt-1 font-medium">Supporting our church's mission monthly</p>
          </div>
        ) : (
          <div className={compact ? "mt-auto mb-4" : "mb-6"}>
            <div className="flex justify-between text-sm mb-2">
              <span className="text-gray-600 font-medium">Raised</span>
              <span className="text-black font-bold">{percentage}%</span>
            </div>

            {/* Progress Bar Background */}
            <div className="h-3 w-full bg-gray-200 rounded-full overflow-hidden">
              {/* Progress Bar Fill */}
              <div
                className="h-full bg-black rounded-full transition-all duration-1000 ease-out relative"
                style={{ width: `${percentage}%` }}
              >
                <div className="absolute inset-0 bg-white/20 animate-[shimmer_2s_infinite]" />
              </div>
            </div>

            <div className="flex justify-between mt-2 text-xs text-gray-500">
              <div>
                <span className="block text-gray-400 uppercase tracking-wider text-[10px]">Raised</span>
                <span className="font-bold text-gray-900">{formatCurrency(collectedAmount)}</span>
              </div>
              <div className="text-right">
                <span className="block text-gray-400 uppercase tracking-wider text-[10px]">Goal</span>
                <span className="font-bold text-gray-900">{formatCurrency(goalAmount)}</span>
              </div>
            </div>
          </div>
        )}

        {/* DATES GRID */}
        {!compact && (
          <div className="grid grid-cols-2 gap-3 mb-6 pt-4 border-t border-gray-100">
            <div className="flex items-center gap-2 text-xs text-gray-500">
              <Calendar className="w-4 h-4 text-gray-900" />
              <div className="flex flex-col">
                <span className="text-[10px] uppercase tracking-wider text-gray-400">Starts</span>
                <span className="font-medium text-gray-900">{formatDate(startDate)}</span>
              </div>
            </div>

            {endDate && (
              <div className="flex items-center gap-2 text-xs text-gray-500">
                <Clock className="w-4 h-4 text-gray-900" />
                <div className="flex flex-col">
                  <span className="text-[10px] uppercase tracking-wider text-gray-400">Ends</span>
                  <span className="font-medium text-gray-900">{formatDate(endDate)}</span>
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
              className={`w-full flex items-center justify-center gap-2 bg-black hover:bg-gray-800 text-white font-bold tracking-wide rounded-xl transition-all shadow-md hover:shadow-xl focus:ring-4 focus:ring-gray-300 ${compact ? "py-2 text-sm" : "py-2.5 px-4"}`}
            >
              Donate
              <TrendingUp className="w-4 h-4" />
            </button>
          )}

          {role === "admin" && (
            <div className="flex gap-2">
              <button
                onClick={() => onEdit?.(campaign)}
                className="flex-1 flex items-center justify-center gap-2 bg-white hover:bg-gray-50 text-gray-900 font-bold py-2 px-4 rounded-lg border-2 border-gray-200 hover:border-black transition-colors"
              >
                <Edit className="w-4 h-4" /> Edit
              </button>
              <button
                onClick={() => onDelete?.(campaign._id)}
                className="flex-1 flex items-center justify-center gap-2 bg-white hover:bg-red-50 text-red-600 font-bold py-2 px-4 rounded-lg border-2 border-red-100 hover:border-red-200 transition-colors"
              >
                <Trash2 className="w-4 h-4" /> Delete
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default DonationCampaignCard;
