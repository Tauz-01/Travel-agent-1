CREATE TABLE IF NOT EXISTS hotel_properties (
    id VARCHAR(36) PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    city VARCHAR(100) NOT NULL,
    locality VARCHAR(100),
    star_rating DOUBLE,
    user_rating DOUBLE,
    review_count INT DEFAULT 0,
    address VARCHAR(255),
    latitude DECIMAL(10, 8),
    longitude DECIMAL(11, 8),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS hotel_rooms (
    id VARCHAR(36) PRIMARY KEY,
    hotel_id VARCHAR(36) NOT NULL,
    room_type VARCHAR(100) NOT NULL,
    price_per_night DECIMAL(10, 2) NOT NULL,
    tax_amount DECIMAL(10, 2) DEFAULT 0.00,
    available_rooms INT DEFAULT 1,
    cancellation_policy VARCHAR(255),
    amenities VARCHAR(500),
    FOREIGN KEY (hotel_id) REFERENCES hotel_properties(id) ON DELETE CASCADE
);

INSERT INTO hotel_properties (id, name, city, locality, star_rating, user_rating, review_count, address) VALUES
('h1111111-1111-1111-1111-111111111111', 'Cyber Stay Inn', 'Hyderabad', 'Gachibowli', 3.5, 4.3, 128, 'Near Mindspace, Gachibowli, Hyderabad'),
('h2222222-2222-2222-2222-222222222222', 'Gachibowli Comfort Suites', 'Hyderabad', 'Gachibowli', 4.0, 4.6, 250, 'Outer Ring Road, Gachibowli, Hyderabad'),
('h3333333-3333-3333-3333-333333333333', 'Grand Vizag Retreat', 'Visakhapatnam', 'RTC Complex', 4.0, 4.5, 310, 'Dwaraka Nagar, Visakhapatnam'),
('h4444444-4444-4444-4444-444444444444', 'Benz Circle Residency', 'Vijayawada', 'Benz Circle', 3.0, 4.1, 95, 'Benz Circle, Vijayawada');

INSERT INTO hotel_rooms (id, hotel_id, room_type, price_per_night, tax_amount, available_rooms, cancellation_policy, amenities) VALUES
('r1111111-1111-1111-1111-111111111111', 'h1111111-1111-1111-1111-111111111111', 'Deluxe AC Room', 1450.00, 180.00, 5, 'Free cancellation up to 24h before check-in', 'WiFi, AC, Breakfast, TV'),
('r2222222-2222-2222-2222-222222222222', 'h2222222-2222-2222-2222-222222222222', 'Executive Suite', 1950.00, 240.00, 3, 'Non-refundable', 'WiFi, AC, Breakfast, Gym, Parking'),
('r3333333-3333-3333-3333-333333333333', 'h3333333-3333-3333-3333-333333333333', 'Standard Double AC', 1800.00, 200.00, 8, 'Free cancellation', 'WiFi, AC, Hot Water'),
('r4444444-4444-4444-4444-444444444444', 'h4444444-4444-4444-4444-444444444444', 'Economy AC', 1200.00, 140.00, 4, 'Free cancellation', 'AC, TV');
