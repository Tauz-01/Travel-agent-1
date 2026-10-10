package com.roamagent.entity;

import jakarta.persistence.*;
import lombok.*;
import java.math.BigDecimal;

@Entity
@Table(name = "stops")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class Stop {
    @Id
    @Column(length = 36)
    private String id;

    @Column(nullable = false, unique = true)
    private String code;

    @Column(nullable = false)
    private String name;

    @Column(nullable = false)
    private String city;

    @Column(nullable = false)
    private String state;

    @Column(nullable = false)
    private BigDecimal latitude;

    @Column(nullable = false)
    private BigDecimal longitude;

    private String amenities;
}
