package org.rescuebite.service;

import org.rescuebite.dto.ClaimDTOs.*;
import org.rescuebite.dto.DonationDTOs.*;
import org.rescuebite.model.AuditLog;
import org.rescuebite.model.ClaimRequest;
import org.rescuebite.model.FoodDonation;
import org.rescuebite.model.User;
import org.rescuebite.model.enums.DonationStatus;
import org.rescuebite.repository.AuditLogRepository;
import org.rescuebite.repository.ClaimRequestRepository;
import org.rescuebite.repository.FoodDonationRepository;
import org.rescuebite.repository.UserRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class FoodDonationService {

    private final FoodDonationRepository donationRepository;
    private final ClaimRequestRepository claimRepository;
    private final UserRepository userRepository;
    private final AuditLogRepository auditLogRepository;

    public FoodDonationService(FoodDonationRepository donationRepository,
                               ClaimRequestRepository claimRepository,
                               UserRepository userRepository,
                               AuditLogRepository auditLogRepository) {
        this.donationRepository = donationRepository;
        this.claimRepository = claimRepository;
        this.userRepository = userRepository;
        this.auditLogRepository = auditLogRepository;
    }

    public List<DonationResponseDTO> getDonations(String category, String status, String query) {
        DonationStatus enumStatus = null;
        if (status != null && !status.equalsIgnoreCase("All")) {
            try {
                enumStatus = DonationStatus.valueOf(status.toUpperCase());
            } catch (Exception ignored) {}
        }

        List<FoodDonation> list;
        if (category == null && enumStatus == null && query == null) {
            list = donationRepository.findAll();
        } else {
            list = donationRepository.searchDonations(category, enumStatus, query);
        }

        // Auto-check expiry
        LocalDateTime now = LocalDateTime.now();
        list.forEach(d -> {
            if (d.getStatus() == DonationStatus.AVAILABLE && d.getExpiryDeadline() != null && d.getExpiryDeadline().isBefore(now)) {
                d.setStatus(DonationStatus.EXPIRED);
                donationRepository.save(d);
            }
        });

        return list.stream().map(DonationResponseDTO::fromEntity).collect(Collectors.toList());
    }

    public DonationResponseDTO getDonationById(Long id) {
        FoodDonation donation = donationRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Donation not found: " + id));
        return DonationResponseDTO.fromEntity(donation);
    }

    @Transactional
    public DonationResponseDTO createDonation(CreateDonationDTO dto, String userEmail) {
        User donor = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new RuntimeException("Donor user not found: " + userEmail));

        FoodDonation d = new FoodDonation();
        d.setTitle(dto.getTitle());
        d.setDescription(dto.getDescription());
        d.setCategory(dto.getCategory());
        d.setQuantity(dto.getQuantity());
        d.setUnit(dto.getUnit());
        d.setDonor(donor);
        d.setStorageCondition(dto.getStorageCondition());
        d.setDietaryType(dto.getDietaryType());
        d.setAllergens(dto.getAllergens());
        d.setPrepDateTime(dto.getPrepDateTime() != null ? dto.getPrepDateTime() : LocalDateTime.now());
        d.setPickupWindowStart(dto.getPickupWindowStart() != null ? dto.getPickupWindowStart() : LocalDateTime.now().plusHours(1));
        d.setPickupWindowEnd(dto.getPickupWindowEnd() != null ? dto.getPickupWindowEnd() : LocalDateTime.now().plusHours(4));
        d.setExpiryDeadline(dto.getExpiryDeadline() != null ? dto.getExpiryDeadline() : LocalDateTime.now().plusHours(6));
        d.setStatus(DonationStatus.AVAILABLE);
        d.setImageUrl(dto.getImageUrl());
        d.setHandlingInstructions(dto.getHandlingInstructions());
        d.setTemperatureAtListing(dto.getTemperatureAtListing());

        FoodDonation saved = donationRepository.save(d);

        auditLogRepository.save(new AuditLog(
                saved.getId(),
                "LISTING_CREATED",
                donor.getName(),
                "donor",
                "New surplus listing created: " + saved.getTitle() + " (" + saved.getQuantity() + " " + saved.getUnit() + ")",
                "info"
        ));

        return DonationResponseDTO.fromEntity(saved);
    }

    @Transactional
    public ClaimResponseDTO claimDonation(Long donationId, ClaimRequestDTO claimDTO, String userEmail) {
        User recipient = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new RuntimeException("Recipient organization not found: " + userEmail));

        FoodDonation donation = donationRepository.findById(donationId)
                .orElseThrow(() -> new RuntimeException("Donation not found: " + donationId));

        if (donation.getStatus() != DonationStatus.AVAILABLE) {
            throw new RuntimeException("Donation is no longer available. Current status: " + donation.getStatus());
        }

        if (donation.getExpiryDeadline() != null && donation.getExpiryDeadline().isBefore(LocalDateTime.now())) {
            donation.setStatus(DonationStatus.EXPIRED);
            donationRepository.save(donation);
            throw new RuntimeException("Donation safe collection deadline has passed.");
        }

        donation.setStatus(DonationStatus.RESERVED);
        donation.setClaimedByOrg(recipient);
        donation.setClaimedAt(LocalDateTime.now());
        donation.setScheduledPickupTime(claimDTO.getScheduledPickupTime() != null ? claimDTO.getScheduledPickupTime() : LocalDateTime.now().plusHours(2));
        donationRepository.save(donation);

        ClaimRequest claim = new ClaimRequest();
        claim.setDonation(donation);
        claim.setRecipientOrg(recipient);
        claim.setVolunteerName(claimDTO.getVolunteerName());
        claim.setVolunteerPhone(claimDTO.getVolunteerPhone());
        claim.setBeneficiariesCount(claimDTO.getBeneficiaryCount());
        claim.setScheduledPickupTime(donation.getScheduledPickupTime());
        claim.setStatus("RESERVED");
        claim.setNotes(claimDTO.getNotes());
        ClaimRequest savedClaim = claimRepository.save(claim);

        auditLogRepository.save(new AuditLog(
                donation.getId(),
                "DONATION_CLAIMED",
                recipient.getOrganizationName(),
                "recipient",
                "Claim reserved for " + donation.getTitle() + ". Driver: " + claim.getVolunteerName(),
                "info"
        ));

        ClaimResponseDTO resp = new ClaimResponseDTO();
        resp.setId(savedClaim.getId());
        resp.setDonationId(donation.getId());
        resp.setDonationTitle(donation.getTitle());
        resp.setRecipientOrgId(recipient.getId());
        resp.setRecipientOrgName(recipient.getOrganizationName());
        resp.setVolunteerName(savedClaim.getVolunteerName());
        resp.setVolunteerPhone(savedClaim.getVolunteerPhone());
        resp.setBeneficiaryCount(savedClaim.getBeneficiariesCount());
        resp.setScheduledPickupTime(savedClaim.getScheduledPickupTime());
        resp.setStatus(savedClaim.getStatus());
        resp.setNotes(savedClaim.getNotes());
        resp.setCreatedAt(savedClaim.getCreatedAt());

        return resp;
    }

    @Transactional
    public DonationResponseDTO updateStatus(Long id, DonationStatus newStatus, String actorName) {
        FoodDonation donation = donationRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Donation not found: " + id));

        donation.setStatus(newStatus);
        if (newStatus == DonationStatus.COLLECTED) {
            donation.setCollectedAt(LocalDateTime.now());
        }
        FoodDonation updated = donationRepository.save(donation);

        auditLogRepository.save(new AuditLog(
                id,
                "STATUS_UPDATED",
                actorName,
                "system",
                "Status changed to " + newStatus.name(),
                "info"
        ));

        return DonationResponseDTO.fromEntity(updated);
    }
}
