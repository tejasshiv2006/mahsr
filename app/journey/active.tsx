import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView, Switch } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { Colors, BorderRadius } from '../../src/constants/theme';
import { useJourneyStore } from '../../src/store/useJourneyStore';

export default function ActiveJourneyScreen() {
  const {
    currentSpeed,
    nextStation,
    distanceToNext,
    etaMinutes,
    platformNumber,
    coachPosition,
    destinationAlertEnabled,
    toggleDestinationAlert,
  } = useJourneyStore();

  return (
    <SafeAreaView style={styles.root} edges={['top']}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Text style={styles.backText}>← Back</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Live Journey Mode</Text>
      </View>

      <ScrollView contentContainerStyle={styles.body} showsVerticalScrollIndicator={false}>
        {/* Speedometer Card */}
        <View style={styles.speedCard}>
          <Text style={styles.speedText}>{currentSpeed} <Text style={styles.unitText}>km/h</Text></Text>
          <Text style={styles.speedSub}>MAHSR E5 Series Shinkansen Active</Text>
        </View>

        {/* Live Boarding & Platform Guidance */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Boarding & Platform Guidance</Text>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Assigned Platform</Text>
            <Text style={styles.infoValue}>{platformNumber}</Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Recommended Position</Text>
            <Text style={styles.infoValue}>{coachPosition}</Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Next Stop</Text>
            <Text style={styles.infoValue}>{nextStation} ({distanceToNext} km away)</Text>
          </View>
        </View>

        {/* Destination Alert Toggle */}
        <View style={[styles.card, styles.rowBetween]}>
          <View style={{ flex: 1 }}>
            <Text style={styles.cardTitle}>Destination Arrival Alert</Text>
            <Text style={styles.cardMuted}>Vibrate/alarm 10 mins before arrival</Text>
          </View>
          <Switch value={destinationAlertEnabled} onValueChange={toggleDestinationAlert} trackColor={{ true: Colors.primary }} />
        </View>

        {/* Station Map & Amenities Navigation */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Station Navigation & Amenities</Text>
          <Text style={styles.cardMuted}>Concourse Floor 1: Wheelchair Ramp, Luggage Hub, Food Plaza</Text>
          <TouchableOpacity style={styles.secondaryButton} onPress={() => alert('Opening Interactive Station Map...')}>
            <Text style={styles.secondaryButtonText}>View Station Map</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: Colors.primary },
  header: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 16, paddingVertical: 14, borderBottomWidth: 1, borderBottomColor: 'rgba(255,255,255,0.1)' },
  backText: { color: '#FFFFFF', fontSize: 14, fontWeight: '700', marginRight: 16 },
  headerTitle: { fontSize: 18, fontWeight: '800', color: '#FFFFFF' },
  body: { padding: 16, gap: 16 },
  speedCard: { backgroundColor: '#1A202C', padding: 20, borderRadius: BorderRadius.xl, alignItems: 'center' },
  speedText: { fontSize: 42, fontWeight: '900', color: '#38A169' },
  unitText: { fontSize: 18, color: '#A0AEC0' },
  speedSub: { color: '#E2E8F0', fontSize: 12, marginTop: 4, fontWeight: '600' },
  card: { backgroundColor: '#FFFFFF', borderRadius: BorderRadius.xl, padding: 18 },
  cardTitle: { fontSize: 16, fontWeight: '800', color: Colors.textPrimary },
  cardMuted: { fontSize: 12, color: '#718096', marginTop: 4 },
  infoRow: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 10, paddingTop: 10, borderTopWidth: 1, borderTopColor: '#EDF2F7' },
  infoLabel: { fontSize: 13, color: '#718096' },
  infoValue: { fontSize: 13, fontWeight: '700', color: Colors.textPrimary },
  rowBetween: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  secondaryButton: { backgroundColor: '#EDF2F7', marginTop: 12, paddingVertical: 10, borderRadius: BorderRadius.md, alignItems: 'center' },
  secondaryButtonText: { color: Colors.textPrimary, fontWeight: '700', fontSize: 13 },
});