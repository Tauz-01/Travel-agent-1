package com.roamagent.entity;

import jakarta.persistence.*;
import lombok.*;
import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "recovery_proposal_legs")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class RecoveryProposalLeg {
    @Id
    @Column(length = 36)
    private String id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "recovery_proposal_id", nullable = false)
    private RecoveryProposal recoveryProposal;

    @Column(nullable = false)
    private Integer legSequence;

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
    private LocalDateTime scheduledDeparture;

    @Column(nullable = false)
    private LocalDateTime scheduledArrival;

    @Column(nullable = false)
    private BigDecimal legFare;

    @Column(nullable = false)
    private String seatType;
}
