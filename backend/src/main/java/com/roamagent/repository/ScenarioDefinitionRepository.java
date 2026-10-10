package com.roamagent.repository;

import com.roamagent.entity.ScenarioDefinition;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;
import java.util.UUID;

@Repository
public interface ScenarioDefinitionRepository extends JpaRepository<ScenarioDefinition, UUID> {
    Optional<ScenarioDefinition> findByCode(String code);
}
