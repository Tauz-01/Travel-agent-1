package com.roamagent.agent;

import com.roamagent.client.GroqApiClient;
import org.junit.jupiter.api.Test;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.Mockito.*;

import static org.junit.jupiter.api.Assertions.*;

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
        assertEquals("SLEEPER", draft.getPreferredMode());
    }
}
