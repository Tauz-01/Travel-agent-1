package com.roamagent.client;

import lombok.Data;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.io.ByteArrayResource;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Component;
import org.springframework.util.LinkedMultiValueMap;
import org.springframework.util.MultiValueMap;
import org.springframework.web.client.RestTemplate;

import java.util.List;
import java.util.Map;

@Component
@RequiredArgsConstructor
public class GroqApiClient {

    @Value("${groq.api.key:}")
    private String apiKey;

    @Value("${groq.model:llama-3.1-8b-instant}")
    private String model;

    @Value("${groq.base-url:https://api.groq.com/openai/v1}")
    private String baseUrl;

    private final RestTemplate restTemplate = new RestTemplate();

    @Data
    public static class ChatResponse {
        private List<Choice> choices;

        @Data
        public static class Choice {
            private Message message;
        }

        @Data
        public static class Message {
            private String content;
        }
    }

    @Data
    public static class TranscriptionResponse {
        private String text;
    }

    public String generateChatCompletion(String systemPrompt, String userMessage) {
        if (apiKey == null || apiKey.trim().isEmpty() || "test-key".equals(apiKey)) {
            return null; // Fallback signal
        }

        try {
            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_JSON);
            headers.setBearerAuth(apiKey);

            Map<String, Object> requestBody = Map.of(
                    "model", model,
                    "messages", List.of(
                            Map.of("role", "system", "content", systemPrompt),
                            Map.of("role", "user", "content", userMessage)
                    ),
                    "temperature", 0.2
            );

            HttpEntity<Map<String, Object>> entity = new HttpEntity<>(requestBody, headers);
            ChatResponse response = restTemplate.postForObject(baseUrl + "/chat/completions", entity, ChatResponse.class);

            if (response != null && response.getChoices() != null && !response.getChoices().isEmpty()) {
                return response.getChoices().get(0).getMessage().getContent();
            }
        } catch (Exception e) {
            // Log & fallback to template/regex
        }
        return null;
    }

    public String transcribeAudio(byte[] audioBytes, String filename) {
        if (apiKey == null || apiKey.trim().isEmpty() || "test-key".equals(apiKey) || audioBytes == null || audioBytes.length == 0) {
            return null;
        }

        try {
            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.MULTIPART_FORM_DATA);
            headers.setBearerAuth(apiKey);

            ByteArrayResource fileResource = new ByteArrayResource(audioBytes) {
                @Override
                public String getFilename() {
                    return filename != null ? filename : "audio.m4a";
                }
            };

            MultiValueMap<String, Object> body = new LinkedMultiValueMap<>();
            body.add("file", fileResource);
            body.add("model", "whisper-large-v3-turbo");
            body.add("response_format", "json");

            HttpEntity<MultiValueMap<String, Object>> requestEntity = new HttpEntity<>(body, headers);
            TranscriptionResponse response = restTemplate.postForObject(baseUrl + "/audio/transcriptions", requestEntity, TranscriptionResponse.class);

            if (response != null && response.getText() != null) {
                return response.getText().trim();
            }
        } catch (Exception e) {
            // Fallback signal
        }
        return null;
    }
}
