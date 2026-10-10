## Why

To avoid generating random or missing data during route searches and stay recommendations, the system requires a comprehensive canonical dataset of 12-15 Indian cities (with fields: `city_id`, `city_name`, `city_name_te`, `state_name`, `state_code`, `latitude`, `longitude`), 15 scheduled bus routes connecting these cities, and mock stay/hotel data. When origin and destination cities exist in this dataset, the UI and backend route engines will render these exact verified records without falling back to random placeholder data.

## What Changes

- **Canonical City Dataset (12-15 Cities)**: Standardize city schema with `city_id`, `city_name`, `city_name_te`, `state_name`, `state_code`, `latitude`, and `longitude` fields in both `frontend/src/mockData.js` and backend Spring Boot database seed files.
- **15 Scheduled Intercity Bus Routes**: Define 15 realistic bus services connecting canonical cities (e.g., Visakhapatnam, Vijayawada, Hyderabad, Tirupati, Guntur, Rajahmundry, Kakinada, Nellore, Anantapur, Kurnool, Bengaluru, Chennai) with complete operator, vehicle, timetable, and fare information.
- **Mock Hotel / Stay Data**: Add 10-12 curated hotel records near key bus terminals for stay recommendations.
- **Dynamic Route & City Rendering**: Ensure `GraphNetworkService.java`, `transportEngine.js`, and `IntakeAgent.java` match origin and destination against this canonical store and present real city names, Telugu translations, and scheduled bus services dynamically without random data generation.

## Capabilities

### New Capabilities
- `canonical-travel-mock-dataset`: Rich, schema-compliant dataset of 15 cities, 15 intercity bus services, and hotel stays with bilingual Telugu/English support and exact UI rendering.

### Modified Capabilities
None.

## Impact

- `frontend/src/mockData.js`: Expand cities, bus services, and hotels with exact required fields.
- `frontend/src/transportEngine.js`: Update search engine to dynamically filter services matching any origin and destination city present in `MOCK_CITIES`.
- `backend/src/main/java/com/roamagent/entity/Stop.java` & `entity/City.java`: Ensure city entities store Telugu names and geographic coordinates.
- `backend/src/main/resources/db/migration` / seed loaders: Add seed data for all 15 cities and bus services.
