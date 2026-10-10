## Why

The RoamAgent platform requires a robust, authoritative Java 21 Spring Boot backend to power multi-leg bus intercity travel, deterministic routing, LLM/Groq AI agent orchestration, journey lifecycle tracking, disruption management, and recovery options. Implementing the backend based on the 7 architectural design documents ensures data integrity, zero AI hallucinations for travel schedules, deterministic route calculation, and auditability.

## What Changes

- **Backend Project Setup**: Java 21 Spring Boot 3.2.x Maven project with Flyway migrations and PostgreSQL database seed.
- **Relational Storage & Entities**: Implement Flyway migrations V1 through V5 and JPA entities/repositories for transit catalog, trip intents, itineraries, disruptions, and audit records.
- **Deterministic Routing Engine**: Implement time-expanded graph search (`GraphNetworkService`), feasibility validation (`FeasibilityService`), and 2-stage weighted composite scoring (`RecommendationScorer`).
- **AI Agent Orchestration & Groq Client**: Implement Groq API client with fallback capabilities and 7 logical agent components managed by `AgentOrchestratorService`.
- **REST APIs & Journey Lifecycle**: Implement `TripController`, `ItineraryController`, `DisruptionController`, `BookingController`, and OpenAPI/Swagger specs.
- **Disruption & Recovery Engine**: Implement `DisruptionSimulator`, connection conflict calculation, mid-trip recovery search from Vijayawada, and atomic revision commit.

## Capabilities

### New Capabilities
- `backend-core`: Java 21 Spring Boot backend framework, Flyway database migrations, JPA entities, REST API layer, Groq AI agent orchestration, deterministic graph routing, disruption simulator, and atomic revision tracking.

### Modified Capabilities

None.

## Impact

- **Database**: PostgreSQL schema with Flyway migrations V1-V5.
- **API**: REST API endpoints matching `api-contract.md` under `/api/v1/*` and Swagger UI at `/swagger-ui.html`.
- **External Dependencies**: Groq Cloud API for LLM/Whisper inference.
