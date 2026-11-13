import React, { useState } from 'react';
import { StyleSheet, Text, View, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { Colors, BorderRadius, Spacing } from '../src/constants/theme';
import { useSearchStore } from '../src/store/useSearchStore';
import { registerForPushNotificationsAsync, sendTrainNotification } from '../src/Services/notificationService';

export default function TrainDetailsScreen() {
  const router = useRouter();
  const { selectedTrain, params } = useSearchStore();
  const [selectedClass, setSelectedClass] = useState<'Standard' | 'Executive'>('Standard');
  const [isNotifying, setIsNotifying] = useState(false);

  if (!selectedTrain) {
    return (
      <SafeAreaView style={styles.root}>
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>No train selected.</Text>
          <TouchableOpacity onPress={() => router.back()} style={styles.backBtnAction}>
            <Text style={styles.backBtnText}>Go Back to Search</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  const baseFare = selectedClass === 'Executive' 
    ? Math.round(selectedTrain.fare.standard * 1.8) 
    : selectedTrain.fare.standard;
  const totalFare = baseFare * params.passengers;

  const handleBooking = () => {
    router.push('/seat-selection' as any);
  };

  const handleEnableNotification = async () => {
    try {
      setIsNotifying(true);
      const hasPermission = await registerForPushNotificationsAsync();
      if (hasPermission) {
        await sendTrainNotification(selectedTrain.name, selectedTrain.number, '3');
        Alert.alert(
          'Notification Set! 🔔', 
          `You will receive platform and departure updates for ${selectedTrain.name} (${selectedTrain.number}).`
        );
      } else {
        Alert.alert('Permission Required', 'Please enable notification permissions in your device settings.');
      }
    } catch (error) {
      console.error(error);
      Alert.alert('Error', 'Could not schedule notification.');
    } finally {
      setIsNotifying(false);
    }
  };

  return (
    <SafeAreaView style={styles.root} edges={['top']}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={20} color={Colors.primary} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Train Details</Text>
        <TouchableOpacity 
          style={styles.notifyIconButton} 
          onPress={handleEnableNotification}
          activeOpacity={0.7}
        >
          <Ionicons name="notifications-outline" size={18} color={Colors.primary} />
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        {/* Main Train Card */}
        <View style={styles.trainCard}>
          <View style={styles.trainHeader}>
            <View style={{ flex: 1, marginRight: 10 }}>
              <Text style={styles.trainName}>{selectedTrain.name}</Text>
              <Text style={styles.trainMeta}>Train #{selectedTrain.number} · {selectedTrain.type}</Text>
            </View>
            <View style={styles.speedTag}>
              <Ionicons name="flash" size={12} color="#FFD700" />
              <Text style={styles.speedText}>320 km/h</Text>
            </View>
          </View>

          <View style={styles.timeRow}>
            <View>
              <Text style={styles.timeLabel}>Departure</Text>
              <Text style={styles.timeText}>{selectedTrain.departureTime}</Text>
              <Text style={styles.stationText}>{params.fromStation?.name ?? 'Origin'}</Text>
            </View>
            <View style={styles.durationBlock}>
              <Text style={styles.durationText}>{selectedTrain.duration}</Text>
              <View style={styles.routeLine} />
              <Text style={styles.directText}>Non-Stop / Express</Text>
            </View>
            <View style={{ alignItems: 'flex-end' }}>
              <Text style={styles.timeLabel}>Arrival</Text>
              <Text style={styles.timeText}>{selectedTrain.arrivalTime}</Text>
              <Text style={styles.stationText}>{params.toStation?.name ?? 'Destination'}</Text>
            </View>
          </View>

          {/* Quick Notification Alert Strip inside Card */}
          <TouchableOpacity 
            style={styles.alertStrip} 
            onPress={handleEnableNotification}
            activeOpacity={0.8}
          >
            <Ionicons name="notifications" size={14} color={Colors.accent} />
            <Text style={styles.alertStripText}>
              {isNotifying ? 'Setting up alert...' : 'Tap here to enable platform & departure notifications'}
            </Text>
            <Ionicons name="chevron-forward" size={14} color="#CBD5E0" />
          </TouchableOpacity>
        </View>

        {/* Class Selection */}
        <Text style={styles.sectionTitle}>Select Travel Class</Text>
        <View style={styles.classRow}>
          <TouchableOpacity 
            style={[styles.classCard, selectedClass === 'Standard' && styles.classCardActive]}
            onPress={() => setSelectedClass('Standard')}
            activeOpacity={0.8}
          >
            <Text style={[styles.className, selectedClass === 'Standard' && styles.classTextActive]}>Standard Class</Text>
            <Text style={[styles.classSeats, selectedClass === 'Standard' && styles.classTextActive]}>{selectedTrain.availableSeats} seats left</Text>
            <Text style={[styles.classFare, selectedClass === 'Standard' && styles.classTextActive]}>₹{selectedTrain.fare.standard.toLocaleString('en-IN')}</Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={[styles.classCard, selectedClass === 'Executive' && styles.classCardActive]}
            onPress={() => setSelectedClass('Executive')}
            activeOpacity={0.8}
          >
            <Text style={[styles.className, selectedClass === 'Executive' && styles.classTextActive]}>Executive Class</Text>
            <Text style={[styles.classSeats, selectedClass === 'Executive' && styles.classTextActive]}>12 seats left</Text>
            <Text style={[styles.classFare, selectedClass === 'Executive' && styles.classTextActive]}>₹{Math.round(selectedTrain.fare.standard * 1.8).toLocaleString('en-IN')}</Text>
          </TouchableOpacity>
        </View>

        {/* Journey Summary Box */}
        <Text style={styles.sectionTitle}>Fare Summary</Text>
        <View style={styles.summaryCard}>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Base Fare ({selectedClass} x {params.passengers})</Text>
            <Text style={styles.summaryVal}>₹{totalFare.toLocaleString('en-IN')}</Text>
          </View>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Reservation & Tax Charge</Text>
            <Text style={styles.summaryVal}>₹0 (Free Demo)</Text>
          </View>
          <View style={styles.divider} />
          <View style={styles.summaryRow}>
            <Text style={styles.totalLabel}>Total Payable Amount</Text>
            <Text style={styles.totalVal}>₹{totalFare.toLocaleString('en-IN')}</Text>
          </View>
        </View>
      </ScrollView>

      {/* Bottom Booking Action Bar */}
      <View style={styles.footerBar}>
        <View>
          <Text style={styles.footerTotalLabel}>Total Amount</Text>
          <Text style={styles.footerTotalVal}>₹{totalFare.toLocaleString('en-IN')}</Text>
        </View>
        <TouchableOpacity style={styles.bookButton} onPress={handleBooking} activeOpacity={0.85}>
          <Text style={styles.bookButtonText}>Select Seats</Text>
          <Ionicons name="arrow-forward" size={16} color={Colors.primary} style={{ marginLeft: 6 }} />
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: Colors.surface },
  header: { 
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', 
    paddingHorizontal: Spacing.base, paddingVertical: 12, borderBottomWidth: 1, borderBottomColor: Colors.divider 
  },
  backButton: { width: 36, height: 36, borderRadius: BorderRadius.full, backgroundColor: Colors.surfaceCard, alignItems: 'center', justifyContent: 'center', borderWidth: 1, borderColor: Colors.divider },
  notifyIconButton: { width: 36, height: 36, borderRadius: BorderRadius.full, backgroundColor: Colors.surfaceCard, alignItems: 'center', justifyContent: 'center', borderWidth: 1, borderColor: Colors.divider },
  headerTitle: { fontSize: 18, fontWeight: '800', color: Colors.primary },
  content: { padding: Spacing.base, paddingBottom: 100 },
  emptyContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20 },
  emptyText: { fontSize: 16, color: Colors.textSecondary, marginBottom: 16 },
  backBtnAction: { backgroundColor: Colors.primary, paddingHorizontal: 16, paddingVertical: 10, borderRadius: BorderRadius.md },
  backBtnText: { color: '#fff', fontWeight: '700' },
  trainCard: { backgroundColor: Colors.primary, borderRadius: BorderRadius.xl, padding: 18, marginBottom: 20 },
  trainHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' },
  trainName: { color: '#fff', fontSize: 18, fontWeight: '800' },
  trainMeta: { color: '#CBD5E0', fontSize: 12, marginTop: 2 },
  speedTag: { flexDirection: 'row', alignItems: 'center', backgroundColor: 'rgba(255,255,255,0.15)', paddingHorizontal: 8, paddingVertical: 4, borderRadius: BorderRadius.full },
  speedText: { color: '#fff', fontSize: 11, fontWeight: '800', marginLeft: 4 },
  timeRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 16 },
  timeLabel: { color: '#A0AEC0', fontSize: 10, fontWeight: '600' },
  timeText: { color: '#fff', fontSize: 20, fontWeight: '800', marginTop: 2 },
  stationText: { color: '#E2E8F0', fontSize: 12, fontWeight: '600', marginTop: 2 },
  durationBlock: { flex: 1, alignItems: 'center', paddingHorizontal: 10 },
  durationText: { color: Colors.accent, fontSize: 11, fontWeight: '700' },
  routeLine: { height: 1, width: '100%', backgroundColor: 'rgba(255,255,255,0.3)', marginVertical: 6 },
  directText: { color: '#A0AEC0', fontSize: 9 },
  alertStrip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.1)',
    marginTop: 16,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: BorderRadius.md,
    gap: 8,
  },
  alertStripText: { flex: 1, color: '#E2E8F0', fontSize: 11, fontWeight: '700' },
  sectionTitle: { fontSize: 16, fontWeight: '800', color: Colors.primary, marginBottom: 12 },
  classRow: { flexDirection: 'row', gap: 10, marginBottom: 20 },
  classCard: { flex: 1, backgroundColor: Colors.surfaceCard, padding: 14, borderRadius: BorderRadius.lg, borderWidth: 1, borderColor: Colors.divider },
  classCardActive: { backgroundColor: Colors.primary, borderColor: Colors.primary },
  className: { fontSize: 14, fontWeight: '800', color: Colors.textPrimary },
  classSeats: { fontSize: 11, color: Colors.success, fontWeight: '700', marginTop: 4 },
  classFare: { fontSize: 16, fontWeight: '800', color: Colors.primary, marginTop: 8 },
  classTextActive: { color: '#fff' },
  summaryCard: { backgroundColor: Colors.surfaceCard, padding: 16, borderRadius: BorderRadius.lg, borderWidth: 1, borderColor: Colors.divider },
  summaryRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 10 },
  summaryLabel: { fontSize: 13, color: Colors.textSecondary },
  summaryVal: { fontSize: 13, fontWeight: '700', color: Colors.textPrimary },
  divider: { height: 1, backgroundColor: Colors.divider, marginVertical: 10 },
  totalLabel: { fontSize: 14, fontWeight: '800', color: Colors.primary },
  totalVal: { fontSize: 16, fontWeight: '800', color: Colors.primary },
  footerBar: { position: 'absolute', bottom: 0, left: 0, right: 0, backgroundColor: Colors.surfaceCard, borderTopWidth: 1, borderTopColor: Colors.divider, paddingHorizontal: Spacing.base, paddingVertical: 14, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  footerTotalLabel: { fontSize: 11, color: Colors.textSecondary },
  footerTotalVal: { fontSize: 20, fontWeight: '800', color: Colors.primary },
  bookButton: { flexDirection: 'row', alignItems: 'center', backgroundColor: Colors.accent, paddingHorizontal: 20, paddingVertical: 12, borderRadius: BorderRadius.md },
  bookButtonText: { color: Colors.primary, fontWeight: '800', fontSize: 15 },
});