## 1. Mock Data Expansion

- [ ] 1.1 Create `MOCK_CITIES` array in `frontend/src/mockData.js` containing 15 canonical cities with `city_id`, `city_name`, `city_name_te`, `state_name`, `state_code`, `latitude`, `longitude`
- [ ] 1.2 Expand `MOCK_BUS_SERVICES` in `frontend/src/mockData.js` to 15 scheduled bus routes connecting canonical cities
- [ ] 1.3 Add `MOCK_HOTELS` array in `frontend/src/mockData.js` with 10-12 curated hotel recommendations near major transit hubs

## 2. Dynamic Search & Frontend Rendering

- [ ] 2.1 Refactor `searchRoutes` in `frontend/src/transportEngine.js` to dynamically match any origin and destination city present in `MOCK_CITIES`
- [ ] 2.2 Verify that `Screen4Top4Results.js` and `Screen5ItineraryDetails.js` render exact city names, Telugu titles, fares, and stops without generating random data
