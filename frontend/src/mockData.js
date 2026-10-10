export const MOCK_CITIES = [
  {
    city_id: 'CT_01',
    city_name: 'Visakhapatnam',
    city_name_te: 'విశాఖపట్నం',
    state_name: 'Andhra Pradesh',
    state_code: 'AP',
    latitude: 17.7231,
    longitude: 83.3012,
    aliases: ['Vizag', 'Visakhapatnam', 'Vizag RTC', 'Dwaraka Nagar']
  },
  {
    city_id: 'CT_02',
    city_name: 'Hyderabad',
    city_name_te: 'హైదరాబాద్',
    state_name: 'Telangana',
    state_code: 'TS',
    latitude: 17.3850,
    longitude: 78.4867,
    aliases: ['Hyderabad', 'Hyd', 'MGBS', 'Koti', 'Secunderabad', 'Ameerpet']
  },
  {
    city_id: 'CT_03',
    city_name: 'Vijayawada',
    city_name_te: 'విజయవాడ',
    state_name: 'Andhra Pradesh',
    state_code: 'AP',
    latitude: 16.5062,
    longitude: 80.6480,
    aliases: ['Vijayawada', 'Vijayawada PNBS', 'Benz Circle', 'Vijayawada Bus Stand']
  },
  {
    city_id: 'CT_04',
    city_name: 'Tirupati',
    city_name_te: 'తిరుపతి',
    state_name: 'Andhra Pradesh',
    state_code: 'AP',
    latitude: 13.6288,
    longitude: 79.4192,
    aliases: ['Tirupati', 'Tirupathi', 'Tirumala', 'Alipiri']
  },
  {
    city_id: 'CT_05',
    city_name: 'Guntur',
    city_name_te: 'గుంటూరు',
    state_name: 'Andhra Pradesh',
    state_code: 'AP',
    latitude: 16.3067,
    longitude: 80.4365,
    aliases: ['Guntur', 'Guntur Bus Stand', 'NTR Bus Station']
  },
  {
    city_id: 'CT_06',
    city_name: 'Rajahmundry',
    city_name_te: 'రాజమండ్రి',
    state_name: 'Andhra Pradesh',
    state_code: 'AP',
    latitude: 17.0005,
    longitude: 81.8040,
    aliases: ['Rajahmundry', 'Rajamahendravaram', 'Kotipalli Stand']
  },
  {
    city_id: 'CT_07',
    city_name: 'Kakinada',
    city_name_te: 'కాకినాడ',
    state_name: 'Andhra Pradesh',
    state_code: 'AP',
    latitude: 16.9891,
    longitude: 82.2475,
    aliases: ['Kakinada', 'Kakinada Town', 'Sarpavaram']
  },
  {
    city_id: 'CT_08',
    city_name: 'Nellore',
    city_name_te: 'నెల్లూరు',
    state_name: 'Andhra Pradesh',
    state_code: 'AP',
    latitude: 14.4426,
    longitude: 79.9865,
    aliases: ['Nellore', 'Nellore Bus Stand', 'Atmakur Bus Stand']
  },
  {
    city_id: 'CT_09',
    city_name: 'Kurnool',
    city_name_te: 'కర్నూలు',
    state_name: 'Andhra Pradesh',
    state_code: 'AP',
    latitude: 15.8281,
    longitude: 78.0373,
    aliases: ['Kurnool', 'Kurnool Bus Stand', 'Raj Vihar']
  },
  {
    city_id: 'CT_10',
    city_name: 'Anantapur',
    city_name_te: 'అనంతపురం',
    state_name: 'Andhra Pradesh',
    state_code: 'AP',
    latitude: 14.6819,
    longitude: 77.6006,
    aliases: ['Anantapur', 'Ananthapur', 'ATP Bus Stand']
  },
  {
    city_id: 'CT_11',
    city_name: 'Bengaluru',
    city_name_te: 'బెంగళూరు',
    state_name: 'Karnataka',
    state_code: 'KA',
    latitude: 12.9716,
    longitude: 77.5946,
    aliases: ['Bengaluru', 'Bangalore', 'Majestic', 'Silk Board', 'Electronic City']
  },
  {
    city_id: 'CT_12',
    city_name: 'Chennai',
    city_name_te: 'చెన్నై',
    state_name: 'Tamil Nadu',
    state_code: 'TN',
    latitude: 13.0827,
    longitude: 80.2707,
    aliases: ['Chennai', 'Madras', 'Koyambedu', 'CMBT', 'Guindy']
  },
  {
    city_id: 'CT_13',
    city_name: 'Warangal',
    city_name_te: 'వరంగల్',
    state_name: 'Telangana',
    state_code: 'TS',
    latitude: 17.9689,
    longitude: 79.5941,
    aliases: ['Warangal', 'Hanamkonda', 'Kazipet']
  },
  {
    city_id: 'CT_14',
    city_name: 'Nizamabad',
    city_name_te: 'నిజామాబాద్',
    state_name: 'Telangana',
    state_code: 'TS',
    latitude: 18.6725,
    longitude: 78.0941,
    aliases: ['Nizamabad', 'NZB Bus Stand']
  },
  {
    city_id: 'CT_15',
    city_name: 'Eluru',
    city_name_te: 'ఏలూరు',
    state_name: 'Andhra Pradesh',
    state_code: 'AP',
    latitude: 16.7107,
    longitude: 81.1035,
    aliases: ['Eluru', 'Eluru Bus Stand', 'Old Bus Stand']
  }
];

