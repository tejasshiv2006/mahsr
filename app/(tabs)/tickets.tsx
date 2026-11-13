import React from 'react';
import { View, Text, TouchableOpacity, ScrollView, StyleSheet, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { Colors, BorderRadius } from '../../src/constants/theme';
import { useTicketStore } from '../../src/store/useTicketStore';
import { useAppStore } from '../../src/store/useAppStore';
import { translations } from '../../src/constants/translations';
import { localStationName } from '../../src/constants/stations';

export default function TicketsTabScreen() {
  const tickets = useTicketStore((s: any) => s.tickets);
  const language = useAppStore((s: any) => s.language);
  const t = translations[language as keyof typeof translations] ?? translations.en;

  // Foolproof station text helper using localStationName & fallback keys
  const getStationText = (station: any) => {
    if (!station) return '';
    if (typeof station === 'string') return station;
    if (typeof station === 'object') {
      try {
        const localized = localStationName ? localStationName(station, language) : null;
        if (localized && typeof localized === 'string') return localized;
      } catch (e) {}

      const name = station.name || station.nameHi || station.nameMr || station.nameGu || station.code;
      if (typeof name === 'string') return name;
      if (name && typeof name === 'object') return name.en || name.name || '';
    }
    return '';
  };

  // Foolproof safe text handler to prevent object crashes
  const safeText = (val: any) => {
    if (!val) return '';
    if (typeof val === 'string' || typeof val === 'number') return String(val);
    if (typeof val === 'object') {
      const obj: any = val;
      const text = obj.name || obj.en || obj.code || obj.title || obj.value;
      if (typeof text === 'string') return text;
      if (text && typeof text === 'object') return text.en || text.name || '';
      return '';
    }
    return String(val);
  };

  return (
    <SafeAreaView style={styles.root} edges={['top']}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>{t.myTickets || 'My Tickets'}</Text>
      </View>

      <ScrollView contentContainerStyle={styles.body} showsVerticalScrollIndicator={false}>
        {(!tickets || tickets.length === 0) ? (
          <View style={styles.center}>
            <Text style={styles.noTicketText}>{t.noTicketFound || 'No active tickets found.'}</Text>
            <TouchableOpacity style={styles.searchButton} onPress={() => router.replace('/(tabs)/search')}>
              <Text style={styles.searchButtonText}>{t.searchTrains || 'Search Trains'}</Text>
            </TouchableOpacity>
          </View>
        ) : (
          tickets.map((ticket: any) => {
            const validQrData = ticket.qrData && ticket.qrData.trim().length > 0 
              ? ticket.qrData 
              : JSON.stringify({
                  id: ticket.id,
                  bookingId: ticket.bookingId,
                  trainNumber: ticket.trainNumber,
                  passengerName: ticket.passengerName,
                  seats: ticket.seats,
                  date: ticket.travelDate
                });

            const qrImageUrl = `https://api.qrserver.com/v1/create-qr-code/?size=140x140&data=${encodeURIComponent(validQrData)}`;

            return (
              <TouchableOpacity 
                key={ticket.id} 
                style={styles.card}
                onPress={() => router.push(`/ticket?id=${ticket.id}`)}
              >
                <View style={styles.cardHeader}>
                  <Text style={styles.route}>
                    {getStationText(ticket.fromStation)} → {getStationText(ticket.toStation)}
                  </Text>
                  <Text style={styles.statusBadge}>CONFIRMED</Text>
                </View>

                <Text style={styles.trainInfo}>
                  {safeText(ticket.trainNumber)} {safeText(ticket.trainName)}
                </Text>

                <View style={styles.detailsRow}>
                  <View>
                    <Text style={styles.muted}>{t.travelDate || 'Date'}</Text>
                    <Text style={styles.value}>{safeText(ticket.travelDate)}</Text>
                  </View>
                  <View>
                    <Text style={styles.muted}>{t.departure || 'Departure'}</Text>
                    <Text style={styles.value}>{safeText(ticket.departureTime)}</Text>
                  </View>
                  <View>
                    <Text style={styles.muted}>{t.seatsLabel || 'Seats'}</Text>
                    <Text style={styles.value}>
                      {Array.isArray(ticket.seats) ? ticket.seats.map((s: any) => safeText(s)).join(', ') : safeText(ticket.seats)}
                    </Text>
                  </View>
                </View>

                <View style={styles.qrRow}>
                  <Image source={{ uri: qrImageUrl }} style={styles.qrImage} resizeMode="contain" />
                  <View style={{ flex: 1, marginLeft: 12, justifyContent: 'center' }}>
                    <Text style={styles.muted}>{t.bookingId || 'Booking ID'}</Text>
                    <Text style={styles.bookingIdText}>{safeText(ticket.bookingId)}</Text>
                    <Text style={styles.tapText}>Tap to view full ticket & QR</Text>
                  </View>
                </View>
              </TouchableOpacity>
            );
          })
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: Colors.primary },
  header: { paddingHorizontal: 16, paddingVertical: 14, borderBottomWidth: 1, borderBottomColor: 'rgba(255,255,255,0.1)' },
  headerTitle: { fontSize: 18, fontWeight: '800', color: '#FFFFFF' },
  body: { padding: 16, gap: 16 },
  center: { alignItems: 'center', justifyContent: 'center', marginTop: 60, gap: 16 },
  noTicketText: { color: '#FFFFFF', fontSize: 16, textAlign: 'center' },
  searchButton: { backgroundColor: Colors.accent, paddingHorizontal: 20, paddingVertical: 12, borderRadius: BorderRadius.md },
  searchButtonText: { color: Colors.primary, fontWeight: '800', fontSize: 15 },
  card: { backgroundColor: '#FFFFFF', borderRadius: BorderRadius.xl, padding: 16, marginBottom: 12, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.1, shadowRadius: 4, elevation: 3 },
  cardHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  route: { fontSize: 16, fontWeight: '800', color: Colors.textPrimary, flex: 1 },
  statusBadge: { fontSize: 10, fontWeight: '800', color: '#38A169', backgroundColor: '#F0FFF4', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 6 },
  trainInfo: { fontSize: 13, color: '#718096', marginTop: 4, fontWeight: '600' },
  detailsRow: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 12, paddingVertical: 8, borderTopWidth: 1, borderBottomWidth: 1, borderColor: '#EDF2F7' },
  muted: { fontSize: 11, color: '#718096' },
  value: { fontSize: 13, fontWeight: '700', color: Colors.textPrimary, marginTop: 2 },
  qrRow: { flexDirection: 'row', alignItems: 'center', marginTop: 12, backgroundColor: '#F7FAFC', padding: 10, borderRadius: BorderRadius.md },
  qrImage: { width: 60, height: 60, backgroundColor: '#FFFFFF' },
  bookingIdText: { fontSize: 13, fontWeight: '800', color: Colors.primary, marginTop: 2 },
  tapText: { fontSize: 10, color: '#3182CE', marginTop: 4, fontWeight: '700' },
});