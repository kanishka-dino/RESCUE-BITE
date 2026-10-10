package org.rescuebite.controller;

import jakarta.validation.Valid;
import org.rescuebite.dto.ClaimDTOs.*;
import org.rescuebite.dto.DonationDTOs.*;
import org.rescuebite.model.enums.DonationStatus;
import org.rescuebite.service.FoodDonationService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/donations")
public class FoodDonationController {

    private final FoodDonationService donationService;

    public FoodDonationController(FoodDonationService donationService) {
        this.donationService = donationService;
    }

    @GetMapping
    public ResponseEntity<List<DonationResponseDTO>> getDonations(
            @RequestParam(required = false) String category,
            @RequestParam(required = false) String status,
            @RequestParam(required = false) String search) {
        return ResponseEntity.ok(donationService.getDonations(category, status, search));
    }

    @GetMapping("/{id}")
    public ResponseEntity<DonationResponseDTO> getDonationById(@PathVariable Long id) {
        return ResponseEntity.ok(donationService.getDonationById(id));
    }

    @PostMapping
    @PreAuthorize("hasAuthority('ROLE_DONOR')")
    public ResponseEntity<DonationResponseDTO> createDonation(
            @Valid @RequestBody CreateDonationDTO dto,
            Authentication authentication) {
        String email = authentication.getName();
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(donationService.createDonation(dto, email));
    }

    @PostMapping("/{id}/claims")
    @PreAuthorize("hasAuthority('ROLE_RECIPIENT')")
    public ResponseEntity<ClaimResponseDTO> claimDonation(
            @PathVariable Long id,
            @Valid @RequestBody ClaimRequestDTO claimDTO,
            Authentication authentication) {
        String email = authentication.getName();
        return ResponseEntity.ok(donationService.claimDonation(id, claimDTO, email));
    }

    @PatchMapping("/{id}/status")
    public ResponseEntity<DonationResponseDTO> updateStatus(
            @PathVariable Long id,
            @RequestParam DonationStatus newStatus,
            Authentication authentication) {
        String actor = authentication != null ? authentication.getName() : "System Coordinator";
        return ResponseEntity.ok(donationService.updateStatus(id, newStatus, actor));
    }
}
