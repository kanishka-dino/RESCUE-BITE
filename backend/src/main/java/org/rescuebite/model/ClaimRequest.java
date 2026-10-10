package org.rescuebite.model;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "claims")
public class ClaimRequest {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "donation_id", nullable = false)
    private FoodDonation donation;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "recipient_org_id", nullable = false)
    private User recipientOrg;

    @Column(name = "volunteer_name", length = 100)
    private String volunteerName;

    @Column(name = "volunteer_phone", length = 30)
    private String volunteerPhone;

    @Column(name = "beneficiaries_count")
    private Integer beneficiariesCount = 0;

    @Column(name = "scheduled_pickup_time", nullable = false)
    private LocalDateTime scheduledPickupTime;

    @Column(length = 30)
    private String status = "RESERVED";

    @Column(columnDefinition = "TEXT")
    private String notes;

    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt = LocalDateTime.now();

    public ClaimRequest() {}

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public FoodDonation getDonation() { return donation; }
    public void setDonation(FoodDonation donation) { this.donation = donation; }

    public User getRecipientOrg() { return recipientOrg; }
    public void setRecipientOrg(User recipientOrg) { this.recipientOrg = recipientOrg; }

    public String getVolunteerName() { return volunteerName; }
    public void setVolunteerName(String volunteerName) { this.volunteerName = volunteerName; }

    public String getVolunteerPhone() { return volunteerPhone; }
    public void setVolunteerPhone(String volunteerPhone) { this.volunteerPhone = volunteerPhone; }

    public Integer getBeneficiariesCount() { return beneficiariesCount; }
    public void setBeneficiariesCount(Integer beneficiariesCount) { this.beneficiariesCount = beneficiariesCount; }

    public LocalDateTime getScheduledPickupTime() { return scheduledPickupTime; }
    public void setScheduledPickupTime(LocalDateTime scheduledPickupTime) { this.scheduledPickupTime = scheduledPickupTime; }

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }

    public String getNotes() { return notes; }
    public void setNotes(String notes) { this.notes = notes; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
}
