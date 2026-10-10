package com.roamagent.entity;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "journey_events")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class JourneyEvent {
    @Id
    @Column(length = 36)
    private String id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "itinerary_id", nullable = false)
    private Itinerary itinerary;

    @Column(nullable = false)
    private String eventType;

    @Column(columnDefinition = "TEXT")
    private String payload;

    @Column(name = "timestamp", insertable = false, updatable = false)
    private LocalDateTime timestamp;
}
