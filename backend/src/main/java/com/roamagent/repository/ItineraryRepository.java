package com.roamagent.repository;

import com.roamagent.entity.Itinerary;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface ItineraryRepository extends JpaRepository<Itinerary, String> {
    Optional<Itinerary> findFirstByStatus(String status);
}
