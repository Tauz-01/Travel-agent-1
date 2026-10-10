package com.roamagent.entity;

import jakarta.persistence.*;
import lombok.*;
import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "operators")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class Operator {
    @Id
    @Column(length = 36)
    private String id;

    @Column(nullable = false, unique = true)
    private String code;

    @Column(nullable = false)
    private String name;

    private String contactNumber;
    private BigDecimal rating;
    private BigDecimal onTimePerformancePct;

    @Column(name = "created_at", insertable = false, updatable = false)
    private LocalDateTime createdAt;
}
