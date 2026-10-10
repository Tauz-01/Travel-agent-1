CREATE TABLE recovery_proposals (
    id VARCHAR(36) PRIMARY KEY,
    itinerary_id VARCHAR(36) NOT NULL,
    disruption_event_id VARCHAR(36) NULL,
    status VARCHAR(20) NOT NULL,
    fare_difference DECIMAL(10,2) NOT NULL,
    revised_eta TIMESTAMP NOT NULL,
    replacement_summary TEXT NOT NULL,
    proposed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    decided_at TIMESTAMP NULL,
    CONSTRAINT fk_recovery_proposals_itinerary FOREIGN KEY (itinerary_id) REFERENCES itineraries(id)
);

CREATE TABLE recovery_proposal_legs (
    id VARCHAR(36) PRIMARY KEY,
    recovery_proposal_id VARCHAR(36) NOT NULL,
    leg_sequence INT NOT NULL,
    bus_service_id VARCHAR(36) NOT NULL,
    from_stop_id VARCHAR(36) NOT NULL,
    to_stop_id VARCHAR(36) NOT NULL,
    scheduled_departure TIMESTAMP NOT NULL,
    scheduled_arrival TIMESTAMP NOT NULL,
    leg_fare DECIMAL(10,2) NOT NULL,
    seat_type VARCHAR(20) NOT NULL,
    CONSTRAINT fk_recovery_proposal_legs_proposal FOREIGN KEY (recovery_proposal_id) REFERENCES recovery_proposals(id),
    CONSTRAINT fk_recovery_proposal_legs_bus_service FOREIGN KEY (bus_service_id) REFERENCES bus_services(id),
    CONSTRAINT fk_recovery_proposal_legs_from_stop FOREIGN KEY (from_stop_id) REFERENCES stops(id),
    CONSTRAINT fk_recovery_proposal_legs_to_stop FOREIGN KEY (to_stop_id) REFERENCES stops(id)
);

CREATE TABLE audit_records (
    id VARCHAR(36) PRIMARY KEY,
    itinerary_id VARCHAR(36) NOT NULL,
    action_type VARCHAR(50) NOT NULL,
    previous_revision_number INT NOT NULL,
    new_revision_number INT NOT NULL,
    change_summary TEXT NOT NULL,
    committed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_audit_records_itinerary FOREIGN KEY (itinerary_id) REFERENCES itineraries(id)
);
