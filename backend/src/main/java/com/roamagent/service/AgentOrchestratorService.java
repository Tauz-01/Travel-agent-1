package com.roamagent.service;

import com.roamagent.agent.*;
import lombok.Getter;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
@Getter
public class AgentOrchestratorService {
    private final ConversationAgent conversationAgent;
    private final IntakeAgent intakeAgent;
    private final ClarificationAgent clarificationAgent;
    private final RoutePlanningAgent routePlanningAgent;
    private final RecommendationAgent recommendationAgent;
    private final DisruptionRecoveryAgent disruptionRecoveryAgent;
    private final ExplanationLocalizationAgent explanationLocalizationAgent;
}