export const MOCK_STOPS = {
  VISAKHAPATNAM: {
    id: 'STOP_VIZAG_RTC',
    name: 'Visakhapatnam RTC Complex',
    city: 'Visakhapatnam',
    city_id: 'CT_01',
    lat: 17.7231,
    lng: 83.3012,
    aliases: ['Vizag', 'Visakhapatnam', 'Vizag RTC', 'Dwaraka Nagar']
  },
  VIJAYAWADA_RTC: {
    id: 'STOP_VIJAYAWADA_RTC',
    name: 'Vijayawada Pandit Nehru Bus Station',
    city: 'Vijayawada',
    city_id: 'CT_03',
    lat: 16.5062,
    lng: 80.6480,
    aliases: ['Vijayawada', 'Vijayawada PNBS', 'Vijayawada Bus Stand']
  },
  VIJAYAWADA_BYPASS: {
    id: 'STOP_VIJAYAWADA_BYPASS',
    name: 'Vijayawada Bypass Boarding Point',
    city: 'Vijayawada',
    city_id: 'CT_03',
    lat: 16.5200,
    lng: 80.6200,
    aliases: ['Vijayawada Bypass', 'Benz Circle Bypass']
  },
  HYDERABAD_MGBS: {
    id: 'STOP_HYD_MGBS',
    name: 'Hyderabad MGBS (Mahatma Gandhi Bus Station)',
    city: 'Hyderabad',
    city_id: 'CT_02',
    lat: 17.3783,
    lng: 78.4820,
    aliases: ['Hyderabad', 'Hyderabad MGBS', 'MGBS', 'Koti']
  },
  HYDERABAD_AMBERPET: {
    id: 'STOP_HYD_AMBERPET',
    name: 'Hyderabad Amberpet Drop Point',
    city: 'Hyderabad',
    city_id: 'CT_02',
    lat: 17.3912,
    lng: 78.5189,
    aliases: ['Amberpet', 'Hyderabad Amberpet']
  },
  TIRUPATI_BUS_STAND: {
    id: 'STOP_TIRUPATI_RTC',
    name: 'Tirupati Central Bus Station',
    city: 'Tirupati',
    city_id: 'CT_04',
    lat: 13.6288,
    lng: 79.4192,
    aliases: ['Tirupati', 'Tirupati RTC']
  },
  BENGALURU_MAJESTIC: {
    id: 'STOP_BLR_MAJESTIC',
    name: 'Bengaluru KSRTC Majestic Bus Stand',
    city: 'Bengaluru',
    city_id: 'CT_11',
    lat: 12.9716,
    lng: 77.5946,
    aliases: ['Bengaluru', 'Bangalore Majestic', 'Kempegowda Station']
  },
  CHENNAI_KOYAMBEDU: {
    id: 'STOP_CHENNAI_CMBT',
    name: 'Chennai CMBT Koyambedu',
    city: 'Chennai',
    city_id: 'CT_12',
    lat: 13.0827,
    lng: 80.2707,
    aliases: ['Chennai', 'CMBT', 'Koyambedu']
  }
};

