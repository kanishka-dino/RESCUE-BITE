import React from 'react';
import { DonationStatus } from '../../types';
import { CheckCircle2, Clock, AlertTriangle, XCircle, PackageCheck, Truck } from 'lucide-react';

interface StatusBadgeProps {
  status: DonationStatus;
  showIcon?: boolean;
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({ status, showIcon = true }) => {
  const config: Record<
    DonationStatus,
    { label: string; textClass: string; icon: React.ReactNode }
  > = {
    available: {
      label: 'Available Now',
      textClass: 'text-[#166534] font-semibold',
      icon: <CheckCircle2 className="w-3.5 h-3.5 text-[#166534]" />,
    },
    reserved: {
      label: 'Reserved by NGO',
      textClass: 'text-amber-700 font-semibold',
      icon: <Clock className="w-3.5 h-3.5 text-amber-600" />,
    },
    pickup_scheduled: {
      label: 'Pickup Scheduled',
      textClass: 'text-sky-700 font-semibold',
      icon: <Truck className="w-3.5 h-3.5 text-sky-600" />,
    },
    collected: {
      label: 'Collected in Transit',
      textClass: 'text-indigo-700 font-semibold',
      icon: <PackageCheck className="w-3.5 h-3.5 text-indigo-600" />,
    },
    completed: {
      label: 'Redistributed',
      textClass: 'text-emerald-700 font-semibold',
      icon: <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />,
    },
    expired: {
      label: 'Passed Safe Deadline',
      textClass: 'text-rose-700 font-semibold',
      icon: <AlertTriangle className="w-3.5 h-3.5 text-rose-600" />,
    },
    cancelled: {
      label: 'Listing Cancelled',
      textClass: 'text-gray-500 font-semibold',
      icon: <XCircle className="w-3.5 h-3.5 text-gray-500" />,
    },
  };

  const item = config[status] || {
    label: status,
    textClass: 'text-gray-600 font-medium',
    icon: null,
  };

  return (
    <span className={`inline-flex items-center gap-1.5 text-xs ${item.textClass}`}>
      {showIcon && item.icon}
      <span>{item.label}</span>
    </span>
  );
};
