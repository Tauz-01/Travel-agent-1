package com.roamagent.repository;

import com.roamagent.entity.BusSeat;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface BusSeatRepository extends JpaRepository<BusSeat, String> {
    List<BusSeat> findByBusServiceIdOrderByDeckAscRowIndexAscColIndexAsc(String serviceId);
}