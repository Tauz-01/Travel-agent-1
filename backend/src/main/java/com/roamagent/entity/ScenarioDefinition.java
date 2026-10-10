package com.roamagent.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "scenario_definitions")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class ScenarioDefinition {
    @Id
    @Column(length = 36)
    private String id;

    @Column(nullable = false, unique = true)
    private String code;

    @Column(nullable = false, columnDefinition = "TEXT")
    private String description;

    @Column(nullable = false)
    private String targetServiceNumber;

    @Column(nullable = false)
    private Integer delayMinutes;
}
