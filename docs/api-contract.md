# RoamAgent Spring Boot Backend REST API Specification

All API endpoints follow RESTful conventions under the base path `/api/v1`. JSON is used for requests and responses unless noted otherwise (e.g., multipart audio files).

---

## 1. Summary Endpoint Table

| Method | Endpoint Path | Description | Primary Consumer |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/v1/health` | Health & system readiness check | Flutter / Load Balancer |
| `POST` | `/api/v1/voice/transcribe` | Transcribe recorded audio file to text | Flutter Voice Intake |
| `POST` | `/api/v1/trip-intent/extract` | Extract draft trip parameters from text | Flutter Intake Screen |
| `POST` | `/api/v1/trip-intent/clarify` | Submit answers to clarification questions | Flutter Clarification Modal |
| `POST` | `/api/v1/itineraries/search` | Execute graph search & rank feasible routes | Flutter Results Screen |
| `GET` | `/api/v1/itineraries/{id}` | Get detailed itinerary breakdown with map legs | Flutter Details Screen |
| `POST` | `/api/v1/itineraries/{id}/select` | Select an itinerary option | Flutter Selection Flow |
| `POST` | `/api/v1/itineraries/{id}/checkout` | Confirm simulated demo payment | Flutter Demo Checkout |
| `GET` | `/api/v1/journeys/active` | Get active simulated journey state & map markers | Flutter Monitoring View |
| `POST` | `/api/v1/disruptions/trigger-scenario` | Inject a predefined demo delay/disruption scenario | Flutter Demo Control Panel |
| `POST` | `/api/v1/disruptions/recover` | Calculate recovery alternatives for active journey | Disruption Simulator |
| `POST` | `/api/v1/itineraries/{id}/revisions/approve` | Explicitly approve & commit a recovery proposal | Flutter Change Approval |
| `POST` | `/api/v1/itineraries/{id}/revisions/reject` | Explicitly reject a recovery proposal | Flutter Change Approval |
| `GET` | `/api/v1/itineraries/{id}/audit-history` | Fetch versioned revision audit records | Flutter Journey History |

---

## 2. Selected Core Request & Response DTO Schemas

### 2.1 Voice Transcription Endpoint
- **`POST /api/v1/voice/transcribe`**
  - **Content-Type**: `multipart/form-data`
  - **Form Data**: `file` (Binary audio WAV/M4A), `language` (e.g. `'te'`, `'en'`)
  - **Response 200 OK**:
```json
{
  "success": true,
  "transcript": "Visakhapatnam to Hyderabad tomorrow morning, sleeper preferred under 1500 rupees",
  "detectedLanguage": "te-IN",
  "confidenceScore": 0.94
}
```

### 2.2 Trip-Intent Extraction Endpoint
- **`POST /api/v1/trip-intent/extract`**
  - **Request Body**:
```json
{
  "conversationId": "550e8400-e29b-41d4-a716-446655440000",
  "rawInput": "Visakhapatnam to Hyderabad tomorrow, arrive by 9am, sleeper budget 1500",
  "userLanguage": "te"
}
```
  - **Response 200 OK**:
```json
{
  "intentId": "a1b2c3d4-e5f6-7890-1234-567890abcdef",
  "status": "REQUIRES_CLARIFICATION",
  "draftIntent": {
    "originCity": "Visakhapatnam",
    "destinationCity": "Hyderabad",
    "travelDate": "2026-10-11",
    "arrivalDeadline": "2026-10-11T09:00:00+05:30",
    "maxBudget": 1500.00,
    "preferredMode": "SLEEPER",
    "passengerCount": 1
  },
  "missingFields": ["SPECIFIC_BOARDING_POINT"],
  "clarificationQuestion": {
    "questionKey": "BOARDING_POINT_SELECTION",
    "questionText": "Do you prefer boarding at Dwaraka Bus Stand (RTC Complex) or Gajuwaka?",
    "options": ["Dwaraka Bus Stand", "Gajuwaka", "No Preference"]
  }
}
```

### 2.3 Feasible Itinerary Search Endpoint
- **`POST /api/v1/itineraries/search`**
  - **Request Body**:
```json
{
  "intentId": "a1b2c3d4-e5f6-7890-1234-567890abcdef",
  "minTransferBufferMinutes": 45,
  "allowMultiLeg": true
}
```
  - **Response 200 OK**:
```json
{
  "intentId": "a1b2c3d4-e5f6-7890-1234-567890abcdef",
  "totalOptionsFound": 2,
  "itineraries": [
    {
      "itineraryId": "c9f8e7d6-c5b4-a321-0987-654321fedcba",
      "rankingPosition": 1,
      "totalFare": 1350.00,
      "totalDurationMinutes": 735,
      "totalTransfers": 1,
      "overallFeasible": true,
      "compositeScore": 88.5,
      "verifiedExplanation": "1-transfer option via Vijayawada. Meets arrival deadline (08:30 AM vs 09:00 AM limit) with 55 min transfer buffer.",
      "legs": [
        {
          "legSequence": 1,
          "operatorName": "APSRTC",
          "serviceNumber": "AP7788",
          "busType": "SUPER_LUXURY",
          "fromStopName": "Dwaraka Bus Stand (Visakhapatnam)",
          "toStopName": "Pandit Nehru Bus Stand (Vijayawada)",
          "scheduledDeparture": "2026-10-10T20:00:00+05:30",
          "scheduledArrival": "2026-10-11T02:40:00+05:30",
          "fare": 700.00
        },
        {
          "legSequence": 2,
          "operatorName": "APSRTC",
          "serviceNumber": "AP9911",
          "busType": "GARUDA_PLUS_SLEEPER",
          "fromStopName": "Pandit Nehru Bus Stand (Vijayawada)",
          "toStopName": "MGBS (Hyderabad)",
          "scheduledDeparture": "2026-10-11T03:35:00+05:30",
          "scheduledArrival": "2026-10-11T08:30:00+05:30",
          "fare": 650.00
        }
      ],
      "mapPolylines": [
        {"leg": 1, "points": "e~f~FvabzM..."},
        {"leg": 2, "points": "g~g~GvcdzM..."}
      ]
    }
  ]
}
```

### 2.4 Trigger Demo Disruption Endpoint
- **`POST /api/v1/disruptions/trigger-scenario`**
  - **Request Body**:
```json
{
  "activeItineraryId": "c9f8e7d6-c5b4-a321-0987-654321fedcba",
  "scenarioCode": "SCENARIO_CONNECTION_DELAY_01",
  "simulatedDelayMinutes": 50
}
```
  - **Response 200 OK**:
```json
{
  "disruptionTriggered": true,
  "affectedLegSequence": 1,
  "originalProjectedArrival": "2026-10-11T02:40:00+05:30",
  "newProjectedArrival": "2026-10-11T03:30:00+05:30",
  "nextLegDeparture": "2026-10-11T03:35:00+05:30",
  "effectiveRemainingBufferMinutes": 5,
  "requiredBufferMinutes": 45,
  "impactStatus": "CONNECTION_FEASIBILITY_BREACHED",
  "recoveryProposal": {
    "proposalId": "f1e2d3c4-b5a6-9788-1122-334455667788",
    "fareDifference": 0.00,
    "revisedEta": "2026-10-11T09:15:00+05:30",
    "explanation": "Leg 1 delayed by 50 mins. Connecting bus AP9911 cannot be safely caught (5 min buffer vs 45 min requirement). Replaced with Leg B2 departing Vijayawada at 04:30 AM.",
    "replacedLegs": [2],
    "replacementLegs": [
      {
        "operatorName": "APSRTC",
        "serviceNumber": "AP9922",
        "departure": "2026-10-11T04:30:00+05:30",
        "arrival": "2026-10-11T09:15:00+05:30",
        "fare": 650.00
      }
    ]
  }
}
```

### 2.5 Approve Recovery Revision Endpoint
- **`POST /api/v1/itineraries/{id}/revisions/approve`**
  - **Request Body**: `{"proposalId": "f1e2d3c4-b5a6-9788-1122-334455667788"}`
  - **Response 200 OK**:
```json
{
  "itineraryId": "c9f8e7d6-c5b4-a321-0987-654321fedcba",
  "newRevisionNumber": 2,
  "status": "REVISION_COMMITTED",
  "activeEta": "2026-10-11T09:15:00+05:30",
  "auditRecordId": "99887766-5544-3322-1100-aabbccddeeff",
  "message": "Itinerary updated successfully. Monitoring resumed for revised route."
}
```
