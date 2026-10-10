# RoamAgent PostgreSQL Database Design & Seed Data Specification

## 1. Relational Entity ERD Overview

```
[Operator] 1──< [Vehicle]
[Operator] 1──< [BusService] 1──< [ServiceStop]
[Stop] 1──< [ServiceStop]
[BusService] 1──< [FareRecord]

[TripIntent] 1──< [Itinerary] 1──< [ItineraryLeg]
[Itinerary] 1──< [JourneyEvent]
[Itinerary] 1──< [RecoveryProposal] 1──< [RecoveryProposalLeg]
[Itinerary] 1──< [AuditRecord]

[ScenarioDefinition]
[Review]
[PassengerFeedback]
```

---

## 2. Table Schemas, Constraints, and Indexes

### 2.1 Catalog & Transport Network Domain

#### `operators`
- `id` (UUID, Primary Key)
- `code` (VARCHAR(20), UNIQUE, NOT NULL) — e.g., 'APSRTC', 'TSRTC', 'ORANGE'
- `name` (VARCHAR(100), NOT NULL)
- `contact_number` (VARCHAR(20))
- `rating` (DECIMAL(3,2)) — Average operator score (1.00 to 5.00)
- `on_time_performance_pct` (DECIMAL(5,2)) — Historic punctuality % (e.g., 92.50)
- `created_at` (TIMESTAMP WITH TIME ZONE, DEFAULT CURRENT_TIMESTAMP)

#### `vehicles`
- `id` (UUID, Primary Key)
- `operator_id` (UUID, FK -> `operators.id`, NOT NULL)
- `registration_number` (VARCHAR(20), UNIQUE, NOT NULL)
- `bus_type` (VARCHAR(30), NOT NULL) — e.g., 'AC_SLEEPER', 'NON_AC_SEATER', 'VOLVO_MULTI_AXLE'
- `capacity` (INT, NOT NULL)
- `manufacture_year` (INT, NOT NULL) — Used for vehicle age calculation
- `has_wifi` (BOOLEAN, DEFAULT FALSE)
- `has_charging_point` (BOOLEAN, DEFAULT TRUE)
- `is_active` (BOOLEAN, DEFAULT TRUE)

#### `stops`
- `id` (UUID, Primary Key)
- `code` (VARCHAR(20), UNIQUE, NOT NULL) — e.g., 'VSKP_BS', 'BZA_BS', 'HYD_MGBS'
- `name` (VARCHAR(100), NOT NULL)
- `city` (VARCHAR(50), NOT NULL) — e.g., 'Visakhapatnam', 'Vijayawada', 'Hyderabad'
- `state` (VARCHAR(50), NOT NULL) — e.g., 'Andhra Pradesh', 'Telangana'
- `latitude` (DECIMAL(10,8), NOT NULL)
- `longitude` (DECIMAL(11,8), NOT NULL)
- `amenities` (TEXT) — JSON or CSV array of amenities ('Restrooms', 'Waiting Lounge', 'Food Court')
- Index: `idx_stops_city` (`city`), `idx_stops_coords` (`latitude`, `longitude`)

#### `bus_services`
- `id` (UUID, Primary Key)
- `service_number` (VARCHAR(30), UNIQUE, NOT NULL) — e.g., 'AP7788', 'TS9911'
- `operator_id` (UUID, FK -> `operators.id`, NOT NULL)
- `vehicle_id` (UUID, FK -> `vehicles.id`, NOT NULL)
- `service_type` (VARCHAR(30), NOT NULL) — 'SUPER_LUXURY', 'GARUDA_PLUS', 'NIGHT_EXPRESS'
- `is_active` (BOOLEAN, DEFAULT TRUE)

#### `service_stops`
- `id` (UUID, Primary Key)
- `bus_service_id` (UUID, FK -> `bus_services.id`, NOT NULL)
- `stop_id` (UUID, FK -> `stops.id`, NOT NULL)
- `stop_sequence` (INT, NOT NULL) — 1 = Origin, 2 = Stop 1, etc.
- `scheduled_arrival_time` (TIME) — NULL for origin stop
- `scheduled_departure_time` (TIME) — NULL for final destination
- `day_offset` (INT, DEFAULT 0) — 0 for same day, 1 for next day arrival
- Constraint: `UNIQUE(bus_service_id, stop_sequence)`
- Index: `idx_service_stops_lookup` (`stop_id`, `scheduled_departure_time`)

