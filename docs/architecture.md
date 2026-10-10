# RoamAgent Architecture Blueprint & Overview

## 1. System Vision & Architecture Principles

RoamAgent is an agentic travel platform designed for Indian intercity travel. It addresses the challenges of multi-leg intercity bus journeys, transfer risks, schedule disruptions, and complex recovery decisions for travellers—including non-English speakers and first-time smartphone users.

### Core Non-Negotiable Architecture Principles
1. **Frontend Presentation & State**: The Flutter mobile application owns the presentation layer, client UI state, audio recording, map visual rendering, and localized text display (Telugu & English).
2. **Authoritative Backend**: The Java 21 Spring Boot backend owns trip validation, route planning graph searches, transfer buffer verification, fare calculation, journey lifecycle state, disruption impact calculations, and atomic itinerary revision commits.
3. **Deterministic Core vs. AI Boundaries**: 
   - **Deterministic Logic**: Graph search, transfer feasibility, arrival deadline compliance, budget cap checking, delay impact calculations, and recovery option generation are executed **100% deterministically** by backend Java services querying PostgreSQL.
   - **AI Responsibility**: AI (Groq API using Llama 3.1 8B / Whisper) is strictly restricted to interpreting conversational requests (natural language / speech-to-text), drafting structured search parameters, asking focused clarification questions, and explaining verified deterministic outputs in localized natural language.
   - **Zero Hallucination Rule**: AI is never permitted to invent bus schedules, fares, operators, stops, vehicle ratings, transfer feasibility, or connection status.
4. **No Quiet Relaxation of Constraints**: Hard constraints (arrival deadlines, maximum budget, minimum transfer buffer) are never silently loosened to produce artificial recommendations.
5. **Separation of Revised Itinerary Proposals**: Proposed recovery itineraries remain strictly isolated from active itineraries until explicit user approval is recorded and transactionally committed.
6. **Auditability**: Every applied itinerary modification produces an immutable audit record and versioned journey history.

---

## 2. Technology Stack & Frameworks

| Component | Technology / Library | Version / Detail |
| :--- | :--- | :--- |
| **Mobile App (Frontend)** | Flutter Framework | Dart 3.x, Material 3 Design |
| **Frontend State & Navigation** | Flutter Riverpod & GoRouter | Reactive state & declarative routing |
| **Frontend Network & Maps** | Dio & `google_maps_flutter` | REST client & Google Maps SDK |
| **Backend Framework** | Spring Boot (Java 21) | Spring Boot 3.2.x, Maven |
| **Database & Migrations** | PostgreSQL & Flyway | Relational storage & reproducible migrations |
| **AI Orchestration & LLM Provider** | Groq Cloud API | Llama 3.1 8B (`llama-3.1-8b-instant`) |
| **Speech Recognition** | Groq Whisper API | `whisper-large-v3` / `whisper-large-v3-turbo` |
| **OpenAPI & Documentation** | SpringDoc OpenAPI | Swagger UI at `/swagger-ui.html` |

---

## 3. Top-Level Architectural Boundaries & Component Overview

RoamAgent is deployed as a **Spring Boot Modular Monolith** serving a **Flutter Mobile App**. It consists of 5 logical architectural areas:

1. **Flutter Mobile Application**: Feature-oriented client app providing chat/voice intake, editable trip forms, map overlays with simulated vehicle markers, itinerary cards with timeline view, disruption notifications, recovery comparison sliders, and approval modals.
2. **AI Orchestration & Logical Agents**: Central Agent Orchestrator managing 7 specialized logical agent modules (Conversation, Intake, Clarification, Route-Planning, Recommendation, Disruption/Recovery, Explanation/Localization).
3. **Deterministic Travel & Journey Engine**: Core Java services for time-aware multi-leg graph routing, hard-constraint filtering, 2-stage weighted scoring, simulated delay impact calculation, and atomic revision commit.
4. **PostgreSQL Relational Store**: Persists operators, vehicles, stops, bus schedules, fare matrices, reviews, trip intents, versioned itineraries, simulated journey events, recovery proposals, and audit records.
5. **Google Maps & Simulation Layer**: Map coordinate translation, polyline synthesis, and configurable clock tick processing for simulated journey tracking and mock vehicle positioning.

---

## 4. End-to-End Execution Flow

```
[User Input (Voice/Text)] 
       │
       ▼
[Flutter App] ──(Audio File / Text)──> [Spring Boot API Controller]
                                              │
                                              ▼
                                   [Groq Speech-to-Text / LLM]
                                              │
                                              ▼
                                   [Agent 2: Intent Extractor]
                                              │
                                              ▼
                                   [Agent 3: Clarification]
                                              │
                                      (Draft validated?)
                                    ┌─────────┴─────────┐
                                  NO│                  │YES
                                    ▼                   ▼
                         [Clarification Prompt]   [Routing Engine (Graph Search)]
                                                        │
                                                        ▼
                                           [Hard Constraint Filter]
                                                        │
                                                        ▼
                                            [2-Stage Weighted Scorer]
                                                        │
                                                        ▼
                                           [Max 4 Ranked Options]
                                                        │
                                                        ▼
                                          [Itinerary Selection & Checkout]
                                                        │
                                                        ▼
                                           [Active Journey Lifecycle]
                                                        │
                                          (Simulated Disruption Event)
                                                        │
                                                        ▼
                                          [Disruption Impact Calculator]
                                                        │
                                                        ▼
                                          [Recovery Search Engine]
                                                        │
                                                        ▼
                                          [Recovery Proposal Comparison]
                                                        │
                                          (User Approve / Reject)
                                           ┌────────────┴────────────┐
                                    REJECT│                         │APPROVE
                                          ▼                         ▼
                                [Keep Active Plan]        [Atomic Revision Commit]
                                                                    │
                                                                    ▼
                                                            [Audit Record Logged]
```
