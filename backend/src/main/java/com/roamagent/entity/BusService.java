package com.roamagent.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "bus_services")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class BusService {
    @Id
    @Column(length = 36)
    private String id;

    @Column(nullable = false, unique = true)
    private String serviceNumber;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "operator_id", nullable = false)
    private Operator operator;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "vehicle_id", nullable = false)
    private Vehicle vehicle;

    private String serviceType;
    private Boolean isActive;
}