#### `fare_records`
- `id` (UUID, Primary Key)
- `bus_service_id` (UUID, FK -> `bus_services.id`, NOT NULL)
- `from_stop_id` (UUID, FK -> `stops.id`, NOT NULL)
- `to_stop_id` (UUID, FK -> `stops.id`, NOT NULL)
- `seat_class` (VARCHAR(20), NOT NULL) — 'SLEEPER', 'SEATER', 'BERTH'
- `base_fare` (DECIMAL(10,2), NOT NULL)
- `tax_amount` (DECIMAL(10,2), DEFAULT 0.00)
- Constraint: `UNIQUE(bus_service_id, from_stop_id, to_stop_id, seat_class)`

#### `reviews` & `passenger_feedback`
- `reviews`: Stores structured quantitative reviews (rating, cleanliness, driver rating, safety score).
- `passenger_feedback`: Stores qualitative feedback tags ('Punctual', 'Clean Sheets', 'Frequent Rest Stops', 'Rash Driving').

---

### 2.2 Trip, Itinerary & Journey Lifecycle Domain

#### `trip_intents`
- `id` (UUID, Primary Key)
- `conversation_id` (UUID, NOT NULL)
- `origin_city` (VARCHAR(50), NOT NULL)
- `destination_city` (VARCHAR(50), NOT NULL)
- `travel_date` (DATE, NOT NULL)
- `arrival_deadline` (TIMESTAMP WITH TIME ZONE) — Hard constraint
- `max_budget` (DECIMAL(10,2)) — Hard constraint
- `preferred_mode` (VARCHAR(30)) — 'SLEEPER', 'SEATER', 'NO_PREFERENCE'
- `passenger_count` (INT, DEFAULT 1)
- `language_preference` (VARCHAR(10), DEFAULT 'en') — 'en', 'te'
- `is_clarified` (BOOLEAN, DEFAULT FALSE)
- `created_at` (TIMESTAMP WITH TIME ZONE, DEFAULT CURRENT_TIMESTAMP)

#### `itineraries`
- `id` (UUID, Primary Key)
- `trip_intent_id` (UUID, FK -> `trip_intents.id`, NOT NULL)
- `status` (VARCHAR(30), NOT NULL) — 'PROPOSED', 'SELECTED', 'AWAITING_DEMO_CONFIRMATION', 'DEMO_CONFIRMED', 'ACTIVE', 'COMPLETED', 'DISRUPTED'
- `total_fare` (DECIMAL(10,2), NOT NULL)
- `total_duration_minutes` (INT, NOT NULL)
- `total_transfers` (INT, NOT NULL)
- `ranking_score` (DECIMAL(5,2)) — Stage 2 weighted composite score (0-100)
- `score_explanation` (TEXT) — JSON containing verified factor breakdowns
- `current_revision_number` (INT, DEFAULT 1)
- `created_at` (TIMESTAMP WITH TIME ZONE, DEFAULT CURRENT_TIMESTAMP)

#### `itinerary_legs`
- `id` (UUID, Primary Key)
- `itinerary_id` (UUID, FK -> `itineraries.id`, NOT NULL)
- `leg_sequence` (INT, NOT NULL)
- `bus_service_id` (UUID, FK -> `bus_services.id`, NOT NULL)
- `from_stop_id` (UUID, FK -> `stops.id`, NOT NULL)
- `to_stop_id` (UUID, FK -> `stops.id`, NOT NULL)
- `scheduled_departure` (TIMESTAMP WITH TIME ZONE, NOT NULL)
- `scheduled_arrival` (TIMESTAMP WITH TIME ZONE, NOT NULL)
- `projected_arrival` (TIMESTAMP WITH TIME ZONE) — Updated dynamically during disruptions
- `leg_fare` (DECIMAL(10,2), NOT NULL)
- `seat_type` (VARCHAR(20), NOT NULL)
- `status` (VARCHAR(20), DEFAULT 'SCHEDULED') — 'SCHEDULED', 'IN_TRANSIT', 'DELAYED', 'COMPLETED', 'CANCELLED'

#### `journey_events`
- `id` (UUID, Primary Key)
- `itinerary_id` (UUID, FK -> `itineraries.id`, NOT NULL)
- `event_type` (VARCHAR(50), NOT NULL) — 'SIMULATION_TICK', 'DELAY_INJECTED', 'TRANSFER_RISK_DETECTED', 'RECOVERY_REQUESTED', 'REVISION_COMMITTED'
- `payload` (TEXT) — JSON payload describing the event state
- `timestamp` (TIMESTAMP WITH TIME ZONE, DEFAULT CURRENT_TIMESTAMP)

---

### 2.3 Recovery & Audit Domain

