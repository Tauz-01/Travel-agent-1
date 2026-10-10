package com.roamagent.entity;

import jakarta.persistence.*;
import lombok.*;
import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "itineraries")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class Itinerary {
    @Id
    @Column(length = 36)
    private String id;

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
    private LocalDateTime createdAt;

    @OneToMany(mappedBy = "itinerary", cascade = CascadeType.ALL, orphanRemoval = true)
    @Builder.Default
    private List<ItineraryLeg> legs = new ArrayList<>();
}
