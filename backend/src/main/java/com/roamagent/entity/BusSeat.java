package com.roamagent.entity;

import jakarta.persistence.*;
import lombok.*;
import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "bus_seats")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class BusSeat {
    @Id
    @Column(length = 36)
    private String id;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "service_id", nullable = false)
    private BusService busService;

    @Column(nullable = false, length = 10)
    private String seatNumber;

    @Column(length = 10)
    private String deck; // LOWER, UPPER

    private Integer rowIndex;
    private Integer colIndex;

    @Column(nullable = false, length = 20)
    private String seatType; // SEATER, SLEEPER_L, SLEEPER_R

    @Column(nullable = false)
    private BigDecimal price;

    @Column(length = 20)
    private String status; // AVAILABLE, BOOKED, RESERVED_LADIES, LOCKED

    private LocalDateTime lockExpiresAt;
}