import React from 'react';
import { DonationStatus } from '../../types';
import { Check, Clock, Truck, PackageCheck, AlertCircle } from 'lucide-react';

interface StatusTimelineProps {
  currentStatus: DonationStatus;
  scheduledTime?: string;
  claimedAt?: string;
  collectedAt?: string;
}

export const StatusTimeline: React.FC<StatusTimelineProps> = ({
  currentStatus,
  scheduledTime,
  claimedAt,
  collectedAt,
}) => {
  const isCancelled = currentStatus === 'cancelled';
  const isExpired = currentStatus === 'expired';

  if (isCancelled || isExpired) {
    return (
      <div className="p-4 rounded-xl bg-rose-50/60 border border-rose-200 text-rose-900 flex items-center gap-3">
        <AlertCircle className="w-5 h-5 text-rose-600 shrink-0" />
        <div className="text-xs">
          <span className="font-semibold">
            {isExpired ? 'Listing Expired' : 'Listing Cancelled'}:
          </span>{' '}
          {isExpired
            ? 'The safe collection deadline has passed. This donation can no longer be collected.'
            : 'The donor cancelled this donation.'}
        </div>
      </div>
    );
  }

  const steps = [
    { key: 'available', label: '1. Listed', desc: 'Ready for claim' },
    { key: 'reserved', label: '2. Reserved', desc: claimedAt ? 'NGO verified' : 'Claimed' },
    { key: 'pickup_scheduled', label: '3. Scheduled', desc: scheduledTime ? 'Transport planned' : 'In dispatch' },
    { key: 'collected', label: '4. In Transit', desc: collectedAt ? 'Handover verified' : 'Loaded' },
    { key: 'completed', label: '5. Completed', desc: 'Meals served' },
  ];

  const getStepIndex = (status: DonationStatus) => {
    switch (status) {
      case 'available':
        return 0;
      case 'reserved':
        return 1;
      case 'pickup_scheduled':
        return 2;
      case 'collected':
        return 3;
      case 'completed':
        return 4;
      default:
        return 0;
    }
  };

  const currentIndex = getStepIndex(currentStatus);

  return (
    <div className="py-2">
      <div className="grid grid-cols-5 gap-2 relative">
        {/* Connector line */}
        <div className="absolute top-4 left-6 right-6 h-0.5 bg-gray-200 -z-0" />

        {steps.map((step, idx) => {
          const isDone = idx <= currentIndex;
          const isCurrent = idx === currentIndex;

          return (
            <div key={step.key} className="flex flex-col items-center text-center z-10">
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all ${
                  isDone
                    ? 'bg-[#166534] text-white shadow-xs'
                    : 'bg-white border-2 border-gray-300 text-gray-400'
                } ${isCurrent ? 'ring-4 ring-[#DCFCE7]' : ''}`}
              >
                {isDone ? <Check className="w-4 h-4" /> : idx + 1}
              </div>
              <span
                className={`text-[11px] font-semibold mt-2 ${
                  isDone ? 'text-[#12372A]' : 'text-gray-400'
                }`}
              >
                {step.label}
              </span>
              <span className="text-[10px] text-[#647067] hidden sm:block mt-0.5">
                {step.desc}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
};
