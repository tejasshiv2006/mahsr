import { View, Text, TouchableOpacity, ScrollView, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router, useLocalSearchParams } from 'expo-router';
import QRCode from 'react-native-qrcode-svg';
import { Colors, BorderRadius } from '../src/constants/theme';
import { useTicketStore } from '../src/store/useTicketStore';
import { useAppStore } from '../src/store/useAppStore';
import { translations } from '../src/constants/translations';
import { localStationName } from '../src/constants/stations';

export default function TicketScreen() {
  const { id } = useLocalSearchParams<{ id?: string }>();
  const tickets = useTicketStore((s) => s.tickets);
  const ticket = tickets.find((x) => x.id === id) ?? tickets[0];
  const language = useAppStore((s) => s.language);
  const t = translations[language];

  if (!ticket) {
    return (
      <SafeAreaView style={styles.center}>
        <Text>{t.noTicketFound}</Text>
        <TouchableOpacity onPress={() => router.replace('/(tabs)/search')}>
          <Text style={styles.link}>{t.searchTrains}</Text>
        </TouchableOpacity>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.root} edges={['top', 'bottom']}>
      <ScrollView contentContainerStyle={styles.body}>
        <TouchableOpacity onPress={() => router.replace('/(tabs)/tickets')}>
          <Text style={styles.back}>‹ {t.myTickets}</Text>
        </TouchableOpacity>

        <View style={styles.card}>
          <Text style={styles.demo}>{t.demoWatermark}</Text>
          <Text style={styles.route}>{localStationName(ticket.fromStation, language)} → {localStationName(ticket.toStation, language)}</Text>
          <Text style={styles.muted}>{ticket.trainNumber} {ticket.trainName}</Text>

          <View style={styles.grid}>
            <Field label={t.travelDate} value={ticket.travelDate} />
            <Field label={t.departure} value={ticket.departureTime} />
            <Field label={t.arrival} value={ticket.arrivalTime} />
            <Field label={t.classLabel} value={ticket.seatClass === 'standard' ? t.standardClass : t.businessClass} />
            <Field label={t.seatsLabel} value={ticket.seats.join(', ')} />
            <Field label={t.fare} value={`₹${ticket.fare.toLocaleString('en-IN')}`} />
          </View>

          <View style={styles.qr}>
            <QRCode value={ticket.qrData} size={160} />
          </View>
          <Text style={styles.booking}>{t.bookingId} {ticket.bookingId}</Text>
          <Text style={styles.muted}>{t.passengerName}: {ticket.passengerName}</Text>
        </View>

        <TouchableOpacity style={styles.cta} onPress={() => router.push('/journey-tracking')}>
          <Text style={styles.ctaText}>{t.trackJourney}</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

const Field = ({ label, value }: { label: string; value: string }) => (
  <View style={styles.field}>
    <Text style={styles.muted}>{label}</Text>
    <Text style={styles.value}>{value}</Text>
  </View>
);

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: Colors.primary },
  center: { flex: 1, alignItems: 'center', justifyContent: 'center', gap: 8 },
  body: { padding: 16, gap: 16 },
  back: { color: Colors.textOnDark, fontSize: 15 },
  card: { backgroundColor: Colors.surfaceCard, borderRadius: BorderRadius.xl, padding: 20, alignItems: 'center' },
  demo: { color: Colors.demoRed, fontSize: 11, fontWeight: '800', marginBottom: 10 },
  route: { fontSize: 22, fontWeight: '800', color: Colors.textPrimary, textAlign: 'center' },
  muted: { color: Colors.textSecondary, fontSize: 13 },
  grid: { flexDirection: 'row', flexWrap: 'wrap', marginTop: 16, width: '100%' },
  field: { width: '50%', paddingVertical: 8 },
  value: { fontSize: 16, fontWeight: '700', color: Colors.textPrimary },
  qr: { marginTop: 12, padding: 12, backgroundColor: '#fff', borderRadius: BorderRadius.md, borderWidth: 1, borderColor: Colors.divider },
  booking: { marginTop: 12, fontWeight: '800', color: Colors.textPrimary },
  link: { color: Colors.secondary, fontWeight: '700' },
  cta: { backgroundColor: Colors.accent, borderRadius: BorderRadius.md, padding: 16, alignItems: 'center' },
  ctaText: { color: Colors.primary, fontWeight: '800', fontSize: 16 },
});
