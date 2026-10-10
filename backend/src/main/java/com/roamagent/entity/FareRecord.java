package com.roamagent.entity;

import jakarta.persistence.*;
import lombok.*;
import java.math.BigDecimal;

@Entity
@Table(name = "fare_records")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class FareRecord {
    @Id
    @Column(length = 36)
    private String id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "bus_service_id", nullable = false)
    private BusService busService;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "from_stop_id", nullable = false)
    private Stop fromStop;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "to_stop_id", nullable = false)
    private Stop toStop;

    @Column(nullable = false)
    private String seatClass;

    @Column(nullable = false)
    private BigDecimal baseFare;

    private BigDecimal taxAmount;
}
