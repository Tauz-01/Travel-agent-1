## Purpose

Provides end-to-end voice interaction capabilities using audio recording and Speech-to-Text (STT) transcription, alongside direct user flow progression from Screen 1 intake directly to Screen 2 parameter review.

## ADDED Requirements

### Requirement: Real-time Audio Voice Recording
The frontend system SHALL capture real voice audio from the microphone when the voice action is triggered by the user and stream or send the audio payload for processing.

#### Scenario: Successful Voice Input Capture
- **WHEN** the user taps the microphone icon on Screen 1
- **THEN** the system begins recording audio and shows an active recording visual indicator with a stop/submit button

#### Scenario: Voice Recording Cancellation
- **WHEN** the user cancels active audio recording
- **THEN** the system discards the recorded audio snippet and returns the interface to the default composer state

### Requirement: Audio Speech-to-Text Transcription
The backend system SHALL expose an endpoint to accept audio data, forward it to an AI STT model (such as Groq Whisper or speech-to-text service), and return the transcribed text along with language identification.

#### Scenario: Audio Transcription Success
- **WHEN** audio data is submitted to `/api/v1/voice/stt`
- **THEN** the backend processes the audio with the STT engine and returns the text transcript in JSON format

#### Scenario: Audio Transcription Fallback
- **WHEN** the external STT service is unavailable or audio is unparseable
- **THEN** the system provides a clear error response or fallback default transcription prompt without crashing

### Requirement: Direct Screen 1 to Screen 2 Navigation
The mobile application SHALL automatically transition from Screen 1 (Conversational Intake) directly to Screen 2 (Review Extracted Trip) immediately upon receiving extracted trip intent parameters from the backend, displaying a loading state during execution.

#### Scenario: Automated Navigation on Text Input
- **WHEN** the user submits a text query on Screen 1
- **THEN** the application displays a loading overlay, extracts the trip intent via backend API, and navigates directly to Screen 2 with pre-populated fields

#### Scenario: Automated Navigation on Voice Input
- **WHEN** voice audio transcription completes and intent extraction succeeds
- **THEN** the application automatically proceeds to Screen 2 without requiring manual inline card taps
