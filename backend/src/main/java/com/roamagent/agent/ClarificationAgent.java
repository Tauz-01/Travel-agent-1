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

        if (draft.getOriginCity() == null) missing.add("ORIGIN_CITY");
        if (draft.getDestinationCity() == null) missing.add("DESTINATION_CITY");

        if (!missing.isEmpty()) {
            return ClarificationResult.builder()
                    .isClarified(false)
                    .missingFields(missing)
                    .question(QuestionPayload.builder()
                            .questionKey("CITY_SELECTION")
                            .questionText("Please specify your origin and destination city.")
                            .options(List.of("Visakhapatnam to Hyderabad", "Vijayawada to Hyderabad"))
                            .build())
                    .build();
        }

        // Demo specific boarding point clarification
        return ClarificationResult.builder()
                .isClarified(true)
                .missingFields(List.of())
                .question(null)
                .build();
    }
}
