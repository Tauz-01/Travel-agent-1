package com.roamagent.controller;

import com.roamagent.dto.ApiDtos.*;
import com.roamagent.entity.HotelRoom;
import com.roamagent.entity.TripIntent;
import com.roamagent.repository.BusSeatRepository;
import com.roamagent.repository.HotelRoomRepository;
import com.roamagent.repository.ItineraryRepository;
import com.roamagent.repository.TripIntentRepository;
import com.roamagent.service.AgentOrchestratorService;
import com.roamagent.service.FeasibilityService;
import com.roamagent.service.RevisionCommitService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;
import java.util.Map;
import java.util.UUID;

@RestController
@RequestMapping("/api/v1/itineraries")
@RequiredArgsConstructor
public class ItineraryController {

    private final TripIntentRepository tripIntentRepository;
    private final AgentOrchestratorService orchestratorService;
    private final FeasibilityService feasibilityService;
    private final ItineraryRepository itineraryRepository;
    private final RevisionCommitService revisionCommitService;
    private final HotelRoomRepository hotelRoomRepository;
    private final BusSeatRepository busSeatRepository;

    @PostMapping("/search")
    public SearchItinerariesResponse searchItineraries(@RequestBody SearchItinerariesRequest request) {
        TripIntent intent = tripIntentRepository.findById(request.getIntentId())
                .orElseThrow(() -> new IllegalArgumentException("Trip intent not found"));

        List<ItineraryOptionDto> options = new ArrayList<>();
        String intentType = intent.getIntentType() != null ? intent.getIntentType().toUpperCase() : "BUS";

        boolean searchBus = "BUS".equalsIgnoreCase(intentType) || "COMBINED".equalsIgnoreCase(intentType);
        boolean searchHotel = "HOTEL".equalsIgnoreCase(intentType) || "COMBINED".equalsIgnoreCase(intentType);

        if (searchBus && intent.getOriginCity() != null && intent.getDestinationCity() != null) {
            var candidates = orchestratorService.getRoutePlanningAgent().findCandidates(
                    intent.getOriginCity(), intent.getDestinationCity(), intent.getTravelDate()
            );

            var feasible = feasibilityService.filterFeasible(candidates, intent.getArrivalDeadline(), intent.getMaxBudget());
            var ranked = orchestratorService.getRecommendationAgent().scoreAndRank(feasible);

            int pos = 1;
            for (var scored : ranked) {
                var c = scored.getCandidate();
                List<LegDto> legs = new ArrayList<>();
                int seq = 1;
                for (var leg : c.getLegs()) {
                    legs.add(LegDto.builder()
                            .legSequence(seq++)
                            .serviceId(leg.getBusService().getId())
                            .operatorName(leg.getBusService().getOperator().getName())
                            .serviceNumber(leg.getBusService().getServiceNumber())
                            .busType(leg.getBusService().getServiceType())
                            .fromStopName(leg.getFromStop().getName())
                            .toStopName(leg.getToStop().getName())
                            .scheduledDeparture(leg.getDepartureTime())
                            .scheduledArrival(leg.getArrivalTime())
                            .fare(leg.getFare())
                            .build());
                }

                options.add(ItineraryOptionDto.builder()
                        .itineraryId(UUID.randomUUID().toString())
                        .rankingPosition(pos++)
                        .totalFare(c.getTotalFare())
                        .totalDurationMinutes(c.getTotalDurationMinutes())
                        .totalTransfers(c.getTotalTransfers())
                        .overallFeasible(true)
                        .compositeScore(scored.getCompositeScore())
                        .verifiedExplanation(scored.getScoreExplanation())
                        .legs(legs)
                        .build());
            }
        }

        List<HotelOptionDto> hotelOptions = new ArrayList<>();
        if (searchHotel) {
            String hotelSearchCity = intent.getLocality() != null ? intent.getLocality() :
                    (intent.getHotelDestination() != null ? intent.getHotelDestination() : intent.getDestinationCity());

            if (hotelSearchCity != null) {
                List<HotelRoom> rooms = hotelRoomRepository.searchHotels(
                        hotelSearchCity,
                        intent.getMaxHotelBudgetPerNight(),
                        intent.getMinHotelRating()
                );

                int nights = intent.getStayNights() != null ? intent.getStayNights() : 1;

                for (HotelRoom room : rooms) {
                    BigDecimal basePrice = room.getPricePerNight().multiply(BigDecimal.valueOf(nights));
                    BigDecimal totalTax = room.getTaxAmount() != null ? room.getTaxAmount().multiply(BigDecimal.valueOf(nights)) : BigDecimal.ZERO;
                    BigDecimal totalPrice = basePrice.add(totalTax);

                    List<String> amenitiesList = room.getAmenities() != null ?
                            Arrays.asList(room.getAmenities().split("\\s*,\\s*")) : List.of();

                    hotelOptions.add(HotelOptionDto.builder()
                            .hotelId(room.getHotelProperty().getId())
                            .roomId(room.getId())
                            .hotelName(room.getHotelProperty().getName())
                            .city(room.getHotelProperty().getCity())
                            .locality(room.getHotelProperty().getLocality())
                            .userRating(room.getHotelProperty().getUserRating())
                            .reviewCount(room.getHotelProperty().getReviewCount())
                            .roomType(room.getRoomType())
                            .pricePerNight(room.getPricePerNight())
                            .taxAmount(room.getTaxAmount())
                            .totalPrice(totalPrice)
                            .cancellationPolicy(room.getCancellationPolicy())
                            .amenities(amenitiesList)
                            .sourceStatus("INTERNAL_MOCK_STORE")
                            .build());
                }
            }
        }

        int totalFound = options.size() + hotelOptions.size();

        return SearchItinerariesResponse.builder()
                .intentId(intent.getId())
                .totalOptionsFound(totalFound)
                .itineraries(options)
                .hotelOptions(hotelOptions)
                .build();
    }

