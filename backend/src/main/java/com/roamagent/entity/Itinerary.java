package com.roamagent.entity;

import jakarta.persistence.*;
import lombok.*;
import java.math.BigDecimal;
import java.time.OffsetDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

@Entity
@Table(name = "itineraries")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class Itinerary {
    @Id
    private UUID id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "trip_intent_id", nullable = false)
    private TripIntent tripIntent;

    @Column(nullable = false)
    private String status;

    @Column(nullable = false)
    private BigDecimal totalFare;

    @Column(nullable = false)
    private Integer totalDurationMinutes;

    @Column(nullable = false)
    private Integer totalTransfers;

    private BigDecimal rankingScore;
    
    @Column(columnDefinition = "TEXT")
    private String scoreExplanation;

    private Integer currentRevisionNumber;

    @Column(name = "created_at", insertable = false, updatable = false)
    private OffsetDateTime createdAt;

    @OneToMany(mappedBy = "itinerary", cascade = CascadeType.ALL, orphanRemoval = true)
    @Builder.Default
    private List<ItineraryLeg> legs = new ArrayList<>();
}
