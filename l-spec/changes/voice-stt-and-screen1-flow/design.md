## Context

See `proposal.md` and `specs/voice-stt-concierge/spec.md`. Currently, Screen 1 uses a mock voice alert with simulated hardcoded text and requires a manual button tap to proceed to Screen 2. Furthermore, loading states during backend API communications are subtle or hidden, leaving the user unaware of AI processing status.

## Goals / Non-Goals

**Goals:**
- Provide full voice recording in React Native with audio STT processing using Groq Whisper (`whisper-large-v3-turbo`) via a dedicated backend endpoint `/api/v1/voice/stt` (with Web Speech Recognition / Speech API client fallback).
- Enable prominent, full-screen AI loading overlays and state indicators ("🎙️ Transcribing audio with Groq Whisper...", "🤖 Extracting travel intent with Groq AI...", "🚌 Searching deterministic route graph...") so AI processing is explicitly visible to the user at every step.
- Automatically transition from Screen 1 directly to Screen 2 (Review Extracted Trip) as soon as intent extraction succeeds.

**Non-Goals:**
- Offline native mobile C++ Whisper model compilation (we rely on lightweight HTTP base64/audio upload to backend or Web Speech API).

## Decisions

1. **Backend Groq Whisper Integration**:
   - Add `transcribeAudio(byte[] audioBytes, String filename)` in `GroqApiClient.java` hitting `https://api.groq.com/openai/v1/audio/transcriptions` with model `whisper-large-v3-turbo`.
   - Expose `POST /api/v1/voice/stt` in Spring Boot `TripController.java` to handle base64 audio requests and return `{ "transcript": "...", "language": "en" }`.
   
2. **Frontend Recording & Web Speech / expo-av Fallback**:
   - In React Native (`Screen1ConversationalIntake.js`), use `expo-av` or `expo-speech-recognition` / Web Speech API (`webkitSpeechRecognition`) depending on platform/environment to record audio.
   - Send recorded audio to `/api/v1/voice/stt` for backend Groq Whisper processing. If Speech API natively transcribes in web/expo client, forward the transcript directly to `/api/v1/trip-intent/extract`.

3. **Prominent Loading States & Screen Flow**:
   - Update `App.js` and `Screen1ConversationalIntake.js` to render a centered, animated AI Processing modal overlay with step messages when `isLoading` is true.
   - Automatically trigger `setCurrentStage(2)` upon receiving extracted intent from `sendChatMessage`.

## Risks / Trade-offs

- [Audio permissions on mobile] → Request microphone permission via Expo permissions API on first tap; show clear prompt if denied.
- [Network latency for audio upload] → Show immediate "Recording completed, transcribing with Groq AI..." status overlay.
