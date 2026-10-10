## Why

The current React Native frontend uses a simulated mock alert modal for microphone voice input on Screen 1 and requires an extra manual tap on an inline card to transition to Screen 2. To align with the target architecture and provide a seamless voice concierge experience:
1. Real audio recording must be captured using Expo AV in React Native and processed by an actual Speech-to-Text (STT) service (e.g. Groq Whisper / backend STT service or device native STT fallback) so speech in English and Telugu is transcribed reliably.
2. The UI flow must automatically show a loading state during transcription and intent extraction, navigating directly from Screen 1 to Screen 2 (Review Extracted Trip Intent) upon receiving the structured travel intent response.

## What Changes

- **Audio Recording & STT Pipeline**: Add real microphone recording capability to React Native using `expo-av` (or `expo-speech-recognition` / Web Speech API for web/Expo Go) and connect it to a backend audio STT endpoint `/api/v1/voice/stt` utilizing Groq Whisper (`whisper-large-v3-turbo`) or Speech-to-Text processing.
- **Screen 1 to Screen 2 Auto-Navigation**: Modify Screen 1 and `App.js` so that when text or voice intake is submitted, the app displays a loading overlay, extracts the trip intent via the Spring Boot backend, and immediately navigates to Screen 2 (Review Extracted Trip) without requiring an intermediate inline card click.
- **Backend Voice Endpoint**: Add `/api/v1/voice/stt` endpoint in `TripController` or `VoiceController` to receive base64/audio files and return transcribed text using `GroqApiClient`.

## Capabilities

### New Capabilities
- `voice-stt-concierge`: Audio recording, Speech-to-Text transcription, and seamless conversational trip intake navigation from Screen 1 to Screen 2.

### Modified Capabilities
None.

## Impact

- `frontend/package.json`: Add `expo-av` (or `expo-speech-recognition` / `react-native-voice` compatibility layer).
- `frontend/src/Screen1ConversationalIntake.js`: Replace Alert simulated microphone modal with real recording start/stop state and auto-proceed callback.
- `frontend/App.js`: Update `handleExtractTrip` to transition directly to `currentStage = 2` upon success.
- `backend/src/main/java/com/roamagent/client/GroqApiClient.java`: Add Groq Whisper audio transcription API call (`/v1/audio/transcriptions`).
- `backend/src/main/java/com/roamagent/controller/TripController.java`: Add `/api/v1/voice/stt` endpoint for audio handling.
