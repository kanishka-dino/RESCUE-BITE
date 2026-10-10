import React, { useState } from 'react';
import { FoodDonation } from '../../types';
import { Modal } from '../common/Modal';
import { StatusBadge } from '../common/StatusBadge';
import { StatusTimeline } from './StatusTimeline';
import { FoodSafetyNotice } from './FoodSafetyNotice';
import {
  MapPin,
  Clock,
  Thermometer,
  ShieldAlert,
  AlertTriangle,
  Building2,
  Calendar,
  Sparkles,
  Info
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { adminService } from '../../services/adminService';

interface DonationDetailModalProps {
  donation: FoodDonation | null;
  isOpen: boolean;
  onClose: () => void;
  onClaim?: (donation: FoodDonation) => void;
}

export const DonationDetailModal: React.FC<DonationDetailModalProps> = ({
  donation,
  isOpen,
  onClose,
  onClaim,
}) => {
  const { currentUser, role } = useAuth();
  const { showToast } = useToast();
  const [reporting, setReporting] = useState(false);
  const [reportReason, setReportReason] = useState('');

  if (!donation) return null;

  const handleReport = (e: React.FormEvent) => {
    e.preventDefault();
    if (!reportReason.trim()) return;

    adminService.addReport({
      donationId: donation.id,
      donationTitle: donation.title,
      donorName: donation.donorName,
      reporterName: currentUser ? currentUser.name : 'Community Volunteer',
      reporterOrg: currentUser ? currentUser.organizationName : 'Public Observer',
      reason: reportReason,
      severity: 'medium',
    });

    showToast('Report submitted for safety board review. Thank you for keeping food safe.', 'info');
    setReporting(false);
    setReportReason('');
  };

  const isExpired =
    donation.status === 'expired' || new Date(donation.expiryDeadline).getTime() < Date.now();

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={donation.title}
      subtitle={`${donation.category} • Listed by ${donation.donorName}`}
      maxWidth="xl"
    >
      <div className="space-y-6">
        
        {/* Status Timeline */}
        <div className="bg-[#F5FAF4] p-4 rounded-xl border border-[#12372A]/10">
          <StatusTimeline
            currentStatus={donation.status}
            scheduledTime={donation.scheduledPickupTime}
            claimedAt={donation.claimedAt}
            collectedAt={donation.collectedAt}
          />
        </div>

        {/* Hero image and quick summary */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
          <div className="rounded-xl overflow-hidden aspect-4/3 bg-gray-100 border">
            <img
              src={donation.imageUrl}
              alt={donation.title}
              referrerPolicy="no-referrer"
              className="w-full h-full object-cover"
            />
          </div>

          <div className="space-y-4">
            <div>
              <div className="flex items-center gap-2 mb-1.5">
                <StatusBadge status={donation.status} />
                <span className="text-xs text-[#647067]">·</span>
                <span className="text-xs font-semibold text-[#166534]">{donation.dietaryType}</span>
              </div>
              <h3 className="text-lg font-bold text-[#17231D]">{donation.title}</h3>
              <p className="text-xs text-[#647067] mt-1.5 leading-relaxed">
                {donation.description}
              </p>
            </div>

            {/* Key metrics */}
            <div className="grid grid-cols-2 gap-3 p-3.5 bg-white rounded-xl border border-gray-100 text-xs">
              <div>
                <span className="text-gray-400 block text-[11px]">Total Quantity</span>
                <span className="font-bold text-[#12372A] text-base font-mono tabular-nums">
                  {donation.quantity} {donation.unit}
                </span>
              </div>
              <div>
                <span className="text-gray-400 block text-[11px]">Holding Temp</span>
                <span className="font-semibold text-[#166534] text-base flex items-center gap-1 font-mono">
                  <Thermometer className="w-4 h-4" />
                  {donation.temperatureAtListing || 'Standard'}
                </span>
              </div>
            </div>

            {/* Preparation and Expiry timing */}
            <div className="space-y-2 text-xs">
              <div className="flex items-center gap-2 text-gray-600">
                <Calendar className="w-4 h-4 text-[#166534] shrink-0" />
                <span>Prepared: </span>
                <span className="font-medium text-[#17231D]">
                  {new Date(donation.prepDateTime).toLocaleString()}
                </span>
              </div>
              <div className="flex items-center gap-2 text-gray-600">
                <Clock className="w-4 h-4 text-amber-600 shrink-0" />
                <span>Safe Collection Deadline: </span>
                <span className="font-semibold text-rose-700">
                  {new Date(donation.expiryDeadline).toLocaleString()}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Detailed Safety & Handling Specs */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="p-4 bg-white rounded-xl border border-gray-100 text-xs space-y-2">
            <h4 className="font-bold text-[#12372A] flex items-center gap-1.5">
              <Thermometer className="w-4 h-4 text-[#166534]" />
              Storage & Handling Guidelines
            </h4>
            <div className="text-[#647067] space-y-1">
              <div>
                <span className="font-medium text-gray-800">Storage Required: </span>
                {donation.storageCondition}
              </div>
              <div>
                <span className="font-medium text-gray-800">Donor Notes: </span>
                {donation.handlingInstructions}
              </div>
            </div>
          </div>

          <div className="p-4 bg-white rounded-xl border border-gray-100 text-xs space-y-2">
            <h4 className="font-bold text-[#12372A] flex items-center gap-1.5">
              <AlertTriangle className="w-4 h-4 text-amber-600" />
              Allergen Declarations
            </h4>
            <div className="flex flex-wrap gap-1.5 pt-1">
              {donation.allergens.map((alg) => (
                <span
                  key={alg}
                  className="px-2.5 py-1 bg-amber-50 text-amber-900 border border-amber-200 rounded-lg text-[11px] font-medium"
                >
                  {alg}
                </span>
              ))}
            </div>
            <p className="text-[11px] text-[#647067] pt-1">
              Cross-contamination warnings: Verified commercial facility.
            </p>
          </div>
        </div>

        {/* Donor Pickup Location */}
        <div className="p-4 bg-white rounded-xl border border-gray-100 text-xs flex items-start gap-3">
          <Building2 className="w-5 h-5 text-[#166534] shrink-0 mt-0.5" />
          <div className="space-y-1 flex-1">
            <div className="flex items-center justify-between">
              <span className="font-bold text-[#17231D]">{donation.donorName}</span>
              <span className="text-[11px] text-[#166534] font-semibold bg-[#DCFCE7] px-2 py-0.5 rounded">
                {donation.donorType}
              </span>
            </div>
            <div className="flex items-center gap-1 text-gray-600">
              <MapPin className="w-3.5 h-3.5 text-gray-400 shrink-0" />
              <span>{donation.donorAddress}, {donation.area}, {donation.city}</span>
            </div>
            <div className="text-[11px] text-gray-500">
              Pickup window: {new Date(donation.pickupWindowStart).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} – {new Date(donation.pickupWindowEnd).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
            </div>
          </div>
        </div>

        {/* Food safety guidance banner */}
        <FoodSafetyNotice compact />

        {/* Claim Info if claimed */}
        {donation.claimedByOrgName && (
          <div className="p-3.5 bg-blue-50/70 border border-blue-200 rounded-xl text-xs text-blue-950 flex items-center gap-2.5">
            <Sparkles className="w-4 h-4 text-blue-600 shrink-0" />
            <div>
              <span className="font-bold">Claimed by Partner: </span>
              <span>{donation.claimedByOrgName}</span>
              {donation.scheduledPickupTime && (
                <span className="block text-[11px] text-blue-700 mt-0.5">
                  Scheduled collection: {new Date(donation.scheduledPickupTime).toLocaleString()}
                </span>
              )}
            </div>
          </div>
        )}

        {/* Reporting form */}
        {reporting ? (
          <form onSubmit={handleReport} className="p-4 bg-rose-50/70 border border-rose-200 rounded-xl space-y-3">
            <div className="flex items-center gap-2 text-rose-900 font-semibold text-xs">
              <ShieldAlert className="w-4 h-4 text-rose-600" />
              <span>Report Food Safety or Misleading Information</span>
            </div>
            <textarea
              required
              rows={2}
              value={reportReason}
              onChange={(e) => setReportReason(e.target.value)}
              placeholder="Describe the issue (e.g. broken temperature holding, incorrect allergens, expired item)..."
              className="w-full text-xs p-2.5 bg-white border border-rose-200 rounded-lg focus:ring-2 focus:ring-rose-500 focus:outline-none"
            />
            <div className="flex items-center gap-2 justify-end">
              <button
                type="button"
                onClick={() => setReporting(false)}
                className="px-3 py-1.5 text-xs text-gray-600 hover:text-gray-900"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-1.5 text-xs font-semibold bg-rose-600 hover:bg-rose-700 text-white rounded-lg"
              >
                Submit Report
              </button>
            </div>
          </form>
        ) : (
          <div className="flex items-center justify-between pt-2">
            <button
              onClick={() => setReporting(true)}
              className="text-xs text-gray-400 hover:text-rose-600 flex items-center gap-1 transition-colors"
            >
              <ShieldAlert className="w-3.5 h-3.5" />
              <span>Flag Unsafe Listing</span>
            </button>
          </div>
        )}

        {/* Footer Actions */}
        <div className="pt-4 border-t border-gray-100 flex items-center justify-end gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2.5 text-xs font-semibold text-[#647067] hover:text-[#17231D] rounded-xl hover:bg-gray-100"
          >
            Close
          </button>

          {donation.status === 'available' && !isExpired && onClaim && (
            <button
              onClick={() => {
                onClose();
                onClaim(donation);
              }}
              className="px-6 py-2.5 text-xs font-bold text-white bg-[#166534] hover:bg-[#12372A] rounded-xl shadow-xs transition-colors flex items-center gap-2"
            >
              <span>Proceed to Claim</span>
            </button>
          )}

          {isExpired && (
            <div className="px-4 py-2 text-xs font-medium text-rose-700 bg-rose-50 rounded-xl">
              Cannot Claim: Past Expiry
            </div>
          )}
        </div>

      </div>
    </Modal>
  );
};
