package com.roamagent.entity;

import jakarta.persistence.*;
import lombok.*;
import java.math.BigDecimal;
import java.time.OffsetDateTime;
import java.util.UUID;

@Entity
@Table(name = "recovery_proposal_legs")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class RecoveryProposalLeg {
    @Id
    private UUID id;

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
    private OffsetDateTime scheduledDeparture;

    @Column(nullable = false)
    private OffsetDateTime scheduledArrival;

    @Column(nullable = false)
    private BigDecimal legFare;

    @Column(nullable = false)
    private String seatType;
}
