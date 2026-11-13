import React, { useState } from 'react';
import { StyleSheet, Text, View, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { Colors, BorderRadius, Spacing } from '../src/constants/theme';
import { useSearchStore } from '../src/store/useSearchStore';
import { useTicketStore } from '../src/store/useTicketStore';

// High-Speed Rail 2+2 Seating Layout (A & D are Window seats, B & C are Aisle seats)
const ROWS = ['1', '2', '3', '4', '5', '6', '7', '8'];
const COLS = [
  { id: 'A', type: 'Window' },
  { id: 'B', type: 'Aisle' },
  { id: 'C', type: 'Aisle' },
  { id: 'D', type: 'Window' },
];

export default function SeatSelectionScreen() {
  const router = useRouter();
  const { selectedTrain, params } = useSearchStore();
  const addTicket = useTicketStore((s: any) => s.addTicket);
  const requiredSeats = params.passengers || 1;
  
  // Default first available seat selected
  const [selectedSeats, setSelectedSeats] = useState<string[]>(['1A']);

  const toggleSeat = (seatId: string) => {
    if (selectedSeats.includes(seatId)) {
      if (selectedSeats.length === 1) {
        Alert.alert('Selection Notice', 'At least one seat must be selected for your journey.');
        return;
      }
      setSelectedSeats(selectedSeats.filter((s) => s !== seatId));
    } else {
      if (selectedSeats.length >= requiredSeats) {
        Alert.alert(
          'Passenger Limit Reached',
          `You have selected seats for all ${requiredSeats} passenger(s). Deselect a seat to change your choice.`
        );
        return;
      }
      setSelectedSeats([...selectedSeats, seatId]);
    }
  };

  const confirmSeats = () => {
    if (selectedSeats.length < requiredSeats) {
      Alert.alert('Incomplete Selection', `Please select all ${requiredSeats} required seat(s).`);
      return;
    }

    const seatClass = (params as { seatClass?: string }).seatClass || 'standard';
    const farePerSeat = seatClass === 'business'
      ? (selectedTrain?.fare?.business ?? 2400)
      : (selectedTrain?.fare?.standard ?? 1200);

    // 1. Generate new ticket entry for the store
    const newTicket = {
      id: `TICKET-${Date.now()}`,
      bookingId: `MAHSR-${Math.floor(100000 + Math.random() * 900000)}`,
      trainNumber: selectedTrain?.number || 'T-20501',
      trainName: selectedTrain?.name || 'Bullet Express',
      fromStation: params.fromStation || { code: 'BCT', name: 'Mumbai Central' },
      toStation: params.toStation || { code: 'ADI', name: 'Ahmedabad' },
      travelDate: (params as unknown as { date?: string }).date || 'Today',
      departureTime: selectedTrain?.departureTime || '06:00 AM',
      arrivalTime: selectedTrain?.arrivalTime || '08:07 AM',
      seatClass,
      seats: selectedSeats,
      fare: farePerSeat * selectedSeats.length,
      passengerName: 'Tejas Passenger',
      qrData: JSON.stringify({
        bookingId: `MAHSR-${Date.now()}`,
        train: selectedTrain?.number || 'T-20501',
        seats: selectedSeats,
      }),
      createdAt: Date.now(),
    };

    // 2. Save to Ticket Store
    addTicket(newTicket);

    // 3. Success Alert and Redirection to My Tickets tab
    Alert.alert(
      'Booking Confirmed 🎉',
      `Successfully reserved seats: ${selectedSeats.join(', ')}\nYour digital ticket is ready!`,
      [
        {
          text: 'View My Tickets',
          onPress: () => router.replace('/(tabs)/tickets'),
        },
      ]
    );
  };

  return (
    <SafeAreaView style={styles.root} edges={['top']}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={20} color={Colors.primary} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Choose Your Seats</Text>
        <View style={{ width: 36 }} />
      </View>

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        {/* Info Card */}
        <View style={styles.infoCard}>
          <Ionicons name="information-circle-outline" size={20} color={Colors.secondary} />
          <Text style={styles.infoText}>
            Selecting {selectedSeats.length} of {requiredSeats} required seat(s) for {selectedTrain?.name ?? 'MAHSR Express'}. Tap any available seat to choose.
          </Text>
        </View>

        {/* Legend */}
        <View style={styles.legendRow}>
          <View style={styles.legendItem}>
            <View style={[styles.legendBox, styles.seatAvailable]} />
            <Text style={styles.legendText}>Available</Text>
          </View>
          <View style={styles.legendItem}>
            <View style={[styles.legendBox, styles.seatSelected]} />
            <Text style={styles.legendText}>Selected</Text>
          </View>
          <View style={styles.legendItem}>
            <View style={[styles.legendBox, styles.seatOccupied]} />
            <Text style={styles.legendText}>Occupied</Text>
          </View>
        </View>

        {/* Coach Grid Layout */}
        <View style={styles.coachContainer}>
          <View style={styles.cabinHeader}>
            <Ionicons name="train" size={18} color={Colors.primary} />
            <Text style={styles.cabinTitle}>Executive Coach C2 (2+2 Layout)</Text>
          </View>

          {/* Column Headings */}
          <View style={styles.columnHeaderRow}>
            <Text style={styles.colHeaderText}>Window</Text>
            <Text style={styles.colHeaderText}>Aisle</Text>
            <View style={{ width: 20 }} />
            <Text style={styles.colHeaderText}>Aisle</Text>
            <Text style={styles.colHeaderText}>Window</Text>
          </View>

          {ROWS.map((rowNum) => (
            <View key={rowNum} style={styles.seatRow}>
              <Text style={styles.rowLabel}>{rowNum}</Text>
              <View style={styles.seatsGroup}>
                {COLS.map((col, idx) => {
                  const seatId = `${rowNum}${col.id}`;
                  const isSelected = selectedSeats.includes(seatId);
                  // Simulating some pre-booked occupied seats
                  const isOccupied = seatId === '2B' || seatId === '5C' || seatId === '7A';

                  return (
                    <React.Fragment key={seatId}>
                      {idx === 2 && <View style={styles.aisleGap} />}
                      <TouchableOpacity
                        style={[
                          styles.seatItem,
                          isOccupied && styles.seatItemOccupied,
                          isSelected && styles.seatItemSeleted,
                        ]}
                        disabled={isOccupied}
                        onPress={() => toggleSeat(seatId)}
                        activeOpacity={0.7}
                      >
                        <Text
                          style={[
                            styles.seatText,
                            isOccupied && styles.seatTextOccupied,
                            isSelected && styles.seatTextSelected,
                          ]}
                        >
                          {seatId}
                        </Text>
                      </TouchableOpacity>
                    </React.Fragment>
                  );
                })}
              </View>
            </View>
          ))}
        </View>
      </ScrollView>

      {/* Bottom Action Footer */}
      <View style={styles.footerBar}>
        <View>
          <Text style={styles.footerLabel}>Selected Seats</Text>
          <Text style={styles.footerValue}>{selectedSeats.join(', ') || 'None'}</Text>
        </View>
        <TouchableOpacity 
          style={[styles.confirmButton, selectedSeats.length < requiredSeats && styles.disabledBtn]} 
          onPress={confirmSeats} 
          activeOpacity={0.85}
        >
          <Text style={styles.confirmButtonText}>Confirm Seats</Text>
          <Ionicons name="checkmark-circle" size={18} color={Colors.primary} style={{ marginLeft: 6 }} />
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: Colors.surface },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: Spacing.base,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: Colors.divider,
  },
  backButton: {
    width: 36,
    height: 36,
    borderRadius: BorderRadius.full,
    backgroundColor: Colors.surfaceCard,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: Colors.divider,
  },
  headerTitle: { fontSize: 18, fontWeight: '800', color: Colors.primary },
  content: { padding: Spacing.base, paddingBottom: 100 },
  infoCard: {
    flexDirection: 'row',
    backgroundColor: '#E5F3FD',
    padding: 12,
    borderRadius: BorderRadius.md,
    alignItems: 'center',
    gap: 10,
    marginBottom: 16,
  },
  infoText: { flex: 1, fontSize: 12, color: Colors.primary, fontWeight: '600' },
  legendRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    backgroundColor: Colors.surfaceCard,
    padding: 12,
    borderRadius: BorderRadius.lg,
    borderWidth: 1,
    borderColor: Colors.divider,
    marginBottom: 20,
  },
  legendItem: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  legendBox: { width: 14, height: 14, borderRadius: 3 },
  seatAvailable: { backgroundColor: '#E2E8F0', borderWidth: 1, borderColor: '#CBD5E0' },
  seatSelected: { backgroundColor: Colors.secondary },
  seatOccupied: { backgroundColor: '#CBD5E0', opacity: 0.5 },
  legendText: { fontSize: 11, color: Colors.textSecondary, fontWeight: '600' },
  coachContainer: {
    backgroundColor: Colors.surfaceCard,
    borderRadius: BorderRadius.xl,
    padding: 18,
    borderWidth: 1,
    borderColor: Colors.divider,
    alignItems: 'center',
  },
  cabinHeader: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 14 },
  cabinTitle: { fontSize: 14, fontWeight: '800', color: Colors.primary },
  columnHeaderRow: {
    flexDirection: 'row',
    width: '100%',
    justifyContent: 'space-between',
    paddingHorizontal: 24,
    marginBottom: 10,
  },
  colHeaderText: { fontSize: 10, fontWeight: '700', color: Colors.textSecondary },
  seatRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 12, gap: 10 },
  rowLabel: { fontSize: 13, fontWeight: '800', color: Colors.textSecondary, width: 14, textAlign: 'center' },
  seatsGroup: { flexDirection: 'row', alignItems: 'center' },
  aisleGap: { width: 24 },
  seatItem: {
    width: 38,
    height: 42,
    borderRadius: BorderRadius.sm,
    backgroundColor: '#F8FAFC',
    borderWidth: 1,
    borderColor: Colors.divider,
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: 3,
  },
  seatItemSeleted: { backgroundColor: Colors.secondary, borderColor: Colors.secondary },
  seatItemOccupied: { backgroundColor: '#E2E8F0', opacity: 0.4 },
  seatText: { fontSize: 12, fontWeight: '700', color: Colors.textPrimary },
  seatTextSelected: { color: '#fff' },
  seatTextOccupied: { color: Colors.textSecondary },
  footerBar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: Colors.surfaceCard,
    borderTopWidth: 1,
    borderTopColor: Colors.divider,
    paddingHorizontal: Spacing.base,
    paddingVertical: 14,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  footerLabel: { fontSize: 10, color: Colors.textSecondary, fontWeight: '600' },
  footerValue: { fontSize: 15, fontWeight: '800', color: Colors.primary, marginTop: 2, maxWidth: 160 },
  confirmButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.accent,
    paddingHorizontal: 18,
    paddingVertical: 12,
    borderRadius: BorderRadius.md,
  },
  disabledBtn: { opacity: 0.5 },
  confirmButtonText: { color: Colors.primary, fontWeight: '800', fontSize: 14 },
});