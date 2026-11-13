import React from 'react';
import { StyleSheet, Text, View, ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { Colors, BorderRadius, Spacing } from '../src/constants/theme';
import { useSearchStore } from '../src/store/useSearchStore';

const JOURNEY_STOPS = [
  { name: 'Mumbai Central (BCT)', time: '06:00 AM', status: 'Completed', speed: '0 km/h' },
  { name: 'Thane (TNA)', time: '06:15 AM', status: 'Completed', speed: '315 km/h' },
  { name: 'Virar (VR)', time: '06:32 AM', status: 'Completed', speed: '320 km/h' },
  { name: 'Boisar (BOR)', time: '06:50 AM', status: 'Current Location', speed: '318 km/h' },
  { name: 'Vapi (VAPI)', time: '07:10 AM', status: 'Upcoming', speed: '-' },
  { name: 'Surat (ST)', time: '07:35 AM', status: 'Upcoming', speed: '-' },
  { name: 'Vadodara (BRC)', time: '08:05 AM', status: 'Upcoming', speed: '-' },
  { name: 'Ahmedabad Junction (ADI)', time: '08:07 AM', status: 'Upcoming', speed: '-' },
];

export default function JourneyTrackingScreen() {
  const router = useRouter();
  const { selectedTrain, params } = useSearchStore();

  return (
    <SafeAreaView style={styles.root} edges={['top']}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={20} color={Colors.primary} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Live Running Status</Text>
        <View style={{ width: 36 }} />
      </View>

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        {/* Live Train Card */}
        <View style={styles.liveCard}>
          <View style={styles.liveHeader}>
            <View style={styles.badgeLive}>
              <View style={styles.liveDot} />
              <Text style={styles.liveBadgeText}>LIVE RUNNING</Text>
            </View>
            <Text style={styles.trainNum}>{selectedTrain?.number ?? 'MAHSR #20501'}</Text>
          </View>

          <Text style={styles.trainTitle}>{selectedTrain?.name ?? 'Mumbai - Ahmedabad Express'}</Text>

          <View style={styles.speedMetricRow}>
            <View>
              <Text style={styles.metricLabel}>Current Speed</Text>
              <Text style={styles.metricVal}>318 <Text style={styles.unit}>km/h</Text></Text>
            </View>
            <View style={{ alignItems: 'flex-end' }}>
              <Text style={styles.metricLabel}>Next Station</Text>
              <Text style={styles.metricValSub}>Vapi (VAPI)</Text>
            </View>
          </View>

          {/* Progress Bar */}
          <View style={styles.progressTrack}>
            <View style={[styles.progressBar, { width: '45%' }]} />
          </View>
          <View style={styles.progressLabels}>
            <Text style={styles.progressText}>{params.fromStation?.name ?? 'Mumbai'}</Text>
            <Text style={styles.progressText}>{params.toStation?.name ?? 'Ahmedabad'}</Text>
          </View>
        </View>

        {/* Station Timeline */}
        <Text style={styles.sectionTitle}>Route & Station Stops</Text>
        <View style={styles.timelineContainer}>
          {JOURNEY_STOPS.map((stop, index) => {
            const isCompleted = stop.status === 'Completed';
            const isCurrent = stop.status === 'Current Location';

            return (
              <View key={index} style={styles.timelineRow}>
                <View style={styles.timelineIndicator}>
                  <View style={[
                    styles.nodeCircle, 
                    isCompleted && styles.nodeCompleted,
                    isCurrent && styles.nodeCurrent
                  ]} />
                  {index < JOURNEY_STOPS.length - 1 && <View style={styles.nodeLine} />}
                </View>
                <View style={[styles.stationInfoCard, isCurrent && styles.stationInfoCardActive]}>
                  <View>
                    <Text style={[styles.stopName, isCurrent && styles.stopNameActive]}>{stop.name}</Text>
                    <Text style={styles.stopTime}>{stop.time} · {stop.status}</Text>
                  </View>
                  <Text style={[styles.stopSpeed, isCurrent && styles.stopSpeedActive]}>{stop.speed}</Text>
                </View>
              </View>
            );
          })}
        </View>
      </ScrollView>
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
    width: 36, height: 36, borderRadius: BorderRadius.full, backgroundColor: Colors.surfaceCard,
    alignItems: 'center', justifyContent: 'center', borderWidth: 1, borderColor: Colors.divider,
  },
  headerTitle: { fontSize: 18, fontWeight: '800', color: Colors.primary },
  content: { padding: Spacing.base, paddingBottom: 40 },
  liveCard: {
    backgroundColor: Colors.primary,
    borderRadius: BorderRadius.xl,
    padding: 20,
    marginBottom: 24,
  },
  liveHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 },
  badgeLive: { flexDirection: 'row', alignItems: 'center', backgroundColor: 'rgba(52, 199, 89, 0.2)', paddingHorizontal: 8, paddingVertical: 4, borderRadius: BorderRadius.full, gap: 6 },
  liveDot: { width: 6, height: 6, borderRadius: 3, backgroundColor: '#34C759' },
  liveBadgeText: { color: '#34C759', fontSize: 10, fontWeight: '800' },
  trainNum: { color: '#CBD5E0', fontSize: 12, fontWeight: '700' },
  trainTitle: { color: '#fff', fontSize: 18, fontWeight: '800', marginBottom: 16 },
  speedMetricRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: 16 },
  metricLabel: { color: '#A0AEC0', fontSize: 11, fontWeight: '600' },
  metricVal: { color: '#fff', fontSize: 28, fontWeight: '800', marginTop: 2 },
  unit: { fontSize: 14, fontWeight: '600', color: '#CBD5E0' },
  metricValSub: { color: Colors.accent, fontSize: 16, fontWeight: '800', marginTop: 2 },
  progressTrack: { height: 6, backgroundColor: 'rgba(255,255,255,0.2)', borderRadius: 3, marginBottom: 8, overflow: 'hidden' },
  progressBar: { height: '100%', backgroundColor: Colors.accent, borderRadius: 3 },
  progressLabels: { flexDirection: 'row', justifyContent: 'space-between' },
  progressText: { color: '#E2E8F0', fontSize: 11, fontWeight: '700' },
  sectionTitle: { fontSize: 16, fontWeight: '800', color: Colors.primary, marginBottom: 14 },
  timelineContainer: { backgroundColor: Colors.surfaceCard, borderRadius: BorderRadius.xl, padding: 16, borderWidth: 1, borderColor: Colors.divider },
  timelineRow: { flexDirection: 'row', minHeight: 60 },
  timelineIndicator: { alignItems: 'center', marginRight: 14, width: 16 },
  nodeCircle: { width: 12, height: 12, borderRadius: 6, backgroundColor: '#CBD5E0', borderWidth: 2, borderColor: '#fff', zIndex: 2 },
  nodeCompleted: { backgroundColor: Colors.primary },
  nodeCurrent: { backgroundColor: '#34C759', width: 16, height: 16, borderRadius: 8 },
  nodeLine: { width: 2, flex: 1, backgroundColor: Colors.divider, marginVertical: 2 },
  stationInfoCard: { flex: 1, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingBottom: 16 },
  stationInfoCardActive: { backgroundColor: '#F0F9FF', paddingHorizontal: 10, borderRadius: BorderRadius.md, borderWidth: 1, borderColor: '#BAE6FD' },
  stopName: { fontSize: 14, fontWeight: '700', color: Colors.textPrimary },
  stopNameActive: { color: Colors.primary, fontWeight: '800' },
  stopTime: { fontSize: 11, color: Colors.textSecondary, marginTop: 2 },
  stopSpeed: { fontSize: 12, fontWeight: '700', color: Colors.textSecondary },
  stopSpeedActive: { color: '#34C759', fontWeight: '800' },
});