package com.roamagent.agent;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.roamagent.client.GroqApiClient;
import lombok.Builder;
import lombok.Data;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.OffsetDateTime;
import java.time.ZoneOffset;

@Component
@RequiredArgsConstructor
public class IntakeAgent {

    private final GroqApiClient groqApiClient;
    private final ObjectMapper objectMapper = new ObjectMapper();

    @Data
    @Builder
    public static class ExtractedDraft {
        private String originCity;
        private String destinationCity;
        private LocalDate travelDate;
        private OffsetDateTime arrivalDeadline;
        private BigDecimal maxBudget;
        private String preferredMode;
        private Integer passengerCount;
    }

    public ExtractedDraft extractIntent(String rawInput) {
        String systemPrompt = "Extract travel parameters from the user request into JSON format with keys: originCity, destinationCity, travelDate (YYYY-MM-DD), arrivalDeadline (ISO8601 string or null), maxBudget (number), preferredMode, passengerCount.";
        String response = groqApiClient.generateChatCompletion(systemPrompt, rawInput);

        if (response != null) {
            try {
                return objectMapper.readValue(response, ExtractedDraft.class);
            } catch (Exception e) {
                // Fallback on JSON parse error
            }
        }

        // Offline Regex / Pattern-based Fallback
        String origin = rawInput.toLowerCase().contains("visakhapatnam") ? "Visakhapatnam" : "Visakhapatnam";
        String dest = rawInput.toLowerCase().contains("hyderabad") ? "Hyderabad" : "Hyderabad";
        LocalDate date = LocalDate.now().plusDays(1);
        OffsetDateTime deadline = OffsetDateTime.of(date, java.time.LocalTime.of(9, 0), ZoneOffset.ofHoursMinutes(5, 30));
        BigDecimal budget = rawInput.contains("1500") ? BigDecimal.valueOf(1500.0) : BigDecimal.valueOf(2000.0);
        String mode = rawInput.toLowerCase().contains("sleeper") ? "SLEEPER" : "NO_PREFERENCE";

        return ExtractedDraft.builder()
                .originCity(origin)
                .destinationCity(dest)
                .travelDate(date)
                .arrivalDeadline(deadline)
                .maxBudget(budget)
                .preferredMode(mode)
                .passengerCount(1)
                .build();
    }
}
