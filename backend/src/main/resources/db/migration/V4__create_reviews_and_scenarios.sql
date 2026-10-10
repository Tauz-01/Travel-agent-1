CREATE TABLE scenario_definitions (
    id VARCHAR(36) PRIMARY KEY,
    code VARCHAR(50) UNIQUE NOT NULL,
    description TEXT NOT NULL,
    target_service_number VARCHAR(30) NOT NULL,
    delay_minutes INT NOT NULL
);

CREATE TABLE reviews (
    id VARCHAR(36) PRIMARY KEY,
    operator_id VARCHAR(36) NOT NULL,
    rating DECIMAL(3,2) NOT NULL,
    cleanliness_score DECIMAL(3,2),
    driver_score DECIMAL(3,2),
    safety_score DECIMAL(3,2),
    comment TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_reviews_operator FOREIGN KEY (operator_id) REFERENCES operators(id)
);

CREATE TABLE passenger_feedback (
    id VARCHAR(36) PRIMARY KEY,
    itinerary_id VARCHAR(36) NOT NULL,
    tag VARCHAR(50) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_passenger_feedback_itinerary FOREIGN KEY (itinerary_id) REFERENCES itineraries(id)
);
