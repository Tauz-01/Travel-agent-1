package com.roamagent.service;

import com.roamagent.service.GraphNetworkService.RouteCandidate;
import com.roamagent.service.GraphNetworkService.RouteLeg;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.time.Duration;
import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class FeasibilityService {

    public static final int MIN_TRANSFER_BUFFER_MINUTES = 45;

    public boolean isFeasible(RouteCandidate candidate, LocalDateTime arrivalDeadline, BigDecimal maxBudget) {
        // 1. Budget check
        if (maxBudget != null && candidate.getTotalFare().compareTo(maxBudget) > 0) {
            return false;
        }

        // 2. Arrival Deadline check
        if (arrivalDeadline != null) {
            LocalDateTime finalArrival = candidate.getLegs().get(candidate.getLegs().size() - 1).getArrivalTime();
            if (finalArrival.isAfter(arrivalDeadline)) {
                return false;
            }
        }

        // 3. Transfer Buffer check
        List<RouteLeg> legs = candidate.getLegs();
        for (int i = 0; i < legs.size() - 1; i++) {
            LocalDateTime arr = legs.get(i).getArrivalTime();
            LocalDateTime dep = legs.get(i + 1).getDepartureTime();
            long bufferMinutes = Duration.between(arr, dep).toMinutes();

            if (bufferMinutes < MIN_TRANSFER_BUFFER_MINUTES) {
                return false;
            }
        }

        return true;
    }

    public List<RouteCandidate> filterFeasible(List<RouteCandidate> candidates, LocalDateTime arrivalDeadline, BigDecimal maxBudget) {
        return candidates.stream()
                .filter(c -> isFeasible(c, arrivalDeadline, maxBudget))
                .collect(Collectors.toList());
    }
}
