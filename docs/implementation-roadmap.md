# RoamAgent Implementation Roadmap & Acceptance Criteria

This roadmap outlines the strict sequential execution order for Phase 2 implementation following architecture approval.

---

## Phase 0 — Environment & Repository Baseline Verification
- **Goal**: Confirm Java 21, Maven, Flutter, PostgreSQL tools and verify workspace directory baseline.
- **Tasks**:
  1. Verify Java 21 and Maven build capabilities in `backend/`.
  2. Verify Flutter SDK and dependencies in `frontend/`.
  3. Validate database connection settings in `application.yml`.
- **Acceptance Criteria**: Both backend compile and frontend `flutter pub get` succeed without environment errors.

---

## Phase 1 — Backend Foundation & PostgreSQL Seed Infrastructure
- **Goal**: Establish relational schema, JPA entities, repositories, and Flyway database migrations.
- **Tasks**:
  1. Create Flyway migrations `V1__create_transport_tables.sql` through `V4__create_booking_tables.sql`.
  2. Implement `V5__insert_demo_data.sql` with Visakhapatnam, Vijayawada, Hyderabad, Tirupati routes.
  3. Implement JPA entities and Spring Data Repositories for catalog, trip, itinerary, disruption, and audit tables.
  4. Implement `/api/v1/health` endpoint.
- **Acceptance Criteria**: Spring Boot starts cleanly; Flyway migrates successfully; database seed can be re-run deterministically without duplicate key failures.

---

## Phase 2 — Deterministic Routing & Recommendation Engine
- **Goal**: Implement graph-based route search, constraint filtering, and 2-stage weighted composite scoring.
- **Tasks**:
  1. Implement `GraphNetworkService.java` to build time-expanded adjacency graph from database schedules.
  2. Implement `RoutePlannerService.java` with bounded depth-first search for multi-leg paths.
  3. Implement `FeasibilityService.java` checking transfer buffers, budget caps, and arrival deadlines.
  4. Implement `RecommendationScorer.java` computing composite scores ($0\text{--}100$).
- **Acceptance Criteria**: Unit tests pass verifying direct routes, multi-leg transfer buffer enforcement ($<45$ mins rejected), budget cap enforcement, and the fewer-than-4 results case.

---

## Phase 3 — Groq AI Integration & Agent Orchestration
- **Goal**: Implement central agent orchestrator, 7 specialized logical agents, and Groq API client with fallback mechanisms.
- **Tasks**:
  1. Implement `GroqApiClient.java` with configurable model ID (`llama-3.1-8b-instant`).
  2. Implement Agents 1 through 7 as distinct Spring components.
  3. Implement `AgentOrchestratorService.java` controlling workflow state.
  4. Implement regex and template-based fallbacks for offline LLM mode.
- **Acceptance Criteria**: Intent extraction converts natural text to `DraftTripIntent` JSON; clarification manager identifies missing fields; unconfigured API key falls back smoothly without crashing backend.

---

## Phase 4 — REST API Endpoints & Journey State Management
- **Goal**: Implement complete REST API layer, demo checkout, and journey lifecycle state transitions.
- **Tasks**:
  1. Implement `TripController`, `ItineraryController`, `DisruptionController`, `BookingController`.
  2. Implement demo checkout (`AWAITING_DEMO_CONFIRMATION` -> `DEMO_CONFIRMED` -> `ACTIVE`).
  3. Add OpenAPI annotations and Swagger documentation at `/swagger-ui.html`.
- **Acceptance Criteria**: All API endpoints return valid JSON DTOs matching `api-contract.md`; invalid state transitions throw `400 Bad Request`.

---

## Phase 5 — Flutter Core Mobile Application
- **Goal**: Build Flutter UI featuring chat/voice intake, editable trip forms, itinerary cards, timeline view, and theme.
- **Tasks**:
  1. Configure Riverpod state providers and Dio REST API client in `frontend/`.
  2. Implement Material 3 design system tokens and localization ARB files (`app_en.arb`, `app_te.arb`).
  3. Build Conversation Screen, Editable Trip Intake Form, and Search Results View.
  4. Build Itinerary Detail View with multi-leg journey timeline.
- **Acceptance Criteria**: User can type or speak a trip request, review/edit constraints, view ranked itinerary cards with feasibility badges, and select a route.

---

## Phase 6 — Speech-to-Text & Voice Integration
- **Goal**: Integrate Flutter audio recording with backend Groq Whisper speech-to-text service.
- **Tasks**:
  1. Integrate `record` plugin for Flutter microphone input.
  2. Implement `POST /api/v1/voice/transcribe` multipart handler calling Groq Whisper API.
  3. Add transcript review/edit screen with Telugu and English support.
  4. Implement fallback to text input on mic permission denial or recording failure.
- **Acceptance Criteria**: Recorded voice audio is transcribed accurately; user can edit transcript before extraction; voice errors fall back gracefully to text.

---

## Phase 7 — Google Maps Visualization
- **Goal**: Integrate `google_maps_flutter` plugin to render mock stop coordinates, route polylines, and simulated bus markers.
- **Tasks**:
  1. Integrate `google_maps_flutter` plugin in Flutter screens.
  2. Synthesize polyline coordinates for Visakhapatnam -> Vijayawada -> Hyderabad.
  3. Display custom markers for boarding stops, transfer terminals, and simulated vehicle positions.
- **Acceptance Criteria**: Selected itinerary displays polyline overlay and stop markers matching backend coordinates; simulated vehicle positions render clearly.

---

## Phase 8 — Disruption Simulation & Mid-Trip Recovery Engine
- **Goal**: Implement deterministic delay scenario injection, connection conflict calculation, and recovery candidate search.
- **Tasks**:
  1. Implement `DisruptionSimulator.java` handling predefined scenario `SCENARIO_CONNECTION_DELAY_01`.
  2. Implement delay recalculation math ($02:40 + 50\text{m} = 03:30\text{ AM} \implies \text{Buffer } 5\text{m} < 45\text{m}$).
  3. Implement mid-trip recovery search starting from Vijayawada transfer point.
  4. Generate side-by-side comparison payload (Active vs Recovery Options).
- **Acceptance Criteria**: Injecting 50 min delay automatically flags transfer conflict and produces valid recovery alternatives from Vijayawada; mathematical calculation strictly matches spec.

---

## Phase 9 — Revision Approval, Atomic Commit & Audit Logging
- **Goal**: Implement explicit user approval/rejection, atomic database revision commits, and audit history.
- **Tasks**:
  1. Implement approval/rejection endpoints in `ItineraryController.java`.
  2. Add `@Transactional` revision commit service updating active itinerary legs.
  3. Implement immutable audit logging in `audit_records` table.
  4. Build Flutter Change Approval Modal and Recovery Comparison Slider.
- **Acceptance Criteria**: Clicking Approve transactionally updates active itinerary and records audit entry; clicking Reject maintains active plan; stale or duplicate approvals are rejected.

---

## Phase 10 — End-to-End Integration Testing & Demo Verification
- **Goal**: Execute complete end-to-end journey demonstration and verify test suites across backend and frontend.
- **Tasks**:
  1. Execute Spring Boot integration tests (`mvn test`).
  2. Execute Flutter unit/widget tests (`flutter test`).
  3. Run full end-to-end demo workflow (Voice intake -> Search -> Checkout -> Disruption -> Recovery -> Approval -> Audit history).
- **Acceptance Criteria**: 100% of integration test suites pass; complete end-to-end demonstration executes smoothly without crashes or unhandled exceptions.
