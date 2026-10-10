# RoamAgent Technical Risks, Open Decisions & Architectural Baseline Summary

## 1. Resolved Design Decisions & Assumptions

1. **Groq Model Verification**:
   - Primary Chat / Intent / Explanation Model: `llama-3.1-8b-instant` (Configurable via `GROQ_CHAT_MODEL`).
   - Primary Speech-to-Text Model: `whisper-large-v3-turbo` (Configurable via `GROQ_STT_MODEL`).
   - Rationale: High inference speed, official Groq Cloud support, excelente Telugu/English multilingual capabilities.
2. **Modular Monolith Packaging**:
   - Single Spring Boot application with distinct packages (`com.roamagent.ai`, `com.roamagent.routing`, `com.roamagent.disruption`, etc.) rather than microservices.
3. **Deterministic Core Isolation**:
   - Zero LLM involvement in schedule search, pricing, transfer buffer validation, or recovery calculation.
4. **Isolated Recovery Revision State**:
   - Recovery proposals strictly isolated in `recovery_proposals` table until explicit user approval triggers transactional commit.

---

## 2. Technical Risks & Mitigation Strategies

| Risk / Potential Issue | Impact | Mitigation Strategy |
| :--- | :--- | :--- |
| **Groq API Rate Limit or Network Outage** | High | Implement regex-based intent parsing fallback and string template explanations when Groq API is unavailable. Core route planner remains fully functional. |
| **Microphone Permission Denial / Audio Format Incompatibility** | Medium | Provide instant UI fallback to manual text input and editable trip form; handle permission failure states gracefully. |
| **Google Maps API Key Missing or Unconfigured** | Low | Flutter Map widget displays static schematic polyline fallback view with stop markers if Google Maps SDK initialization fails. |
| **Complex Multi-Leg Search Performance in Database** | Medium | Cap search depth to maximum 2 transfers ($K_{max}=2$) and index `service_stops` by `stop_id` and `scheduled_departure_time`. |

---

## 3. Existing Codebase Audit & Reuse Strategy

- **`backend/` Directory**:
  - Found Spring Boot 3.2.3 structure with Maven (`pom.xml`), Java 21, Spring Web, Data JPA, Flyway, PostgreSQL driver, and `application.yml`.
  - Strategy: Preserve existing directory structure and build configurations.
- **Documentation Area (`docs/`)**:
  - Created complete set of 8 technical architecture specification files under `docs/`.

---

## 4. Summary of Phase 1 Deliverables

The complete Phase 1 Technical Architecture Blueprint has been authored and documented in `docs/`:

1. `docs/architecture.md` — Vision, core non-negotiable architectural principles, technology choices, system boundaries, and top-level data flows.
2. `docs/architecture-diagrams.md` — Mermaid system component architecture, sequence diagrams (voice intake, disruption & recovery), and itinerary state machine.
3. `docs/database-design.md` — Normalized PostgreSQL schemas, entity constraints, indexing, and Flyway seed data specification (APSRTC, TSRTC, Visakhapatnam, Vijayawada, Hyderabad).
4. `docs/api-contract.md` — Complete REST API specifications (`/api/v1/*`), request/response DTO schemas, and error handling contracts.
5. `docs/agent-design.md` — Orchestrator specification and detailed specs for all 7 specialized logical agents with strict deterministic vs LLM boundaries.
6. `docs/routing-and-recovery.md` — Multi-leg graph routing algorithm, Stage 2 weighted scoring formula, transfer buffer math, delay impact calculations, and atomic revision commit rules.
7. `docs/implementation-roadmap.md` — Ordered implementation phases (Phase 0 through Phase 10) with explicit task breakdowns and verification acceptance criteria.
8. `docs/open-decisions.md` — Technical risk evaluation, Groq model findings, existing code audit summary, and architectural decision records.

---

## Next Action & Stopping Gate

**Phase 1 (Architecture Blueprint) is complete.**

As required by your instructions, I have stopped here and am awaiting your review and explicit approval of the architecture blueprint before generating application implementation code for Phase 2.
