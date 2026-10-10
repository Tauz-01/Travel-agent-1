# RoamAgent Technical Architecture Diagrams

## 1. System Component Architecture Diagram

```mermaid
graph TB
    subgraph "Flutter Mobile Application Layer"
        UI_Chat["Conversation & Voice Screen"]
        UI_Form["Editable Trip Intent Form"]
        UI_Results["Itinerary Comparison & Cards"]
        UI_Map["Google Maps Overlay Component"]
        UI_Disruption["Disruption Alert & Recovery Modal"]
        
        State_Riverpod["Riverpod Providers & Controllers"]
        Network_Dio["Dio HTTP API Client"]
        
        UI_Chat --> State_Riverpod
        UI_Form --> State_Riverpod
        UI_Results --> State_Riverpod
        UI_Map --> State_Riverpod
        UI_Disruption --> State_Riverpod
        State_Riverpod --> Network_Dio
    end

    Network_Dio <==>|"REST / JSON & Multipart Audio"| Controller_Layer["Spring Boot REST Controllers"]

    subgraph "Spring Boot Modular Monolith Backend"
        Controller_Layer --> Orchestrator["Central Agent Orchestrator"]

        subgraph "AI & Agent Layer"
            Orchestrator --> Agent1["Agent 1: Conversation & Language"]
            Orchestrator --> Agent2["Agent 2: Intent Extraction"]
            Orchestrator --> Agent3["Agent 3: Clarification Manager"]
            Orchestrator --> Agent4["Agent 4: Route-Planning Coordinator"]
            Orchestrator --> Agent5["Agent 5: Recommendation Synthesizer"]
            Orchestrator --> Agent6["Agent 6: Disruption & Recovery Coordinator"]
            Orchestrator --> Agent7["Agent 7: Explanation & Localization"]
            
            Agent1 & Agent2 & Agent3 & Agent7 <--> Groq_Client["Groq AI Client Service"]
        end

        subgraph "Deterministic Core Services Domain"
            Agent4 & Agent6 --> Routing_Engine["Graph Route Search Service"]
            Routing_Engine --> Constraint_Filter["Hard Constraint Feasibility Evaluator"]
            Constraint_Filter --> Recommendation_Scorer["2-Stage Weighted Scorer"]
            
            Agent6 --> Disruption_Engine["Disruption Impact Calculator"]
            Disruption_Engine --> Recovery_Planner["Mid-Trip Recovery Search Engine"]
            
            Orchestrator --> Itinerary_Service["Itinerary & Checkout Manager"]
            Itinerary_Service --> Revision_Service["Atomic Revision & Approval Commit Service"]
        end

        subgraph "Persistence & Data Access Layer"
            Routing_Engine & Disruption_Engine & Itinerary_Service & Revision_Service --> Repositories["Spring Data JPA Repositories"]
            Repositories <--> Flyway["Flyway Migration Engine"]
        end
    end

    Groq_Client <==>|"HTTPS (Llama 3.1 8B / Whisper)"| Groq_Cloud["Groq Cloud Infrastructure"]
    Repositories <==>|"JDBC / SQL"| Postgres_DB[("PostgreSQL Database")]
```

---

## 2. End-to-End Sequence Diagram: Voice Intake to Itinerary Recommendation

```mermaid
sequenceDiagram
    autonumber
    actor User as Traveller
    participant App as Flutter Mobile App
    participant API as REST Controller
    participant Orch as Agent Orchestrator
    participant Groq as Groq AI Client
    participant IntentAgent as Agent 2 (Intent Extractor)
    participant ClarifyAgent as Agent 3 (Clarification)
    participant RoutePlanner as Deterministic Route Planner
    participant DB as PostgreSQL DB
    participant ExplainAgent as Agent 7 (Explanation)

    User->>App: Press Microphone & Speak ("I need to go from Vizag to Vizag to Hyd tomorrow morning, budget 1500")
    App->>API: POST /api/v1/voice/transcribe (Audio file)
    API->>Groq: Transcribe Audio (Whisper)
    Groq-->>API: Transcript text ("Visakhapatnam to Hyderabad tomorrow morning, sleeper preferred, budget 1500")
    API-->>App: Return transcript
    User->>App: Confirm transcript
    App->>API: POST /api/v1/trip-intent/extract (Transcript)
    API->>Orch: Process raw input
    Orch->>IntentAgent: Extract draft trip intent
    IntentAgent->>Groq: Prompt structured JSON extraction
    Groq-->>IntentAgent: Return Draft JSON (Origin, Destination, Budget, Mode)
    IntentAgent-->>Orch: Draft Trip Intent Object
    Orch->>ClarifyAgent: Evaluate completeness
    ClarifyAgent-->>Orch: Intent valid (all required fields present)
    Orch->>RoutePlanner: Search Feasible Routes(DraftTripIntent)
    
    rect rgb(240, 248, 255)
        note over RoutePlanner,DB: Deterministic Search (Zero LLM)
        RoutePlanner->>DB: Query Schedules & Graph Nodes (Origin -> Transfers -> Destination)
        DB-->>RoutePlanner: Candidate Multi-leg Paths
        RoutePlanner->>RoutePlanner: Apply Hard Constraints (Arrival Deadline, Budget, Transfer Buffer)
        RoutePlanner->>RoutePlanner: Compute 2-Stage Weighted Scores & Rank Options (Max 4)
    end

    RoutePlanner-->>Orch: List<FeasibleItinerary>
    Orch->>ExplainAgent: Synthesize verified natural language explanations
    ExplainAgent->>Groq: Generate Telugu/English explanation using ONLY verified facts
    Groq-->>ExplainAgent: Localized explanation text
    ExplainAgent-->>Orch: Final Search Result DTO
    Orch-->>API: Search Response
    API-->>App: 200 OK (List of Itinerary Cards & Map Data)
    App-->>User: Display Recommended Itineraries & Route Polylines
```

