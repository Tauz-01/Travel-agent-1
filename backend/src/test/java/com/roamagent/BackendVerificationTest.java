package com.roamagent;

import com.roamagent.agent.IntakeAgent;
import com.roamagent.client.GroqApiClient;
import com.roamagent.service.FeasibilityService;
import com.roamagent.service.GraphNetworkService.RouteCandidate;
import com.roamagent.service.GraphNetworkService.RouteLeg;
import org.junit.jupiter.api.Test;

import java.math.BigDecimal;
import java.time.OffsetDateTime;
import java.time.ZoneOffset;
import java.util.List;

import static org.junit.jupiter.api.Assertions.*;

class BackendVerificationTest {

    @Test
    void testFeasibilityCheck() {
        FeasibilityService service = new FeasibilityService();
        OffsetDateTime now = OffsetDateTime.now(ZoneOffset.UTC);

        RouteLeg leg1 = RouteLeg.builder().arrivalTime(now.plusHours(2)).build();
        RouteLeg leg2 = RouteLeg.builder().departureTime(now.plusHours(2).plusMinutes(30)).build();

        RouteCandidate shortBufferCandidate = RouteCandidate.builder()
                .legs(List.of(leg1, leg2))
                .totalFare(BigDecimal.valueOf(1000))
                .build();

        assertFalse(service.isFeasible(shortBufferCandidate, null, null));
    }

    @Test
    void testIntakeFallback() {
        GroqApiClient mockClient = new GroqApiClient();
        IntakeAgent agent = new IntakeAgent(mockClient);

        IntakeAgent.ExtractedDraft draft = agent.extractIntent("Visakhapatnam to Hyderabad tomorrow sleeper 1500");
        assertNotNull(draft);
        assertEquals("Visakhapatnam", draft.getOriginCity());
        assertEquals("Hyderabad", draft.getDestinationCity());
    }
}
