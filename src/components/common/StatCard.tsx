import React from 'react';

interface StatCardProps {
  label: string;
  value: string | number;
  change?: string;
  subtext?: string;
  icon?: React.ReactNode;
  highlight?: boolean;
}

export const StatCard: React.FC<StatCardProps> = ({
  label,
  value,
  change,
  subtext,
  icon,
  highlight = false,
}) => {
  return (
    <div
      className={`p-6 rounded-2xl border transition-all duration-200 ${
        highlight
          ? 'bg-[#166534] text-white border-[#166534] shadow-sm'
          : 'bg-[#FCFDF9] text-[#17231D] border-[#12372A]/10 hover:border-[#166534]/30 shadow-xs'
      }`}
    >
      <div className="flex items-center justify-between gap-4 mb-3">
        <span
          className={`text-xs font-semibold tracking-wide uppercase ${
            highlight ? 'text-[#DCFCE7]' : 'text-[#647067]'
          }`}
        >
          {label}
        </span>
        {icon && (
          <div
            className={`p-2 rounded-xl ${
              highlight ? 'bg-white/10 text-white' : 'bg-[#DCFCE7] text-[#166534]'
            }`}
          >
            {icon}
          </div>
        )}
      </div>

      <div className="flex items-baseline gap-2">
        <div
          className={`text-3xl sm:text-4xl font-bold tracking-tight font-mono tabular-nums ${
            highlight ? 'text-white' : 'text-[#12372A]'
          }`}
        >
          {value}
        </div>
        {change && (
          <span
            className={`text-xs font-semibold ${
              highlight ? 'text-[#DCFCE7]' : 'text-emerald-700'
            }`}
          >
            {change}
          </span>
        )}
      </div>

      {subtext && (
        <p
          className={`text-xs mt-2 leading-relaxed ${
            highlight ? 'text-emerald-100' : 'text-[#647067]'
          }`}
        >
          {subtext}
        </p>
      )}
    </div>
  );
};
