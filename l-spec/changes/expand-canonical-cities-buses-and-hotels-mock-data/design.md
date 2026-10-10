## Context

Currently, `mockData.js` contains 5 stops primarily centered on Visakhapatnam, Vijayawada, and Hyderabad, and 6 bus services. To handle searches across Andhra Pradesh, Telangana, Karnataka, and Tamil Nadu without generating random data, we expand the dataset to 15 cities, 15 bus services, and 10 hotels.

## Goals / Non-Goals

**Goals:**
- Implement 15 canonical cities in `frontend/src/mockData.js` with full schema (`city_id`, `city_name`, `city_name_te`, `state_name`, `state_code`, `latitude`, `longitude`).
- Add 15 intercity bus services covering direct and multi-leg connections.
- Add 10-12 mock hotel/stay options keyed by `city_id`.
- Update `transportEngine.js` search algorithm so any origin-destination pair from this dataset dynamically matches candidate services and renders accurate city names and Telugu translations on UI screens.

**Non-Goals:**
- Dynamic API calls to live third-party hotel/bus booking aggregators.

## Decisions

1. **City Schema Alignment**:
   Standardize `MOCK_CITIES` object array and key lookup map in `mockData.js`:
   - `VISAKHAPATNAM` (`CT_01`, "Visakhapatnam", "విశాఖపట్నం", "Andhra Pradesh", "AP", 17.7231, 83.3012)
   - `HYDERABAD` (`CT_02`, "Hyderabad", "హైదరాబాద్", "Telangana", "TS", 17.3850, 78.4867)
   - `VIJAYAWADA` (`CT_03`, "Vijayawada", "విజయవాడ", "Andhra Pradesh", "AP", 16.5062, 80.6480)
   - `TIRUPATI` (`CT_04`, "Tirupati", "తిరుపతి", "Andhra Pradesh", "AP", 13.6288, 79.4192)
   - `GUNTUR` (`CT_05`, "Guntur", "గుంటూరు", "Andhra Pradesh", "AP", 16.3067, 80.4365)
   - `RAJAHMUNDRY` (`CT_06`, "Rajahmundry", "రాజమండ్రి", "Andhra Pradesh", "AP", 17.0005, 81.8040)
   - `KAKINADA` (`CT_07`, "Kakinada", "కాకినాడ", "Andhra Pradesh", "AP", 16.9891, 82.2475)
   - `NELLORE` (`CT_08`, "Nellore", "నెల్లూరు", "Andhra Pradesh", "AP", 14.4426, 79.9865)
   - `KURNOOL` (`CT_09`, "Kurnool", "కర్నూలు", "Andhra Pradesh", "AP", 15.8281, 78.0373)
   - `ANANTAPUR` (`CT_10`, "Anantapur", "అనంతపురం", "Andhra Pradesh", "AP", 14.6819, 77.6006)
   - `BENGALURU` (`CT_11`, "Bengaluru", "బెంగళూరు", "Karnataka", "KA", 12.9716, 77.5946)
   - `CHENNAI` (`CT_12`, "Chennai", "చెన్నై", "Tamil Nadu", "TN", 13.0827, 80.2707)
   - `WARANGAL` (`CT_13`, "Warangal", "వరంగల్", "Telangana", "TS", 17.9689, 79.5941)
   - `NIZAMABAD` (`CT_14`, "Nizamabad", "నిజామాబాద్", "Telangana", "TS", 18.6725, 78.0941)
   - `ELURU` (`CT_15`, "Eluru", "ఏలూరు", "Andhra Pradesh", "AP", 16.7107, 81.1035)

2. **Search Logic Dynamic Filtering**:
   Modify `searchRoutes` in `transportEngine.js` so it filters `MOCK_BUS_SERVICES` matching origin and destination city names dynamically, providing candidate routes for all 15 cities with appropriate fare, time, and transfer calculation.
