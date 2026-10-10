## 1. Backend Voice STT & AI Integration

- [ ] 1.1 Add Groq Whisper audio transcription method to `GroqApiClient.java` hitting `/v1/audio/transcriptions` and verify API execution with test key or fallback payload
- [ ] 1.2 Add `/api/v1/voice/stt` endpoint in `TripController.java` to handle audio requests and return `{ transcript, language }`
- [ ] 1.3 Enhance `IntakeAgent.java` prompt context to supply canonical city names (`Visakhapatnam`, `Vijayawada`, `Hyderabad`) and current travel dates to Groq LLM

## 2. Frontend Voice Recording & API Service

- [ ] 2.1 Add `expo-av` dependency to `frontend/package.json` for React Native microphone audio recording
- [ ] 2.2 Add `sendVoiceAudio` API method in `frontend/src/services/api.js` pointing to `/api/v1/voice/stt`
- [ ] 2.3 Implement audio recording, stop, and transcription handling in `Screen1ConversationalIntake.js`

## 3. Screen 1 Auto-Navigation & Visible Loading Overlays

- [ ] 3.1 Update `Screen1ConversationalIntake.js` so submitting text or voice directly triggers `onExtractTrip` without requiring an intermediate inline card tap
- [ ] 3.2 Update `App.js` `handleExtractTrip` to set active step state ("🤖 Analyzing query with Groq LLM...") and auto-navigate directly to Stage 2 (`setCurrentStage(2)`) upon receiving the extracted draft
- [ ] 3.3 Create a prominent, animated AI Processing Loading Overlay in `App.js` and `Screen1ConversationalIntake.js` that clearly communicates AI progress during backend API execution
