package com.roamagent.service;

import com.roamagent.service.GraphNetworkService.RouteCandidate;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.util.Comparator;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class RecommendationScorer {

    @Data
    @Builder
    @AllArgsConstructor
    public static class ScoredCandidate {
        private RouteCandidate candidate;
        private BigDecimal compositeScore;
        private String scoreExplanation;
    }

    public List<ScoredCandidate> rankCandidates(List<RouteCandidate> candidates) {
        if (candidates.isEmpty()) {
            return List.of();
        }

        return candidates.stream()
                .map(c -> {
                    // Duration penalty: 100 - (durationInMinutes / 15)
                    double durationScore = Math.max(0, 100.0 - (c.getTotalDurationMinutes() / 15.0));
                    // Transfer penalty: 0 transfers -> 100, 1 transfer -> 85
                    double transferScore = c.getTotalTransfers() == 0 ? 100.0 : 85.0;
                    // Fare penalty: 100 - (fare / 30)
                    double fareScore = Math.max(0, 100.0 - (c.getTotalFare().doubleValue() / 30.0));

                    double composite = (durationScore * 0.4) + (transferScore * 0.3) + (fareScore * 0.3);
                    BigDecimal finalScore = BigDecimal.valueOf(composite).setScale(1, RoundingMode.HALF_UP);

                    String explanation = String.format("%d-transfer option. Duration: %d mins, Total Fare: ₹%.2f. Composite score: %.1f",
                            c.getTotalTransfers(), c.getTotalDurationMinutes(), c.getTotalFare(), finalScore.doubleValue());

                    return ScoredCandidate.builder()
                            .candidate(c)
                            .compositeScore(finalScore)
                            .scoreExplanation(explanation)
                            .build();
                })
                .sorted(Comparator.comparing(ScoredCandidate::getCompositeScore).reversed())
                .limit(4)
                .collect(Collectors.toList());
    }
}
