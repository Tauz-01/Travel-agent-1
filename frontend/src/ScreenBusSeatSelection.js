import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert, TextInput } from 'react-native';
import { theme } from './theme';
import { DemoHeader, StatusPill } from './components';

export function ScreenBusSeatSelection({ bus, onConfirmSeats, onBack, language = 'en', onToggleLanguage = () => {} }) {
  const isTe = language === 'te';

  // 2x2 Grid Layout matching user screenshot (1A-1D to 5A-5D)
  const [seats, setSeats] = useState([
    { id: '1A', label: '1A', status: 'BOOKED', price: 700 },
    { id: '1B', label: '1B', status: 'AVAILABLE', price: 700 },
    { id: '1C', label: '1C', status: 'AVAILABLE', price: 700 },
    { id: '1D', label: '1D', status: 'AVAILABLE', price: 700 },

    { id: '2A', label: '2A', status: 'AVAILABLE', price: 700 },
    { id: '2B', label: '2B', status: 'AVAILABLE', price: 700 },
    { id: '2C', label: '2C', status: 'AVAILABLE', price: 700 },
    { id: '2D', label: '2D', status: 'AVAILABLE', price: 700 },

    { id: '3A', label: '3A', status: 'BOOKED', price: 700 },
    { id: '3B', label: '3B', status: 'AVAILABLE', price: 700 },
    { id: '3C', label: '3C', status: 'SELECTED', price: 700 },
    { id: '3D', label: '3D', status: 'AVAILABLE', price: 700 },

    { id: '4A', label: '4A', status: 'AVAILABLE', price: 700 },
    { id: '4B', label: '4B', status: 'AVAILABLE', price: 700 },
    { id: '4C', label: '4C', status: 'AVAILABLE', price: 700 },
    { id: '4D', label: '4D', status: 'AVAILABLE', price: 700 },

    { id: '5A', label: '5A', status: 'AVAILABLE', price: 700 },
    { id: '5B', label: '5B', status: 'AVAILABLE', price: 700 },
    { id: '5C', label: '5C', status: 'AVAILABLE', price: 700 },
    { id: '5D', label: '5D', status: 'AVAILABLE', price: 700 },
  ]);

  const [selectedSeatIds, setSelectedSeatIds] = useState(['3C']);
  const [passengerName, setPassengerName] = useState('Vamsi Mohan');
  const [passengerGender, setPassengerGender] = useState('Male');
  const [passengerAge, setPassengerAge] = useState('24');

  const toggleSeat = (seat) => {
    if (seat.status === 'BOOKED') {
      Alert.alert(
        isTe ? 'అందుబాటులో లేదు' : 'Seat Unavailable',
        isTe ? 'ఈ సీటు ఇప్పటికే బుక్ చేయబడింది.' : 'This seat is already booked.'
      );
      return;
    }

    if (selectedSeatIds.includes(seat.id)) {
      setSelectedSeatIds(prev => prev.filter(id => id !== seat.id));
    } else {
      setSelectedSeatIds(prev => [...prev, seat.id]);
    }
  };

  const selectedSeatsList = seats.filter(s => selectedSeatIds.includes(s.id));
  const basePrice = bus?.totalFare || 700;
  const totalAmount = selectedSeatIds.length * basePrice;

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <DemoHeader
        title={isTe ? 'సీటు ఎంపిక' : 'Seat Selection'}
        subtitle={`${bus?.operator || 'Kaveri Travels'} • ${bus?.coachType || 'AC Sleeper'}`}
        language={language}
        onToggleLanguage={onToggleLanguage}
      />

      {/* Legend Header */}
      <View style={styles.legendCard}>
        <View style={styles.legendItem}>
          <View style={[styles.seatLegendBox, styles.seatAvailableBox]} />
          <Text style={styles.legendLabel}>{isTe ? 'లభ్యం' : 'Available'}</Text>
        </View>
        <View style={styles.legendItem}>
          <View style={[styles.seatLegendBox, styles.seatSelectedBox]} />
          <Text style={styles.legendLabel}>{isTe ? 'ఎంచుకున్నది' : 'Selected'}</Text>
        </View>
        <View style={styles.legendItem}>
          <View style={[styles.seatLegendBox, styles.seatBookedBox]} />
          <Text style={styles.legendLabel}>{isTe ? 'బుక్ అయింది' : 'Booked'}</Text>
        </View>
      </View>

      {/* Driver Position & Grid Layout Card matching screenshot */}
      <View style={styles.busLayoutCard}>
        <View style={styles.layoutHeader}>
          <View style={styles.driverRow}>
            <Text style={styles.driverIcon}>☸️</Text>
            <Text style={styles.driverTitle}>Driver Position</Text>
          </View>
          <Text style={styles.frontText}>FRONT OF BUS</Text>
        </View>

        <View style={styles.gridContainer}>
          {['1', '2', '3', '4', '5'].map(rowNum => (
            <View key={rowNum} style={styles.gridRow}>
              {/* Left Column (A & B) */}
              <View style={styles.colGroup}>
                {['A', 'B'].map(colLet => {
                  const seatId = `${rowNum}${colLet}`;
                  const seat = seats.find(s => s.id === seatId);
                  const isSelected = selectedSeatIds.includes(seatId);
                  const isBooked = seat?.status === 'BOOKED';

                  return (
                    <TouchableOpacity
                      key={seatId}
                      style={[
                        styles.gridSeatBtn,
                        isBooked && styles.gridSeatBooked,
                        isSelected && styles.gridSeatSelected,
                      ]}
                      onPress={() => seat && toggleSeat(seat)}
                    >
                      <Text style={[styles.gridSeatText, (isBooked || isSelected) && styles.gridSeatTextDark]}>
                        {seatId}
                      </Text>
                    </TouchableOpacity>
                  );
                })}
              </View>

              {/* Aisle Space */}
              <View style={styles.aisleSpace} />

              {/* Right Column (C & D) */}
              <View style={styles.colGroup}>
                {['C', 'D'].map(colLet => {
                  const seatId = `${rowNum}${colLet}`;
                  const seat = seats.find(s => s.id === seatId);
                  const isSelected = selectedSeatIds.includes(seatId);
                  const isBooked = seat?.status === 'BOOKED';

                  return (
                    <TouchableOpacity
                      key={seatId}
                      style={[
                        styles.gridSeatBtn,
                        isBooked && styles.gridSeatBooked,
                        isSelected && styles.gridSeatSelected,
                      ]}
                      onPress={() => seat && toggleSeat(seat)}
                    >
                      <Text style={[styles.gridSeatText, (isBooked || isSelected) && styles.gridSeatTextDark]}>
                        {seatId}
                      </Text>
                    </TouchableOpacity>
                  );
                })}
              </View>
            </View>
          ))}
        </View>
      </View>

      {/* Passenger Details Form Card matching screenshot */}
      <View style={styles.passengerCard}>
        <View style={styles.passengerHeader}>
          <Text style={styles.passengerIcon}>📋</Text>
          <Text style={styles.passengerTitle}>Passenger Details</Text>
        </View>

        <View style={styles.passengerBox}>
          <Text style={styles.selectedSeatPillText}>
            Seat {selectedSeatIds.join(', ') || 'None'}
          </Text>

          <TextInput
            style={styles.inputField}
            value={passengerName}
            onChangeText={setPassengerName}
            placeholder="Passenger Name"
          />

          <View style={styles.rowInputs}>
            <TextInput
              style={[styles.inputField, { flex: 2 }]}
              value={passengerGender}
              onChangeText={setPassengerGender}
              placeholder="Gender"
            />
            <TextInput
              style={[styles.inputField, { flex: 1 }]}
              value={passengerAge}
              onChangeText={setPassengerAge}
              keyboardType="numeric"
              placeholder="Age"
            />
          </View>
        </View>
      </View>

      {/* Footer Total & Proceed Bar matching screenshot */}
      <View style={styles.bottomBarCard}>
        <View style={styles.bottomBarRow}>
          <View>
            <Text style={styles.selectedSeatsLabel}>Selected Seats:</Text>
            <Text style={styles.selectedSeatsVal}>{selectedSeatIds.join(', ') || 'None'}</Text>
          </View>
          <View style={{ alignItems: 'flex-end' }}>
            <Text style={styles.totalAmountLabel}>Total Amount:</Text>
            <Text style={styles.totalAmountVal}>₹{totalAmount}</Text>
          </View>
        </View>

        <TouchableOpacity
          style={[styles.proceedBtn, selectedSeatIds.length === 0 && styles.proceedBtnDisabled]}
          disabled={selectedSeatIds.length === 0}
          onPress={() =>
            onConfirmSeats({
              bus,
              selectedSeats: selectedSeatsList,
              totalFare: totalAmount,
              passengerName,
              passengerGender,
              passengerAge,
            })
          }
        >
          <Text style={styles.proceedBtnText}>Proceed to Payment ➔</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F8FAFC' },
  content: { paddingBottom: 40 },
  legendCard: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    backgroundColor: '#FFFFFF',
    marginHorizontal: theme.spacing.md,
    marginTop: theme.spacing.md,
    padding: 12,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  legendItem: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  legendLabel: { fontSize: 12, color: '#64748B', fontWeight: '600' },
  seatLegendBox: { width: 18, height: 18, borderRadius: 4, borderWidth: 1.5 },
  seatAvailableBox: { backgroundColor: '#FFFFFF', borderColor: '#CBD5E1' },
  seatSelectedBox: { backgroundColor: '#10B981', borderColor: '#10B981' },
  seatBookedBox: { backgroundColor: '#94A3B8', borderColor: '#94A3B8' },

  busLayoutCard: {
    backgroundColor: '#FFFFFF',
    marginHorizontal: theme.spacing.md,
    marginTop: theme.spacing.md,
    padding: 16,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  layoutHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
    paddingBottom: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
  },
  driverRow: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  driverIcon: { fontSize: 16 },
  driverTitle: { fontSize: 14, fontWeight: '700', color: '#334155' },
  frontText: { fontSize: 10, fontWeight: '800', color: '#94A3B8', letterSpacing: 1 },

  gridContainer: { gap: 12, alignItems: 'center' },
  gridRow: { flexDirection: 'row', alignItems: 'center' },
  colGroup: { flexDirection: 'row', gap: 8 },
  aisleSpace: { width: 28 },

  gridSeatBtn: {
    width: 48,
    height: 44,
    borderRadius: 8,
    backgroundColor: '#FFFFFF',
    borderWidth: 1.5,
    borderColor: '#CBD5E1',
    alignItems: 'center',
    justifyContent: 'center',
  },
  gridSeatBooked: { backgroundColor: '#94A3B8', borderColor: '#94A3B8' },
  gridSeatSelected: { backgroundColor: '#10B981', borderColor: '#10B981' },
  gridSeatText: { fontSize: 13, fontWeight: '700', color: '#475569' },
  gridSeatTextDark: { color: '#FFFFFF' },

  passengerCard: {
    backgroundColor: '#FFFFFF',
    marginHorizontal: theme.spacing.md,
    marginTop: theme.spacing.md,
    padding: 16,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  passengerHeader: { flexDirection: 'row', alignItems: 'center', gap: 6, marginBottom: 12 },
  passengerIcon: { fontSize: 16 },
  passengerTitle: { fontSize: 15, fontWeight: '700', color: '#0F172A' },
  passengerBox: {
    backgroundColor: '#F8FAFC',
    padding: 12,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    gap: 10,
  },
  selectedSeatPillText: { fontSize: 13, fontWeight: '700', color: '#0284C7' },
  inputField: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#CBD5E1',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
    fontSize: 13,
    color: '#0F172A',
    fontWeight: '600',
  },
  rowInputs: { flexDirection: 'row', gap: 8 },

  bottomBarCard: {
    backgroundColor: '#FFFFFF',
    marginHorizontal: theme.spacing.md,
    marginTop: theme.spacing.md,
    padding: 16,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    gap: 12,
  },
  bottomBarRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  selectedSeatsLabel: { fontSize: 11, color: '#64748B' },
  selectedSeatsVal: { fontSize: 15, fontWeight: '700', color: '#0F172A' },
  totalAmountLabel: { fontSize: 11, color: '#64748B' },
  totalAmountVal: { fontSize: 22, fontWeight: '800', color: '#0284C7' },
  proceedBtn: {
    backgroundColor: '#0F172A',
    borderRadius: 10,
    paddingVertical: 14,
    alignItems: 'center',
  },
  proceedBtnDisabled: { backgroundColor: '#94A3B8' },
  proceedBtnText: { color: '#FFFFFF', fontSize: 14, fontWeight: '700' },
});
