package com.roamagent.repository;

import com.roamagent.entity.*;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalTime;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface StopRepository extends JpaRepository<Stop, UUID> {
    List<Stop> findByCityIgnoreCase(String city);
    Optional<Stop> findByCode(String code);
}
