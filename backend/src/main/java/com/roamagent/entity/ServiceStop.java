package com.roamagent.entity;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalTime;

@Entity
@Table(name = "service_stops")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class ServiceStop {
    @Id
    @Column(length = 36)
    private String id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "bus_service_id", nullable = false)
    private BusService busService;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "stop_id", nullable = false)
    private Stop stop;

    @Column(nullable = false)
    private Integer stopSequence;

    private LocalTime scheduledArrivalTime;
    private LocalTime scheduledDepartureTime;
    private Integer dayOffset;
}
