package com.roamagent.agent;

import com.roamagent.client.GroqApiClient;
import lombok.Getter;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
@Getter
public class ConversationAgent {
    private final GroqApiClient groqApiClient;

    public String processGreeting(String rawInput) {
        String response = groqApiClient.generateChatCompletion(
                "You are RoamAgent assistant for Indian intercity travel concierge. Respond concisely and offer assistance with bus and hotel bookings.",
                rawInput
        );
        return response != null ? response : "Hello! Welcome to RoamAgent. I can help you search intercity buses and nearby hotels. Where would you like to go?";
    }

    public String generateConversationalSummary(IntakeAgent.ExtractedDraft draft, String language) {
        boolean isTelugu = "te".equalsIgnoreCase(language);
        String prompt = "You are RoamAgent concierge. Generate a brief 1-2 sentence friendly summary explaining what travel parameters were understood from the user request.\n" +
                "Language: " + (isTelugu ? "Telugu" : "English") + ".\n" +
                "User intent: " + draft.getIntentType() + ", Origin: " + draft.getOriginCity() + ", Dest: " + draft.getDestinationCity() + ", Date: " + draft.getTravelDate() +
                ", Bus Budget: " + draft.getMaxBusBudget() + ", Hotel Budget: " + draft.getMaxHotelBudgetPerNight() + ".";

        String response = groqApiClient.generateChatCompletion("Summarize travel request parameters concisely in " + (isTelugu ? "Telugu" : "English"), prompt);
        if (response != null && !response.isBlank()) {
            return response.trim();
        }

        if (isTelugu) {
            return "మీ ప్రయాణ వివరాలు పరిశీలించబడ్డాయి. " + (draft.getOriginCity() != null ? draft.getOriginCity() : "") + " నుండి " + (draft.getDestinationCity() != null ? draft.getDestinationCity() : "") + " కి బస్సు మరియు హోటల్ అందుబాటులో వెతుకుతున్నాను.";
        }

        StringBuilder sb = new StringBuilder("Understood: ");
        if ("COMBINED".equalsIgnoreCase(draft.getIntentType())) {
            sb.append("Bus trip from ").append(draft.getOriginCity()).append(" to ").append(draft.getDestinationCity())
              .append(" on ").append(draft.getTravelDate()).append(" and hotel stay in ").append(draft.getHotelDestination() != null ? draft.getHotelDestination() : draft.getDestinationCity()).append(".");
        } else if ("HOTEL".equalsIgnoreCase(draft.getIntentType())) {
            sb.append("Hotel search in ").append(draft.getHotelDestination() != null ? draft.getHotelDestination() : draft.getDestinationCity())
              .append(" for ").append(draft.getStayNights() != null ? draft.getStayNights() : 1).append(" night(s).");
        } else {
            sb.append("Bus travel from ").append(draft.getOriginCity()).append(" to ").append(draft.getDestinationCity())
              .append(" on ").append(draft.getTravelDate()).append(".");
        }
        return sb.toString();
    }
}
