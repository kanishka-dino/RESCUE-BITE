import React, { useState } from 'react';
import { FoodDonation } from '../../types';
import { Modal } from '../common/Modal';
import { Button } from '../common/Button';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { donationService } from '../../services/donationService';
import { adminService } from '../../services/adminService';
import { ShieldCheck, Calendar, Users, Truck, AlertTriangle } from 'lucide-react';

interface ClaimDonationModalProps {
  donation: FoodDonation | null;
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export const ClaimDonationModal: React.FC<ClaimDonationModalProps> = ({
  donation,
  isOpen,
  onClose,
  onSuccess,
}) => {
  const { currentUser } = useAuth();
  const { showToast } = useToast();

  const [volunteerName, setVolunteerName] = useState(currentUser?.name || '');
  const [volunteerPhone, setVolunteerPhone] = useState(currentUser?.phone || '');
  const [beneficiaries, setBeneficiaries] = useState(50);
  const [pickupTime, setPickupTime] = useState('');
  const [notes, setNotes] = useState('');
  const [confirmedSafety, setConfirmedSafety] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!donation) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!confirmedSafety) {
      showToast('Please confirm adherence to food transport safety guidelines.', 'error');
      return;
    }

    setIsSubmitting(true);
    try {
      const orgId = currentUser?.id || 'usr_recipient_1';
      const orgName = currentUser?.organizationName || 'St. Jude Community Meals & Shelter';

      const scheduledTime = pickupTime || donation.pickupWindowStart;

      await donationService.claimDonation({
        donationId: donation.id,
        organizationId: orgId,
        organizationName: orgName,
        volunteerName,
        volunteerPhone,
        beneficiaryCount: Number(beneficiaries),
        notes,
        scheduledPickupTime: scheduledTime,
      });

      adminService.addAuditLog({
        donationId: donation.id,
        action: 'DONATION_CLAIMED',
        actorName: volunteerName || orgName,
        actorRole: 'recipient',
        details: `${orgName} claimed ${donation.quantity} ${donation.unit} of "${donation.title}". Scheduled pickup: ${new Date(scheduledTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}.`,
        severity: 'info',
      });

      showToast(`Successfully claimed "${donation.title}"! Pickup coordinated.`, 'success');
      onSuccess();
      onClose();
    } catch (err: any) {
      showToast(err.message || 'Failed to claim donation', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Confirm Food Rescue Claim"
      subtitle={`Reserving ${donation.quantity} ${donation.unit} from ${donation.donorName}`}
      maxWidth="md"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        
        {/* Summary box */}
        <div className="p-3.5 bg-[#F5FAF4] rounded-xl border border-[#166534]/20 text-xs space-y-1.5">
          <div className="font-bold text-[#12372A]">{donation.title}</div>
          <div className="text-[#647067] flex items-center gap-1.5">
            <Truck className="w-3.5 h-3.5 text-[#166534]" />
            <span>Pickup Address: {donation.donorAddress}, {donation.area}</span>
          </div>
          <div className="text-[#647067] flex items-center gap-1.5">
            <Calendar className="w-3.5 h-3.5 text-[#166534]" />
            <span>Allowed Window: {new Date(donation.pickupWindowStart).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} – {new Date(donation.pickupWindowEnd).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
          </div>
        </div>

        {/* Inputs */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
          <div>
            <label className="block font-semibold text-gray-700 mb-1">Volunteer Driver Name</label>
            <input
              type="text"
              required
              value={volunteerName}
              onChange={(e) => setVolunteerName(e.target.value)}
              placeholder="e.g. David Chen"
              className="w-full p-2.5 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#166534] focus:outline-none"
            />
          </div>

          <div>
            <label className="block font-semibold text-gray-700 mb-1">Driver Phone Number</label>
            <input
              type="tel"
              required
              value={volunteerPhone}
              onChange={(e) => setVolunteerPhone(e.target.value)}
              placeholder="+1 (555) 000-0000"
              className="w-full p-2.5 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#166534] focus:outline-none"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
          <div>
            <label className="block font-semibold text-gray-700 mb-1">Estimated Beneficiaries</label>
            <div className="relative">
              <input
                type="number"
                min={1}
                required
                value={beneficiaries}
                onChange={(e) => setBeneficiaries(Number(e.target.value))}
                className="w-full p-2.5 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#166534] focus:outline-none"
              />
              <Users className="w-4 h-4 text-gray-400 absolute right-3 top-3" />
            </div>
            <span className="text-[10px] text-gray-500 mt-0.5 block">Estimated people fed</span>
          </div>

          <div>
            <label className="block font-semibold text-gray-700 mb-1">Estimated Pickup Time</label>
            <input
              type="datetime-local"
              value={pickupTime}
              onChange={(e) => setPickupTime(e.target.value)}
              className="w-full p-2.5 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#166534] focus:outline-none"
            />
            <span className="text-[10px] text-gray-500 mt-0.5 block">Within donor window</span>
          </div>
        </div>

        <div className="text-xs">
          <label className="block font-semibold text-gray-700 mb-1">Special Pickup Notes</label>
          <input
            type="text"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="e.g. Arriving with insulated food cambros and refrigerated van..."
            className="w-full p-2.5 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#166534] focus:outline-none"
          />
        </div>

        {/* Safety Agreement */}
        <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl text-xs space-y-2">
          <div className="flex items-center gap-2 text-amber-900 font-semibold">
            <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0" />
            <span>Food Safety & Cold-Chain Commitment</span>
          </div>
          <label className="flex items-start gap-2.5 cursor-pointer text-gray-700">
            <input
              type="checkbox"
              required
              checked={confirmedSafety}
              onChange={(e) => setConfirmedSafety(e.target.checked)}
              className="mt-0.5 rounded text-[#166534] focus:ring-[#166534]"
            />
            <span className="text-[11px] leading-relaxed">
              I certify that our organization has sanitized transport containers, verified temperature maintenance equipment ({donation.storageCondition}), and will distribute this food before the safe deadline ({new Date(donation.expiryDeadline).toLocaleTimeString()}).
            </span>
          </label>
        </div>

        {/* Actions */}
        <div className="pt-2 flex items-center justify-end gap-3 border-t border-gray-100">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2.5 text-xs font-semibold text-gray-600 hover:text-gray-900"
          >
            Cancel
          </button>
          <Button
            type="submit"
            isLoading={isSubmitting}
            variant="primary"
            size="md"
          >
            <ShieldCheck className="w-4 h-4 mr-1.5" />
            Confirm & Reserve Donation
          </Button>
        </div>

      </form>
    </Modal>
  );
};