    @GetMapping("/bus/{serviceId}/seatmap")
    public BusSeatMapResponse getBusSeatMap(@PathVariable("serviceId") String serviceId) {
        List<com.roamagent.entity.BusSeat> seats = busSeatRepository.findByBusServiceIdOrderByDeckAscRowIndexAscColIndexAsc(serviceId);
        
        if (seats.isEmpty()) {
            return BusSeatMapResponse.builder()
                    .serviceId(serviceId)
                    .operatorName("Unknown Operator")
                    .serviceNumber("N/A")
                    .busType("N/A")
                    .seats(List.of())
                    .dataProvenance("NO_SEATMAP_AVAILABLE")
                    .build();
        }

        var service = seats.get(0).getBusService();
        List<SeatDto> seatDtos = seats.stream().map(s -> SeatDto.builder()
                .seatId(s.getId())
                .seatNumber(s.getSeatNumber())
                .deck(s.getDeck())
                .rowIndex(s.getRowIndex())
                .colIndex(s.getColIndex())
                .seatType(s.getSeatType())
                .price(s.getPrice())
                .status(s.getStatus())
                .build()).toList();

        return BusSeatMapResponse.builder()
                .serviceId(serviceId)
                .operatorName(service.getOperator().getName())
                .serviceNumber(service.getServiceNumber())
                .busType(service.getServiceType())
                .seats(seatDtos)
                .dataProvenance("INTERNAL_MOCK_STORE")
                .build();
    }

    @PostMapping("/bus/seats/lock")
    public LockSeatsResponse lockSeats(@RequestBody LockSeatsRequest request) {
        List<com.roamagent.entity.BusSeat> seatsToLock = busSeatRepository.findAllById(request.getSeatIds());
        
        for (var s : seatsToLock) {
            if (!"AVAILABLE".equalsIgnoreCase(s.getStatus())) {
                throw new IllegalStateException("Seat " + s.getSeatNumber() + " is no longer available.");
            }
        }

        BigDecimal total = BigDecimal.ZERO;
        List<String> lockedIds = new ArrayList<>();
        LocalDateTime expiresAt = LocalDateTime.now().plusMinutes(10);

        for (var s : seatsToLock) {
            s.setStatus("LOCKED");
            s.setLockExpiresAt(expiresAt);
            busSeatRepository.save(s);
            total = total.add(s.getPrice());
            lockedIds.add(s.getId());
        }

        return LockSeatsResponse.builder()
                .lockId(UUID.randomUUID().toString())
                .serviceId(request.getServiceId())
                .lockedSeatIds(lockedIds)
                .totalFare(total)
                .expiresAt(expiresAt)
                .status("LOCKED_SUCCESS")
                .build();
    }

    @PostMapping("/{id}/select")
    public Map<String, Object> selectItinerary(@PathVariable String id) {
        return Map.of("itineraryId", id, "status", "AWAITING_DEMO_CONFIRMATION");
    }

    @PostMapping("/{id}/checkout")
    public Map<String, Object> checkoutItinerary(@PathVariable String id) {
        return Map.of("itineraryId", id, "status", "ACTIVE", "paymentStatus", "DEMO_CONFIRMED");
    }

    @PostMapping("/{id}/revisions/approve")
    public ApproveRevisionResponse approveRevision(@PathVariable String id, @RequestBody ApproveRevisionRequest request) {
        return revisionCommitService.approveRevision(id, request.getProposalId());
    }

    @PostMapping("/{id}/revisions/reject")
    public Map<String, Object> rejectRevision(@PathVariable String id) {
        return Map.of("itineraryId", id, "status", "REJECTED_ACTIVE_PRESERVED");
    }
}
