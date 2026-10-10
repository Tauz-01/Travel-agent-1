package com.roamagent.repository;

import com.roamagent.entity.FareRecord;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;
import java.util.UUID;

@Repository
public interface FareRecordRepository extends JpaRepository<FareRecord, UUID> {
    Optional<FareRecord> findByBusServiceIdAndFromStopIdAndToStopId(UUID busServiceId, UUID fromStopId, UUID toStopId);
}
