package com.roamagent.repository;

import com.roamagent.entity.Itinerary;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;
import java.util.UUID;

@Repository
public interface ItineraryRepository extends JpaRepository<Itinerary, UUID> {
    Optional<Itinerary> findFirstByStatus(String status);
}
