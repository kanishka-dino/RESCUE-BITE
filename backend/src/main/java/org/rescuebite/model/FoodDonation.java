package org.rescuebite.model;

import jakarta.persistence.*;
import org.rescuebite.model.enums.DonationStatus;
import java.time.LocalDateTime;

@Entity
@Table(name = "donations")
public class FoodDonation {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, length = 180)
    private String title;

    @Column(columnDefinition = "TEXT", nullable = false)
    private String description;

    @Column(nullable = false, length = 60)
    private String category;

    @Column(nullable = false)
    private Double quantity;

    @Column(nullable = false, length = 30)
    private String unit;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "donor_id", nullable = false)
    private User donor;

    @Column(name = "storage_condition", nullable = false, length = 80)
    private String storageCondition;

    @Column(name = "dietary_type", nullable = false, length = 40)
    private String dietaryType;

    @Column(length = 255)
    private String allergens;

    @Column(name = "prep_timestamp", nullable = false)
    private LocalDateTime prepDateTime;

    @Column(name = "pickup_window_start", nullable = false)
    private LocalDateTime pickupWindowStart;

    @Column(name = "pickup_window_end", nullable = false)
    private LocalDateTime pickupWindowEnd;

    @Column(name = "expiry_deadline", nullable = false)
    private LocalDateTime expiryDeadline;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 40)
    private DonationStatus status = DonationStatus.AVAILABLE;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "claimed_by_org_id")
    private User claimedByOrg;

    @Column(name = "claimed_at")
    private LocalDateTime claimedAt;

    @Column(name = "scheduled_pickup_time")
    private LocalDateTime scheduledPickupTime;

    @Column(name = "collected_at")
    private LocalDateTime collectedAt;

    @Column(name = "image_url", length = 500)
    private String imageUrl;

    @Column(name = "handling_instructions", columnDefinition = "TEXT")
    private String handlingInstructions;

    @Column(name = "temperature_at_listing", length = 30)
    private String temperatureAtListing;

    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt = LocalDateTime.now();

    public FoodDonation() {}

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

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

    public User getDonor() { return donor; }
    public void setDonor(User donor) { this.donor = donor; }

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

    public DonationStatus getStatus() { return status; }
    public void setStatus(DonationStatus status) { this.status = status; }

    public User getClaimedByOrg() { return claimedByOrg; }
    public void setClaimedByOrg(User claimedByOrg) { this.claimedByOrg = claimedByOrg; }

    public LocalDateTime getClaimedAt() { return claimedAt; }
    public void setClaimedAt(LocalDateTime claimedAt) { this.claimedAt = claimedAt; }

    public LocalDateTime getScheduledPickupTime() { return scheduledPickupTime; }
    public void setScheduledPickupTime(LocalDateTime scheduledPickupTime) { this.scheduledPickupTime = scheduledPickupTime; }

    public LocalDateTime getCollectedAt() { return collectedAt; }
    public void setCollectedAt(LocalDateTime collectedAt) { this.collectedAt = collectedAt; }

    public String getImageUrl() { return imageUrl; }
    public void setImageUrl(String imageUrl) { this.imageUrl = imageUrl; }

    public String getHandlingInstructions() { return handlingInstructions; }
    public void setHandlingInstructions(String handlingInstructions) { this.handlingInstructions = handlingInstructions; }

    public String getTemperatureAtListing() { return temperatureAtListing; }
    public void setTemperatureAtListing(String temperatureAtListing) { this.temperatureAtListing = temperatureAtListing; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
}
