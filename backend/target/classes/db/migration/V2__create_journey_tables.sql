CREATE TABLE trip_intents (
    id UUID PRIMARY KEY,
    conversation_id UUID NOT NULL,
    origin_city VARCHAR(50) NOT NULL,
    destination_city VARCHAR(50) NOT NULL,
    travel_date DATE NOT NULL,
    arrival_deadline TIMESTAMP WITH TIME ZONE,
    max_budget DECIMAL(10,2),
    preferred_mode VARCHAR(30),
    passenger_count INT DEFAULT 1,
    language_preference VARCHAR(10) DEFAULT 'en',
    is_clarified BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE itineraries (
    id UUID PRIMARY KEY,
    trip_intent_id UUID NOT NULL REFERENCES trip_intents(id),
    status VARCHAR(30) NOT NULL,
    total_fare DECIMAL(10,2) NOT NULL,
    total_duration_minutes INT NOT NULL,
    total_transfers INT NOT NULL,
    ranking_score DECIMAL(5,2),
    score_explanation TEXT,
    current_revision_number INT DEFAULT 1,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE itinerary_legs (
    id UUID PRIMARY KEY,
    itinerary_id UUID NOT NULL REFERENCES itineraries(id),
    leg_sequence INT NOT NULL,
    bus_service_id UUID NOT NULL REFERENCES bus_services(id),
    from_stop_id UUID NOT NULL REFERENCES stops(id),
    to_stop_id UUID NOT NULL REFERENCES stops(id),
    scheduled_departure TIMESTAMP WITH TIME ZONE NOT NULL,
    scheduled_arrival TIMESTAMP WITH TIME ZONE NOT NULL,
    projected_arrival TIMESTAMP WITH TIME ZONE,
    leg_fare DECIMAL(10,2) NOT NULL,
    seat_type VARCHAR(20) NOT NULL,
    status VARCHAR(20) DEFAULT 'SCHEDULED'
);

CREATE TABLE journey_events (
    id UUID PRIMARY KEY,
    itinerary_id UUID NOT NULL REFERENCES itineraries(id),
    event_type VARCHAR(50) NOT NULL,
    payload TEXT,
    timestamp TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);
