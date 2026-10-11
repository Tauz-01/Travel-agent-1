package com.roamagent.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

public class ApiDtos {

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class ExtractIntentRequest {
        private String conversationId;
        private String rawInput;
        private String userLanguage;
    }

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class ExtractIntentResponse {
        private String intentId;
        private String conversationId;
        private String intentType; // BUS, HOTEL, COMBINED, UNKNOWN
        private String status; // CLARIFIED, REQUIRES_CLARIFICATION
        private DraftIntentDto draftIntent;
        private List<String> missingFields;
        private ClarificationQuestionDto clarificationQuestion;
        private String conversationalSummary;
    }

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class DraftIntentDto {
        private String intentType; // BUS, HOTEL, COMBINED
        private String originCity;
        private String destinationCity;
        private String locality;
        private LocalDate travelDate;
        private LocalDateTime arrivalDeadline;
        private BigDecimal maxBusBudget;
        private String preferredBusMode; // SLEEPER, SEATER, AC, NON_AC
        private Integer passengerCount;
        
        // Hotel specific fields
        private String hotelDestination;
        private LocalDate checkInDate;
        private LocalDate checkOutDate;
        private Integer stayNights;
        private Integer roomCount;
        private BigDecimal maxHotelBudgetPerNight;
        private BigDecimal maxHotelTotalBudget;
        private Double minHotelRating;
        private List<String> preferredAmenities;
    }

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class ClarificationQuestionDto {
        private String questionKey;
        private String questionText;
        private List<String> options;
    }

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class SearchItinerariesRequest {
        private String intentId;
        private Integer minTransferBufferMinutes;
        private Boolean allowMultiLeg;
    }

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class HotelOptionDto {
        private String hotelId;
        private String roomId;
        private String hotelName;
        private String city;
        private String locality;
        private Double userRating;
        private Integer reviewCount;
        private String roomType;
        private BigDecimal pricePerNight;
        private BigDecimal taxAmount;
        private BigDecimal totalPrice;
        private String cancellationPolicy;
        private List<String> amenities;
        private String sourceStatus; // MOCK_STORE, AUTHORISED_LIVE
    }

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class SeatDto {
        private String seatId;
        private String seatNumber;
        private String deck;
        private Integer rowIndex;
        private Integer colIndex;
        private String seatType;
        private BigDecimal price;
        private String status;
    }

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class BusSeatMapResponse {
        private String serviceId;
        private String operatorName;
        private String serviceNumber;
        private String busType;
        private List<SeatDto> seats;
        private String dataProvenance;
    }

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class LockSeatsRequest {
        private String serviceId;
        private List<String> seatIds;
        private String userId;
    }

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class LockSeatsResponse {
        private String lockId;
        private String serviceId;
        private List<String> lockedSeatIds;
        private BigDecimal totalFare;
        private LocalDateTime expiresAt;
        private String status;
    }

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class SearchItinerariesResponse {
        private String intentId;
        private Integer totalOptionsFound;
        private List<ItineraryOptionDto> itineraries;
        private List<HotelOptionDto> hotelOptions;
    }

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class ItineraryOptionDto {
        private String itineraryId;
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
    @NoArgsConstructor
    @AllArgsConstructor
    public static class LegDto {
        private Integer legSequence;
        private String serviceId;
        private String operatorName;
        private String serviceNumber;
        private String busType;
        private String fromStopName;
        private String toStopName;
        private LocalDateTime scheduledDeparture;
        private LocalDateTime scheduledArrival;
        private BigDecimal fare;
    }

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class TriggerScenarioRequest {
        private String activeItineraryId;
        private String scenarioCode;
        private Integer simulatedDelayMinutes;
    }

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class ApproveRevisionRequest {
        private String proposalId;
    }

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class ApproveRevisionResponse {
        private String itineraryId;
        private Integer newRevisionNumber;
        private String status;
        private LocalDateTime activeEta;
        private String auditRecordId;
        private String message;
    }
}
