package com.roamagent.entity;

import jakarta.persistence.*;
import lombok.*;
import java.math.BigDecimal;

@Entity
@Table(name = "hotel_rooms")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class HotelRoom {
    @Id
    @Column(length = 36)
    private String id;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "hotel_id", nullable = false)
    private HotelProperty hotelProperty;

    @Column(nullable = false)
    private String roomType;

    @Column(nullable = false)
    private BigDecimal pricePerNight;

    private BigDecimal taxAmount;
    private Integer availableRooms;
    private String cancellationPolicy;
    private String amenities;
}