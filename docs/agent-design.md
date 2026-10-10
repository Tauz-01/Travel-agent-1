# RoamAgent Agent System Specification

## 1. Central Agent Orchestrator Architecture

The **Central Agent Orchestrator** (`AgentOrchestratorService.java`) acts as the state manager and workflow gatekeeper across the 7 specialized logical agents.

### Key Rules
- Agents do **not** directly call each other via unstructured natural language.
- Communication between agents occurs via strongly-typed Java DTOs.
- The Orchestrator enforces deterministic validation gates before advancing to the next workflow stage.
- LLM calls are invoked strictly when parsing unstructured input or synthesizing natural language explanations.

---

## 2. Detailed Specifications for the 7 Specialized Agents

### Agent 1 — Conversation and Language Agent
- **Purpose**: Tracks active user conversation state, chosen language (`en` / `te`), and maintains short-term conversational context.
- **Inputs**: User input text/voice, `conversationId`, current session state.
- **Outputs**: Language context DTO, updated conversation history.
- **LLM Usage**: None (Deterministic state management).
- **Error Handling**: Defaults to English (`en`) if language code is unrecognized.

### Agent 2 — Trip-Intent Extraction Agent
- **Purpose**: Converts natural-language text or transcribed speech into a structured `DraftTripIntent` candidate DTO.
- **Inputs**: Raw user text, user language preference.
- **Outputs**: `DraftTripIntent` DTO (`originCity`, `destinationCity`, `travelDate`, `arrivalDeadline`, `maxBudget`, `preferredMode`).
- **LLM Usage**: **Yes** (Calls Groq Llama 3.1 8B with JSON mode / JSON schema constraint).
- **Fallback**: Regex-based keyword & date pattern extraction when Groq API is offline or unconfigured.

### Agent 3 — Clarification Agent
- **Purpose**: Evaluates draft trip intent against required fields and generates focused follow-up questions for missing values.
- **Inputs**: `DraftTripIntent` DTO.
- **Outputs**: Validation result DTO (`isValid`, `missingFields`, `clarificationQuestion`).
- **Distinction**: Explicitly distinguishes "no preference" (valid value) from missing/unknown fields.
- **LLM Usage**: Conditional (Template-based for standard missing fields; Groq LLM for ambiguous user choices).

### Agent 4 — Route-Planning Agent
- **Purpose**: Bridges the Orchestrator with the Java `RoutePlannerService`.
- **Inputs**: Validated `TripIntent` DTO.
- **Outputs**: Feasible multi-leg route candidates.
- **LLM Usage**: **Zero (100% Deterministic)**. Calls graph search service querying PostgreSQL.

### Agent 5 — Recommendation Agent
- **Purpose**: Takes feasible candidate routes and applies Stage 2 composite scoring (0-100) and ranking.
- **Inputs**: Feasible candidate itineraries, user preference weights.
- **Outputs**: Ranked list of up to 4 itineraries with score breakdowns.
- **LLM Usage**: **Zero (100% Deterministic)**. Executes mathematical scoring algorithm.

### Agent 6 — Disruption and Recovery Coordinator
- **Purpose**: Monitors journey simulation clock, calculates disruption delay impacts on downstream connections, and invokes recovery searches.
- **Inputs**: `DisruptionEvent`, `ActiveItinerary`.
- **Outputs**: `ImpactAssessmentDTO` and `RecoveryProposalDTO`.
- **LLM Usage**: **Zero (100% Deterministic)**. Executes time arithmetic and transfer buffer math.

### Agent 7 — Explanation and Localization Agent
- **Purpose**: Translates verified deterministic results, trade-offs, delay warnings, and recovery proposals into natural Telugu or English sentences.
- **Inputs**: Ranked itineraries / Recovery proposals + verified score inputs + user language.
- **Outputs**: Natural language summary text.
- **LLM Usage**: **Yes** (Calls Groq Llama 3.1 8B).
- **Constraint**: Prompt enforced never to invent new facts outside the provided DTO data. Fallback to pre-formatted string templates if LLM unavailable.

---

## 3. Summary Table of Agent Boundaries

| Agent | Module Name | Type | LLM Powered? | Primary Responsibility |
| :--- | :--- | :--- | :--- | :--- |
| **Agent 1** | Conversation & Language | Logical Module | No | Maintain session state & language context |
| **Agent 2** | Intent Extraction | Logical Module | Yes (Groq) | Natural language / speech -> Structured JSON DTO |
| **Agent 3** | Clarification | Logical Module | Conditional | Validate mandatory fields & ask follow-up questions |
| **Agent 4** | Route Planning | Logical Module | **No (0%)** | Invoke graph search service |
| **Agent 5** | Recommendation | Logical Module | **No (0%)** | 2-Stage weighted scoring & candidate ranking |
| **Agent 6** | Disruption & Recovery | Logical Module | **No (0%)** | Calculate delay impact & search mid-trip alternatives |
| **Agent 7** | Explanation & Localization | Logical Module | Yes (Groq) | Translate verified data into Telugu/English explanations |
