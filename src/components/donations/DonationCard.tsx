import React, { useState } from 'react';
import { FoodDonation } from '../../types';
import { StatusBadge } from '../common/StatusBadge';
import { MapPin, Clock, ShieldCheck, Thermometer, ChevronRight } from 'lucide-react';

interface DonationCardProps {
  donation: FoodDonation;
  onViewDetails: (donation: FoodDonation) => void;
  onClaim?: (donation: FoodDonation) => void;
  canClaim?: boolean;
}

export const DonationCard: React.FC<DonationCardProps> = ({
  donation,
  onViewDetails,
  onClaim,
  canClaim = false,
}) => {
  const [imgError, setImgError] = useState(false);

  // Calculate deadline urgency
  const deadlineDate = new Date(donation.expiryDeadline);
  const now = new Date();
  const diffHours = Math.round((deadlineDate.getTime() - now.getTime()) / (1000 * 60 * 60));
  const isUrgent = diffHours > 0 && diffHours <= 6 && donation.status === 'available';
  const isExpired = donation.status === 'expired' || diffHours <= 0;

  const formattedDeadline = deadlineDate.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
  });

  return (
    <div className="bg-[#FCFDF9] rounded-2xl border border-[#12372A]/10 hover:border-[#166534]/40 hover:shadow-md transition-all duration-200 overflow-hidden flex flex-col group">
      
      {/* Image container */}
      <div className="relative aspect-16/10 bg-[#12372A]/5 overflow-hidden">
        {!imgError ? (
          <img
            src={donation.imageUrl}
            alt={donation.title}
            referrerPolicy="no-referrer"
            onError={() => setImgError(true)}
            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-103"
          />
        ) : (
          <div className="w-full h-full bg-[#166534]/10 flex flex-col items-center justify-center text-[#166534] p-4 text-center">
            <ShieldCheck className="w-8 h-8 mb-1" />
            <span className="text-xs font-semibold">{donation.category}</span>
          </div>
        )}

        {/* Floating Urgency or Status Overlay tag */}
        <div className="absolute top-3 left-3 bg-white/95 backdrop-blur-xs px-2.5 py-1 rounded-lg shadow-xs text-xs font-medium">
          <StatusBadge status={donation.status} />
        </div>

        {isUrgent && (
          <div className="absolute top-3 right-3 bg-amber-500 text-white font-semibold px-2 py-0.5 rounded-md text-[11px] shadow-xs tracking-wide">
            Urgent: {diffHours}h left
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-5 flex-1 flex flex-col justify-between">
        <div>
          {/* Metadata: zero-pill discipline clean unboxed text */}
          <div className="flex items-center gap-1.5 text-xs text-[#647067] mb-2 font-medium">
            <span className="text-[#166534] font-semibold">{donation.category}</span>
            <span aria-hidden="true">·</span>
            <span>{donation.dietaryType}</span>
            <span aria-hidden="true">·</span>
            <span>{donation.donorType}</span>
          </div>

          {/* Title */}
          <h3 className="text-base font-bold text-[#17231D] tracking-tight group-hover:text-[#166534] transition-colors line-clamp-1">
            {donation.title}
          </h3>

          {/* Donor and location */}
          <div className="flex items-center gap-1.5 text-xs text-[#647067] mt-1.5 line-clamp-1">
            <span className="font-medium text-[#17231D]">{donation.donorName}</span>
          </div>

          <div className="flex items-center gap-1 text-xs text-[#647067] mt-1">
            <MapPin className="w-3.5 h-3.5 shrink-0 text-[#166534]" />
            <span className="truncate">{donation.area}, {donation.city}</span>
          </div>

          {/* Quantity & Storage */}
          <div className="mt-3.5 pt-3 border-t border-gray-100 grid grid-cols-2 gap-2 text-xs">
            <div>
              <span className="text-[11px] text-[#647067] block">Available Quantity</span>
              <span className="font-bold text-[#12372A] text-sm tabular-nums font-mono">
                {donation.quantity} {donation.unit}
              </span>
            </div>
            <div>
              <span className="text-[11px] text-[#647067] block">Safe Storage</span>
              <span className="font-medium text-[#17231D] flex items-center gap-1 truncate text-xs mt-0.5">
                <Thermometer className="w-3.5 h-3.5 text-[#166534] shrink-0" />
                <span className="truncate">{donation.storageCondition.split(' ')[0]}</span>
              </span>
            </div>
          </div>

          {/* Pickup Deadline */}
          <div className="mt-3 flex items-center gap-1.5 text-xs text-[#647067]">
            <Clock className="w-3.5 h-3.5 text-[#647067] shrink-0" />
            <span>Pickup by:</span>
            <span className="font-medium text-[#17231D]">{formattedDeadline}</span>
          </div>
        </div>

        {/* Action Controls */}
        <div className="mt-5 pt-3 border-t border-gray-100 flex items-center gap-2">
          <button
            onClick={() => onViewDetails(donation)}
            className="flex-1 py-2 px-3 text-xs font-semibold text-[#166534] bg-[#DCFCE7]/70 hover:bg-[#DCFCE7] rounded-xl transition-colors text-center cursor-pointer flex items-center justify-center gap-1"
          >
            <span>View Details</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>

          {canClaim && donation.status === 'available' && !isExpired && onClaim && (
            <button
              onClick={() => onClaim(donation)}
              className="py-2 px-3.5 text-xs font-semibold text-white bg-[#166534] hover:bg-[#12372A] rounded-xl transition-colors cursor-pointer shadow-2xs whitespace-nowrap"
            >
              Claim Food
            </button>
          )}
        </div>

      </div>
    </div>
  );
};
