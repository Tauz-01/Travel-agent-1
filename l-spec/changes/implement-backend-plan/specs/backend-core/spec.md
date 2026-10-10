## Purpose

Provides a Java 21 Spring Boot backend infrastructure, relational PostgreSQL database migrations and entities, deterministic routing and recovery engines, AI orchestration via Groq API, and REST endpoints for intercity bus travel planning and management.

## ADDED Requirements

### Requirement: Database Migrations & Relational Entities
The system SHALL establish Flyway migrations V1 through V5 and corresponding JPA entities to support transit catalogs, bus schedules, trip intents, itineraries, disruptions, and audit records.

#### Scenario: Deterministic database migration execution
- **WHEN** the Spring Boot application starts against PostgreSQL
- **THEN** Flyway executes migrations V1 through V5 cleanly, populating demo transit schedules for Visakhapatnam, Vijayawada, Hyderabad, and Tirupati without duplicate key errors.

### Requirement: Deterministic Route Search & Feasibility Validation
The system SHALL compute multi-leg intercity bus routes using a time-expanded graph network search, strictly enforcing hard constraints including a minimum transfer buffer of 45 minutes, maximum budget caps, and arrival deadlines.

#### Scenario: Transfer buffer enforcement
- **WHEN** a multi-leg route option has a transfer buffer less than 45 minutes between connecting legs
- **THEN** the feasibility engine rejects the route option and excludes it from recommendation scoring.

### Requirement: 2-Stage Composite Recommendation Scoring
The system SHALL rank feasible travel itineraries using a 2-stage weighted composite scoring algorithm (yielding scores from 0 to 100) and return at most 4 top-ranked options.

#### Scenario: Candidate ranking and filtering
- **WHEN** valid route candidates are evaluated by the recommendation scorer
- **THEN** options are scored based on duration, cost, transfer risk, and operator rating, returning no more than the top 4 candidates.

### Requirement: Groq AI Agent Orchestration & Conversational Fallback
The system SHALL integrate Groq API (`llama-3.1-8b-instant`) for 7 specialized logical agents to interpret conversational trip requests and produce structured intents, while seamlessly falling back to offline regex/template processing when AI services or API keys are unavailable.

#### Scenario: Unconfigured or offline LLM fallback
- **WHEN** the Groq API client encounters a missing API key or network timeout
- **THEN** the agent orchestrator falls back to deterministic regex and template parsing without interrupting user requests.

### Requirement: REST API Layer & Journey Lifecycle Management
The system SHALL expose REST API endpoints for trips, itineraries, disruptions, and bookings matching the API contract specification, while strictly enforcing journey lifecycle state transitions.

#### Scenario: Invalid journey state transition
- **WHEN** a client attempts an unauthorized state transition (e.g. moving directly from `AWAITING_DEMO_CONFIRMATION` to `COMPLETED`)
- **THEN** the backend throws a `400 Bad Request` exception with a detailed validation error payload.

### Requirement: Disruption Simulation & Recovery Engine
The system SHALL evaluate injected delay scenarios, detect connecting leg buffer breaches, and compute alternative mid-trip recovery routes starting from the transfer hub (Vijayawada).

#### Scenario: Injected connection delay detection
- **WHEN** scenario `SCENARIO_CONNECTION_DELAY_01` injects a 50-minute delay on Leg 1
- **THEN** the disruption impact calculator identifies the reduced transfer buffer (<45 mins) and triggers the recovery engine to produce alternative routes from Vijayawada.

### Requirement: Atomic Revision Commits & Audit Logging
The system SHALL transactionally commit user-approved itinerary revisions while maintaining immutable records in the audit log and leaving active itineraries unchanged when rejected.

#### Scenario: Transactional revision approval
- **WHEN** the user approves a recovery itinerary proposal
- **THEN** the system transactionally updates the active itinerary legs, invalidates stale proposals, and creates an immutable entry in `audit_records`.
