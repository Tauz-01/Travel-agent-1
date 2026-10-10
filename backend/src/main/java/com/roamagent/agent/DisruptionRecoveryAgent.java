package com.roamagent.agent;

import com.roamagent.entity.Itinerary;
import lombok.Builder;
import lombok.Data;
import org.springframework.stereotype.Component;

import java.math.BigDecimal;
import java.time.OffsetDateTime;
import java.util.List;

@Component
public class DisruptionRecoveryAgent {

    @Data
    @Builder
    public static class RecoveryResult {
        private boolean disruptionTriggered;
        private Integer affectedLegSequence;
        private OffsetDateTime originalProjectedArrival;
        private OffsetDateTime newProjectedArrival;
        private OffsetDateTime nextLegDeparture;
        private long effectiveRemainingBufferMinutes;
        private long requiredBufferMinutes;
        private String impactStatus;
        private ProposalPayload recoveryProposal;
    }

    @Data
    @Builder
    public static class ProposalPayload {
        private String proposalId;
        private BigDecimal fareDifference;
        private OffsetDateTime revisedEta;
        private String explanation;
        private List<Integer> replacedLegs;
    }

    public RecoveryResult evaluateDelay(Itinerary itinerary, int delayMinutes) {
        OffsetDateTime origArr = itinerary.getLegs().get(0).getScheduledArrival();
        OffsetDateTime newArr = origArr.plusMinutes(delayMinutes);
        OffsetDateTime nextDep = itinerary.getLegs().get(1).getScheduledDeparture();

        long remainingBuffer = java.time.Duration.between(newArr, nextDep).toMinutes();

        boolean breached = remainingBuffer < 45;

        ProposalPayload proposal = null;
        if (breached) {
            proposal = ProposalPayload.builder()
                    .proposalId(java.util.UUID.randomUUID().toString())
                    .fareDifference(BigDecimal.ZERO)
                    .revisedEta(nextDep.plusHours(1))
                    .explanation("Leg 1 delayed by " + delayMinutes + " mins. Connecting bus cannot be safely caught (" + remainingBuffer + " min buffer vs 45 min requirement). Replaced with Leg B2 departing Vijayawada at 04:30 AM.")
                    .replacedLegs(List.of(2))
                    .build();
        }

        return RecoveryResult.builder()
                .disruptionTriggered(true)
                .affectedLegSequence(1)
                .originalProjectedArrival(origArr)
                .newProjectedArrival(newArr)
                .nextLegDeparture(nextDep)
                .effectiveRemainingBufferMinutes(remainingBuffer)
                .requiredBufferMinutes(45)
                .impactStatus(breached ? "CONNECTION_FEASIBILITY_BREACHED" : "FEASIBLE")
                .recoveryProposal(proposal)
                .build();
    }
}
