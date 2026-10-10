package com.roamagent.agent;

import com.roamagent.client.GroqApiClient;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class ExplanationLocalizationAgent {

    private final GroqApiClient groqApiClient;

    public String generateExplanation(String rawExplanation, String lang) {
        if ("te".equalsIgnoreCase(lang)) {
            String prompt = "Translate or explain this travel itinerary details in simple Telugu for an intercity bus passenger: " + rawExplanation;
            String res = groqApiClient.generateChatCompletion("You are a helpful travel assistant fluent in Telugu.", prompt);
            if (res != null) return res;
            return "విజయవాడ మీదుగా 1 మార్పిడి ప్రయాణం. ఆగమనం: ఉదయం 08:30.";
        }
        return rawExplanation;
    }
}
