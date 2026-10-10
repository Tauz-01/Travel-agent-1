package com.roamagent.entity;

import jakarta.persistence.*;
import lombok.*;
import java.math.BigDecimal;
import java.time.OffsetDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

@Entity
@Table(name = "recovery_proposals")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class RecoveryProposal {
    @Id
    private UUID id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "itinerary_id", nullable = false)
    private Itinerary itinerary;

    private UUID disruptionEventId;

    @Column(nullable = false)
    private String status;

    @Column(nullable = false)
    private BigDecimal fareDifference;

    @Column(nullable = false)
    private OffsetDateTime revisedEta;

    @Column(nullable = false, columnDefinition = "TEXT")
    private String replacementSummary;

    @Column(name = "proposed_at", insertable = false, updatable = false)
    private OffsetDateTime proposedAt;

    private OffsetDateTime decidedAt;

    @OneToMany(mappedBy = "recoveryProposal", cascade = CascadeType.ALL, orphanRemoval = true)
    @Builder.Default
    private List<RecoveryProposalLeg> legs = new ArrayList<>();
}
