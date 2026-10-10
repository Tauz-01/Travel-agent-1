package com.roamagent.repository;

import com.roamagent.entity.AuditRecord;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface AuditRecordRepository extends JpaRepository<AuditRecord, UUID> {
    List<AuditRecord> findByItineraryIdOrderByCommittedAtDesc(UUID itineraryId);
}
