import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { theme } from './theme';
import { DemoHeader, StatusPill } from './components';

export function Screen8RecoveryApproval({ activeItinerary, proposal, onApprove, onReject, language = 'en', onToggleLanguage = () => {} }) {
  const isTe = language === 'te';
  const [paymentDone, setPaymentDone] = useState(false);

  if (!proposal) return null;

  const handlePayment = () => {
    setPaymentDone(true);
    // Automatically complete revision approval after payment confirmation
    setTimeout(() => {
      onApprove();
    }, 1500);
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <DemoHeader
        title={isTe ? '8. చెల్లింపు మరియు ధృవీకరణ' : '8. Payment & Booking Confirmation'}
        subtitle={isTe ? 'ప్రతిపాదిత ప్రయాణ సవరణ కోసం చెల్లింపు పూర్తి చేయండి' : 'Complete Payment & Confirm Revised Journey Booking'}
        language={language}
        onToggleLanguage={onToggleLanguage}
      />

      <View style={styles.gateBanner}>
        <Text style={styles.gateTitle}>💳 {isTe ? 'చెల్లింపు గేట్‌వే' : 'Payment Authorization Gateway'}</Text>
        <Text style={styles.gateText}>
          {isTe
            ? 'సవరించిన బస్సు టిక్కెట్ మరియు రీబుకింగ్ కోసం చెల్లింపు పూర్తి చేయండి.'
            : 'Complete payment for fare difference and revised seat reservation to confirm your updated itinerary.'}
        </Text>
      </View>

      {/* Side-by-Side Comparison Card (Diff View) */}
      <View style={styles.diffCard}>
        <Text style={styles.diffCardHeader}>{isTe ? 'పాత మరియు కొత్త ప్రణాళిక పోలిక' : 'Original vs Proposed Itinerary Diff'}</Text>

        <View style={styles.diffGrid}>
          {/* Column 1: Old Active Itinerary */}
          <View style={styles.oldCol}>
            <Text style={styles.colTitle}>{isTe ? 'పాత ప్రణాళిక' : 'Active Plan (Rev 1)'}</Text>
            <Text style={styles.oldText}>Bus B @ Vijayawada PNBS</Text>
            <Text style={styles.strikethrough}>ETA: {proposal.oldEta} AM</Text>
            <Text style={styles.strikethrough}>Fare: ₹{activeItinerary.totalFare}</Text>
            <StatusPill type="WARNING" label="UNSAFE (5m)" />
          </View>

          <View style={styles.vDivider} />

          {/* Column 2: New Proposal */}
          <View style={styles.newCol}>
            <Text style={styles.colTitleNew}>{isTe ? 'ప్రతిపాదిత మార్గం' : 'Proposal (Rev 2)'}</Text>
            <Text style={styles.newText}>Garuda @ Vijayawada Bypass</Text>
            <Text style={styles.newEta}>ETA: {proposal.newEta} AM</Text>
            <Text style={styles.newFare}>Fare: ₹{proposal.newTotalFare}</Text>
            <Text style={styles.fareDiffTag}>+{`₹${proposal.fareDifference}`}</Text>
            <StatusPill type="SUCCESS" label="SAFE (45m)" />
          </View>
        </View>

        {/* Payment Summary Box */}
        <View style={styles.paymentSummaryBox}>
          <Text style={styles.paymentSummaryTitle}>💰 {isTe ? 'చెల్లించవలసిన నికర మొత్తం' : 'Net Payable Amount'}</Text>
          <View style={styles.paymentRow}>
            <Text style={styles.paymentLabel}>{isTe ? 'ఛార్జీ తేడా (Fare Difference)' : 'Revised Fare Adjustment'}</Text>
            <Text style={styles.paymentValue}>₹{proposal.fareDifference}</Text>
          </View>
          <View style={styles.paymentRow}>
            <Text style={styles.paymentLabel}>{isTe ? 'మొత్తం చెల్లింపు' : 'Total Payable'}</Text>
            <Text style={styles.paymentTotal}>₹{proposal.fareDifference}</Text>
          </View>
        </View>
      </View>

      {/* Payment Success State OR Action Cluster */}
      {paymentDone ? (
        <View style={styles.successCard}>
          <Text style={styles.successIcon}>✅</Text>
          <Text style={styles.successTitle}>{isTe ? 'చెల్లింపు పూర్తయింది!' : 'Payment Done Successfully!'}</Text>
          <Text style={styles.successSubtitle}>
            {isTe ? 'సవరించిన టిక్కెట్ ధృవీకరించబడింది. ప్రయాణ పర్యవేక్షణకు వెళ్తోంది...' : 'Revised ticket confirmed. Redirecting to live journey monitor...'}
          </Text>
        </View>
      ) : (
        <View style={styles.actionCluster}>
          <TouchableOpacity style={styles.rejectBtn} onPress={onReject}>
            <Text style={styles.rejectBtnText}>{isTe ? 'రద్దు చేయి' : 'Cancel'}</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.paymentBtn} onPress={handlePayment}>
            <Text style={styles.paymentBtnText}>
              💳 {isTe ? `₹${proposal.fareDifference} చెల్లించండి (Payment Done)` : `Pay ₹${proposal.fareDifference} & Confirm ➔`}
            </Text>
          </TouchableOpacity>
        </View>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: theme.colors.background },
  content: { paddingBottom: 30 },
  gateBanner: {
    backgroundColor: '#FFF7ED',
    margin: theme.spacing.md,
    padding: theme.spacing.md,
    borderRadius: theme.radius.lg,
    borderWidth: 1,
    borderColor: '#FED7AA',
  },
  gateTitle: { fontSize: 13, fontWeight: '700', color: '#C2410C', marginBottom: 4 },
  gateText: { fontSize: 11, color: '#EA580C', lineHeight: 16 },
  diffCard: {
    backgroundColor: '#FFFFFF',
    marginHorizontal: theme.spacing.md,
    borderRadius: theme.radius.xl,
    padding: theme.spacing.md,
    borderWidth: 1,
    borderColor: theme.colors.outline,
    gap: 12,
  },
  diffCardHeader: { fontSize: 14, fontWeight: '700', color: theme.colors.textPrimary },
  diffGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: '#F8FAFC',
    padding: 12,
    borderRadius: theme.radius.lg,
  },
  oldCol: { flex: 1, gap: 4, alignItems: 'flex-start' },
  newCol: { flex: 1, gap: 4, alignItems: 'flex-start' },
  vDivider: { width: 1, backgroundColor: '#CBD5E1', marginHorizontal: 8 },
  colTitle: { fontSize: 11, fontWeight: '700', color: theme.colors.textMuted },
  colTitleNew: { fontSize: 11, fontWeight: '700', color: theme.colors.secondary },
  oldText: { fontSize: 11, color: theme.colors.textSecondary },
  newText: { fontSize: 11, fontWeight: '700', color: theme.colors.textPrimary },
  strikethrough: { fontSize: 12, textDecorationLine: 'line-through', color: theme.colors.textMuted },
  newEta: { fontSize: 13, fontWeight: '700', color: theme.colors.success },
  newFare: { fontSize: 13, fontWeight: '700', color: theme.colors.textPrimary },
  fareDiffTag: { fontSize: 11, fontWeight: '700', color: theme.colors.action },
  explanationBox: {
    backgroundColor: '#E0F2FE',
    padding: 10,
    borderRadius: theme.radius.md,
    borderWidth: 1,
    borderColor: '#7DD3FC',
  },
  explanationTitle: { fontSize: 12, fontWeight: '700', color: '#0369A1', marginBottom: 4 },
  explanationText: { fontSize: 11, color: '#0284C7', lineHeight: 16 },
  actionCluster: { flexDirection: 'row', gap: 10, margin: theme.spacing.md },
  rejectBtn: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderWidth: 1.5,
    borderColor: '#CBD5E1',
    borderRadius: theme.radius.lg,
    paddingVertical: 14,
    alignItems: 'center',
  },
  rejectBtnText: { fontSize: 12, fontWeight: '700', color: theme.colors.textSecondary },
  paymentBtn: {
    flex: 2,
    backgroundColor: theme.colors.success,
    borderRadius: theme.radius.lg,
    paddingVertical: 14,
    alignItems: 'center',
  },
  paymentBtnText: { fontSize: 13, fontWeight: '700', color: '#FFFFFF' },
  paymentSummaryBox: {
    backgroundColor: '#F1F5F9',
    padding: 12,
    borderRadius: theme.radius.md,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    marginTop: 8,
  },
  paymentSummaryTitle: { fontSize: 12, fontWeight: '700', color: '#1E293B', marginBottom: 6 },
  paymentRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 },
  paymentLabel: { fontSize: 11, color: '#64748B' },
  paymentValue: { fontSize: 12, fontWeight: '600', color: '#0F172A' },
  paymentTotal: { fontSize: 14, fontWeight: '700', color: '#166534' },
  successCard: {
    backgroundColor: '#DCFCE7',
    margin: theme.spacing.md,
    padding: theme.spacing.lg,
    borderRadius: theme.radius.xl,
    borderWidth: 1.5,
    borderColor: '#86EFAC',
    alignItems: 'center',
  },
  successIcon: { fontSize: 32, marginBottom: 8 },
  successTitle: { fontSize: 16, fontWeight: '700', color: '#15803D', marginBottom: 4 },
  successSubtitle: { fontSize: 12, color: '#166534', textAlign: 'center' }
});
