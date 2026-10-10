package com.roamagent.service;

import com.roamagent.service.GraphNetworkService.RouteCandidate;
import com.roamagent.service.GraphNetworkService.RouteLeg;
import org.junit.jupiter.api.Test;

import java.math.BigDecimal;
import java.time.OffsetDateTime;
import java.time.ZoneOffset;
import java.util.List;

import static org.junit.jupiter.api.Assertions.*;

class FeasibilityServiceTest {

    private final FeasibilityService feasibilityService = new FeasibilityService();

    @Test
    void testTransferBufferEnforcement() {
        OffsetDateTime now = OffsetDateTime.now(ZoneOffset.UTC);

        // Buffer = 30 mins (< 45 mins) -> Should be REJECTED
        RouteLeg leg1 = RouteLeg.builder().arrivalTime(now.plusHours(2)).build();
        RouteLeg leg2 = RouteLeg.builder().departureTime(now.plusHours(2).plusMinutes(30)).build();

        RouteCandidate candidateShortBuffer = RouteCandidate.builder()
                .legs(List.of(leg1, leg2))
                .totalFare(BigDecimal.valueOf(1000))
                .build();

        assertFalse(feasibilityService.isFeasible(candidateShortBuffer, null, null));

        // Buffer = 55 mins (>= 45 mins) -> Should be ACCEPTED
        RouteLeg leg3 = RouteLeg.builder().departureTime(now.plusHours(2).plusMinutes(55)).build();
        RouteCandidate candidateValidBuffer = RouteCandidate.builder()
                .legs(List.of(leg1, leg3))
                .totalFare(BigDecimal.valueOf(1000))
                .build();

        assertTrue(feasibilityService.isFeasible(candidateValidBuffer, null, null));
    }

    @Test
    void testBudgetCapEnforcement() {
        RouteLeg leg1 = RouteLeg.builder().arrivalTime(OffsetDateTime.now()).build();
        RouteCandidate candidate = RouteCandidate.builder()
                .legs(List.of(leg1))
                .totalFare(BigDecimal.valueOf(1600))
                .build();

        assertFalse(feasibilityService.isFeasible(candidate, null, BigDecimal.valueOf(1500)));
        assertTrue(feasibilityService.isFeasible(candidate, null, BigDecimal.valueOf(2000)));
    }
}
