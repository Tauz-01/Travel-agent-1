import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, StatusBar, ActivityIndicator, LogBox } from 'react-native';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';

// Ignore all yellow box warning banners on mobile/emulator during hackathon demo
LogBox.ignoreAllLogs();
import { theme } from './src/theme';
import { demoScenarios } from './src/data/demoScenarios';
import { DemoNoticeBanner } from './src/components';
import {
  getInitialData,
  sendChatMessage,
  fetchTripSearchResults,
  fetchDisruptionStatus,
  fetchRecoveryOptions,
  approveItineraryChange
} from './src/services/api';
import { parseIntentFromInput } from './src/transportEngine';

// 8 Execution Screens
import { Screen1ConversationalIntake } from './src/Screen1ConversationalIntake';
import { Screen2ReviewDraft } from './src/Screen2ReviewDraft';
import { Screen3Clarification } from './src/Screen3Clarification';
import { Screen4Top4Results } from './src/Screen4Top4Results';
import { ScreenBusSeatSelection } from './src/ScreenBusSeatSelection';
import { Screen5ItineraryDetails } from './src/Screen5ItineraryDetails';
import { Screen6Checkout } from './src/Screen6Checkout';
import { Screen7DisruptionMonitor } from './src/Screen7DisruptionMonitor';
import { Screen8RecoveryApproval } from './src/Screen8RecoveryApproval';

