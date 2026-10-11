package com.roamagent.agent;

import com.roamagent.client.GroqApiClient;
import org.junit.jupiter.api.Test;
import java.math.BigDecimal;
import java.time.LocalDate;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.Mockito.*;

class IntakeAgentTest {

    @Test
    void testOfflineFallbackParsing() {
        GroqApiClient mockClient = mock(GroqApiClient.class);
        when(mockClient.generateChatCompletion(anyString(), anyString())).thenReturn(null);

        IntakeAgent agent = new IntakeAgent(mockClient);
        IntakeAgent.ExtractedDraft draft = agent.extractIntent("Visakhapatnam to Hyderabad tomorrow sleeper budget 1500");

        assertNotNull(draft);
        assertEquals("Visakhapatnam", draft.getOriginCity());
        assertEquals("Hyderabad", draft.getDestinationCity());
        assertEquals("SLEEPER", draft.getPreferredBusMode());
    }

    @Test
    void testVoiceInputTypoAndDateExtraction() {
        GroqApiClient mockClient = mock(GroqApiClient.class);
        when(mockClient.generateChatCompletion(anyString(), anyString())).thenReturn(null);

        IntakeAgent agent = new IntakeAgent(mockClient);
        IntakeAgent.ExtractedDraft draft = agent.extractIntent("i want to travel from viag to banglore under budget 1000 on 16october");

        assertNotNull(draft);
        assertEquals("Visakhapatnam", draft.getOriginCity());
        assertEquals("Bengaluru", draft.getDestinationCity());
        assertEquals(new BigDecimal("1000"), draft.getMaxBusBudget());
        assertEquals(LocalDate.of(2026, 10, 16), draft.getTravelDate());
    }
}