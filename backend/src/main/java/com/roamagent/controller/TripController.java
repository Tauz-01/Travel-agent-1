package com.roamagent.controller;

import com.roamagent.dto.ApiDtos.*;
import com.roamagent.entity.TripIntent;
import com.roamagent.repository.TripIntentRepository;
import com.roamagent.service.AgentOrchestratorService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.Map;
import java.util.UUID;

@RestController
@RequestMapping("/api/v1")
@RequiredArgsConstructor
public class TripController {

    private final AgentOrchestratorService orchestratorService;
    private final TripIntentRepository tripIntentRepository;

    @GetMapping("/health")
    public Map<String, Object> health() {
        return Map.of("status", "UP", "service", "RoamAgent Backend", "version", "1.0.0");
    }

    @PostMapping("/voice/stt")
    public Map<String, Object> speechToText(@RequestBody Map<String, String> request) {
        String base64Audio = request.get("audioBase64");
        String language = request.getOrDefault("language", "en");
        
        if (base64Audio != null && !base64Audio.isEmpty()) {
            try {
                byte[] audioBytes = java.util.Base64.getDecoder().decode(base64Audio);
                String transcript = orchestratorService.getConversationAgent().getGroqApiClient().transcribeAudio(audioBytes, "recording.m4a");
                if (transcript != null && !transcript.trim().isEmpty()) {
                    return Map.of("status", "SUCCESS", "transcript", transcript, "language", language, "source", "GROQ_WHISPER_LIVE");
                }
            } catch (Exception e) {
                // Fallthrough to fallback
            }
        }

        return Map.of(
                "status", "ERROR",
                "message", "Speech transcription unavailable. Please check backend Groq key configuration or provide typed input.",
                "language", language,
                "source", "STT_UNAVAILABLE"
        );
    }

    @PostMapping(value = "/voice/stt/file", consumes = org.springframework.http.MediaType.MULTIPART_FORM_DATA_VALUE)
    public Map<String, Object> speechToTextFile(
            @RequestParam("file") org.springframework.web.multipart.MultipartFile file,
            @RequestParam(value = "language", defaultValue = "en") String language) {
        if (file != null && !file.isEmpty()) {
            try {
                byte[] audioBytes = file.getBytes();
                String originalFilename = file.getOriginalFilename() != null ? file.getOriginalFilename() : "recording.m4a";
                String transcript = orchestratorService.getConversationAgent().getGroqApiClient().transcribeAudio(audioBytes, originalFilename);
                if (transcript != null && !transcript.trim().isEmpty()) {
                    return Map.of(
                            "status", "SUCCESS",
                            "transcript", transcript,
                            "language", language,
                            "source", "GROQ_WHISPER_LIVE"
                    );
                }
            } catch (Exception e) {
                // Fallthrough
            }
        }

        return Map.of(
                "status", "ERROR",
                "message", "Failed to process audio file or Groq transcription API unavailable.",
                "language", language,
                "source", "STT_UNAVAILABLE"
        );
    }

