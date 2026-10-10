package com.roamagent.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "vehicles")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class Vehicle {
    @Id
    @Column(length = 36)
    private String id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "operator_id", nullable = false)
    private Operator operator;

    @Column(nullable = false, unique = true)
    private String registrationNumber;

    @Column(nullable = false)
    private String busType;

    private Integer capacity;
    private Integer manufactureYear;
    private Boolean hasWifi;
    private Boolean hasChargingPoint;
    private Boolean isActive;
}
