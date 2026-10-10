package com.roamagent.agent;

import com.roamagent.client.GroqApiClient;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class ConversationAgent {
    private final GroqApiClient groqApiClient;

    public String processGreeting(String rawInput) {
        String response = groqApiClient.generateChatCompletion(
                "You are RoamAgent assistant for Indian intercity travel. Be polite and helpful.",
                rawInput
        );
        return response != null ? response : "Hello! Welcome to RoamAgent. Where would you like to travel today?";
    }
}