export const MOCK_OPERATORS = {
  APSRTC: { id: 'OP_APSRTC', name: 'APSRTC (State Express)', rating: 4.6, totalReviews: 1420 },
  KAveri: { id: 'OP_KAVERI', name: 'Kaveri Travels Multi-Axle', rating: 4.8, totalReviews: 890 },
  ORANGE: { id: 'OP_ORANGE', name: 'Orange Tours & Travels', rating: 4.7, totalReviews: 1120 },
  GARUDA: { id: 'OP_GARUDA', name: 'Garuda Plus AC Sleeper', rating: 4.5, totalReviews: 650 },
};

export const MOCK_VEHICLES = {
  VEH_01: {
    id: 'VEH_01',
    model: 'Volvo B11R Multi-Axle AC Sleeper (2+1)',
    ageYears: 2,
    serviceHistory: 'Routine maintenance passed 5 days ago. Excellent alignment & suspension rating.',
    reviews: [
      { user: 'Srinivas R.', rating: 5, comment: 'Punctual departure, clean berths, good charging ports.' },
      { user: 'Anitha K.', rating: 4.5, comment: 'Smooth suspension on National Highway.' }
    ]
  },
  VEH_02: {
    id: 'VEH_02',
    model: 'Scania Metrolink AC Semi-Sleeper (2+2)',
    ageYears: 4,
    serviceHistory: 'AC serviced last month. Recorded minor delay last week due to tyre pressure check.',
    reviews: [
      { user: 'Ramesh B.', rating: 4.2, comment: 'Decent speed and driving, air conditioning was powerful.' }
    ]
  },
  VEH_03: {
    id: 'VEH_03',
    model: 'Mercedes-Benz Multi-Axle Super Luxury AC Sleeper',
    ageYears: 1,
    serviceHistory: 'Brand new fleet addition. Zero mechanical faults recorded.',
    reviews: [
      { user: 'Karthik V.', rating: 4.9, comment: 'Extremely silent cabin, spotless bedding.' }
    ]
  },
  VEH_04: {
    id: 'VEH_04',
    model: 'Eicher Non-AC Seater Express',
    ageYears: 6,
    serviceHistory: 'Older vehicle fleet. Mixed passenger feedback on suspension comfort.',
    reviews: [
      { user: 'Praveen T.', rating: 3.2, comment: 'Reached destination, but bumpy ride.' }
    ]
  }
};

