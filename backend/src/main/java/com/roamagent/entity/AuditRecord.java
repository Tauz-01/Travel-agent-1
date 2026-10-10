package com.roamagent.entity;

import jakarta.persistence.*;
import lombok.*;
import java.time.OffsetDateTime;
import java.util.UUID;

@Entity
@Table(name = "audit_records")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class AuditRecord {
    @Id
    private UUID id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "itinerary_id", nullable = false)
    private Itinerary itinerary;

    @Column(nullable = false)
    private String actionType;

    @Column(nullable = false)
    private Integer previousRevisionNumber;

    @Column(nullable = false)
    private Integer newRevisionNumber;

    @Column(nullable = false, columnDefinition = "TEXT")
    private String changeSummary;

    @Column(name = "committed_at", insertable = false, updatable = false)
    private OffsetDateTime committedAt;
}
