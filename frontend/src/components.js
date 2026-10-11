import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { theme } from './theme';

export function DemoHeader({ title, subtitle, language = 'en', onToggleLanguage = () => {} }) {
  return (
    <View style={styles.container}>
      <View style={styles.topRow}>
        <View style={styles.titleGroup}>
          <Text style={styles.brandTitle}>RoamAgent AI</Text>
          <View style={styles.demoPill}>
            <Text style={styles.demoPillText}>Demo Mode · Simulated Data</Text>
          </View>
        </View>
        <TouchableOpacity style={styles.langBadgeContainer} onPress={onToggleLanguage}>
          <Text style={styles.langBadge}>
            {language === 'te' ? 'తెలుగు (TE)' : 'English (EN)'}
          </Text>
        </TouchableOpacity>
      </View>
      {title && <Text style={styles.title}>{title}</Text>}
      {subtitle && <Text style={styles.subtitle}>{subtitle}</Text>}
    </View>
  );
}

export function DemoNoticeBanner() {
  return (
    <View style={styles.noticeBanner}>
      <Text style={styles.noticeIcon}>ℹ️</Text>
      <Text style={styles.noticeText}>
        <Text style={styles.noticeBold}>Demo Mode Active: </Text>
        Predefined scenario data loaded locally for voice/text travel search. No external APIs connected.
      </Text>
    </View>
  );
}

export function StatusPill({ type, label }) {
  let bg = theme.colors.surfaceSubtle;
  let text = theme.colors.textSecondary;
  let border = theme.colors.outline;
  let dotColor = null;

  if (type === 'SUCCESS' || type === 'ON_TIME' || type === 'CONFIRMED') {
    bg = theme.colors.successContainer;
    text = theme.colors.onSuccessContainer;
    border = '#86EFAC';
    dotColor = theme.colors.success;
  } else if (type === 'WARNING' || type === 'DELAYED' || type === 'AT_RISK') {
    bg = theme.colors.actionContainer;
    text = theme.colors.onActionContainer;
    border = '#FED7AA';
    dotColor = theme.colors.action;
  } else if (type === 'INFO' || type === 'DIRECT') {
    bg = theme.colors.secondaryContainer;
    text = theme.colors.onSecondaryContainer;
    border = '#BAE6FD';
  } else if (type === 'VIOLATION') {
    bg = theme.colors.errorContainer;
    text = theme.colors.onErrorContainer;
    border = '#FF8A8A';
  }

  return (
    <View style={[styles.pill, { backgroundColor: bg, borderColor: border }]}>
      {dotColor && <View style={[styles.dot, { backgroundColor: dotColor }]} />}
      <Text style={[styles.pillText, { color: text }]}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: theme.colors.primary,
    paddingHorizontal: theme.spacing.md,
    paddingTop: theme.spacing.lg,
    paddingBottom: theme.spacing.md,
  },
  topRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  titleGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  brandTitle: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '700',
  },
  demoPill: {
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: theme.radius.pill,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.25)',
  },
  demoPillText: {
    color: '#E2E8F0',
    fontSize: 10,
    fontWeight: '500',
  },
  langBadgeContainer: {
    borderRadius: theme.radius.pill,
  },
  langBadge: {
    color: '#38BDF8',
    backgroundColor: '#1E293B',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: theme.radius.pill,
    fontSize: 12,
    fontWeight: '600',
    borderWidth: 1,
    borderColor: '#0284C7',
  },
  title: {
    color: '#FFFFFF',
    fontSize: 20,
    fontWeight: '700',
    marginTop: 10,
  },
  subtitle: {
    color: '#94A3B8',
    fontSize: 13,
    marginTop: 2,
  },
  noticeBanner: {
    backgroundColor: '#0F172A',
    borderBottomWidth: 1,
    borderBottomColor: '#38BDF8',
    paddingHorizontal: 14,
    paddingVertical: 8,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  noticeIcon: {
    fontSize: 14,
  },
  noticeText: {
    color: '#94A3B8',
    fontSize: 11,
    lineHeight: 15,
    flex: 1,
  },
  noticeBold: {
    color: '#38BDF8',
    fontWeight: '700',
  },
  scenarioBarContainer: {
    backgroundColor: '#1E293B',
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#334155',
  },
  scenarioTopRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  scenarioStatusGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  scenarioBarTitle: {
    color: '#F8FAFC',
    fontSize: 13,
    fontWeight: '700',
  },
  simulatedPill: {
    backgroundColor: '#0284C7',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  simulatedPillText: {
    color: '#FFFFFF',
    fontSize: 10,
    fontWeight: '700',
  },
  timerControlGroup: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  timerPill: {
    backgroundColor: '#334155',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#475569',
  },
  timerText: {
    color: '#38BDF8',
    fontSize: 11,
    fontWeight: '700',
  },
  replayBtn: {
    backgroundColor: '#16A34A',
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderRadius: 12,
  },
  replayBtnText: {
    color: '#FFFFFF',
    fontSize: 11,
    fontWeight: '700',
  },
  tabsRow: {
    flexDirection: 'row',
    gap: 6,
    alignItems: 'center',
  },
  scenarioTab: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#0F172A',
    paddingVertical: 6,
    paddingHorizontal: 6,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#334155',
    gap: 4,
  },
  scenarioTabActive: {
    backgroundColor: '#0284C7',
    borderColor: '#38BDF8',
  },
  tabNum: {
    color: '#64748B',
    fontSize: 10,
    fontWeight: '700',
  },
  tabNumActive: {
    color: '#E0F2FE',
  },
  tabRoute: {
    color: '#94A3B8',
    fontSize: 11,
    fontWeight: '600',
  },
  tabRouteActive: {
    color: '#FFFFFF',
    fontWeight: '700',
  },
  replayMiniBtn: {
    backgroundColor: '#334155',
    paddingHorizontal: 8,
    paddingVertical: 6,
    borderRadius: 8,
  },
  replayMiniBtnText: {
    color: '#E2E8F0',
    fontSize: 10,
    fontWeight: '700',
  },
  pill: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: theme.radius.pill,
    borderWidth: 1,
    gap: 4,
  },
  pillText: {
    fontSize: 11,
    fontWeight: '600',
  },
  dot: {
    width: 6,
    height: 6,
    borderRadius: 3,
  }
});

