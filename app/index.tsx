import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView, Switch, Alert, Linking } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { Colors, BorderRadius } from '../src/constants/theme';

export default function SupportScreen() {
  const [wheelchairRequested, setWheelchairRequested] = useState(false);
  const [audioAnnounce, setAudioAnnounce] = useState(true);

  const handleBack = () => {
    if (router.canGoBack()) {
      router.back();
    } else {
      router.replace('/(tabs)/search');
    }
  };

  const handleEmergencyCall = () => {
    Alert.alert(
      'MAHSR Emergency Helpline',
      'Connect directly to Railway Emergency Assistance (139)?',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Call 139', style: 'destructive', onPress: () => Linking.openURL('tel:139') },
      ]
    );
  };

  const toggleWheelchair = (value: boolean) => {
    setWheelchairRequested(value);
    if (value) {
      Alert.alert(
        'Assistance Requested',
        'Station staff at your boarding and destination platforms have been notified for wheelchair & ramp support.'
      );
    }
  };

  return (
    <SafeAreaView style={styles.root} edges={['top']}>
      <View style={styles.header}>
        <TouchableOpacity onPress={handleBack} hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}>
          <Text style={styles.backText}>← Back</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Help & Accessibility</Text>
      </View>

      <ScrollView contentContainerStyle={styles.body} showsVerticalScrollIndicator={false}>
        {/* Emergency Assistance */}
        <View style={styles.emergencyCard}>
          <Text style={styles.emergencyTitle}>MAHSR Helpline & Emergency</Text>
          <Text style={styles.emergencyNumber}>139 / 1800-HIGH-SPEED</Text>
          <TouchableOpacity style={styles.emergencyBtn} onPress={handleEmergencyCall} activeOpacity={0.85}>
            <Text style={styles.emergencyBtnText}>Call Emergency Assistance</Text>
          </TouchableOpacity>
        </View>

        {/* Accessibility Services */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Accessibility Assistance</Text>
          <View style={styles.switchRow}>
            <Text style={styles.label}>Request Station Wheelchair & Ramp</Text>
            <Switch
              value={wheelchairRequested}
              onValueChange={toggleWheelchair}
              trackColor={{ false: '#CBD5E0', true: Colors.primary }}
              thumbColor="#FFFFFF"
            />
          </View>
          <View style={[styles.switchRow, styles.lastRow]}>
            <Text style={styles.label}>Screen Reader / Audio Announcements</Text>
            <Switch
              value={audioAnnounce}
              onValueChange={setAudioAnnounce}
              trackColor={{ false: '#CBD5E0', true: Colors.primary }}
              thumbColor="#FFFFFF"
            />
          </View>
        </View>

        {/* FAQs */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Frequently Asked Questions</Text>
          <TouchableOpacity
            style={styles.faqRow}
            onPress={() => Alert.alert('Instant Refunds', 'Cancellations made more than 2 hours before departure are refunded automatically to your original payment method within 24 hours.')}
          >
            <Text style={styles.faqText}>How do instant cancellation refunds work?</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.faqRow, styles.lastRow]}
            onPress={() => Alert.alert('Offline QR Tickets', 'Your MAHSR digital QR pass is cached locally on your device and works at station AFC gates without an active internet connection.')}
          >
            <Text style={styles.faqText}>Can I scan QR tickets offline?</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: Colors.primary },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255,255,255,0.12)',
  },
  backText: { color: '#FFFFFF', fontSize: 14, fontWeight: '700', marginRight: 16 },
  headerTitle: { fontSize: 18, fontWeight: '800', color: '#FFFFFF' },
  body: { padding: 16, gap: 16 },
  emergencyCard: {
    backgroundColor: '#FFF5F5',
    borderWidth: 1,
    borderColor: '#FEB2B2',
    padding: 18,
    borderRadius: BorderRadius.xl,
  },
  emergencyTitle: { fontSize: 14, fontWeight: '800', color: '#C53030' },
  emergencyNumber: { fontSize: 20, fontWeight: '900', color: '#9B2C2C', marginTop: 4 },
  emergencyBtn: {
    backgroundColor: '#E53E3E',
    marginTop: 12,
    paddingVertical: 12,
    borderRadius: BorderRadius.md,
    alignItems: 'center',
  },
  emergencyBtnText: { color: '#FFFFFF', fontWeight: '800', fontSize: 14 },
  card: { backgroundColor: '#FFFFFF', borderRadius: BorderRadius.xl, padding: 18 },
  cardTitle: { fontSize: 16, fontWeight: '800', color: Colors.textPrimary, marginBottom: 12 },
  switchRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#EDF2F7',
  },
  label: { fontSize: 13, color: Colors.textPrimary, flex: 1, paddingRight: 12 },
  faqRow: { paddingVertical: 10, borderBottomWidth: 1, borderBottomColor: '#EDF2F7' },
  faqText: { fontSize: 13, color: '#3182CE', fontWeight: '600' },
  lastRow: { borderBottomWidth: 0, paddingBottom: 2 },
});