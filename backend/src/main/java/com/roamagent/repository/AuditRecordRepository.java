package com.roamagent.repository;

import com.roamagent.entity.AuditRecord;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface AuditRecordRepository extends JpaRepository<AuditRecord, String> {
    List<AuditRecord> findByItineraryIdOrderByCommittedAtDesc(String itineraryId);
}
