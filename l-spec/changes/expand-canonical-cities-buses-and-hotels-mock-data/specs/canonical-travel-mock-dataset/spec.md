## Purpose

Maintains a canonical, verified mock dataset of 12-15 Indian cities, 15 intercity bus services, and stay options with bilingual Telugu/English support, ensuring exact data rendering across search and itinerary screens without random placeholders.

## ADDED Requirements

### Requirement: Canonical City Schema & Repository
The system SHALL maintain a store of at least 12-15 intercity destinations containing `city_id`, `city_name`, `city_name_te`, `state_name`, `state_code`, `latitude`, and `longitude`.

#### Scenario: City Lookup by Name or Alias
- **WHEN** a user or LLM inputs a city name (e.g. "Vizag" or "విశాఖపట్నం")
- **THEN** the system resolves it to the canonical city record with its English and Telugu titles and coordinates

### Requirement: Intercity Bus Services Dataset
The system SHALL contain at least 15 scheduled bus routes operating between canonical cities with complete operator, vehicle, schedule, fare, and transfer hub attributes.

#### Scenario: Route Search with Matched Cities
- **WHEN** the origin and destination belong to the canonical city dataset
- **THEN** the search engine returns real scheduled bus options matching those exact city stops rather than generating random fallback strings

### Requirement: Mock Stay & Hotel Dataset
The system SHALL maintain hotel recommendations near major transit stops with ratings, prices, amenities, and bilingual titles.

#### Scenario: Stay Recommendation Rendering
- **WHEN** an itinerary detail or stay suggestion is requested for a destination city
- **THEN** the system renders verified hotel records associated with that canonical city
