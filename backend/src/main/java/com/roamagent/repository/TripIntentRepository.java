package com.roamagent.repository;

import com.roamagent.entity.TripIntent;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface TripIntentRepository extends JpaRepository<TripIntent, String> {
    Optional<TripIntent> findByConversationId(String conversationId);
}