// Scheduled bus legs available in mock database
export const MOCK_BUS_SERVICES = [
  // Direct Vizag -> Hyd (Fastest sleeper, slightly higher fare)
  {
    id: 'SRV_DIRECT_01',
    operator: MOCK_OPERATORS.KAveri,
    vehicle: MOCK_VEHICLES.VEH_03,
    originStop: MOCK_STOPS.VISAKHAPATNAM,
    destStop: MOCK_STOPS.HYDERABAD_MGBS,
    departureTime: '21:00', // 9:00 PM
    arrivalTime: '07:30',   // 7:30 AM (Next Day)
    duration: '10h 30m',
    fare: 1450,
    coachType: 'AC sleeper',
    availableSeats: 12,
    isDirect: true,
  },
  // Connecting Vizag -> Vijayawada (Leg 1)
  {
    id: 'SRV_CONN_LEG1_SAFE',
    operator: MOCK_OPERATORS.APSRTC,
    vehicle: MOCK_VEHICLES.VEH_01,
    originStop: MOCK_STOPS.VISAKHAPATNAM,
    destStop: MOCK_STOPS.VIJAYAWADA_RTC,
    departureTime: '21:15',
    arrivalTime: '02:40', // 2:40 AM
    duration: '5h 25m',
    fare: 720,
    coachType: 'AC sleeper',
    availableSeats: 18,
    isDirect: false,
  },
  // Connecting Vijayawada -> Hyd (Leg 2 - Safe connection departure at 03:35 AM = 55m buffer)
  {
    id: 'SRV_CONN_LEG2_SAFE',
    operator: MOCK_OPERATORS.ORANGE,
    vehicle: MOCK_VEHICLES.VEH_02,
    originStop: MOCK_STOPS.VIJAYAWADA_RTC,
    destStop: MOCK_STOPS.HYDERABAD_MGBS,
    departureTime: '03:35', // 3:35 AM
    arrivalTime: '08:00',   // 8:00 AM (Meets 9:00 AM deadline!)
    duration: '4h 25m',
    fare: 530,
    coachType: 'AC sleeper',
    availableSeats: 8,
    isDirect: false,
  },
  // Connecting Vijayawada Bypass -> Hyd (Recovery Option Leg 2 - Departs 04:15 AM)
  {
    id: 'SRV_CONN_RECOVERY_01',
    operator: MOCK_OPERATORS.GARUDA,
    vehicle: MOCK_VEHICLES.VEH_03,
    originStop: MOCK_STOPS.VIJAYAWADA_BYPASS,
    destStop: MOCK_STOPS.HYDERABAD_MGBS,
    departureTime: '04:15', // 4:15 AM
    arrivalTime: '08:25',   // 8:25 AM (Meets 9:00 AM deadline!)
    duration: '4h 10m',
    fare: 780,
    coachType: 'AC sleeper',
    availableSeats: 6,
    isDirect: false,
  },
  // Infeasible Direct (Arrives past deadline at 10:15 AM)
  {
    id: 'SRV_INFEASIBLE_LATE',
    operator: MOCK_OPERATORS.APSRTC,
    vehicle: MOCK_VEHICLES.VEH_04,
    originStop: MOCK_STOPS.VISAKHAPATNAM,
    destStop: MOCK_STOPS.HYDERABAD_MGBS,
    departureTime: '23:30',
    arrivalTime: '10:15', // Exceeds 09:00 AM deadline
    duration: '10h 45m',
    fare: 980,
    coachType: 'Non-AC Seater',
    availableSeats: 24,
    isDirect: true,
  },
  // Infeasible Budget Direct (Exceeds ₹1500 budget = ₹1850)
  {
    id: 'SRV_INFEASIBLE_BUDGET',
    operator: MOCK_OPERATORS.KAveri,
    vehicle: MOCK_VEHICLES.VEH_03,
    originStop: MOCK_STOPS.VISAKHAPATNAM,
    destStop: MOCK_STOPS.HYDERABAD_MGBS,
    departureTime: '22:00',
    arrivalTime: '08:00',
    duration: '10h 00m',
    fare: 1850, // Exceeds ₹1500 max budget
    coachType: 'AC sleeper',
    availableSeats: 4,
    isDirect: true,
  },
  // 7. Vijayawada -> Tirupati Direct
  {
    id: 'SRV_VIJ_TIRUPATI_01',
    operator: MOCK_OPERATORS.APSRTC,
    vehicle: MOCK_VEHICLES.VEH_01,
    originStop: MOCK_STOPS.VIJAYAWADA_RTC,
    destStop: MOCK_STOPS.TIRUPATI_BUS_STAND,
    departureTime: '22:15',
    arrivalTime: '06:00',
    duration: '7h 45m',
    fare: 680,
    coachType: 'AC sleeper',
    availableSeats: 14,
    isDirect: true,
  },
  // 8. Hyderabad -> Bengaluru Express
  {
    id: 'SRV_HYD_BLR_01',
    operator: MOCK_OPERATORS.ORANGE,
    vehicle: MOCK_VEHICLES.VEH_03,
    originStop: MOCK_STOPS.HYDERABAD_MGBS,
    destStop: MOCK_STOPS.BENGALURU_MAJESTIC,
    departureTime: '21:30',
    arrivalTime: '06:30',
    duration: '9h 00m',
    fare: 1250,
    coachType: 'AC sleeper',
    availableSeats: 16,
    isDirect: true,
  },
  // 9. Tirupati -> Chennai Express
  {
    id: 'SRV_TIRUPATI_CHENNAI_01',
    operator: MOCK_OPERATORS.APSRTC,
    vehicle: MOCK_VEHICLES.VEH_02,
    originStop: MOCK_STOPS.TIRUPATI_BUS_STAND,
    destStop: MOCK_STOPS.CHENNAI_KOYAMBEDU,
    departureTime: '06:00',
    arrivalTime: '09:30',
    duration: '3h 30m',
    fare: 320,
    coachType: 'AC Semi-Sleeper',
    availableSeats: 22,
    isDirect: true,
  },
  // 10. Bengaluru -> Chennai Volvo
  {
    id: 'SRV_BLR_CHENNAI_01',
    operator: MOCK_OPERATORS.KAveri,
    vehicle: MOCK_VEHICLES.VEH_01,
    originStop: MOCK_STOPS.BENGALURU_MAJESTIC,
    destStop: MOCK_STOPS.CHENNAI_KOYAMBEDU,
    departureTime: '23:00',
    arrivalTime: '05:30',
    duration: '6h 30m',
    fare: 890,
    coachType: 'AC sleeper',
    availableSeats: 10,
    isDirect: true,
  },
  // 11. Vizag -> Tirupati Super Luxury
  {
    id: 'SRV_VIZAG_TIRUPATI_01',
    operator: MOCK_OPERATORS.GARUDA,
    vehicle: MOCK_VEHICLES.VEH_03,
    originStop: MOCK_STOPS.VISAKHAPATNAM,
    destStop: MOCK_STOPS.TIRUPATI_BUS_STAND,
    departureTime: '18:00',
    arrivalTime: '07:00',
    duration: '13h 00m',
    fare: 1350,
    coachType: 'AC sleeper',
    availableSeats: 9,
    isDirect: true,
  },
  // 12. Vijayawada -> Bengaluru Multi-Axle
  {
    id: 'SRV_VIJ_BLR_01',
    operator: MOCK_OPERATORS.ORANGE,
    vehicle: MOCK_VEHICLES.VEH_01,
    originStop: MOCK_STOPS.VIJAYAWADA_RTC,
    destStop: MOCK_STOPS.BENGALURU_MAJESTIC,
    departureTime: '20:00',
    arrivalTime: '07:30',
    duration: '11h 30m',
    fare: 1400,
    coachType: 'AC sleeper',
    availableSeats: 15,
    isDirect: true,
  },
  // 13. Vizag -> Chennai Multi-Axle
  {
    id: 'SRV_VIZAG_CHENNAI_01',
    operator: MOCK_OPERATORS.KAveri,
    vehicle: MOCK_VEHICLES.VEH_03,
    originStop: MOCK_STOPS.VISAKHAPATNAM,
    destStop: MOCK_STOPS.CHENNAI_KOYAMBEDU,
    departureTime: '17:30',
    arrivalTime: '08:00',
    duration: '14h 30m',
    fare: 1600,
    coachType: 'AC sleeper',
    availableSeats: 7,
    isDirect: true,
  },
  // 14. Hyderabad -> Vijayawada Day Express
  {
    id: 'SRV_HYD_VIJ_DAY_01',
    operator: MOCK_OPERATORS.APSRTC,
    vehicle: MOCK_VEHICLES.VEH_02,
    originStop: MOCK_STOPS.HYDERABAD_MGBS,
    destStop: MOCK_STOPS.VIJAYAWADA_RTC,
    departureTime: '06:00',
    arrivalTime: '10:45',
    duration: '4h 45m',
    fare: 480,
    coachType: 'AC Semi-Sleeper',
    availableSeats: 28,
    isDirect: true,
  },
  // 15. Hyderabad -> Tirupati Super Luxury
  {
    id: 'SRV_HYD_TIRUPATI_01',
    operator: MOCK_OPERATORS.GARUDA,
    vehicle: MOCK_VEHICLES.VEH_03,
    originStop: MOCK_STOPS.HYDERABAD_MGBS,
    destStop: MOCK_STOPS.TIRUPATI_BUS_STAND,
    departureTime: '21:00',
    arrivalTime: '06:30',
    duration: '9h 30m',
    fare: 1100,
    coachType: 'AC sleeper',
    availableSeats: 11,
    isDirect: true,
  }
];

