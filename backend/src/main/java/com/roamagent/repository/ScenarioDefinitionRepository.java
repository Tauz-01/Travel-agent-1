package com.roamagent.repository;

import com.roamagent.entity.ScenarioDefinition;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface ScenarioDefinitionRepository extends JpaRepository<ScenarioDefinition, String> {
    Optional<ScenarioDefinition> findByCode(String code);
}
