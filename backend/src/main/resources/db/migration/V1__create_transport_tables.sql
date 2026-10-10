CREATE TABLE operators (
    id UUID PRIMARY KEY,
    code VARCHAR(20) UNIQUE NOT NULL,
    name VARCHAR(100) NOT NULL,
    contact_number VARCHAR(20),
    rating DECIMAL(3,2),
    on_time_performance_pct DECIMAL(5,2),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE vehicles (
    id UUID PRIMARY KEY,
    operator_id UUID NOT NULL REFERENCES operators(id),
    registration_number VARCHAR(20) UNIQUE NOT NULL,
    bus_type VARCHAR(30) NOT NULL,
    capacity INT NOT NULL,
    manufacture_year INT NOT NULL,
    has_wifi BOOLEAN DEFAULT FALSE,
    has_charging_point BOOLEAN DEFAULT TRUE,
    is_active BOOLEAN DEFAULT TRUE
);

CREATE TABLE stops (
    id UUID PRIMARY KEY,
    code VARCHAR(20) UNIQUE NOT NULL,
    name VARCHAR(100) NOT NULL,
    city VARCHAR(50) NOT NULL,
    state VARCHAR(50) NOT NULL,
    latitude DECIMAL(10,8) NOT NULL,
    longitude DECIMAL(11,8) NOT NULL,
    amenities TEXT
);

CREATE INDEX idx_stops_city ON stops(city);

CREATE TABLE bus_services (
    id UUID PRIMARY KEY,
    service_number VARCHAR(30) UNIQUE NOT NULL,
    operator_id UUID NOT NULL REFERENCES operators(id),
    vehicle_id UUID NOT NULL REFERENCES vehicles(id),
    service_type VARCHAR(30) NOT NULL,
    is_active BOOLEAN DEFAULT TRUE
);

CREATE TABLE service_stops (
    id UUID PRIMARY KEY,
    bus_service_id UUID NOT NULL REFERENCES bus_services(id),
    stop_id UUID NOT NULL REFERENCES stops(id),
    stop_sequence INT NOT NULL,
    scheduled_arrival_time TIME,
    scheduled_departure_time TIME,
    day_offset INT DEFAULT 0,
    CONSTRAINT uk_service_stop_seq UNIQUE(bus_service_id, stop_sequence)
);

CREATE INDEX idx_service_stops_lookup ON service_stops(stop_id, scheduled_departure_time);

CREATE TABLE fare_records (
    id UUID PRIMARY KEY,
    bus_service_id UUID NOT NULL REFERENCES bus_services(id),
    from_stop_id UUID NOT NULL REFERENCES stops(id),
    to_stop_id UUID NOT NULL REFERENCES stops(id),
    seat_class VARCHAR(20) NOT NULL,
    base_fare DECIMAL(10,2) NOT NULL,
    tax_amount DECIMAL(10,2) DEFAULT 0.00,
    CONSTRAINT uk_fare_service_stops UNIQUE(bus_service_id, from_stop_id, to_stop_id, seat_class)
);
