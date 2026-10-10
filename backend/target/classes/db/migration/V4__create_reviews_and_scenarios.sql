CREATE TABLE scenario_definitions (
    id UUID PRIMARY KEY,
    code VARCHAR(50) UNIQUE NOT NULL,
    description TEXT NOT NULL,
    target_service_number VARCHAR(30) NOT NULL,
    delay_minutes INT NOT NULL
);

CREATE TABLE reviews (
    id UUID PRIMARY KEY,
    operator_id UUID NOT NULL REFERENCES operators(id),
    rating DECIMAL(3,2) NOT NULL,
    cleanliness_score DECIMAL(3,2),
    driver_score DECIMAL(3,2),
    safety_score DECIMAL(3,2),
    comment TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE passenger_feedback (
    id UUID PRIMARY KEY,
    itinerary_id UUID NOT NULL REFERENCES itineraries(id),
    tag VARCHAR(50) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);
