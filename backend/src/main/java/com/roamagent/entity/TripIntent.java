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

    @Column(length = 30)
    private String intentType; // BUS, HOTEL, COMBINED

    private String originCity;
    private String destinationCity;
    private String locality;

    private LocalDate travelDate;
    private LocalDateTime arrivalDeadline;
    private BigDecimal maxBudget;
    private String preferredMode;
    private Integer passengerCount;

    // Hotel intent fields
    private String hotelDestination;
    private LocalDate checkInDate;
    private LocalDate checkOutDate;
    private Integer stayNights;
    private Integer roomCount;
    private BigDecimal maxHotelBudgetPerNight;
    private Double minHotelRating;

    private String languagePreference;
    private Boolean isClarified;

    @Column(name = "created_at", insertable = false, updatable = false)
    private LocalDateTime createdAt;
}
