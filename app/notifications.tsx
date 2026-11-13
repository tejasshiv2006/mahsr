import React from 'react';
import { StyleSheet, Text, View, ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { Colors, BorderRadius, Spacing } from '../src/constants/theme';

interface NotificationItem {
  id: string;
  title: string;
  message: string;
  time: string;
  read: boolean;
  type: 'alert' | 'success' | 'info';
}

const DEMO_NOTIFICATIONS: NotificationItem[] = [
  {
    id: '1',
    title: 'Simulated Journey Update',
    message: 'Your high-speed train MAHSR-01 to Ahmedabad is on schedule. Boarding starts in 20 minutes from Platform 2.',
    time: '10 mins ago',
    read: false,
    type: 'success',
  },
  {
    id: '2',
    title: 'Platform Change Notice',
    message: 'Simulated alert: Platform for Train MAHSR-03 (Mumbai to Surat) has been updated to Platform 4.',
    time: '2 hours ago',
    read: true,
    type: 'alert',
  },
  {
    id: '3',
    title: 'Booking Confirmed',
    message: 'Your ticket for Mumbai (BKC) to Ahmedabad has been generated successfully. Tap to view boarding pass.',
    time: 'Yesterday',
    read: true,
    type: 'info',
  },
];

export default function NotificationsScreen() {
  const router = useRouter();

  return (
    <SafeAreaView style={styles.root} edges={['top']}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={20} color={Colors.primary} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Notifications</Text>
        <View style={{ width: 36 }} />
      </View>

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        {/* Simulated System Banner */}
        <View style={styles.bannerCard}>
          <View style={styles.bannerIconContainer}>
            <Ionicons name="notifications" size={24} color={Colors.primary} />
            <View style={styles.badgeIndicator} />
          </View>
          <View style={{ flex: 1, marginLeft: 12 }}>
            <Text style={styles.bannerTitle}>Notification System[cite: 2]</Text>
            <Text style={styles.bannerSubtitle}>Simulated journey updates[cite: 2] & alerts</Text>
          </View>
        </View>

        <Text style={styles.sectionHeader}>Recent Updates</Text>

        {/* Notification List */}
        {DEMO_NOTIFICATIONS.map((item) => (
          <View key={item.id} style={[styles.notifCard, !item.read && styles.unreadCard]}>
            <View style={styles.notifTopRow}>
              <View style={styles.titleRow}>
                <Ionicons 
                  name={item.type === 'success' ? 'checkmark-circle' : item.type === 'alert' ? 'alert-circle' : 'information-circle'} 
                  size={18} 
                  color={item.type === 'success' ? Colors.success : item.type === 'alert' ? '#ff4d4d' : Colors.secondary} 
                  style={{ marginRight: 6 }}
                />
                <Text style={styles.notifTitle}>{item.title}</Text>
              </View>
              <Text style={styles.notifTime}>{item.time}</Text>
            </View>
            <Text style={styles.notifMessage}>{item.message}</Text>
          </View>
        ))}
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
  content: { padding: Spacing.base, paddingBottom: 32 },
  bannerCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#E5F3FD',
    borderRadius: BorderRadius.xl,
    padding: 16,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#cce7fb',
  },
  bannerIconContainer: {
    width: 44,
    height: 44,
    borderRadius: BorderRadius.full,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  badgeIndicator: {
    position: 'absolute',
    top: 4,
    right: 4,
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#ff4d4d',
    borderWidth: 2,
    borderColor: '#fff',
  },
  bannerTitle: { fontSize: 15, fontWeight: '800', color: Colors.primary },
  bannerSubtitle: { fontSize: 12, color: Colors.textSecondary, marginTop: 2 },
  sectionHeader: { fontSize: 16, fontWeight: '800', color: Colors.primary, marginBottom: 12 },
  notifCard: {
    backgroundColor: Colors.surfaceCard,
    borderRadius: BorderRadius.lg,
    padding: 14,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: Colors.divider,
  },
  unreadCard: {
    backgroundColor: '#fff',
    borderColor: '#b3d9ff',
  },
  notifTopRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  notifTitle: { fontSize: 14, fontWeight: '700', color: Colors.textPrimary },
  notifTime: { fontSize: 10, color: Colors.textSecondary, fontWeight: '600' },
  notifMessage: { fontSize: 13, color: Colors.textSecondary, lineHeight: 18, paddingLeft: 24 },
});