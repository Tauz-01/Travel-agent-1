import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
  Alert
} from 'react-native';
import { AudioModule, useAudioRecorder, RecordingPresets } from 'expo-audio';
import { theme } from './theme';
import { sendChatMessage, sendVoiceAudio } from './services/api';

export function Screen1ConversationalIntake({ onExtractTrip, language = 'en', onToggleLanguage = () => {}, currentScenario }) {
  const isTe = language === 'te';
  const [inputText, setInputText] = useState('');
  const [messages, setMessages] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [loadingStepText, setLoadingStepText] = useState('');
  const [isRecording, setIsRecording] = useState(false);
  const [recording, setRecording] = useState(null);
  const [errorMsg, setErrorMsg] = useState(null);
  const scrollViewRef = useRef(null);

  const activeSampleRequest = currentScenario?.sampleRequest || 'Find a sleeper bus from Vizag to Hyderabad under ₹2000.';

  const handleSend = async (customPrompt) => {
    const promptToSend = customPrompt || inputText || activeSampleRequest;
    if (!promptToSend.trim()) return;

    setErrorMsg(null);
    const userMsg = {
      id: Date.now().toString(),
      sender: 'user',
      text: promptToSend.trim(),
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages(prev => [...prev, userMsg]);
    setInputText('');
    
    setIsLoading(true);
    setLoadingStepText(isTe ? '🤖 డెమో మోడ్: ప్రీడైఫైన్డ్ సినారియో రన్ చేస్తోంది...' : '🤖 Demo mode: Loading predefined scenario request...');

    try {
      await onExtractTrip(promptToSend.trim());
    } catch (err) {
      setIsLoading(false);
      setErrorMsg(isTe ? 'అభ్యర్థన పంపడంలో విఫలమైంది.' : 'Failed to process demo request.');
    }
  };

  const startVoiceRecording = async () => {
    try {
      setErrorMsg(null);
      setIsRecording(true);
    } catch (err) {
      setIsRecording(true);
    }
  };

  const stopVoiceRecordingAndSubmit = async () => {
    setIsRecording(false);
    setInputText(activeSampleRequest);
    await handleSend(activeSampleRequest);
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 0}
    >
      {/* Light-Theme Header Bar */}
      <View style={styles.topBar}>
        <Text style={styles.brandTitle}>RoamAgent</Text>

        <TouchableOpacity
          style={styles.controlButton}
          onPress={onToggleLanguage}
          accessibilityLabel="Controls and Language"
        >
          <Text style={styles.controlIconText}>⚙️</Text>
        </TouchableOpacity>
      </View>

      {/* Main Conversation or Landing State */}
      {messages.length === 0 ? (
        /* Empty / Landing Page State with Suggestion Pills */
        <View style={styles.landingCenterContainer}>
          <Text style={styles.landingTitle}>
            {isTe ? 'ఈరోజు ఎక్కడికి వెళ్లాలి?' : 'Where to today?'}
          </Text>
          <Text style={styles.landingSubtitle}>
            {isTe ? 'లభ్యమైన ఉదాహరణ మార్గాన్ని ఎంచుకోండి లేదా టైప్ చేయండి:' : 'Tap a supported route or type your query:'}
          </Text>

          {/* Quick Route Suggestion Pills matching DB Mock Data */}
          <View style={styles.suggestionPillsContainer}>
            <TouchableOpacity
              style={styles.suggestionPill}
              onPress={() => handleSend('I need an AC sleeper bus from Vizag to Hyderabad tomorrow under 1500')}
            >
              <Text style={styles.suggestionPillText}>🚌 Vizag ➔ Hyderabad (₹1,500)</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.suggestionPill}
              onPress={() => handleSend('Find a hotel in Gachibowli Hyderabad under 2000 per night for 2 nights')}
            >
              <Text style={styles.suggestionPillText}>🏨 Hotel @ Gachibowli, Hyd</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.suggestionPill}
              onPress={() => handleSend('Bus from Vijayawada to Hyderabad under 1000')}
            >
              <Text style={styles.suggestionPillText}>🚌 Vijayawada ➔ Hyderabad</Text>
            </TouchableOpacity>
          </View>
        </View>
      ) : (
        /* Message Stream */
        <ScrollView
          ref={scrollViewRef}
          style={styles.scrollArea}
          contentContainerStyle={styles.scrollContent}
          onContentSizeChange={() => scrollViewRef.current?.scrollToEnd({ animated: true })}
        >
          <View style={styles.messagesList}>
            {messages.map((msg) => (
              <View
                key={msg.id}
                style={[
                  styles.msgWrapper,
                  msg.sender === 'user' ? styles.userMsgWrapper : styles.assistantMsgWrapper
                ]}
              >
                {msg.sender === 'assistant' && (
                  <View style={styles.avatarCircle}>
                    <Text style={styles.avatarText}>🤖</Text>
                  </View>
                )}

                <View
                  style={[
                    styles.msgBubble,
                    msg.sender === 'user' ? styles.userBubble : styles.assistantBubble
                  ]}
                >
                  <Text
                    style={[
                      styles.msgText,
                      msg.sender === 'user' ? styles.userMsgText : styles.assistantMsgText
                    ]}
                  >
                    {msg.text}
                  </Text>

                  {/* Extracted Travel Intent Card */}
                  {msg.sender === 'assistant' && msg.intent && (
                    <View style={styles.intentCardContainer}>
                      <View style={styles.intentSummaryRow}>
                        <Text style={styles.intentLabel}>
                          📍 {msg.intent.origin} ➔ {msg.intent.destination}
                        </Text>
                        <Text style={styles.intentSub}>
                          🕒 Before {msg.intent.arrivalDeadline} AM • Max ₹{msg.intent.maxBudgetINR}
                        </Text>
                      </View>

                      <TouchableOpacity
                        style={styles.reviewTripBtn}
                        onPress={() => onExtractTrip(msg.intent.rawInput || msg.text)}
                      >
                        <Text style={styles.reviewTripBtnText}>
                          {isTe ? 'ప్రయాణ వివరాలు సమీక్షించు ➔' : 'Review & Search Routes ➔'}
                        </Text>
                      </TouchableOpacity>
                    </View>
                  )}

                  <Text style={styles.msgTime}>{msg.timestamp}</Text>
                </View>
              </View>
            ))}

            {isLoading && (
              <View style={styles.loadingWrapper}>
                <View style={styles.avatarCircle}>
                  <Text style={styles.avatarText}>🤖</Text>
                </View>
                <View style={styles.loadingBubble}>
                  <ActivityIndicator size="small" color="#0284C7" />
                  <Text style={styles.loadingText}>
                    {loadingStepText || (isTe ? 'సమాధానం ప్లాన్ చేస్తోంది...' : 'Processing request via Groq AI...')}
                  </Text>
                </View>
              </View>
            )}

            {errorMsg && (
              <View style={styles.errorBox}>
                <Text style={styles.errorText}>{errorMsg}</Text>
                <TouchableOpacity
                  style={styles.retryBtn}
                  onPress={() => handleSend(messages[messages.length - 1]?.text)}
                >
                  <Text style={styles.retryBtnText}>{isTe ? 'మళ్ళీ ప్రయత్నించు' : 'Retry'}</Text>
                </TouchableOpacity>
              </View>
            )}
          </View>
        </ScrollView>
      )}

      {/* Bottom Message Composer */}
      <View style={styles.composerContainer}>
        {/* Sample Scenario Request Prompt Box */}
        <TouchableOpacity
          style={styles.sampleRequestPromptBox}
          onPress={() => handleSend(activeSampleRequest)}
        >
          <Text style={styles.sampleRequestLabel}>
            📋 {isTe ? 'ప్రస్తుత సిమ్యులేటెడ్ అభ్యర్థన (యాక్టివ్ సినారియో):' : 'Current Active Demo Request:'}
          </Text>
          <Text style={styles.sampleRequestText}>"{activeSampleRequest}"</Text>
        </TouchableOpacity>

        <View style={styles.inputCardPill}>
          <TextInput
            style={styles.input}
            multiline
            placeholder={isTe ? 'సిమ్యులేటెడ్ టెక్స్ట్ అభ్యర్థన...' : 'Text demo control (loads active scenario)...'}
            placeholderTextColor="#64748B"
            value={inputText}
            onChangeText={setInputText}
            onSubmitEditing={() => handleSend(inputText || activeSampleRequest)}
          />

          <View style={styles.actionButtonsRow}>
            <TouchableOpacity
              style={styles.sendButtonDark}
              onPress={() => handleSend(inputText || activeSampleRequest)}
              accessibilityLabel="Text demo control"
            >
              <Text style={styles.sendButtonText}>➔</Text>
            </TouchableOpacity>

            {/* Microphone / Voice Demo Control */}
            <TouchableOpacity
              style={[
                styles.micButtonOrange,
                isRecording && styles.micButtonRecordingActive
              ]}
              onPress={isRecording ? stopVoiceRecordingAndSubmit : startVoiceRecording}
              accessibilityLabel="Voice demo control"
            >
              <Text style={styles.micIconText}>{isRecording ? '⏹️' : '🎙️'}</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Status notice */}
        <Text style={styles.tagline}>
          Demo mode: Press 🎙️ or ➔ to load scenario.
        </Text>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC', // Pure clean light-theme canvas
  },
  topBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingTop: Platform.OS === 'ios' ? 20 : 16,
    paddingBottom: 16,
    backgroundColor: '#F8FAFC',
  },
  brandTitle: {
    fontSize: 22,
    fontWeight: '700',
    color: '#0F172A',
    letterSpacing: -0.3,
  },
  controlButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#0F172A',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  controlIconText: {
    fontSize: 18,
  },
  landingCenterContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 24,
  },
  landingTitle: {
    fontSize: 32,
    fontWeight: '700',
    color: '#0F172A',
    textAlign: 'center',
    letterSpacing: -0.5,
    marginBottom: 8,
  },
  landingSubtitle: {
    fontSize: 16,
    fontWeight: '400',
    color: '#64748B',
    textAlign: 'center',
  },
  scrollArea: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingVertical: 16,
    flexGrow: 1,
  },
  messagesList: {
    gap: 16,
  },
  msgWrapper: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    gap: 8,
    marginVertical: 4,
  },
  userMsgWrapper: {
    justifyContent: 'flex-end',
  },
  assistantMsgWrapper: {
    justifyContent: 'flex-start',
  },
  avatarCircle: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#E0F2FE',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 4,
  },
  avatarText: {
    fontSize: 16,
  },
  msgBubble: {
    maxWidth: '82%',
    borderRadius: 18,
    padding: 14,
  },
  userBubble: {
    backgroundColor: '#0F172A',
    borderBottomRightRadius: 4,
  },
  assistantBubble: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderBottomLeftRadius: 4,
  },
  msgText: {
    fontSize: 14,
    lineHeight: 20,
  },
  userMsgText: {
    color: '#FFFFFF',
  },
  assistantMsgText: {
    color: '#0F172A',
  },
  intentCardContainer: {
    marginTop: 12,
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: '#E2E8F0',
  },
  intentSummaryRow: {
    backgroundColor: '#F8FAFC',
    padding: 10,
    borderRadius: 8,
    marginBottom: 8,
  },
  intentLabel: {
    fontSize: 13,
    fontWeight: '700',
    color: '#0F172A',
  },
  intentSub: {
    fontSize: 11,
    color: '#64748B',
    marginTop: 2,
  },
  reviewTripBtn: {
    backgroundColor: '#0284C7',
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  reviewTripBtnText: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '700',
  },
  msgTime: {
    fontSize: 10,
    color: '#94A3B8',
    marginTop: 4,
    textAlign: 'right',
  },
  loadingWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  loadingBubble: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    padding: 12,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    gap: 8,
  },
  loadingText: {
    fontSize: 12,
    color: '#64748B',
  },
  errorBox: {
    backgroundColor: '#FEF2F2',
    borderWidth: 1,
    borderColor: '#FCA5A5',
    padding: 12,
    borderRadius: 12,
    alignItems: 'center',
    gap: 8,
  },
  errorText: {
    fontSize: 12,
    color: '#991B1B',
  },
  retryBtn: {
    backgroundColor: '#DC2626',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
  },
  retryBtnText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '600',
  },
  composerContainer: {
    paddingHorizontal: 20,
    paddingTop: 8,
    paddingBottom: Platform.OS === 'ios' ? 24 : 16,
    backgroundColor: '#F8FAFC',
  },
  inputCardPill: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#CBD5E1',
    paddingLeft: 16,
    paddingRight: 8,
    paddingVertical: 6,
    minHeight: 56,
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: '#0F172A',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  input: {
    flex: 1,
    fontSize: 15,
    color: '#0F172A',
    maxHeight: 100,
    paddingRight: 8,
  },
  actionButtonsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  sendButtonDark: {
    width: 40,
    height: 40,
    borderRadius: 14,
    backgroundColor: '#0F172A',
    justifyContent: 'center',
    alignItems: 'center',
  },
  sendButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '700',
  },
  micButtonOrange: {
    width: 44,
    height: 44,
    borderRadius: 14,
    backgroundColor: '#EA580C', // Vibrant orange contrast matching reference
    justifyContent: 'center',
    alignItems: 'center',
  },
  micButtonRecordingActive: {
    backgroundColor: '#DC2626', // Red pulsating state during recording
    borderWidth: 2,
    borderColor: '#FECACA',
  },
  micIconText: {
    fontSize: 18,
  },
  tagline: {
    fontSize: 12,
    color: '#64748B',
    textAlign: 'center',
    marginTop: 12,
  },
  suggestionPillsContainer: {
    marginTop: 20,
    gap: 10,
    width: '100%',
    alignItems: 'center',
  },
  suggestionPill: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1.5,
    borderColor: '#38BDF8',
    borderRadius: 20,
    paddingVertical: 10,
    paddingHorizontal: 16,
    width: '90%',
    alignItems: 'center',
    shadowColor: '#0284C7',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  suggestionPillText: {
    color: '#0369A1',
    fontSize: 13,
    fontWeight: '700',
  },
  sampleRequestPromptBox: {
    backgroundColor: '#EFF6FF',
    borderWidth: 1,
    borderColor: '#BFDBFE',
    borderRadius: 12,
    padding: 10,
    marginBottom: 8,
  },
  sampleRequestLabel: {
    fontSize: 11,
    fontWeight: '700',
    color: '#1D4ED8',
    marginBottom: 2,
  },
  sampleRequestText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#1E3A8A',
    fontStyle: 'italic',
  },
});
