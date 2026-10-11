package com.roamagent.agent;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.datatype.jsr310.JavaTimeModule;
import com.roamagent.client.GroqApiClient;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.stereotype.Component;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.time.ZoneId;
import java.util.List;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

@Component
public class IntakeAgent {

    private final GroqApiClient groqApiClient;
    private final ObjectMapper objectMapper;

    public IntakeAgent(GroqApiClient groqApiClient) {
        this.groqApiClient = groqApiClient;
        this.objectMapper = new ObjectMapper();
        this.objectMapper.registerModule(new JavaTimeModule());
    }

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    @JsonIgnoreProperties(ignoreUnknown = true)
    public static class ExtractedDraft {
        private String intentType; // BUS, HOTEL, COMBINED, UNKNOWN
        private String originCity;
        private String destinationCity;
        private String locality;
        private LocalDate travelDate;
        private LocalDateTime arrivalDeadline;
        private BigDecimal maxBusBudget;
        private String preferredBusMode;
        private Integer passengerCount;

        // Hotel fields
        private String hotelDestination;
        private LocalDate checkInDate;
        private LocalDate checkOutDate;
        private Integer stayNights;
        private Integer roomCount;
        private BigDecimal maxHotelBudgetPerNight;
        private BigDecimal maxHotelTotalBudget;
        private Double minHotelRating;
        private List<String> preferredAmenities;
    }

    public ExtractedDraft extractIntent(String rawInput) {
        if (rawInput == null || rawInput.trim().isEmpty()) {
            return ExtractedDraft.builder()
                    .intentType("UNKNOWN")
                    .passengerCount(1)
                    .build();
        }

        LocalDate today = LocalDate.now(ZoneId.of("Asia/Kolkata"));
        LocalDate tomorrow = today.plusDays(1);

        String systemPrompt = "You are RoamAgent travel intake AI parser. Extract structured travel request parameters from user natural language into strict JSON.\n" +
                "Date context: Today is " + today + " (Asia/Kolkata). Tomorrow is " + tomorrow + ".\n" +
                "Output ONLY a valid JSON object matching these fields:\n" +
                "- intentType: \"BUS\", \"HOTEL\", \"COMBINED\", or \"UNKNOWN\"\n" +
                "- originCity: string or null\n" +
                "- destinationCity: string or null\n" +
                "- locality: string (e.g. Gachibowli, Benz Circle) or null\n" +
                "- travelDate: string YYYY-MM-DD or null\n" +
                "- arrivalDeadline: string YYYY-MM-DDTHH:mm:ss or null\n" +
                "- maxBusBudget: number or null\n" +
                "- preferredBusMode: string (\"SLEEPER\", \"SEATER\", \"AC\", \"NON_AC\") or null\n" +
                "- passengerCount: integer (default 1)\n" +
                "- hotelDestination: string or null\n" +
                "- checkInDate: string YYYY-MM-DD or null\n" +
                "- checkOutDate: string YYYY-MM-DD or null\n" +
                "- stayNights: integer or null\n" +
                "- roomCount: integer or null\n" +
                "- maxHotelBudgetPerNight: number or null\n" +
                "- maxHotelTotalBudget: number or null\n" +
                "- minHotelRating: number or null\n" +
                "- preferredAmenities: array of strings or null\n" +
                "Do NOT add markdown blocks or conversational text. Output pure JSON.";

        String response = groqApiClient.generateChatCompletion(systemPrompt, rawInput);

        if (response != null) {
            try {
                String cleanJson = response.trim();
                if (cleanJson.startsWith("```json")) {
                    cleanJson = cleanJson.substring(7);
                }
                if (cleanJson.startsWith("```")) {
                    cleanJson = cleanJson.substring(3);
                }
                if (cleanJson.endsWith("```")) {
                    cleanJson = cleanJson.substring(0, cleanJson.length() - 3);
                }
                cleanJson = cleanJson.trim();

                ExtractedDraft parsed = objectMapper.readValue(cleanJson, ExtractedDraft.class);
                if (parsed != null) {
                    if (parsed.getPassengerCount() == null) parsed.setPassengerCount(1);
                    return parsed;
                }
            } catch (Exception e) {
                // Parse failure -> fallback
            }
        }

        // Dynamic Pattern-Based Parser Fallback
        return fallbackPatternExtraction(rawInput, today, tomorrow);
    }