export default function App() {
  const [currentStage, setCurrentStage] = useState(1);
  const [language, setLanguage] = useState('en');
  const [isLoading, setIsLoading] = useState(false);
  const [loadingMessage, setLoadingMessage] = useState('Communicating with backend...');

  // User interaction counter / Scenario Index (0-based: 0 -> place-1, 1 -> place-2, 2 -> place-3)
  const [i, setI] = useState(0);

  // Authoritative State bound to current index i
  const currentScenario = demoScenarios[i < demoScenarios.length ? i : demoScenarios.length - 1];
  const [tripIntent, setTripIntent] = useState(currentScenario.intent);
  const [searchResults, setSearchResults] = useState(currentScenario.searchResults);
  const [selectedOption, setSelectedOption] = useState(null);
  const [activeItinerary, setActiveItinerary] = useState(null);
  const [disruption, setDisruption] = useState(null);
  const [recoveryProposals, setRecoveryProposals] = useState([]);
  const [activeProposal, setActiveProposal] = useState(null);

  // Sync state whenever scenario index i changes
  useEffect(() => {
    const activeSc = demoScenarios[i < demoScenarios.length ? i : demoScenarios.length - 1];
    setTripIntent(activeSc.intent);
    setSearchResults(activeSc.searchResults);
    setSelectedOption(null);
    setActiveItinerary(null);
  }, [i]);

  // Demo Replay Handler (resets i to 0)
  const handleReplayDemo = () => {
    setI(0);
    setCurrentStage(1);
    setSelectedOption(null);
    setActiveItinerary(null);
  };

  // Load initial system data on app boot
  useEffect(() => {
    async function loadAppConfig() {
      try {
        await getInitialData();
      } catch (err) {
        console.warn('Initial data load warning:', err);
      }
    }
    loadAppConfig();
  }, []);

  const toggleLanguage = () => {
    setLanguage(prev => (prev === 'en' ? 'te' : 'en'));
  };

  // Stage 1 -> 2: Triggered ONLY when user types or uses voice input
  const handleExtractTrip = async (inputPrompt) => {
    setIsLoading(true);
    setLoadingMessage(language === 'te' 
      ? '🤖 డెమో మోడ్: అభ్యర్థనను విశ్లేషిస్తోంది...' 
      : '🤖 Processing travel request...');

    // 1. Use the current scenario details (place-1 for i=0, place-2 for i=1, etc.)
    const activeSc = demoScenarios[i < demoScenarios.length ? i : demoScenarios.length - 1];
    setTripIntent(activeSc.intent);
    setSearchResults(activeSc.searchResults);

    // 2. Increment scenario index i AFTER user interaction for the next request
    setI(prevI => (prevI < demoScenarios.length - 1 ? prevI + 1 : prevI));

    setIsLoading(false);
    setCurrentStage(2); // Auto-navigate to Stage 2 review screen with active scenario details
  };

  // Stage 2 -> 4: Confirm Draft & Search Routes via API
  const handleConfirmDraftAndSearch = async () => {
    setIsLoading(true);
    setLoadingMessage(language === 'te'
      ? '🚌 గ్రాఫ్ నెట్‌వర్క్ ద్వారా ఉత్తమ బస్సు రూట్‌లు వెతుకుతోంది...'
      : '🚌 Querying deterministic route graph for best options...');
    try {
      const res = await fetchTripSearchResults(tripIntent);
      setSearchResults(res.results || []);
    } catch (e) {
      console.warn('Error fetching route search results:', e);
    } finally {
      setIsLoading(false);
      setCurrentStage(4);
    }
  };

  // Stage 2 -> 3: Go to Clarification Gate
  const handleGoToClarification = () => {
    setCurrentStage(3);
  };

  // Stage 3 -> 4: Save Clarification & Search via API
  const handleSaveClarification = async (updatedIntent) => {
    setTripIntent(updatedIntent);
    setIsLoading(true);
    setLoadingMessage(language === 'te'
      ? '🚌 గ్రాఫ్ శోధన ఇంజిన్ నవీకరిస్తోంది...'
      : '🚌 Updating route graph search with updated constraints...');
    try {
      const res = await fetchTripSearchResults(updatedIntent);
      setSearchResults(res.results || []);
    } catch (e) {
      console.warn('Error searching routes:', e);
    } finally {
      setIsLoading(false);
      setCurrentStage(4);
    }
  };

  // Stage 4 -> Seat Selection: Select Bus Option
  const handleSelectOption = (option) => {
    setSelectedOption(option);
    setCurrentStage(45); // Stage 4.5: Interactive Bus Seat Selection
  };

  // Confirm Seat Selection
  const handleConfirmSeats = ({ bus, selectedSeats, totalFare }) => {
    setSelectedOption(prev => ({
      ...prev,
      selectedSeats,
      totalFare: totalFare > 0 ? totalFare : prev?.totalFare
    }));
    setCurrentStage(5); // Proceed to Itinerary Details
  };

  // Stage 5 -> 6: Proceed to Checkout
  const handleProceedToCheckout = () => {
    setCurrentStage(6);
  };

  // Stage 6 -> 7: Confirm Payment & Activate Journey
  const handleConfirmJourney = () => {
    setActiveItinerary(selectedOption);
    setCurrentStage(7);
  };

  // Stage 7: Trigger Predefined Delay Scenario via API
  const handleTriggerDelay = async () => {
    setIsLoading(true);
    setLoadingMessage(language === 'te'
      ? '🚨 50 నిమిషాల ఆలస్యాన్ని అనుకరిస్తోంది...'
      : '🚨 Simulating 50-minute connection delay & analyzing risk...');
    try {
      const res = await fetchDisruptionStatus(activeItinerary || selectedOption, 50);
      setDisruption(res.disruption);
    } catch (e) {
      console.warn('Error fetching disruption status:', e);
    } finally {
      setIsLoading(false);
    }
  };

  // Stage 7 -> 8: Start Recovery Search via API
  const handleStartRecovery = async () => {
    setIsLoading(true);
    setLoadingMessage(language === 'te'
      ? '🔄 ప్రత్యామ్నాయ రికవరీ రూట్‌లను వెతుకుతోంది...'
      : '🔄 Calculating alternative recovery routes from current location...');
    try {
      const res = await fetchRecoveryOptions(activeItinerary || selectedOption, disruption, tripIntent);
      const proposals = res.proposals || [];
      setRecoveryProposals(proposals);
      setActiveProposal(proposals[0]);
    } catch (e) {
      console.warn('Error fetching recovery options:', e);
    } finally {
      setIsLoading(false);
      setCurrentStage(8);
    }
  };

  // Stage 8 -> 7: Approve Recovery Proposal via API
  const handleApproveProposal = async () => {
    setIsLoading(true);
    try {
      await approveItineraryChange(activeProposal?.proposalId, activeItinerary?.id);
    } catch (e) {
      console.warn('Error approving proposal:', e);
    } finally {
      setIsLoading(false);
    }

    // Commit Itinerary Revision #2
    const currentItin = activeItinerary || selectedOption;
    const updatedLegs = [currentItin.legs[0], activeProposal.replacementLeg];
    const revisedItinerary = {
      ...currentItin,
      revision: 2,
      legs: updatedLegs,
      totalFare: activeProposal.newTotalFare,
      arrivalTime: activeProposal.newEta,
      transfers: [
        {
          stop: { name: 'Vijayawada Bypass' },
          bufferMinutes: 45,
          requiredBuffer: 45,
          isSafe: true
        }
      ]
    };
    setActiveItinerary(revisedItinerary);
    setDisruption(null); // Resolved!
    setCurrentStage(7);
  };

  // Stage 8 -> 7: Reject Recovery Proposal
  const handleRejectProposal = () => {
    alert(language === 'te' ? 'ప్రతిపాదన తిరస్కరించబడింది. పాత మార్గం నిలిచి ఉంది.' : 'Proposal rejected. Original itinerary retained with disruption alert.');
    setCurrentStage(7);
  };

  return (
    <SafeAreaProvider>
      <SafeAreaView style={styles.safeArea}>
        <StatusBar barStyle="light-content" backgroundColor="#0F172A" />

        {/* Prominent Animated AI Processing Modal Overlay */}
        {isLoading && (
          <View style={styles.loadingOverlayModal}>
            <View style={styles.loadingCardContainer}>
              <ActivityIndicator size="large" color="#38BDF8" />
              <Text style={styles.loadingTitleText}>RoamAgent AI Processing</Text>
              <Text style={styles.loadingOverlayText}>{loadingMessage}</Text>
              <View style={styles.loadingProgressPill}>
                <Text style={styles.loadingProgressText}>LIVE AI ENGINE</Text>
              </View>
            </View>
          </View>
        )}

      {/* Main Viewport Router */}
      <View style={styles.container}>
        <DemoNoticeBanner />

        {currentStage === 1 && (
          <Screen1ConversationalIntake
            onExtractTrip={handleExtractTrip}
            language={language}
            onToggleLanguage={toggleLanguage}
            currentScenario={currentScenario}
          />
        )}

        {currentStage === 2 && (
          <Screen2ReviewDraft
            intent={tripIntent}
            onProceedToClarification={handleGoToClarification}
            onConfirmAndSearch={handleConfirmDraftAndSearch}
            onBackToIntake={() => setCurrentStage(1)}
            language={language}
            onToggleLanguage={toggleLanguage}
          />
        )}

        {currentStage === 3 && (
          <Screen3Clarification
            intent={tripIntent}
            onSaveAndSearch={handleSaveClarification}
            language={language}
            onToggleLanguage={toggleLanguage}
          />
        )}

        {currentStage === 4 && (
          <Screen4Top4Results
            options={searchResults}
            tripIntent={tripIntent}
            onSelectOption={handleSelectOption}
            language={language}
            onToggleLanguage={toggleLanguage}
          />
        )}

        {currentStage === 45 && selectedOption && (
          <ScreenBusSeatSelection
            bus={selectedOption}
            onConfirmSeats={handleConfirmSeats}
            onBack={() => setCurrentStage(4)}
            language={language}
            onToggleLanguage={toggleLanguage}
          />
        )}

        {currentStage === 5 && selectedOption && (
          <Screen5ItineraryDetails
            option={selectedOption}
            onProceedToCheckout={handleProceedToCheckout}
            language={language}
            onToggleLanguage={toggleLanguage}
          />
        )}

        {currentStage === 6 && selectedOption && (
          <Screen6Checkout
            option={selectedOption}
            onConfirmJourney={handleConfirmJourney}
            language={language}
            onToggleLanguage={toggleLanguage}
          />
        )}

        {currentStage === 7 && (
          <Screen7DisruptionMonitor
            option={activeItinerary || selectedOption}
            disruption={disruption}
            TriggerDelay={handleTriggerDelay}
            onStartRecovery={handleStartRecovery}
            language={language}
            onToggleLanguage={toggleLanguage}
          />
        )}

        {currentStage === 8 && activeProposal && (
          <Screen8RecoveryApproval
            activeItinerary={activeItinerary || selectedOption}
            proposal={activeProposal}
            onApprove={handleApproveProposal}
            onReject={handleRejectProposal}
            language={language}
            onToggleLanguage={toggleLanguage}
          />
        )}
      </View>
    </SafeAreaView>
  </SafeAreaProvider>
);
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#0F172A' },
  container: { flex: 1, backgroundColor: theme.colors.background },
  loadingOverlayModal: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'rgba(15, 23, 42, 0.88)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
    zIndex: 9999,
  },
  loadingCardContainer: {
    backgroundColor: '#1E293B',
    borderRadius: 20,
    padding: 24,
    alignItems: 'center',
    width: '90%',
    borderWidth: 1,
    borderColor: '#38BDF8',
    shadowColor: '#38BDF8',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 8,
  },
  loadingTitleText: {
    fontSize: 18,
    fontWeight: '700',
    color: '#FFFFFF',
    marginTop: 16,
    marginBottom: 8,
  },
  loadingOverlayText: {
    color: '#94A3B8',
    fontSize: 14,
    fontWeight: '500',
    textAlign: 'center',
    lineHeight: 20,
    marginBottom: 16,
  },
  loadingProgressPill: {
    backgroundColor: '#0284C7',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
  },
  loadingProgressText: {
    color: '#FFFFFF',
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 0.5,
  }
});
