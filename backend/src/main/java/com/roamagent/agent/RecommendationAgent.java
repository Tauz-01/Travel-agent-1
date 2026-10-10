package com.roamagent.agent;

import com.roamagent.service.RecommendationScorer;
import com.roamagent.service.RecommendationScorer.ScoredCandidate;
import com.roamagent.service.GraphNetworkService.RouteCandidate;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;

import java.util.List;

@Component
@RequiredArgsConstructor
public class RecommendationAgent {
    private final RecommendationScorer recommendationScorer;

    public List<ScoredCandidate> scoreAndRank(List<RouteCandidate> candidates) {
        return recommendationScorer.rankCandidates(candidates);
    }
}
