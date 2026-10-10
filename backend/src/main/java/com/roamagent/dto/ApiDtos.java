package com.roamagent.dto;

import lombok.Builder;
import lombok.Data;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.OffsetDateTime;
import java.util.List;
import java.util.UUID;

public class ApiDtos {

    @Data
    public static class ExtractIntentRequest {
        private UUID conversationId;
        private String rawInput;
        private String userLanguage;
    }

    @Data
    @Builder
    public static class ExtractIntentResponse {
        private UUID intentId;
        private String status;
        private DraftIntentDto draftIntent;
        private List<String> missingFields;
        private ClarificationQuestionDto clarificationQuestion;
    }

    @Data
    @Builder
    public static class DraftIntentDto {
        private String originCity;
        private String destinationCity;
        private LocalDate travelDate;
        private OffsetDateTime arrivalDeadline;
        private BigDecimal maxBudget;
        private String preferredMode;
        private Integer passengerCount;
    }

    @Data
    @Builder
    public static class ClarificationQuestionDto {
        private String questionKey;
        private String questionText;
        private List<String> options;
    }

    @Data
    public static class SearchItinerariesRequest {
        private UUID intentId;
        private Integer minTransferBufferMinutes;
        private Boolean allowMultiLeg;
    }

    @Data
    @Builder
    public static class SearchItinerariesResponse {
        private UUID intentId;
        private Integer totalOptionsFound;
        private List<ItineraryOptionDto> itineraries;
    }

    @Data
    @Builder
    public static class ItineraryOptionDto {
        private UUID itineraryId;
        private Integer rankingPosition;
        private BigDecimal totalFare;
        private Integer totalDurationMinutes;
        private Integer totalTransfers;
        private Boolean overallFeasible;
        private BigDecimal compositeScore;
        private String verifiedExplanation;
        private List<LegDto> legs;
    }

    @Data
    @Builder
    public static class LegDto {
        private Integer legSequence;
        private String operatorName;
        private String serviceNumber;
        private String busType;
        private String fromStopName;
        private String toStopName;
        private OffsetDateTime scheduledDeparture;
        private OffsetDateTime scheduledArrival;
        private BigDecimal fare;
    }

    @Data
    public static class TriggerScenarioRequest {
        private UUID activeItineraryId;
        private String scenarioCode;
        private Integer simulatedDelayMinutes;
    }

    @Data
    public static class ApproveRevisionRequest {
        private UUID proposalId;
    }

    @Data
    @Builder
    public static class ApproveRevisionResponse {
        private UUID itineraryId;
        private Integer newRevisionNumber;
        private String status;
        private OffsetDateTime activeEta;
        private UUID auditRecordId;
        private String message;
    }
}
