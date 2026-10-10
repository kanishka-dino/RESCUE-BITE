import React from 'react';
import { ShieldCheck, Info } from 'lucide-react';
import { Link } from 'react-router-dom';

interface FoodSafetyNoticeProps {
  compact?: boolean;
}

export const FoodSafetyNotice: React.FC<FoodSafetyNoticeProps> = ({ compact = false }) => {
  if (compact) {
    return (
      <div className="flex items-center gap-2 p-3 bg-[#DCFCE7]/60 border border-[#166534]/20 rounded-xl text-xs text-[#12372A]">
        <ShieldCheck className="w-4 h-4 text-[#166534] shrink-0" />
        <p className="flex-1">
          Complies with safe cold-chain & hot-holding standards.{' '}
          <Link to="/food-safety" className="font-semibold underline hover:text-[#166534]">
            View Safety Protocol
          </Link>
        </p>
      </div>
    );
  }

  return (
    <div className="p-4 sm:p-5 bg-[#FCFDF9] border border-[#166534]/20 rounded-2xl shadow-xs">
      <div className="flex items-start gap-3.5">
        <div className="p-2 bg-[#DCFCE7] text-[#166534] rounded-xl shrink-0 mt-0.5">
          <ShieldCheck className="w-5 h-5" />
        </div>
        <div className="space-y-1 text-xs sm:text-sm">
          <h4 className="font-bold text-[#12372A]">RescueBite Safe Redistribution Protocol</h4>
          <p className="text-[#647067] leading-relaxed">
            All listings require documented preparation timestamps, active storage temperatures (hot-holding ≥60°C or refrigeration ≤4°C), and allergen disclosures. Per Good Samaritan Food Donation statutory guidelines, never accept unsealed high-risk food past safe deadlines.
          </p>
          <div className="flex items-center gap-4 pt-1 text-xs font-semibold text-[#166534]">
            <Link to="/food-safety" className="hover:underline flex items-center gap-1">
              <Info className="w-3.5 h-3.5" />
              Detailed Temperature & Handover Rules
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};
