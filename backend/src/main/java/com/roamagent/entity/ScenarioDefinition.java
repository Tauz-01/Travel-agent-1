package com.roamagent.entity;

import jakarta.persistence.*;
import lombok.*;
import java.util.UUID;

@Entity
@Table(name = "scenario_definitions")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class ScenarioDefinition {
    @Id
    private UUID id;

    @Column(nullable = false, unique = true)
    private String code;

    @Column(nullable = false, columnDefinition = "TEXT")
    private String description;

    @Column(nullable = false)
    private String targetServiceNumber;

    @Column(nullable = false)
    private Integer delayMinutes;
}
