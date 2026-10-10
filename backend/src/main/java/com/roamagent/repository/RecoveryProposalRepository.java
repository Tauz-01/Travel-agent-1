package com.roamagent.repository;

import com.roamagent.entity.RecoveryProposal;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface RecoveryProposalRepository extends JpaRepository<RecoveryProposal, String> {
    Optional<RecoveryProposal> findByItineraryIdAndStatus(String itineraryId, String status);
}
