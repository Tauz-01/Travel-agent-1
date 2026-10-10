package com.roamagent.entity;

import jakarta.persistence.*;
import lombok.*;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Table(name = "trip_intents")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class TripIntent {
    @Id
    @Column(length = 36)
    private String id;

    @Column(nullable = false, length = 36)
    private String conversationId;

    @Column(nullable = false)
    private String originCity;

    @Column(nullable = false)
    private String destinationCity;

    @Column(nullable = false)
    private LocalDate travelDate;

    private LocalDateTime arrivalDeadline;
    private BigDecimal maxBudget;
    private String preferredMode;
    private Integer passengerCount;
    private String languagePreference;
    private Boolean isClarified;

    @Column(name = "created_at", insertable = false, updatable = false)
    private LocalDateTime createdAt;
}
