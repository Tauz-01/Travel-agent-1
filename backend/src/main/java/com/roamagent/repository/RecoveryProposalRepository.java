package com.roamagent.repository;

import com.roamagent.entity.RecoveryProposal;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;
import java.util.UUID;

@Repository
public interface RecoveryProposalRepository extends JpaRepository<RecoveryProposal, UUID> {
    Optional<RecoveryProposal> findByItineraryIdAndStatus(UUID itineraryId, String status);
}