    private ExtractedDraft fallbackPatternExtraction(String text, LocalDate today, LocalDate tomorrow) {
        String lower = text.toLowerCase();

        boolean hasBusWord = lower.contains("bus") || lower.contains("sleeper") || lower.contains("seater") || lower.contains("reach");
        boolean hasHotelWord = lower.contains("hotel") || lower.contains("stay") || lower.contains("room") || lower.contains("night");

        String intentType = "BUS";
        if (hasBusWord && hasHotelWord) {
            intentType = "COMBINED";
        } else if (hasHotelWord) {
            intentType = "HOTEL";
        }

        // Origin and Destination parsing with common city aliases
        String origin = null;
        String dest = null;

        if (lower.contains("vizag") || lower.contains("visakhapatnam") || lower.contains("vskp") || lower.contains("viag")) origin = "Visakhapatnam";
        else if (lower.contains("vijayawada") || lower.contains("bza")) origin = "Vijayawada";
        else if (lower.contains("tirupati") || lower.contains("tpty")) origin = "Tirupati";
        else if (lower.contains("guntur")) origin = "Guntur";

        if (lower.contains("hyderabad") || lower.contains("hyd") || lower.contains("secunderabad")) dest = "Hyderabad";
        else if (lower.contains("bengaluru") || lower.contains("bangalore") || lower.contains("blr") || lower.contains("banglore")) dest = "Bengaluru";
        else if (lower.contains("chennai") || lower.contains("maa")) dest = "Chennai";

        // Locality
        String locality = null;
        if (lower.contains("gachibowli")) locality = "Gachibowli";
        else if (lower.contains("hitec")) locality = "HITEC City";
        else if (lower.contains("benz circle")) locality = "Benz Circle";

        // Travel date parsing for specific months e.g. "16october" or "16 october"
        LocalDate travelDate = null;
        if (lower.contains("tomorrow") || lower.contains("రేపు")) {
            travelDate = tomorrow;
        } else if (lower.contains("today")) {
            travelDate = today;
        } else {
            Matcher dateMatcher = Pattern.compile("([0-9]{1,2})\\s*(jan|feb|mar|apr|may|jun|jul|aug|sep|oct|nov|dec|january|february|march|april|may|june|july|august|september|october|november|december)").matcher(lower);
            if (dateMatcher.find()) {
                try {
                    int day = Integer.parseInt(dateMatcher.group(1));
                    String monthStr = dateMatcher.group(2).substring(0, 3);
                    int month = switch (monthStr) {
                        case "jan" -> 1;
                        case "feb" -> 2;
                        case "mar" -> 3;
                        case "apr" -> 4;
                        case "may" -> 5;
                        case "jun" -> 6;
                        case "jul" -> 7;
                        case "aug" -> 8;
                        case "sep" -> 9;
                        case "oct" -> 10;
                        case "nov" -> 11;
                        case "dec" -> 12;
                        default -> today.getMonthValue();
                    };
                    int year = today.getYear();
                    if (month < today.getMonthValue()) year++;
                    travelDate = LocalDate.of(year, month, day);
                } catch (Exception ignored) {}
            }
        }

        // Deadline e.g. "before 9 AM"
        LocalDateTime deadline = null;
        if (travelDate != null && (lower.contains("before 9 am") || lower.contains("9 am"))) {
            deadline = LocalDateTime.of(travelDate, LocalTime.of(9, 0));
        }

        // Bus budget e.g. "under budget 1000", "1500", "₹1,500"
        BigDecimal busBudget = null;
        Matcher busBudgetMatcher = Pattern.compile("(?:budget|under|rs\\.?|rupees|₹|bus)\\s*:?\\s*([0-9]{3,5})").matcher(lower);
        if (busBudgetMatcher.find()) {
            try {
                busBudget = new BigDecimal(busBudgetMatcher.group(1));
            } catch (Exception ignored) {}
        }

        // Hotel budget per night
        BigDecimal hotelBudgetNight = null;
        Matcher hotelBudgetMatcher = Pattern.compile("(?:hotel|night|stay).*?(?:₹|rs\\.?|rupees)?\\s*([0-9]{3,5})").matcher(lower);
        if (hotelBudgetMatcher.find()) {
            try {
                hotelBudgetNight = new BigDecimal(hotelBudgetMatcher.group(1));
            } catch (Exception ignored) {}
        }

        // Stay nights
        Integer nights = null;
        if (lower.contains("two nights") || lower.contains("2 nights")) nights = 2;
        else if (lower.contains("one night") || lower.contains("1 night")) nights = 1;

        String busMode = lower.contains("sleeper") ? "SLEEPER" : (lower.contains("ac") ? "AC" : null);

        return ExtractedDraft.builder()
                .intentType(intentType)
                .originCity(origin)
                .destinationCity(dest)
                .locality(locality)
                .travelDate(travelDate)
                .arrivalDeadline(deadline)
                .maxBusBudget(busBudget)
                .preferredBusMode(busMode)
                .passengerCount(1)
                .hotelDestination(dest != null ? dest : locality)
                .checkInDate(travelDate)
                .stayNights(nights)
                .maxHotelBudgetPerNight(hotelBudgetNight)
                .build();
    }
}
