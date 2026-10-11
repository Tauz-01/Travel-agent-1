package com.roamagent.entity;

import jakarta.persistence.*;
import lombok.*;
import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "hotel_properties")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class HotelProperty {
    @Id
    @Column(length = 36)
    private String id;

    @Column(nullable = false)
    private String name;

    @Column(nullable = false)
    private String city;

    private String locality;
    private Double starRating;
    private Double userRating;
    private Integer reviewCount;
    private String address;

    private BigDecimal latitude;
    private BigDecimal longitude;

    @Column(name = "created_at", insertable = false, updatable = false)
    private LocalDateTime createdAt;
}