package com.roamagent.repository;

import com.roamagent.entity.TripIntent;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;
import java.util.UUID;

@Repository
public interface TripIntentRepository extends JpaRepository<TripIntent, UUID> {
    Optional<TripIntent> findByConversationId(UUID conversationId);
}
