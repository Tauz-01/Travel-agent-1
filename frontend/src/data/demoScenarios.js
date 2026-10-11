export const demoScenarios = [
  {
    id: "place-1",
    sampleRequest: "Find a sleeper bus from Vizag to Hyderabad under ₹2000.",
    origin: "Visakhapatnam",
    destination: "Hyderabad",
    budget: 2000,
    travelDate: "11 Oct 2026",
    passengers: 1,
    busType: "AC Sleeper",
    intent: {
      intentId: "demo-intent-place-1",
      originCity: "Visakhapatnam",
      destinationCity: "Hyderabad",
      origin: "Visakhapatnam",
      destination: "Hyderabad",
      travelDate: "11 Oct 2026",
      arrivalDeadline: "09:00 AM",
      maxBudget: 2000,
      maxBudgetINR: 2000,
      preferredMode: "AC Sleeper",
      coachPreference: "AC Sleeper",
      passengerCount: 1,
      minimumTransferMinutes: 45
    },
    searchResults: [
      {
        id: "demo-bus-101",
        operator: "Kaveri Travels Multi-Axle",
        coachType: "AC Sleeper (2+1)",
        rating: 4.8,
        departureTime: "21:00",
        arrivalTime: "07:30",
        duration: "10h 30m",
        type: "DIRECT",
        totalFare: 1450,
        score: 96,
        recommendationReason: "Top Choice: Direct AC Sleeper arriving 1.5h before 9 AM deadline within budget.",
        feasibility: { isFeasible: true, violations: [] },
        legs: [
          {
            id: "leg-101",
            operator: { name: "Kaveri Travels Multi-Axle" },
            vehicle: { model: "Volvo B11R Multi-Axle AC Sleeper" },
            originStop: { name: "Visakhapatnam RTC Complex", city: "Visakhapatnam" },
            destStop: { name: "Hyderabad MGBS", city: "Hyderabad" },
            departureTime: "21:00",
            arrivalTime: "07:30",
            coachType: "AC Sleeper",
            fare: 1450
          }
        ]
      },
      {
        id: "demo-bus-102",
        operator: "APSRTC (Garuda Plus)",
        coachType: "AC Sleeper",
        rating: 4.6,
        departureTime: "21:15",
        arrivalTime: "08:00",
        duration: "10h 45m",
        type: "DIRECT",
        totalFare: 1350,
        score: 91,
        recommendationReason: "Reliable state express sleeper arriving comfortably before deadline.",
        feasibility: { isFeasible: true, violations: [] },
        legs: [
          {
            id: "leg-102",
            operator: { name: "APSRTC" },
            vehicle: { model: "Scania Metrolink AC Sleeper" },
            originStop: { name: "Visakhapatnam RTC Complex", city: "Visakhapatnam" },
            destStop: { name: "Hyderabad MGBS", city: "Hyderabad" },
            departureTime: "21:15",
            arrivalTime: "08:00",
            coachType: "AC Sleeper",
            fare: 1350
          }
        ]
      },
      {
        id: "demo-bus-103",
        operator: "Orange Tours & Travels",
        coachType: "AC Sleeper",
        rating: 4.7,
        departureTime: "20:30",
        arrivalTime: "07:15",
        duration: "10h 45m",
        type: "CONNECTING",
        totalFare: 1250,
        score: 85,
        recommendationReason: "Budget multi-leg option with 55 min transfer buffer at Vijayawada.",
        feasibility: { isFeasible: true, violations: [] },
        transfers: [
          {
            stop: { name: "Vijayawada PNBS" },
            bufferMinutes: 55,
            requiredBuffer: 45,
            isSafe: true
          }
        ],
        legs: [
          {
            id: "leg-103a",
            operator: { name: "APSRTC" },
            vehicle: { model: "Volvo AC Sleeper" },
            originStop: { name: "Visakhapatnam RTC Complex", city: "Visakhapatnam" },
            destStop: { name: "Vijayawada PNBS", city: "Vijayawada" },
            departureTime: "20:30",
            arrivalTime: "01:50",
            coachType: "AC Sleeper",
            fare: 720
          },
          {
            id: "leg-103b",
            operator: { name: "Orange Tours & Travels" },
            vehicle: { model: "Mercedes AC Sleeper" },
            originStop: { name: "Vijayawada PNBS", city: "Vijayawada" },
            destStop: { name: "Hyderabad MGBS", city: "Hyderabad" },
            departureTime: "02:45",
            arrivalTime: "07:15",
            coachType: "AC Sleeper",
            fare: 530
          }
        ]
      },
      {
        id: "demo-bus-104",
        operator: "Express Super Luxury",
        coachType: "Non-AC Seater",
        rating: 3.5,
        departureTime: "23:30",
        arrivalTime: "10:15",
        duration: "10h 45m",
        type: "DIRECT",
        totalFare: 2200,
        score: 30,
        recommendationReason: "Not recommended due to budget and arrival time violations.",
        feasibility: { isFeasible: false, violations: ["Over Budget (₹2200 > ₹2000)", "Arrives past 9 AM deadline"] },
        legs: [
          {
            id: "leg-104",
            operator: { name: "Express Lines" },
            vehicle: { model: "Eicher Non-AC Seater" },
            originStop: { name: "Visakhapatnam RTC Complex", city: "Visakhapatnam" },
            destStop: { name: "Hyderabad MGBS", city: "Hyderabad" },
            departureTime: "23:30",
            arrivalTime: "10:15",
            coachType: "Non-AC Seater",
            fare: 2200
          }
        ]
      }
    ],
    hotels: [
      {
        hotel_id: "HTL_DEMO_01",
        city_id: "CT_02",
        city_name: "Hyderabad",
        name: "Hotel Taj Tristar Secunderabad",
        name_te: "హోటల్ తాజ్ ట్రైస్టార్ సికింద్రాబాద్",
        lifespanYears: 12,
        rating: 4.6,
        totalReviews: 2150,
        location: "SD Road, Secunderabad, Hyderabad",
        proximity: "2.5 km from MGBS",
        pricePerNightINR: 1800,
        amenities: ["AC", "Free WiFi", "24/7 Check-in", "Restaurant"],
        feedback: [
          { user: "Rohan P.", rating: 4.7, comment: "Very clean rooms and very convenient for late night bus arrivals." }
        ]
      }
    ],
    seatMap: [
      { id: "L1", label: "L1", deck: "LOWER", type: "SLEEPER", price: 1450, status: "AVAILABLE" },
      { id: "L2", label: "L2", deck: "LOWER", type: "SLEEPER", price: 1450, status: "AVAILABLE" },
      { id: "L3", label: "L3", deck: "LOWER", type: "SLEEPER", price: 1450, status: "BOOKED" },
      { id: "L4", label: "L4", deck: "LOWER", type: "SLEEPER", price: 1450, status: "RESERVED_LADIES" },
      { id: "U1", label: "U1", deck: "UPPER", type: "SLEEPER", price: 1450, status: "AVAILABLE" },
      { id: "U2", label: "U2", deck: "UPPER", type: "SLEEPER", price: 1450, status: "AVAILABLE" },
      { id: "U3", label: "U3", deck: "UPPER", type: "SLEEPER", price: 1450, status: "AVAILABLE" },
      { id: "U4", label: "U4", deck: "UPPER", type: "SLEEPER", price: 1450, status: "BOOKED" }
    ]
  },
  {
    id: "place-2",
    sampleRequest: "Find an affordable bus from Vijayawada to Bengaluru.",
    origin: "Vijayawada",
    destination: "Bengaluru",
    budget: 2500,
    travelDate: "12 Oct 2026",
    passengers: 1,
    busType: "Sleeper",
    intent: {
      intentId: "demo-intent-place-2",
      originCity: "Vijayawada",
      destinationCity: "Bengaluru",
      origin: "Vijayawada",
      destination: "Bengaluru",
      travelDate: "12 Oct 2026",
      arrivalDeadline: "08:30 AM",
      maxBudget: 2500,
      maxBudgetINR: 2500,
      preferredMode: "Sleeper",
      coachPreference: "Sleeper",
      passengerCount: 1,
      minimumTransferMinutes: 45
    },
    searchResults: [
      {
        id: "demo-bus-201",
        operator: "Orange Tours & Travels",
        coachType: "AC Sleeper (2+1)",
        rating: 4.7,
        departureTime: "20:00",
        arrivalTime: "07:30",
        duration: "11h 30m",
        type: "DIRECT",
        totalFare: 1400,
        score: 95,
        recommendationReason: "Top Choice: Direct AC Sleeper under ₹2500 budget arriving early in Bengaluru.",
        feasibility: { isFeasible: true, violations: [] },
        legs: [
          {
            id: "leg-201",
            operator: { name: "Orange Tours & Travels" },
            vehicle: { model: "Volvo B11R Multi-Axle AC Sleeper" },
            originStop: { name: "Vijayawada PNBS", city: "Vijayawada" },
            destStop: { name: "Bengaluru Majestic", city: "Bengaluru" },
            departureTime: "20:00",
            arrivalTime: "07:30",
            coachType: "AC Sleeper",
            fare: 1400
          }
        ]
      },
      {
        id: "demo-bus-202",
        operator: "KSRTC (Airavat Club Class)",
        coachType: "AC Sleeper",
        rating: 4.8,
        departureTime: "21:30",
        arrivalTime: "08:00",
        duration: "10h 30m",
        type: "DIRECT",
        totalFare: 1250,
        score: 93,
        recommendationReason: "State RTC Volvo sleeper service with high punctuality rating.",
        feasibility: { isFeasible: true, violations: [] },
        legs: [
          {
            id: "leg-202",
            operator: { name: "KSRTC" },
            vehicle: { model: "Volvo B11R Airavat" },
            originStop: { name: "Vijayawada PNBS", city: "Vijayawada" },
            destStop: { name: "Bengaluru Majestic", city: "Bengaluru" },
            departureTime: "21:30",
            arrivalTime: "08:00",
            coachType: "AC Sleeper",
            fare: 1250
          }
        ]
      },
      {
        id: "demo-bus-203",
        operator: "Kaveri Travels",
        coachType: "AC Sleeper",
        rating: 4.5,
        departureTime: "19:30",
        arrivalTime: "06:45",
        duration: "11h 15m",
        type: "DIRECT",
        totalFare: 1800,
        score: 88,
        recommendationReason: "Early evening departure arriving early morning at Silk Board.",
        feasibility: { isFeasible: true, violations: [] },
        legs: [
          {
            id: "leg-203",
            operator: { name: "Kaveri Travels" },
            vehicle: { model: "Scania Metrolink AC Sleeper" },
            originStop: { name: "Vijayawada PNBS", city: "Vijayawada" },
            destStop: { name: "Bengaluru Majestic", city: "Bengaluru" },
            departureTime: "19:30",
            arrivalTime: "06:45",
            coachType: "AC Sleeper",
            fare: 1800
          }
        ]
      },
      {
        id: "demo-bus-204",
        operator: "VIP Ultra Executive",
        coachType: "Luxury Multi-Axle",
        rating: 4.9,
        departureTime: "22:00",
        arrivalTime: "09:30",
        duration: "11h 30m",
        type: "DIRECT",
        totalFare: 2800,
        score: 40,
        recommendationReason: "Constraint Violated: Exceeds maximum budget limit.",
        feasibility: { isFeasible: false, violations: ["Over Budget (₹2800 > ₹2500)"] },
        legs: [
          {
            id: "leg-204",
            operator: { name: "VIP Travels" },
            vehicle: { model: "Mercedes-Benz Multi-Axle" },
            originStop: { name: "Vijayawada PNBS", city: "Vijayawada" },
            destStop: { name: "Bengaluru Majestic", city: "Bengaluru" },
            departureTime: "22:00",
            arrivalTime: "09:30",
            coachType: "Luxury Multi-Axle",
            fare: 2800
          }
        ]
      }
    ],
    hotels: [
      {
        hotel_id: "HTL_DEMO_02",
        city_id: "CT_11",
        city_name: "Bengaluru",
        name: "Hotel Royal Orchid Central",
        name_te: "హోటల్ రాయల్ ఆర్కిడ్ సెంట్రల్ బెంగళూరు",
        lifespanYears: 9,
        rating: 4.5,
        totalReviews: 1670,
        location: "MG Road, Bengaluru",
        proximity: "1.5 km from Majestic KSRTC",
        pricePerNightINR: 2200,
        amenities: ["AC", "Free WiFi", "Gym", "Breakfast Included"],
        feedback: [
          { user: "Anand T.", rating: 4.5, comment: "Prime location near metro and Majestic bus stop." }
        ]
      }
    ],
    seatMap: [
      { id: "L1", label: "L1", deck: "LOWER", type: "SLEEPER", price: 1400, status: "AVAILABLE" },
      { id: "L2", label: "L2", deck: "LOWER", type: "SLEEPER", price: 1400, status: "AVAILABLE" },
      { id: "L3", label: "L3", deck: "LOWER", type: "SLEEPER", price: 1400, status: "AVAILABLE" },
      { id: "L4", label: "L4", deck: "LOWER", type: "SLEEPER", price: 1400, status: "BOOKED" },
      { id: "U1", label: "U1", deck: "UPPER", type: "SLEEPER", price: 1400, status: "AVAILABLE" },
      { id: "U2", label: "U2", deck: "UPPER", type: "SLEEPER", price: 1400, status: "AVAILABLE" },
      { id: "U3", label: "U3", deck: "UPPER", type: "SLEEPER", price: 1400, status: "RESERVED_LADIES" },
      { id: "U4", label: "U4", deck: "UPPER", type: "SLEEPER", price: 1400, status: "AVAILABLE" }
    ]
  },
  {
    id: "place-3",
    sampleRequest: "Find a bus from Guntur to Chennai and a nearby hotel.",
    origin: "Guntur",
    destination: "Chennai",
    budget: 3000,
    travelDate: "13 Oct 2026",
    passengers: 2,
    busType: "AC Seater",
    intent: {
      intentId: "demo-intent-place-3",
      originCity: "Guntur",
      destinationCity: "Chennai",
      origin: "Guntur",
      destination: "Chennai",
      travelDate: "13 Oct 2026",
      arrivalDeadline: "09:00 AM",
      maxBudget: 3000,
      maxBudgetINR: 3000,
      preferredMode: "AC Seater",
      coachPreference: "AC Seater",
      passengerCount: 2,
      minimumTransferMinutes: 45
    },
    searchResults: [
      {
        id: "demo-bus-301",
        operator: "APSRTC Super Luxury",
        coachType: "AC Seater (2+2)",
        rating: 4.6,
        departureTime: "22:00",
        arrivalTime: "06:30",
        duration: "8h 30m",
        type: "DIRECT",
        totalFare: 1200,
        score: 94,
        recommendationReason: "Top Choice: Direct AC Seater with early arrival in Chennai, total ₹2400 for 2 seats.",
        feasibility: { isFeasible: true, violations: [] },
        legs: [
          {
            id: "leg-301",
            operator: { name: "APSRTC Super Luxury" },
            vehicle: { model: "Eicher AC Seater 2+2" },
            originStop: { name: "Guntur NTR Bus Station", city: "Guntur" },
            destStop: { name: "Chennai CMBT Koyambedu", city: "Chennai" },
            departureTime: "22:00",
            arrivalTime: "06:30",
            coachType: "AC Seater",
            fare: 1200
          }
        ]
      },
      {
        id: "demo-bus-302",
        operator: "Kaveri Travels Express",
        coachType: "AC Semi-Sleeper",
        rating: 4.7,
        departureTime: "21:15",
        arrivalTime: "05:45",
        duration: "8h 30m",
        type: "DIRECT",
        totalFare: 1400,
        score: 92,
        recommendationReason: "Comfortable semi-sleeper seats with charging ports and water bottles.",
        feasibility: { isFeasible: true, violations: [] },
        legs: [
          {
            id: "leg-302",
            operator: { name: "Kaveri Travels" },
            vehicle: { model: "Volvo B9R Semi-Sleeper" },
            originStop: { name: "Guntur NTR Bus Station", city: "Guntur" },
            destStop: { name: "Chennai CMBT Koyambedu", city: "Chennai" },
            departureTime: "21:15",
            arrivalTime: "05:45",
            coachType: "AC Semi-Sleeper",
            fare: 1400
          }
        ]
      },
      {
        id: "demo-bus-303",
        operator: "Garuda Express",
        coachType: "AC Seater",
        rating: 4.4,
        departureTime: "23:00",
        arrivalTime: "07:30",
        duration: "8h 30m",
        type: "DIRECT",
        totalFare: 1350,
        score: 87,
        recommendationReason: "Late night departure arriving before 8 AM at Koyambedu.",
        feasibility: { isFeasible: true, violations: [] },
        legs: [
          {
            id: "leg-303",
            operator: { name: "Garuda Express" },
            vehicle: { model: "Scania AC Seater" },
            originStop: { name: "Guntur NTR Bus Station", city: "Guntur" },
            destStop: { name: "Chennai CMBT Koyambedu", city: "Chennai" },
            departureTime: "23:00",
            arrivalTime: "07:30",
            coachType: "AC Seater",
            fare: 1350
          }
        ]
      },
      {
        id: "demo-bus-304",
        operator: "Royal Highlines Sleeper",
        coachType: "Luxury Multi-Axle",
        rating: 4.8,
        departureTime: "23:45",
        arrivalTime: "10:00",
        duration: "10h 15m",
        type: "DIRECT",
        totalFare: 3400,
        score: 35,
        recommendationReason: "Constraint Violated: Exceeds maximum budget limit.",
        feasibility: { isFeasible: false, violations: ["Over Budget (₹3400 > ₹3000)", "Arrives past 9 AM deadline"] },
        legs: [
          {
            id: "leg-304",
            operator: { name: "Royal Highlines" },
            vehicle: { model: "Volvo B11R AC Sleeper" },
            originStop: { name: "Guntur NTR Bus Station", city: "Guntur" },
            destStop: { name: "Chennai CMBT Koyambedu", city: "Chennai" },
            departureTime: "23:45",
            arrivalTime: "10:00",
            coachType: "Luxury Multi-Axle",
            fare: 3400
          }
        ]
      }
    ],
    hotels: [
      {
        hotel_id: "HTL_DEMO_03",
        city_id: "CT_12",
        city_name: "Chennai",
        name: "Radisson Blu Hotel CMBT",
        name_te: "రాడిసన్ బ్లూ హోటల్ చెన్నై",
        lifespanYears: 7,
        rating: 4.6,
        totalReviews: 1320,
        location: "GST Road, St. Thomas Mount, Chennai",
        proximity: "900m from Koyambedu CMBT",
        pricePerNightINR: 2800,
        amenities: ["AC", "Free WiFi", "Spa", "Breakfast Included"],
        feedback: [
          { user: "Priya S.", rating: 4.6, comment: "Extremely polite staff and plush bedding." }
        ]
      }
    ],
    seatMap: [
      { id: "S1", label: "S1", deck: "LOWER", type: "SEATER", price: 1200, status: "AVAILABLE" },
      { id: "S2", label: "S2", deck: "LOWER", type: "SEATER", price: 1200, status: "AVAILABLE" },
      { id: "S3", label: "S3", deck: "LOWER", type: "SEATER", price: 1200, status: "AVAILABLE" },
      { id: "S4", label: "S4", deck: "LOWER", type: "SEATER", price: 1200, status: "BOOKED" },
      { id: "S5", label: "S5", deck: "LOWER", type: "SEATER", price: 1200, status: "AVAILABLE" },
      { id: "S6", label: "S6", deck: "LOWER", type: "SEATER", price: 1200, status: "AVAILABLE" },
      { id: "S7", label: "S7", deck: "LOWER", type: "SEATER", price: 1200, status: "AVAILABLE" },
      { id: "S8", label: "S8", deck: "LOWER", type: "SEATER", price: 1200, status: "BOOKED" }
    ]
  }
];
