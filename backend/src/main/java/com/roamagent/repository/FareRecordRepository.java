package com.roamagent.repository;

import com.roamagent.entity.FareRecord;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface FareRecordRepository extends JpaRepository<FareRecord, String> {
    Optional<FareRecord> findByBusServiceIdAndFromStopIdAndToStopId(String busServiceId, String fromStopId, String toStopId);
}
