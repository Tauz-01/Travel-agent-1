package com.roamagent.agent;

import com.roamagent.service.GraphNetworkService;
import com.roamagent.service.GraphNetworkService.RouteCandidate;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;

import java.time.LocalDate;
import java.util.List;

@Component
@RequiredArgsConstructor
public class RoutePlanningAgent {
    private final GraphNetworkService graphNetworkService;

    public List<RouteCandidate> findCandidates(String origin, String dest, LocalDate travelDate) {
        return graphNetworkService.searchRoutes(origin, dest, travelDate);
    }
}
