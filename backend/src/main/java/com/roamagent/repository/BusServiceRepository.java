package com.roamagent.repository;

import com.roamagent.entity.BusService;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface BusServiceRepository extends JpaRepository<BusService, String> {
    Optional<BusService> findByServiceNumber(String serviceNumber);
}
