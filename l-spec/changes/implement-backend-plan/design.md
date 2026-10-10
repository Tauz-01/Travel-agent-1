## Context

The backend is built as a Java 21 Spring Boot 3.2.x modular monolith structured around clean separation between:
1. Relational persistence & database migrations (PostgreSQL + Flyway).
2. Deterministic transit network search & constraint evaluation engine.
3. Groq AI client integration & 7 specialized logical agent components.
4. Journey lifecycle management, disruption simulation, recovery planning, and audit logging.

See `proposal.md` and `specs/backend-core/spec.md` for requirements.

## Goals / Non-Goals

**Goals:**
- Provide a robust Java 21 Spring Boot backend structure adhering strictly to `docs/architecture.md`, `docs/database-design.md`, `docs/api-contract.md`, and `docs/routing-and-recovery.md`.
- Ensure deterministic route planning and hard-constraint verification (e.g. 45-min minimum transfer buffer).
- Implement Groq API client (`llama-3.1-8b-instant`) with automatic fallback to template/regex processing for offline/unconfigured environments.
- Support disruption simulation (`SCENARIO_CONNECTION_DELAY_01`) and atomic revision commits with audit records.

**Non-Goals:**
- Flutter mobile app presentation layer implementation (handled separately in frontend scope).
- Live real-time GPS hardware integration (simulated positioning and mock clock ticks are used instead).

## Decisions

1. **Modular Monolith Architecture**:
   - *Choice*: Implement single Spring Boot application organized into clear domain packages (`catalog`, `routing`, `agent`, `journey`, `disruption`, `audit`, `common`).
   - *Rationale*: Keeps execution simple for local development and demonstration while maintaining strict layer isolation.

2. **Flyway Migrations for Relational Schema**:
   - *Choice*: Use Flyway SQL scripts `V1__create_transport_tables.sql` through `V5__insert_demo_data.sql`.
   - *Rationale*: Ensures reproducible schema setup and deterministic demo route schedules across environments.

3. **Deterministic Routing vs AI Separation**:
   - *Choice*: Time-expanded graph search (`GraphNetworkService`), constraint validation (`FeasibilityService`), and scoring (`RecommendationScorer`) are 100% deterministic Java code. AI is strictly restricted to intake interpretation, draft generation, and explanation.
   - *Rationale*: Guarantees zero hallucinations on bus schedules, fares, and connection feasibility.

4. **Groq API Client with Offline Fallback**:
   - *Choice*: Inject `GroqApiClient` into agents; if `groq.api.key` is missing or requests fail, fall back to regex/template parser.
   - *Rationale*: Allows offline development, unit testing, and robust failover.

5. **Atomic Revision Commits**:
   - *Choice*: Proposed recovery itineraries remain isolated until the user explicitly calls `/api/v1/itineraries/{id}/revisions/{revId}/approve`, executing an `@Transactional` commit and creating an immutable `AuditRecord`.
   - *Rationale*: Ensures user agency and transactional consistency.

## Risks / Trade-offs

- **[Risk]** Groq API rate limits or network latency during multi-turn agent conversation → **Mitigation**: Implement brief timeout and automatic fallback to regex/template intake parser.
- **[Risk]** Time-expanded graph explosion with large search spaces → **Mitigation**: Bounded depth-first search limited to max 2 transfers and relevant origin-destination corridors.