#### `recovery_proposals`
- `id` (UUID, Primary Key)
- `itinerary_id` (UUID, FK -> `itineraries.id`, NOT NULL)
- `disruption_event_id` (UUID)
- `status` (VARCHAR(20), NOT NULL) — 'PROPOSED', 'APPROVED', 'REJECTED', 'EXPIRED'
- `fare_difference` (DECIMAL(10,2), NOT NULL) — Positive (extra cost) or Negative (refund/cheaper)
- `revised_eta` (TIMESTAMP WITH TIME ZONE, NOT NULL)
- `replacement_summary` (TEXT, NOT NULL) — Human-readable summary of preserved vs replaced legs
- `proposed_at` (TIMESTAMP WITH TIME ZONE, DEFAULT CURRENT_TIMESTAMP)
- `decided_at` (TIMESTAMP WITH TIME ZONE)

#### `recovery_proposal_legs`
- Stores the newly proposed leg sequence corresponding to a `recovery_proposals` record.

#### `audit_records`
- `id` (UUID, Primary Key)
- `itinerary_id` (UUID, FK -> `itineraries.id`, NOT NULL)
- `action_type` (VARCHAR(50), NOT NULL) — 'INITIAL_BOOKING', 'RECOVERY_APPROVAL', 'RECOVERY_REJECTION'
- `previous_revision_number` (INT, NOT NULL)
- `new_revision_number` (INT, NOT NULL)
- `change_summary` (TEXT, NOT NULL)
- `committed_at` (TIMESTAMP WITH TIME ZONE, DEFAULT CURRENT_TIMESTAMP)

#### `scenario_definitions`
- Predefined simulation scenarios (e.g. `SCENARIO_CONNECTION_DELAY_01`) storing target leg IDs, delay minutes, and expected conflict parameters.

---

## 3. Seed Data Specification (Flyway `V5__insert_demo_data.sql`)

### 3.1 Transport Operators & Cities
- **Operators**: 
  1. `APSRTC` (Andhra Pradesh State Road Transport Corporation) — Rating 4.3, On-time 91.5%
  2. `TSRTC` (Telangana State Road Transport Corporation) — Rating 4.2, On-time 90.0%
  3. `ORANGE` (Orange Tours & Travels) — Rating 4.6, On-time 94.2%
  4. `VRL` (VRL Logistics) — Rating 4.5, On-time 93.8%
- **Cities & Main Terminals**:
  1. **Visakhapatnam**: `Dwaraka Bus Station (RTC Complex)` (17.7271° N, 83.3012° E)
  2. **Vijayawada**: `Pandit Nehru Bus Station (PNBS)` (16.5062° N, 80.6200° E)
  3. **Hyderabad**: `Mahatma Gandhi Bus Station (MGBS)` (17.3786° N, 78.4812° E) & `Gachibowli Bus Stop`
  4. **Tirupati**: `RTC Bus Stand` (13.6288° N, 79.4192° E)
  5. **Guntur**: `NTR Bus Station` (16.3067° N, 80.4365° E)

### 3.2 Key Demo Bus Services & Multi-Leg Network
1. **Direct Express 1**: Visakhapatnam (20:00) -> Vijayawada (02:40 AM next day) -> Hyderabad (08:15 AM).
2. **Transfer Segment A**: Visakhapatnam (19:30) -> Vijayawada (PNBS) arriving at **02:40 AM**.
3. **Connecting Leg B1 (Original Plan)**: Vijayawada (PNBS) departing **03:35 AM** -> Hyderabad arriving **08:30 AM** (Original Buffer = 55 mins).
4. **Connecting Leg B2 (Alternative Recovery Option 1)**: Vijayawada (PNBS) departing **04:30 AM** -> Hyderabad arriving **09:15 AM** (RTC Super Luxury, Fare ₹550).
5. **Connecting Leg B3 (Alternative Recovery Option 2)**: Vijayawada (PNBS) departing **05:00 AM** -> Hyderabad arriving **09:45 AM** (Orange AC Sleeper, Fare ₹750).

### 3.3 Test Disruption Scenario (`SCENARIO_CONNECTION_DELAY_01`)
- **Event**: 50-minute traffic/breakdown delay on Leg A (Visakhapatnam -> Vijayawada).
- **Recalculated Arrival**: 02:40 AM + 50 mins = **03:30 AM**.
- **Effective Buffer to Leg B1**: 03:35 AM - 03:30 AM = **5 minutes**.
- **Violation**: 5 minutes < 45 minutes minimum buffer required -> **TRANSFER FAILED**.
- **Generated Recovery**: Replaces Leg B1 with Leg B2 (04:30 AM departure, buffer = 60 mins -> FEASIBLE).
