package com.roamagent.repository;

import com.roamagent.entity.BusService;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;
import java.util.UUID;

@Repository
public interface BusServiceRepository extends JpaRepository<BusService, UUID> {
    Optional<BusService> findByServiceNumber(String serviceNumber);
}
