import React, { useState, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Animated, Easing, ActivityIndicator } from 'react-native';
import { theme } from './theme';
import { DemoHeader, StatusPill } from './components';

export function Screen6Checkout({ option, onConfirmJourney, language = 'en', onToggleLanguage = () => {} }) {
  const isTe = language === 'te';
  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentStep, setPaymentStep] = useState(''); // 'UPI_PING', 'SECURITY_CHECK', 'SUCCESS'

  const checkmarkScale = useRef(new Animated.Value(0)).current;
  const pulseAnim = useRef(new Animated.Value(1)).current;

  // Pulse animation while processing
  useEffect(() => {
    if (isProcessing) {
      Animated.loop(
        Animated.sequence([
          Animated.timing(pulseAnim, {
            toValue: 1.15,
            duration: 500,
            useNativeDriver: true,
          }),
          Animated.timing(pulseAnim, {
            toValue: 1,
            duration: 500,
            useNativeDriver: true,
          }),
        ])
      ).start();
    } else {
      pulseAnim.setValue(1);
    }
  }, [isProcessing]);

  const handlePay = () => {
    setIsProcessing(true);
    setPaymentStep(isTe ? 'సిమ్యులేటెడ్ UPI గేట్‌వే కనెక్ట్ అవుతోంది...' : 'Connecting to Simulated UPI Gateway...');

    setTimeout(() => {
      setPaymentStep(isTe ? 'సెక్యూరిటీ చెక్ & వాలెట్ బ్యాలెన్స్ సరిచూస్తోంది...' : 'Verifying Security Token & Wallet Balance...');
    }, 1200);

    setTimeout(() => {
      setPaymentStep(isTe ? 'చెల్లింపు విజయవంతమైంది!' : 'Payment Successful!');
      setIsProcessing(false);

      // Trigger checkmark pop animation
      Animated.spring(checkmarkScale, {
        toValue: 1,
        friction: 4,
        tension: 80,
        useNativeDriver: true,
      }).start();

      // Complete checkout after animation
      setTimeout(() => {
        onConfirmJourney();
      }, 1500);
    }, 2500);
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <DemoHeader
        title={isTe ? '6. డెమో చెక్‌అవుట్ & ధృవీకరణ' : '6. Simulated Checkout & Journey Activation'}
        subtitle={isTe ? 'ఉచిత సిమ్యులేషన్ ధృవీకరణ (ఏ విధమైన అసలు రుసుము ఉండదు)' : 'Demonstration Payment Flow (No real cards or transactions)'}
        language={language}
        onToggleLanguage={onToggleLanguage}
      />

      <View style={styles.noticeBox}>
        <Text style={styles.noticeTitle}>🛡️ {isTe ? 'సిమ్యులేషన్ నోటీసు' : 'Simulated Checkout Environment'}</Text>
        <Text style={styles.noticeText}>
          {isTe
            ? 'ఈ ప్రక్రియ డెమో ప్రయోజనాల కోసం మాత్రమే. అసలు పేమెంట్ గేట్‌వే లేదా డబ్బు విత్‌డ్రా కావు.'
            : 'Per Architectural Constraint: This screen demonstrates the state machine transition from ITINERARY_SELECTED to DEMO_CONFIRMED.'}
        </Text>
      </View>

      {/* Payment Processing Overlay/Card */}
      {isProcessing || paymentStep === (isTe ? 'చెల్లింపు విజయవంతమైంది!' : 'Payment Successful!') ? (
        <View style={styles.successCardContainer}>
          <Animated.View style={[styles.successBadgeCircle, { transform: [{ scale: checkmarkScale }] }]}>
            <Text style={styles.successCheckmark}>✓</Text>
          </Animated.View>

          <View style={styles.demoPillGreen}>
            <Text style={styles.demoPillGreenText}>DEMO PAYMENT · SIMULATED</Text>
          </View>

          <Text style={styles.successTitleText}>Payment Successful!</Text>
          <Text style={styles.successSubtitleText}>Your demo booking has been confirmed.</Text>

          <View style={styles.amountPaidCard}>
            <Text style={styles.amountPaidLabel}>AMOUNT PAID</Text>
            <Text style={styles.amountPaidValue}>₹{option?.totalFare || '700'}</Text>
            <Text style={styles.bookingRefText}>Booking Ref: <Text style={{ fontWeight: '700' }}>RM-BK755116</Text></Text>
            <Text style={styles.confirmedSeatsText}>Confirmed Seats: <Text style={{ fontWeight: '700' }}>3C</Text></Text>
          </View>

          <TouchableOpacity style={styles.viewJourneyBtn} onPress={onConfirmJourney}>
            <Text style={styles.viewJourneyBtnText}>View My Journey ➔</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <>
          <View style={styles.card}>
            <Text style={styles.sectionHeader}>{isTe ? 'టికెట్ సారాంశం' : 'Trip Summary & Passengers'}</Text>
            <View style={styles.row}>
              <Text style={styles.label}>{isTe ? 'ప్రయాణీకుల సంఖ్య:' : 'Passengers:'}</Text>
              <Text style={styles.val}>1 Adult (Single Berth)</Text>
            </View>
            <View style={styles.row}>
              <Text style={styles.label}>{isTe ? 'ఎంచుకున్న బస్సు:' : 'Selected Service:'}</Text>
              <Text style={styles.val}>{option?.operator || 'Express Lines'}</Text>
            </View>
            <View style={styles.row}>
              <Text style={styles.label}>{isTe ? 'మొత్తం చెల్లించాల్సిన మొత్తం:' : 'Total Amount Due:'}</Text>
              <Text style={styles.fareVal}>₹{option?.totalFare || option?.fare || '1,450'}</Text>
            </View>
          </View>

          <View style={styles.paymentMethodCard}>
            <Text style={styles.sectionHeader}>{isTe ? 'సిమ్యులేటెడ్ పేమెంట్ మోడ్' : 'Select Demo Payment Method'}</Text>
            
            <TouchableOpacity style={styles.radioRow}>
              <Text style={styles.radioDot}>🔘</Text>
              <Text style={styles.radioText}>Simulated UPI (RoamPay Demo Wallet)</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.radioRow}>
              <Text style={styles.radioDot}>⚪</Text>
              <Text style={styles.radioText}>Demo Credit/Debit Card</Text>
            </TouchableOpacity>
          </View>

          <TouchableOpacity style={styles.confirmBtn} onPress={handlePay}>
            <Text style={styles.confirmBtnText}>
              {isTe ? 'సిమ్యులేటెడ్ పేమెంట్ చేయండి ➔' : 'Pay & Confirm Journey ➔'}
            </Text>
          </TouchableOpacity>
        </>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: theme.colors.background },
  content: { paddingBottom: 30 },
  noticeBox: {
    backgroundColor: '#F1F5F9',
    margin: theme.spacing.md,
    padding: theme.spacing.md,
    borderRadius: theme.radius.lg,
    borderWidth: 1,
    borderColor: '#CBD5E1',
  },
  noticeTitle: { fontSize: 13, fontWeight: '700', color: '#475569', marginBottom: 4 },
  noticeText: { fontSize: 11, color: '#64748B', lineHeight: 16 },
  card: {
    backgroundColor: '#FFFFFF',
    marginHorizontal: theme.spacing.md,
    padding: theme.spacing.md,
    borderRadius: theme.radius.xl,
    borderWidth: 1,
    borderColor: theme.colors.outline,
    gap: 12,
  },
  sectionHeader: { fontSize: 14, fontWeight: '700', color: theme.colors.textPrimary, marginBottom: 4 },
  row: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  label: { fontSize: 13, color: theme.colors.textSecondary },
  val: { fontSize: 13, fontWeight: '600', color: theme.colors.textPrimary },
  fareVal: { fontSize: 20, fontWeight: '700', color: theme.colors.secondary },
  paymentMethodCard: {
    backgroundColor: '#FFFFFF',
    marginHorizontal: theme.spacing.md,
    marginTop: theme.spacing.md,
    padding: theme.spacing.md,
    borderRadius: theme.radius.xl,
    borderWidth: 1,
    borderColor: theme.colors.outline,
    gap: 12,
  },
  radioRow: { flexDirection: 'row', alignItems: 'center', gap: 10, paddingVertical: 4 },
  radioDot: { fontSize: 16 },
  radioText: { fontSize: 13, color: theme.colors.textPrimary, fontWeight: '600' },
  confirmBtn: {
    backgroundColor: theme.colors.success,
    marginHorizontal: theme.spacing.md,
    borderRadius: theme.radius.lg,
    paddingVertical: 14,
    alignItems: 'center',
    marginTop: theme.spacing.md,
  },
  confirmBtnText: { color: '#FFFFFF', fontSize: 14, fontWeight: '700' },

  /* Payment Success Screen Matching User Screenshot */
  successCardContainer: {
    backgroundColor: '#FFFFFF',
    marginHorizontal: theme.spacing.md,
    marginTop: theme.spacing.md,
    padding: 24,
    borderRadius: 24,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 3,
  },
  successBadgeCircle: {
    width: 76,
    height: 76,
    borderRadius: 38,
    backgroundColor: '#10B981',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  successCheckmark: {
    color: '#FFFFFF',
    fontSize: 38,
    fontWeight: '900',
  },
  demoPillGreen: {
    backgroundColor: '#DCFCE7',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#86EFAC',
    marginBottom: 12,
  },
  demoPillGreenText: {
    color: '#15803D',
    fontSize: 11,
    fontWeight: '800',
    letterSpacing: 0.5,
  },
  successTitleText: {
    fontSize: 22,
    fontWeight: '800',
    color: '#0F172A',
    marginBottom: 6,
  },
  successSubtitleText: {
    fontSize: 13,
    color: '#64748B',
    textAlign: 'center',
    marginBottom: 20,
  },
  amountPaidCard: {
    width: '100%',
    backgroundColor: '#F8FAFC',
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    alignItems: 'center',
    gap: 4,
    marginBottom: 20,
  },
  amountPaidLabel: {
    fontSize: 11,
    fontWeight: '700',
    color: '#64748B',
    letterSpacing: 1,
  },
  amountPaidValue: {
    fontSize: 28,
    fontWeight: '800',
    color: '#0F172A',
  },
  bookingRefText: {
    fontSize: 12,
    color: '#475569',
    marginTop: 4,
  },
  confirmedSeatsText: {
    fontSize: 12,
    color: '#475569',
  },
  viewJourneyBtn: {
    width: '100%',
    backgroundColor: '#0F172A',
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: 'center',
  },
  viewJourneyBtnText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '700',
  },
});
