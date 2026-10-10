CREATE TABLE recovery_proposals (
    id UUID PRIMARY KEY,
    itinerary_id UUID NOT NULL REFERENCES itineraries(id),
    disruption_event_id UUID,
    status VARCHAR(20) NOT NULL,
    fare_difference DECIMAL(10,2) NOT NULL,
    revised_eta TIMESTAMP WITH TIME ZONE NOT NULL,
    replacement_summary TEXT NOT NULL,
    proposed_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    decided_at TIMESTAMP WITH TIME ZONE
);

CREATE TABLE recovery_proposal_legs (
    id UUID PRIMARY KEY,
    recovery_proposal_id UUID NOT NULL REFERENCES recovery_proposals(id),
    leg_sequence INT NOT NULL,
    bus_service_id UUID NOT NULL REFERENCES bus_services(id),
    from_stop_id UUID NOT NULL REFERENCES stops(id),
    to_stop_id UUID NOT NULL REFERENCES stops(id),
    scheduled_departure TIMESTAMP WITH TIME ZONE NOT NULL,
    scheduled_arrival TIMESTAMP WITH TIME ZONE NOT NULL,
    leg_fare DECIMAL(10,2) NOT NULL,
    seat_type VARCHAR(20) NOT NULL
);

CREATE TABLE audit_records (
    id UUID PRIMARY KEY,
    itinerary_id UUID NOT NULL REFERENCES itineraries(id),
    action_type VARCHAR(50) NOT NULL,
    previous_revision_number INT NOT NULL,
    new_revision_number INT NOT NULL,
    change_summary TEXT NOT NULL,
    committed_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);
