CREATE TABLE trip_intents (
    id VARCHAR(36) PRIMARY KEY,
    conversation_id VARCHAR(36) NOT NULL,
    origin_city VARCHAR(50) NOT NULL,
    destination_city VARCHAR(50) NOT NULL,
    travel_date DATE NOT NULL,
    arrival_deadline TIMESTAMP NULL,
    max_budget DECIMAL(10,2),
    preferred_mode VARCHAR(30),
    passenger_count INT DEFAULT 1,
    language_preference VARCHAR(10) DEFAULT 'en',
    is_clarified BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE itineraries (
    id VARCHAR(36) PRIMARY KEY,
    trip_intent_id VARCHAR(36) NOT NULL,
    status VARCHAR(30) NOT NULL,
    total_fare DECIMAL(10,2) NOT NULL,
    total_duration_minutes INT NOT NULL,
    total_transfers INT NOT NULL,
    ranking_score DECIMAL(5,2),
    score_explanation TEXT,
    current_revision_number INT DEFAULT 1,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_itineraries_trip_intent FOREIGN KEY (trip_intent_id) REFERENCES trip_intents(id)
);

CREATE TABLE itinerary_legs (
    id VARCHAR(36) PRIMARY KEY,
    itinerary_id VARCHAR(36) NOT NULL,
    leg_sequence INT NOT NULL,
    bus_service_id VARCHAR(36) NOT NULL,
    from_stop_id VARCHAR(36) NOT NULL,
    to_stop_id VARCHAR(36) NOT NULL,
    scheduled_departure TIMESTAMP NOT NULL,
    scheduled_arrival TIMESTAMP NOT NULL,
    projected_arrival TIMESTAMP NULL,
    leg_fare DECIMAL(10,2) NOT NULL,
    seat_type VARCHAR(20) NOT NULL,
    status VARCHAR(20) DEFAULT 'SCHEDULED',
    CONSTRAINT fk_itinerary_legs_itinerary FOREIGN KEY (itinerary_id) REFERENCES itineraries(id),
    CONSTRAINT fk_itinerary_legs_bus_service FOREIGN KEY (bus_service_id) REFERENCES bus_services(id),
    CONSTRAINT fk_itinerary_legs_from_stop FOREIGN KEY (from_stop_id) REFERENCES stops(id),
    CONSTRAINT fk_itinerary_legs_to_stop FOREIGN KEY (to_stop_id) REFERENCES stops(id)
);

CREATE TABLE journey_events (
    id VARCHAR(36) PRIMARY KEY,
    itinerary_id VARCHAR(36) NOT NULL,
    event_type VARCHAR(50) NOT NULL,
    payload TEXT,
    timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_journey_events_itinerary FOREIGN KEY (itinerary_id) REFERENCES itineraries(id)
);
