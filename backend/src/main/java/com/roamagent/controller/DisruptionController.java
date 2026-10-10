package com.roamagent.controller;

import com.roamagent.dto.ApiDtos.TriggerScenarioRequest;
import com.roamagent.agent.DisruptionRecoveryAgent;
import com.roamagent.agent.DisruptionRecoveryAgent.RecoveryResult;
import com.roamagent.entity.Itinerary;
import com.roamagent.entity.ItineraryLeg;
import com.roamagent.service.AgentOrchestratorService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/v1/disruptions")
@RequiredArgsConstructor
public class DisruptionController {

    private final AgentOrchestratorService orchestratorService;

    @PostMapping("/trigger-scenario")
    public RecoveryResult triggerScenario(@RequestBody TriggerScenarioRequest request) {
        LocalDateTime now = LocalDateTime.now();

        ItineraryLeg leg1 = ItineraryLeg.builder()
                .legSequence(1)
                .scheduledArrival(now.plusHours(2))
                .build();

        ItineraryLeg leg2 = ItineraryLeg.builder()
                .legSequence(2)
                .scheduledDeparture(now.plusHours(2).plusMinutes(55))
                .build();

        Itinerary mockItinerary = Itinerary.builder()
                .id(request.getActiveItineraryId() != null ? request.getActiveItineraryId() : UUID.randomUUID().toString())
                .legs(List.of(leg1, leg2))
                .build();

        int delay = request.getSimulatedDelayMinutes() != null ? request.getSimulatedDelayMinutes() : 50;

        return orchestratorService.getDisruptionRecoveryAgent().evaluateDelay(mockItinerary, delay);
    }
}
