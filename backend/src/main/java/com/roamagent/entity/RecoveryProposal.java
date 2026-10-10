package com.roamagent.entity;

import jakarta.persistence.*;
import lombok.*;
import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "recovery_proposals")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class RecoveryProposal {
    @Id
    @Column(length = 36)
    private String id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "itinerary_id", nullable = false)
    private Itinerary itinerary;

    @Column(length = 36)
    private String disruptionEventId;

    @Column(nullable = false)
    private String status;

    @Column(nullable = false)
    private BigDecimal fareDifference;

    @Column(nullable = false)
    private LocalDateTime revisedEta;

    @Column(nullable = false, columnDefinition = "TEXT")
    private String replacementSummary;

    @Column(name = "proposed_at", insertable = false, updatable = false)
    private LocalDateTime proposedAt;

    private LocalDateTime decidedAt;

    @OneToMany(mappedBy = "recoveryProposal", cascade = CascadeType.ALL, orphanRemoval = true)
    @Builder.Default
    private List<RecoveryProposalLeg> legs = new ArrayList<>();
}