export const MOCK_HOTELS = [
  {
    hotel_id: 'HTL_01',
    city_id: 'CT_01',
    city_name: 'Visakhapatnam',
    name: 'Novotel Vizag Varun Beach',
    name_te: 'నోవోటెల్ విశాఖ వరుణ్ బీచ్',
    lifespanYears: 8,
    rating: 4.8,
    totalReviews: 1240,
    location: 'Beach Road, Maharani Peta, Visakhapatnam',
    proximity: '1.2 km from RTC Complex',
    pricePerNightINR: 3800,
    amenities: ['AC', 'Free WiFi', 'Sea View', 'Breakfast Included'],
    feedback: [
      { user: 'Sita M.', rating: 5, comment: 'Pristine ocean view and walking distance to transport hubs.' },
      { user: 'Srinivas K.', rating: 4.6, comment: 'Great buffet breakfast and fast room service.' }
    ]
  },
  {
    hotel_id: 'HTL_02',
    city_id: 'CT_02',
    city_name: 'Hyderabad',
    name: 'Hotel Taj Tristar Secunderabad',
    name_te: 'హోటల్ తాజ్ ట్రైస్టార్ సికింద్రాబాద్',
    lifespanYears: 12,
    rating: 4.6,
    totalReviews: 2150,
    location: 'SD Road, Secunderabad, Hyderabad',
    proximity: '2.5 km from MGBS',
    pricePerNightINR: 2400,
    amenities: ['AC', 'Free WiFi', '24/7 Check-in', 'Restaurant'],
    feedback: [
      { user: 'Rohan P.', rating: 4.7, comment: 'Very clean rooms and very convenient for late night bus arrivals.' }
    ]
  },
  {
    hotel_id: 'HTL_03',
    city_id: 'CT_03',
    city_name: 'Vijayawada',
    name: 'The Gateway Hotel M.G. Road',
    name_te: 'ది గేట్‌వే హోటల్ విజయవాడ',
    lifespanYears: 10,
    rating: 4.7,
    totalReviews: 1890,
    location: 'M.G. Road, Labbipet, Vijayawada',
    proximity: '800m from PNBS Bus Stand',
    pricePerNightINR: 2800,
    amenities: ['AC', 'Free WiFi', 'Swimming Pool', 'Buffet Breakfast'],
    feedback: [
      { user: 'Venkatesh B.', rating: 4.8, comment: 'Spacious rooms and excellent connectivity to bus station.' }
    ]
  },
  {
    hotel_id: 'HTL_04',
    city_id: 'CT_04',
    city_name: 'Tirupati',
    name: 'Fortune Select Grand Ridge',
    name_te: 'ఫార్చ్యూన్ సెలెక్ట్ గ్రాండ్ రిడ్జ్ తిరుపతి',
    lifespanYears: 6,
    rating: 4.7,
    totalReviews: 1450,
    location: 'Shilparamam, Tiruchanoor Road, Tirupati',
    proximity: '1.0 km from Central Bus Stand',
    pricePerNightINR: 3200,
    amenities: ['AC', 'Free WiFi', 'Temple Shuttle', 'Pure Veg Restaurant'],
    feedback: [
      { user: 'Lakshmi N.', rating: 4.9, comment: 'Temple shuttle service was super helpful for darshan.' }
    ]
  },
  {
    hotel_id: 'HTL_05',
    city_id: 'CT_11',
    city_name: 'Bengaluru',
    name: 'Hotel Royal Orchid Central',
    name_te: 'హోటల్ రాయల్ ఆర్కిడ్ సెంట్రల్ బెంగళూరు',
    lifespanYears: 9,
    rating: 4.5,
    totalReviews: 1670,
    location: 'MG Road, Bengaluru',
    proximity: '1.5 km from Majestic KSRTC',
    pricePerNightINR: 3100,
    amenities: ['AC', 'Free WiFi', 'Gym', 'Airport Shuttle'],
    feedback: [
      { user: 'Anand T.', rating: 4.5, comment: 'Prime location near metro and Majestic bus stop.' }
    ]
  },
  {
    hotel_id: 'HTL_06',
    city_id: 'CT_12',
    city_name: 'Chennai',
    name: 'Radisson Blu Hotel CMBT',
    name_te: 'రాడిసన్ బ్లూ హోటల్ చెన్నై',
    lifespanYears: 7,
    rating: 4.6,
    totalReviews: 1320,
    location: 'GST Road, St. Thomas Mount, Chennai',
    proximity: '900m from Koyambedu CMBT',
    pricePerNightINR: 3500,
    amenities: ['AC', 'Free WiFi', 'Spa', 'Breakfast'],
    feedback: [
      { user: 'Priya S.', rating: 4.6, comment: 'Extremely polite staff and plush bedding.' }
    ]
  },
  {
    hotel_id: 'HTL_07',
    city_id: 'CT_05',
    city_name: 'Guntur',
    name: 'Hotel Grand Nagarjuna',
    name_te: 'హోటల్ గ్రాండ్ నాగార్జున గుంటూరు',
    lifespanYears: 14,
    rating: 4.4,
    totalReviews: 980,
    location: 'Nagarjuna Nagar, Brodipet, Guntur',
    proximity: '500m from NTR Bus Station',
    pricePerNightINR: 1900,
    amenities: ['AC', 'Free WiFi', 'Restaurant', 'Car Parking'],
    feedback: [
      { user: 'Kiran R.', rating: 4.3, comment: 'Budget friendly with great local Andhra thali.' }
    ]
  },
  {
    hotel_id: 'HTL_08',
    city_id: 'CT_06',
    city_name: 'Rajahmundry',
    name: 'Hotel River Bay',
    name_te: 'హోటల్ రివర్ బే రాజమండ్రి',
    lifespanYears: 11,
    rating: 4.5,
    totalReviews: 890,
    location: 'Godavari Bund Road, Rajahmundry',
    proximity: '1.8 km from Kotipalli Bus Stand',
    pricePerNightINR: 2200,
    amenities: ['AC', 'Godavari River View', 'Water Park', 'Restaurant'],
    feedback: [
      { user: 'Subba Rao P.', rating: 4.6, comment: 'Beautiful sunset view over Godavari river.' }
    ]
  },
  {
    hotel_id: 'HTL_09',
    city_id: 'CT_07',
    city_name: 'Kakinada',
    name: 'GRT Grand Kakinada',
    name_te: 'జిఆర్‌టి గ్రాండ్ కాకినాడ',
    lifespanYears: 5,
    rating: 4.7,
    totalReviews: 1100,
    location: 'Cinema Road, Kakinada',
    proximity: '1.1 km from Kakinada Town Stop',
    pricePerNightINR: 2600,
    amenities: ['AC', 'Free WiFi', 'Swimming Pool', 'Fitness Center'],
    feedback: [
      { user: 'Madhav G.', rating: 4.7, comment: 'Modern property with great amenities.' }
    ]
  },
  {
    hotel_id: 'HTL_10',
    city_id: 'CT_08',
    city_name: 'Nellore',
    name: 'Hotel Minerva Grand Nellore',
    name_te: 'హోటల్ మిలేనియం మినర్వా గ్రాండ్ నెల్లూరు',
    lifespanYears: 8,
    rating: 4.5,
    totalReviews: 760,
    location: 'Grand Trunk Road, Nellore',
    proximity: '600m from Nellore Bus Stand',
    pricePerNightINR: 2100,
    amenities: ['AC', 'Free WiFi', 'Multi-Cuisine Dining', 'Travel Desk'],
    feedback: [
      { user: 'Swathi D.', rating: 4.4, comment: 'Clean rooms and helpful front desk.' }
    ]
  },
  {
    hotel_id: 'HTL_11',
    city_id: 'CT_09',
    city_name: 'Kurnool',
    name: 'Mourya Inn Kurnool',
    name_te: 'మౌర్య ఇన్‌ కర్నూలు',
    lifespanYears: 15,
    rating: 4.3,
    totalReviews: 920,
    location: 'Bhagya Nagar, Kurnool',
    proximity: '700m from Kurnool Central Bus Station',
    pricePerNightINR: 1800,
    amenities: ['AC', 'Free WiFi', 'Banquet Hall', '24h Room Service'],
    feedback: [
      { user: 'Naresh V.', rating: 4.2, comment: 'Landmark hotel in Kurnool with quick service.' }
    ]
  },
  {
    hotel_id: 'HTL_12',
    city_id: 'CT_10',
    city_name: 'Anantapur',
    name: 'Hotel Sapthagiri ATP',
    name_te: 'హోటల్ సప్తగిరి అనంతపురం',
    lifespanYears: 10,
    rating: 4.2,
    totalReviews: 640,
    location: 'Subhash Road, Anantapur',
    proximity: '400m from ATP Bus Stand',
    pricePerNightINR: 1600,
    amenities: ['AC', 'Free WiFi', 'Vegetarian Restaurant', 'Hot Water'],
    feedback: [
      { user: 'Babu K.', rating: 4.1, comment: 'Decent stay right next to the bus station.' }
    ]
  }
];