    @PostMapping("/trip-intent/extract")
    public ExtractIntentResponse extractIntent(@RequestBody ExtractIntentRequest request) {
        String convId = request.getConversationId() != null && !request.getConversationId().isBlank()
                ? request.getConversationId()
                : UUID.randomUUID().toString();

        // Multi-turn session context retrieval if prior intent exists for this conversation
        TripIntent existingIntent = tripIntentRepository.findByConversationId(convId).orElse(null);

        var draft = orchestratorService.getIntakeAgent().extractIntent(request.getRawInput());

        // Merge fields if existing intent exists (follow-up/modification)
        if (existingIntent != null) {
            if (draft.getOriginCity() == null) draft.setOriginCity(existingIntent.getOriginCity());
            if (draft.getDestinationCity() == null) draft.setDestinationCity(existingIntent.getDestinationCity());
            if (draft.getTravelDate() == null) draft.setTravelDate(existingIntent.getTravelDate());
            if (draft.getArrivalDeadline() == null) draft.setArrivalDeadline(existingIntent.getArrivalDeadline());
            if (draft.getMaxBusBudget() == null) draft.setMaxBusBudget(existingIntent.getMaxBudget());
            if (draft.getPreferredBusMode() == null) draft.setPreferredBusMode(existingIntent.getPreferredMode());
            if (draft.getHotelDestination() == null) draft.setHotelDestination(existingIntent.getHotelDestination());
            if (draft.getCheckInDate() == null) draft.setCheckInDate(existingIntent.getCheckInDate());
            if (draft.getStayNights() == null) draft.setStayNights(existingIntent.getStayNights());
            if (draft.getMaxHotelBudgetPerNight() == null) draft.setMaxHotelBudgetPerNight(existingIntent.getMaxHotelBudgetPerNight());
            if (draft.getMinHotelRating() == null) draft.setMinHotelRating(existingIntent.getMinHotelRating());
        }

        var clarification = orchestratorService.getClarificationAgent().evaluateDraft(draft);

        String intentId = UUID.randomUUID().toString();

        TripIntent savedIntent = TripIntent.builder()
                .id(intentId)
                .conversationId(convId)
                .intentType(draft.getIntentType())
                .originCity(draft.getOriginCity())
                .destinationCity(draft.getDestinationCity())
                .locality(draft.getLocality())
                .travelDate(draft.getTravelDate())
                .arrivalDeadline(draft.getArrivalDeadline())
                .maxBudget(draft.getMaxBusBudget())
                .preferredMode(draft.getPreferredBusMode())
                .passengerCount(draft.getPassengerCount())
                .hotelDestination(draft.getHotelDestination())
                .checkInDate(draft.getCheckInDate())
                .checkOutDate(draft.getCheckOutDate())
                .stayNights(draft.getStayNights())
                .roomCount(draft.getRoomCount())
                .maxHotelBudgetPerNight(draft.getMaxHotelBudgetPerNight())
                .minHotelRating(draft.getMinHotelRating())
                .languagePreference(request.getUserLanguage())
                .isClarified(clarification.isClarified())
                .build();

        tripIntentRepository.save(savedIntent);

        DraftIntentDto draftDto = DraftIntentDto.builder()
                .intentType(draft.getIntentType())
                .originCity(draft.getOriginCity())
                .destinationCity(draft.getDestinationCity())
                .locality(draft.getLocality())
                .travelDate(draft.getTravelDate())
                .arrivalDeadline(draft.getArrivalDeadline())
                .maxBusBudget(draft.getMaxBusBudget())
                .preferredBusMode(draft.getPreferredBusMode())
                .passengerCount(draft.getPassengerCount())
                .hotelDestination(draft.getHotelDestination())
                .checkInDate(draft.getCheckInDate())
                .checkOutDate(draft.getCheckOutDate())
                .stayNights(draft.getStayNights())
                .roomCount(draft.getRoomCount())
                .maxHotelBudgetPerNight(draft.getMaxHotelBudgetPerNight())
                .maxHotelTotalBudget(draft.getMaxHotelTotalBudget())
                .minHotelRating(draft.getMinHotelRating())
                .preferredAmenities(draft.getPreferredAmenities())
                .build();

        ClarificationQuestionDto questionDto = null;
        if (clarification.getQuestion() != null) {
            questionDto = ClarificationQuestionDto.builder()
                    .questionKey(clarification.getQuestion().getQuestionKey())
                    .questionText(clarification.getQuestion().getQuestionText())
                    .options(clarification.getQuestion().getOptions())
                    .build();
        }

        String summary = orchestratorService.getConversationAgent().generateConversationalSummary(draft, request.getUserLanguage());

        return ExtractIntentResponse.builder()
                .intentId(savedIntent.getId())
                .conversationId(convId)
                .intentType(draft.getIntentType())
                .status(clarification.isClarified() ? "CLARIFIED" : "REQUIRES_CLARIFICATION")
                .draftIntent(draftDto)
                .missingFields(clarification.getMissingFields())
                .clarificationQuestion(questionDto)
                .conversationalSummary(summary)
                .build();
    }
}
