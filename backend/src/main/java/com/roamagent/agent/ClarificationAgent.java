package com.roamagent.agent;

import com.roamagent.agent.IntakeAgent.ExtractedDraft;
import lombok.Builder;
import lombok.Data;
import org.springframework.stereotype.Component;

import java.util.ArrayList;
import java.util.List;

@Component
public class ClarificationAgent {

    @Data
    @Builder
    public static class ClarificationResult {
        private boolean isClarified;
        private List<String> missingFields;
        private QuestionPayload question;
    }

    @Data
    @Builder
    public static class QuestionPayload {
        private String questionKey;
        private String questionText;
        private List<String> options;
    }

    public ClarificationResult evaluateDraft(ExtractedDraft draft) {
        List<String> missing = new ArrayList<>();
        String intentType = draft.getIntentType() != null ? draft.getIntentType().toUpperCase() : "BUS";

        boolean needsBus = "BUS".equals(intentType) || "COMBINED".equals(intentType);
        boolean needsHotel = "HOTEL".equals(intentType) || "COMBINED".equals(intentType);

        if (needsBus) {
            if (draft.getOriginCity() == null || draft.getOriginCity().isBlank()) {
                missing.add("ORIGIN_CITY");
            }
            if (draft.getDestinationCity() == null || draft.getDestinationCity().isBlank()) {
                missing.add("DESTINATION_CITY");
            }
            if (draft.getTravelDate() == null) {
                missing.add("TRAVEL_DATE");
            }
        }

        if (needsHotel) {
            if ((draft.getHotelDestination() == null || draft.getHotelDestination().isBlank()) &&
                (draft.getDestinationCity() == null || draft.getDestinationCity().isBlank())) {
                missing.add("HOTEL_DESTINATION");
            }
        }

        if (!missing.isEmpty()) {
            String firstMissing = missing.get(0);
            String questionKey = firstMissing;
            String questionText;
            List<String> options = List.of();

            switch (firstMissing) {
                case "ORIGIN_CITY":
                    questionText = "Which city are you departing from?";
                    options = List.of("Visakhapatnam", "Vijayawada", "Hyderabad", "Tirupati");
                    break;
                case "DESTINATION_CITY":
                    questionText = "Where are you traveling to?";
                    options = List.of("Hyderabad", "Visakhapatnam", "Vijayawada", "Bengaluru");
                    break;
                case "TRAVEL_DATE":
                    questionText = "What date are you planning to travel?";
                    options = List.of("Tomorrow", "Day after tomorrow", "This weekend");
                    break;
                case "HOTEL_DESTINATION":
                    questionText = "Which city or area do you need a hotel in?";
                    options = List.of("Gachibowli, Hyderabad", "RTC Complex, Visakhapatnam", "Benz Circle, Vijayawada");
                    break;
                default:
                    questionText = "Please clarify your travel requirements.";
            }

            return ClarificationResult.builder()
                    .isClarified(false)
                    .missingFields(missing)
                    .question(QuestionPayload.builder()
                            .questionKey(questionKey)
                            .questionText(questionText)
                            .options(options)
                            .build())
                    .build();
        }

        return ClarificationResult.builder()
                .isClarified(true)
                .missingFields(List.of())
                .question(null)
                .build();
    }
}
