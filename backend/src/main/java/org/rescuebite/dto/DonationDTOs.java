package org.rescuebite.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import org.rescuebite.model.FoodDonation;
import org.rescuebite.model.enums.DonationStatus;
import java.time.LocalDateTime;

public class DonationDTOs {

    public static class CreateDonationDTO {
        @NotBlank
        private String title;

        @NotBlank
        private String description;

        @NotBlank
        private String category;

        @NotNull @Positive
        private Double quantity;

        @NotBlank
        private String unit;

        @NotBlank
        private String storageCondition;

        @NotBlank
        private String dietaryType;

        private String allergens;

        private LocalDateTime prepDateTime;
        private LocalDateTime pickupWindowStart;
        private LocalDateTime pickupWindowEnd;
        private LocalDateTime expiryDeadline;

        private String imageUrl;
        private String handlingInstructions;
        private String temperatureAtListing;

        public String getTitle() { return title; }
        public void setTitle(String title) { this.title = title; }
        public String getDescription() { return description; }
        public void setDescription(String description) { this.description = description; }
        public String getCategory() { return category; }
        public void setCategory(String category) { this.category = category; }
        public Double getQuantity() { return quantity; }
        public void setQuantity(Double quantity) { this.quantity = quantity; }
        public String getUnit() { return unit; }
        public void setUnit(String unit) { this.unit = unit; }
        public String getStorageCondition() { return storageCondition; }
        public void setStorageCondition(String storageCondition) { this.storageCondition = storageCondition; }
        public String getDietaryType() { return dietaryType; }
        public void setDietaryType(String dietaryType) { this.dietaryType = dietaryType; }
        public String getAllergens() { return allergens; }
        public void setAllergens(String allergens) { this.allergens = allergens; }
        public LocalDateTime getPrepDateTime() { return prepDateTime; }
        public void setPrepDateTime(LocalDateTime prepDateTime) { this.prepDateTime = prepDateTime; }
        public LocalDateTime getPickupWindowStart() { return pickupWindowStart; }
        public void setPickupWindowStart(LocalDateTime pickupWindowStart) { this.pickupWindowStart = pickupWindowStart; }
        public LocalDateTime getPickupWindowEnd() { return pickupWindowEnd; }
        public void setPickupWindowEnd(LocalDateTime pickupWindowEnd) { this.pickupWindowEnd = pickupWindowEnd; }
        public LocalDateTime getExpiryDeadline() { return expiryDeadline; }
        public void setExpiryDeadline(LocalDateTime expiryDeadline) { this.expiryDeadline = expiryDeadline; }
        public String getImageUrl() { return imageUrl; }
        public void setImageUrl(String imageUrl) { this.imageUrl = imageUrl; }
        public String getHandlingInstructions() { return handlingInstructions; }
        public void setHandlingInstructions(String handlingInstructions) { this.handlingInstructions = handlingInstructions; }
        public String getTemperatureAtListing() { return temperatureAtListing; }
        public void setTemperatureAtListing(String temperatureAtListing) { this.temperatureAtListing = temperatureAtListing; }
    }

    public static class DonationResponseDTO {
        private Long id;
        private String title;
        private String description;
        private String category;
        private Double quantity;
        private String unit;
        private Long donorId;
        private String donorName;
        private String donorType;
        private String donorAddress;
        private String city;
        private String storageCondition;
        private String dietaryType;
        private String allergens;
        private LocalDateTime prepDateTime;
        private LocalDateTime pickupWindowStart;
        private LocalDateTime pickupWindowEnd;
        private LocalDateTime expiryDeadline;
        private DonationStatus status;
        private Long claimedByOrgId;
        private String claimedByOrgName;
        private LocalDateTime scheduledPickupTime;
        private String imageUrl;
        private String handlingInstructions;
        private String temperatureAtListing;
        private LocalDateTime createdAt;

        public static DonationResponseDTO fromEntity(FoodDonation entity) {
            DonationResponseDTO dto = new DonationResponseDTO();
            dto.id = entity.getId();
            dto.title = entity.getTitle();
            dto.description = entity.getDescription();
            dto.category = entity.getCategory();
            dto.quantity = entity.getQuantity();
            dto.unit = entity.getUnit();
            if (entity.getDonor() != null) {
                dto.donorId = entity.getDonor().getId();
                dto.donorName = entity.getDonor().getOrganizationName();
                dto.donorType = entity.getDonor().getOrganizationType();
                dto.donorAddress = entity.getDonor().getAddress();
                dto.city = entity.getDonor().getCity();
            }
            dto.storageCondition = entity.getStorageCondition();
            dto.dietaryType = entity.getDietaryType();
            dto.allergens = entity.getAllergens();
            dto.prepDateTime = entity.getPrepDateTime();
            dto.pickupWindowStart = entity.getPickupWindowStart();
            dto.pickupWindowEnd = entity.getPickupWindowEnd();
            dto.expiryDeadline = entity.getExpiryDeadline();
            dto.status = entity.getStatus();
            if (entity.getClaimedByOrg() != null) {
                dto.claimedByOrgId = entity.getClaimedByOrg().getId();
                dto.claimedByOrgName = entity.getClaimedByOrg().getOrganizationName();
            }
            dto.scheduledPickupTime = entity.getScheduledPickupTime();
            dto.imageUrl = entity.getImageUrl();
            dto.handlingInstructions = entity.getHandlingInstructions();
            dto.temperatureAtListing = entity.getTemperatureAtListing();
            dto.createdAt = entity.getCreatedAt();
            return dto;
        }

        public Long getId() { return id; }
        public String getTitle() { return title; }
        public String getDescription() { return description; }
        public String getCategory() { return category; }
        public Double getQuantity() { return quantity; }
        public String getUnit() { return unit; }
        public Long getDonorId() { return donorId; }
        public String getDonorName() { return donorName; }
        public String getDonorType() { return donorType; }
        public String getDonorAddress() { return donorAddress; }
        public String getCity() { return city; }
        public String getStorageCondition() { return storageCondition; }
        public String getDietaryType() { return dietaryType; }
        public String getAllergens() { return allergens; }
        public LocalDateTime getPrepDateTime() { return prepDateTime; }
        public LocalDateTime getPickupWindowStart() { return pickupWindowStart; }
        public LocalDateTime getPickupWindowEnd() { return pickupWindowEnd; }
        public LocalDateTime getExpiryDeadline() { return expiryDeadline; }
        public DonationStatus getStatus() { return status; }
        public Long getClaimedByOrgId() { return claimedByOrgId; }
        public String getClaimedByOrgName() { return claimedByOrgName; }
        public LocalDateTime getScheduledPickupTime() { return scheduledPickupTime; }
        public String getImageUrl() { return imageUrl; }
        public String getHandlingInstructions() { return handlingInstructions; }
        public String getTemperatureAtListing() { return temperatureAtListing; }
        public LocalDateTime getCreatedAt() { return createdAt; }
    }
}
