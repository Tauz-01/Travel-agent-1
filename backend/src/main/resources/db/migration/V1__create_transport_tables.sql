CREATE TABLE operators (
    id VARCHAR(36) PRIMARY KEY,
    code VARCHAR(20) UNIQUE NOT NULL,
    name VARCHAR(100) NOT NULL,
    contact_number VARCHAR(20),
    rating DECIMAL(3,2),
    on_time_performance_pct DECIMAL(5,2),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE vehicles (
    id VARCHAR(36) PRIMARY KEY,
    operator_id VARCHAR(36) NOT NULL,
    registration_number VARCHAR(20) UNIQUE NOT NULL,
    bus_type VARCHAR(30) NOT NULL,
    capacity INT NOT NULL,
    manufacture_year INT NOT NULL,
    has_wifi BOOLEAN DEFAULT FALSE,
    has_charging_point BOOLEAN DEFAULT TRUE,
    is_active BOOLEAN DEFAULT TRUE,
    CONSTRAINT fk_vehicles_operator FOREIGN KEY (operator_id) REFERENCES operators(id)
);

CREATE TABLE stops (
    id VARCHAR(36) PRIMARY KEY,
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
    id VARCHAR(36) PRIMARY KEY,
    service_number VARCHAR(30) UNIQUE NOT NULL,
    operator_id VARCHAR(36) NOT NULL,
    vehicle_id VARCHAR(36) NOT NULL,
    service_type VARCHAR(30) NOT NULL,
    is_active BOOLEAN DEFAULT TRUE,
    CONSTRAINT fk_bus_services_operator FOREIGN KEY (operator_id) REFERENCES operators(id),
    CONSTRAINT fk_bus_services_vehicle FOREIGN KEY (vehicle_id) REFERENCES vehicles(id)
);

CREATE TABLE service_stops (
    id VARCHAR(36) PRIMARY KEY,
    bus_service_id VARCHAR(36) NOT NULL,
    stop_id VARCHAR(36) NOT NULL,
    stop_sequence INT NOT NULL,
    scheduled_arrival_time TIME,
    scheduled_departure_time TIME,
    day_offset INT DEFAULT 0,
    CONSTRAINT uk_service_stop_seq UNIQUE(bus_service_id, stop_sequence),
    CONSTRAINT fk_service_stops_bus_service FOREIGN KEY (bus_service_id) REFERENCES bus_services(id),
    CONSTRAINT fk_service_stops_stop FOREIGN KEY (stop_id) REFERENCES stops(id)
);

CREATE INDEX idx_service_stops_lookup ON service_stops(stop_id, scheduled_departure_time);

CREATE TABLE fare_records (
    id VARCHAR(36) PRIMARY KEY,
    bus_service_id VARCHAR(36) NOT NULL,
    from_stop_id VARCHAR(36) NOT NULL,
    to_stop_id VARCHAR(36) NOT NULL,
    seat_class VARCHAR(20) NOT NULL,
    base_fare DECIMAL(10,2) NOT NULL,
    tax_amount DECIMAL(10,2) DEFAULT 0.00,
    CONSTRAINT uk_fare_service_stops UNIQUE(bus_service_id, from_stop_id, to_stop_id, seat_class),
    CONSTRAINT fk_fare_records_bus_service FOREIGN KEY (bus_service_id) REFERENCES bus_services(id),
    CONSTRAINT fk_fare_records_from_stop FOREIGN KEY (from_stop_id) REFERENCES stops(id),
    CONSTRAINT fk_fare_records_to_stop FOREIGN KEY (to_stop_id) REFERENCES stops(id)
);
