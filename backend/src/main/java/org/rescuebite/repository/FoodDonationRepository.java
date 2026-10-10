package org.rescuebite.repository;

import org.rescuebite.model.FoodDonation;
import org.rescuebite.model.enums.DonationStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface FoodDonationRepository extends JpaRepository<FoodDonation, Long> {

    List<FoodDonation> findByStatus(DonationStatus status);

    List<FoodDonation> findByDonorId(Long donorId);

    List<FoodDonation> findByClaimedByOrgId(Long recipientOrgId);

    @Query("SELECT d FROM FoodDonation d WHERE " +
           "(:category IS NULL OR :category = 'All' OR d.category = :category) AND " +
           "(:status IS NULL OR :status = 'All' OR d.status = :status) AND " +
           "(:query IS NULL OR LOWER(d.title) LIKE LOWER(CONCAT('%', :query, '%')) OR LOWER(d.description) LIKE LOWER(CONCAT('%', :query, '%')))")
    List<FoodDonation> searchDonations(
            @Param("category") String category,
            @Param("status") DonationStatus status,
            @Param("query") String query
    );
}
