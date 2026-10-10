package com.roamagent.repository;

import com.roamagent.entity.Stop;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface StopRepository extends JpaRepository<Stop, String> {
    List<Stop> findByCityIgnoreCase(String city);
    Optional<Stop> findByCode(String code);
}
