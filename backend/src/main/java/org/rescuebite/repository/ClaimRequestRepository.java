package org.rescuebite.repository;

import org.rescuebite.model.ClaimRequest;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface ClaimRequestRepository extends JpaRepository<ClaimRequest, Long> {
    List<ClaimRequest> findByRecipientOrgId(Long recipientOrgId);
    List<ClaimRequest> findByDonationId(Long donationId);
}