---

## 3. Disruption Detection, Recovery & Atomic Revision Sequence Diagram

```mermaid
sequenceDiagram
    autonumber
    actor User as Traveller
    participant App as Flutter Mobile App
    participant API as Disruption REST Controller
    participant SimEngine as Disruption Simulator Engine
    participant RecEngine as Recovery Search Engine
    participant DB as PostgreSQL DB
    participant RevService as Revision Commit Service
    participant Audit as Audit Logging Service

    User->>App: Trigger Demo Disruption (50 min delay on Leg 1)
    App->>API: POST /api/v1/disruptions/trigger-scenario (Scenario ID: SCENARIO_CONNECTION_DELAY_01)
    API->>SimEngine: Process Disruption Event
    SimEngine->>DB: Fetch Active Itinerary & Leg 1 Schedule
    DB-->>SimEngine: Active Itinerary Details
    SimEngine->>SimEngine: Recalculate Projected Arrival (Original 2:40 AM + 50m = 3:30 AM)
    SimEngine->>SimEngine: Check Next Leg Departure (3:35 AM) & Buffer (3:35 - 3:30 = 5 mins)
    SimEngine->>SimEngine: Compare with Min Required Buffer (45 mins) -> INFEASIBLE!
    
    SimEngine->>RecEngine: Trigger Mid-Trip Recovery Search(CurrentStop: Vijayawada, Destination: Hyderabad)
    RecEngine->>DB: Query Available Bus Schedules from Vijayawada after 3:30 AM
    DB-->>RecEngine: Available Services & Fares
    RecEngine->>RecEngine: Calculate Feasible Recovery Options & Cost/Time Delta
    RecEngine->>DB: Save RecoveryProposal (Status: PROPOSED)
    DB-->>RecEngine: Saved Proposal ID
    RecEngine-->>API: Recovery Analysis Result (Active vs Proposal Delta)
    API-->>App: Disruption Alert & Recovery Proposal Options
    
    User->>App: Review Comparison Slider & Click "Approve Revision"
    App->>API: POST /api/v1/itineraries/{id}/revisions/approve (Proposal ID)
    API->>RevService: Approve And Commit Revision(ItineraryID, ProposalID)
    
    rect rgb(255, 245, 238)
        note over RevService,DB: Atomic Database Transaction
        RevService->>DB: Lock Itinerary & Verify Proposal Freshness
        RevService->>DB: Re-verify Hard Constraints against latest state
        RevService->>DB: Archive Active Revision to ITINERARY_REVISION_HISTORY
        RevService->>DB: Set Active Itinerary Legs = Proposal Legs
        RevService->>DB: Update Proposal Status = APPROVED
        RevService->>Audit: Create Immutable AUDIT_RECORD
    end
    
    RevService-->>API: Revision Committed DTO
    API-->>App: 200 OK (Updated Active Journey Timeline & Confirmation)
    App-->>User: Show Revised Itinerary with Updated ETA
```

---

## 4. Itinerary Revision & Proposal State Machine Diagram

```mermaid
stateDiagram-v2
    [*] --> DRAFT_INTENT: User inputs travel request
    DRAFT_INTENT --> INTENT_VALIDATED: Clarification completed
    INTENT_VALIDATED --> SEARCHED: Deterministic graph search executed
    SEARCHED --> ITINERARY_SELECTED: Traveller selects option
    ITINERARY_SELECTED --> AWAITING_DEMO_CONFIRMATION: Enters Checkout
    AWAITING_DEMO_CONFIRMATION --> DEMO_CONFIRMED: Simulated payment confirmed
    DEMO_CONFIRMED --> ACTIVE_SIMULATED_JOURNEY: Journey tracking activated

    state ACTIVE_SIMULATED_JOURNEY {
        [*] --> ON_SCHEDULE
        ON_SCHEDULE --> DISRUPTION_DETECTED: Delay / Cancellation event
        
        state DISRUPTION_DETECTED {
            [*] --> IMPACT_EVALUATED
            IMPACT_EVALUATED --> RECOVERY_PROPOSED: Alternatives found
            IMPACT_EVALUATED --> NO_RECOVERY_AVAILABLE: Hard constraints breached
        }

        RECOVERY_PROPOSED --> RECOVERY_REJECTED: User clicks Reject
        RECOVERY_REJECTED --> ON_SCHEDULE: Active plan maintained

        RECOVERY_PROPOSED --> RECOVERY_APPROVED: User clicks Approve
        RECOVERY_APPROVED --> REVISION_COMMITTED: Transactional DB Commit
        REVISION_COMMITTED --> ON_SCHEDULE: Resumes tracking with new legs
    }

    ACTIVE_SIMULATED_JOURNEY --> COMPLETED: Final destination reached
    COMPLETED --> [*]
```
