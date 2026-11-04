import { useMemo } from 'react';
import { View, Text, TouchableOpacity, ScrollView, Alert, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { Colors, BorderRadius } from '../src/constants/theme';
import { useSearchStore } from '../src/store/useSearchStore';
import { useTicketStore } from '../src/store/useTicketStore';
import { useAppStore } from '../src/store/useAppStore';
import { translations } from '../src/constants/translations';

const ROWS = 10;
const COLS = ['A', 'B', 'C', 'D'];

export default function SeatSelection() {
  const { selectedTrain: train, selectedSeats, toggleSeat, selectedClass, params } = useSearchStore();
  const addTicket = useTicketStore((s) => s.addTicket);
  const user = useAppStore((s) => s.user);
  const language = useAppStore((s) => s.language);
  const t = translations[language];

  // Deterministic "taken" seats so the layout is stable between renders.
  const taken = useMemo(() => {
    const set = new Set<string>();
    for (let i = 0; i < ROWS * COLS.length; i++) {
      if ((i * 7 + 3) % 5 < 2) set.add(`${Math.floor(i / 4) + 1}${COLS[i % 4]}`);
    }
    return set;
  }, []);

  if (!train) {
    return (
      <SafeAreaView style={styles.center}>
        <Text>{t.noTrainSelected}</Text>
        <TouchableOpacity onPress={() => router.replace('/(tabs)/search')}>
          <Text style={styles.link}>{t.searchTrains}</Text>
        </TouchableOpacity>
      </SafeAreaView>
    );
  }

  const total = selectedSeats.length * train.fare[selectedClass];

  const confirm = () => {
    if (selectedSeats.length !== params.passengers) {
      Alert.alert(t.selectSeatsTitle, t.selectSeatsMsg.replace('{n}', String(params.passengers)));
      return;
    }
    const id = `TKT${Date.now()}`;
    const bookingId = `MH${Math.random().toString(36).slice(2, 8).toUpperCase()}`;
    addTicket({
      id,
      bookingId,
      passengerName: user?.name ?? 'Guest',
      trainId: train.id,
      trainName: train.name,
      trainNumber: train.number,
      fromStation: params.fromStation?.name ?? 'Mumbai (BKC)',
      toStation: params.toStation?.name ?? 'Ahmedabad',
      travelDate: params.travelDate.toLocaleDateString('en-IN'),
      departureTime: train.departureTime,
      arrivalTime: train.arrivalTime,
      seats: selectedSeats,
      seatClass: selectedClass,
      fare: total,
      qrData: `DEMO|${bookingId}|${train.number}|${selectedSeats.join(',')}`,
      generatedAt: new Date().toISOString(),
    });
    router.replace({ pathname: '/ticket', params: { id } });
  };

  return (
    <SafeAreaView style={styles.root} edges={['top', 'bottom']}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}><Text style={styles.back}>‹ {t.back}</Text></TouchableOpacity>
        <Text style={styles.title}>{t.seatSelection}</Text>
        <Text style={styles.sub}>{train.number} · {selectedClass === 'standard' ? t.standardClass : t.businessClass} · {params.passengers} {t.passengersCount}</Text>
      </View>

      <ScrollView contentContainerStyle={styles.body}>
        <View style={styles.legend}>
          <Legend color={Colors.available} label={t.available} />
          <Legend color={Colors.selected} label={t.selected} />
          <Legend color={Colors.unavailable} label={t.unavailable} />
        </View>

        {Array.from({ length: ROWS }, (_, r) => (
          <View key={r} style={styles.seatRow}>
            {COLS.map((c, ci) => {
              const id = `${r + 1}${c}`;
              const isTaken = taken.has(id);
              const isSel = selectedSeats.includes(id);
              return (
                <View key={id} style={[styles.seatWrap, ci === 2 && { marginLeft: 22 }]}>
                  <TouchableOpacity
                    disabled={isTaken}
                    onPress={() => toggleSeat(id)}
                    style={[styles.seat, isTaken && styles.taken, isSel && styles.sel]}
                    accessibilityLabel={`Seat ${id}`}
                  >
                    <Text style={[styles.seatText, isSel && { color: Colors.primary }]}>{id}</Text>
                  </TouchableOpacity>
                </View>
              );
            })}
          </View>
        ))}
      </ScrollView>

      <View style={styles.footer}>
        <View>
          <Text style={styles.muted}>{selectedSeats.join(', ') || t.noSeatsYet}</Text>
          <Text style={styles.total}>₹{total.toLocaleString('en-IN')}</Text>
        </View>
        <TouchableOpacity style={styles.cta} onPress={confirm}>
          <Text style={styles.ctaText}>{t.bookDemoTicket}</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const Legend = ({ color, label }: { color: string; label: string }) => (
  <View style={styles.legendItem}>
    <View style={[styles.legendDot, { backgroundColor: color }]} />
    <Text style={styles.muted}>{label}</Text>
  </View>
);

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: Colors.surface },
  center: { flex: 1, alignItems: 'center', justifyContent: 'center', gap: 8 },
  header: { backgroundColor: Colors.primary, padding: 20, paddingBottom: 24 },
  back: { color: Colors.textOnDark, marginBottom: 10, fontSize: 15 },
  title: { color: Colors.textOnDark, fontSize: 22, fontWeight: '800' },
  sub: { color: '#B8C7DA', marginTop: 2 },
  body: { padding: 16, alignItems: 'center', gap: 8 },
  legend: { flexDirection: 'row', gap: 16, marginBottom: 8 },
  legendItem: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  legendDot: { width: 12, height: 12, borderRadius: 4 },
  seatRow: { flexDirection: 'row', gap: 8 },
  seatWrap: {},
  seat: { width: 52, height: 44, borderRadius: BorderRadius.sm, backgroundColor: Colors.available, alignItems: 'center', justifyContent: 'center' },
  taken: { backgroundColor: Colors.unavailable },
  sel: { backgroundColor: Colors.selected },
  seatText: { color: '#fff', fontSize: 12, fontWeight: '700' },
  muted: { color: Colors.textSecondary, fontSize: 13 },
  link: { color: Colors.secondary, fontWeight: '700' },
  footer: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 16, backgroundColor: Colors.surfaceCard, borderTopWidth: 1, borderTopColor: Colors.divider },
  total: { fontSize: 22, fontWeight: '800', color: Colors.textPrimary },
  cta: { backgroundColor: Colors.accent, borderRadius: BorderRadius.md, paddingHorizontal: 20, paddingVertical: 14 },
  ctaText: { color: Colors.primary, fontWeight: '800' },
});
