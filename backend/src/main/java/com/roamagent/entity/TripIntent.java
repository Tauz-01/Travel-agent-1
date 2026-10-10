package com.roamagent.entity;

import jakarta.persistence.*;
import lombok.*;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.OffsetDateTime;
import java.util.UUID;

@Entity
@Table(name = "trip_intents")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class TripIntent {
    @Id
    private UUID id;

    @Column(nullable = false)
    private UUID conversationId;

    @Column(nullable = false)
    private String originCity;

    @Column(nullable = false)
    private String destinationCity;

    @Column(nullable = false)
    private LocalDate travelDate;

    private OffsetDateTime arrivalDeadline;
    private BigDecimal maxBudget;
    private String preferredMode;
    private Integer passengerCount;
    private String languagePreference;
    private Boolean isClarified;

    @Column(name = "created_at", insertable = false, updatable = false)
    private OffsetDateTime createdAt;
}
