package org.rescuebite.dto;

import jakarta.validation.constraints.NotNull;
import java.time.LocalDateTime;

public class ClaimDTOs {

    public static class ClaimRequestDTO {
        @NotNull
        private Long donationId;
        private String volunteerName;
        private String volunteerPhone;
        private Integer beneficiaryCount = 50;
        private LocalDateTime scheduledPickupTime;
        private String notes;

        public Long getDonationId() { return donationId; }
        public void setDonationId(Long donationId) { this.donationId = donationId; }
        public String getVolunteerName() { return volunteerName; }
        public void setVolunteerName(String volunteerName) { this.volunteerName = volunteerName; }
        public String getVolunteerPhone() { return volunteerPhone; }
        public void setVolunteerPhone(String volunteerPhone) { this.volunteerPhone = volunteerPhone; }
        public Integer getBeneficiaryCount() { return beneficiaryCount; }
        public void setBeneficiaryCount(Integer beneficiaryCount) { this.beneficiaryCount = beneficiaryCount; }
        public LocalDateTime getScheduledPickupTime() { return scheduledPickupTime; }
        public void setScheduledPickupTime(LocalDateTime scheduledPickupTime) { this.scheduledPickupTime = scheduledPickupTime; }
        public String getNotes() { return notes; }
        public void setNotes(String notes) { this.notes = notes; }
    }

    public static class ClaimResponseDTO {
        private Long id;
        private Long donationId;
        private String donationTitle;
        private Long recipientOrgId;
        private String recipientOrgName;
        private String volunteerName;
        private String volunteerPhone;
        private Integer beneficiaryCount;
        private LocalDateTime scheduledPickupTime;
        private String status;
        private String notes;
        private LocalDateTime createdAt;

        public Long getId() { return id; }
        public void setId(Long id) { this.id = id; }
        public Long getDonationId() { return donationId; }
        public void setDonationId(Long donationId) { this.donationId = donationId; }
        public String getDonationTitle() { return donationTitle; }
        public void setDonationTitle(String donationTitle) { this.donationTitle = donationTitle; }
        public Long getRecipientOrgId() { return recipientOrgId; }
        public void setRecipientOrgId(Long recipientOrgId) { this.recipientOrgId = recipientOrgId; }
        public String getRecipientOrgName() { return recipientOrgName; }
        public void setRecipientOrgName(String recipientOrgName) { this.recipientOrgName = recipientOrgName; }
        public String getVolunteerName() { return volunteerName; }
        public void setVolunteerName(String volunteerName) { this.volunteerName = volunteerName; }
        public String getVolunteerPhone() { return volunteerPhone; }
        public void setVolunteerPhone(String volunteerPhone) { this.volunteerPhone = volunteerPhone; }
        public Integer getBeneficiaryCount() { return beneficiaryCount; }
        public void setBeneficiaryCount(Integer beneficiaryCount) { this.beneficiaryCount = beneficiaryCount; }
        public LocalDateTime getScheduledPickupTime() { return scheduledPickupTime; }
        public void setScheduledPickupTime(LocalDateTime scheduledPickupTime) { this.scheduledPickupTime = scheduledPickupTime; }
        public String getStatus() { return status; }
        public void setStatus(String status) { this.status = status; }
        public String getNotes() { return notes; }
        public void setNotes(String notes) { this.notes = notes; }
        public LocalDateTime getCreatedAt() { return createdAt; }
        public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
    }
}
