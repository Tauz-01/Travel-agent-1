## 1. Project Baseline & Foundation Setup

- [x] 1.1 Scaffold Spring Boot 3.2.x Maven project with Java 21, Flyway, PostgreSQL, Lombok, and SpringDoc OpenAPI dependencies and verify application context startup.
- [x] 1.2 Configure `application.yml` and `application-test.yml` with PostgreSQL connection settings and verify Flyway migration support.

## 2. Relational Schema & Persistence Infrastructure

- [x] 2.1 Implement SQL migrations `V1__create_transport_tables.sql` through `V4__create_booking_tables.sql` and verify table creation.
- [x] 2.2 Implement `V5__insert_demo_data.sql` with schedules for Visakhapatnam, Vijayawada, Hyderabad, Tirupati routes and verify deterministic data migration.
- [x] 2.3 Implement JPA Entities and Spring Data Repositories for Transit Catalog, Trip Intent, Itinerary, Disruption, and Audit models and verify repository unit tests pass.

## 3. Deterministic Routing & Recommendation Engine

- [x] 3.1 Implement `GraphNetworkService` for time-expanded adjacency graph construction from bus schedule entities.
- [x] 3.2 Implement `FeasibilityService` enforcing minimum 45-minute transfer buffers, budget caps, and arrival deadlines.
- [x] 3.3 Implement `RecommendationScorer` computing 2-stage weighted composite scores ($0\text{--}100$) and returning max 4 ranked options.
- [x] 3.4 Write unit tests for graph search, transfer buffer filtering (<45 min rejected), budget cap enforcement, and ranking output.

## 4. Groq AI Integration & Agent Orchestration

- [x] 4.1 Implement `GroqApiClient` supporting model `llama-3.1-8b-instant` and Whisper transcription.
- [x] 4.2 Implement 7 specialized logical agent components (`ConversationAgent`, `IntakeAgent`, `ClarificationAgent`, `RoutePlanningAgent`, `RecommendationAgent`, `DisruptionRecoveryAgent`, `ExplanationLocalizationAgent`).
- [x] 4.3 Implement `AgentOrchestratorService` to control agent workflow state and provide template/regex offline fallbacks when Groq API keys are unconfigured.
- [x] 4.4 Write integration tests verifying fallback parsing converts natural text into `DraftTripIntent` when Groq API is offline.

## 5. REST API Layer & Journey State Management

- [x] 5.1 Implement `TripController`, `ItineraryController`, `DisruptionController`, and `BookingController` matching `docs/api-contract.md`.
- [x] 5.2 Implement demo checkout lifecycle state transitions (`AWAITING_DEMO_CONFIRMATION` -> `DEMO_CONFIRMED` -> `ACTIVE`).
- [x] 5.3 Configure SpringDoc OpenAPI annotations and verify `/swagger-ui.html` loads contract definitions properly.

## 6. Disruption Simulation & Recovery Engine

- [x] 6.1 Implement `DisruptionSimulator` for predefined scenario `SCENARIO_CONNECTION_DELAY_01`.
- [x] 6.2 Implement connection delay recalculation math and transfer conflict detection ($02:40 + 50\text{m} = 03:30\text{ AM} \implies \text{Buffer } 5\text{m} < 45\text{m}$).
- [x] 6.3 Implement mid-trip recovery search starting from Vijayawada transfer hub and return side-by-side comparison payload.

## 7. Revision Approval, Atomic Commit & Audit Logging

- [x] 7.1 Implement revision approval/rejection endpoints in `ItineraryController`.
- [x] 7.2 Implement `@Transactional` revision commit service updating active itinerary legs upon user approval.
- [x] 7.3 Implement immutable audit logging in `audit_records` table and verify audit trail generation.
- [x] 7.4 Execute complete backend test suite (`mvn test`) and verify 100% test pass rate.
