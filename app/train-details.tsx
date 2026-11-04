import { View, Text, TouchableOpacity, ScrollView, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { Colors, BorderRadius } from '../src/constants/theme';
import { useSearchStore } from '../src/store/useSearchStore';
import { useAppStore } from '../src/store/useAppStore';
import { translations } from '../src/constants/translations';
import { localStationName, WEEK_ORDER } from '../src/constants/stations';

export default function TrainDetails() {
  const { selectedTrain: train, selectedClass, setSelectedClass, params } = useSearchStore();
  const language = useAppStore((s) => s.language);
  const t = translations[language];

  if (!train) {
    return (
      <SafeAreaView style={styles.center}>
        <Text style={styles.muted}>{t.noTrainSelected}</Text>
        <TouchableOpacity onPress={() => router.back()}><Text style={styles.link}>{t.back}</Text></TouchableOpacity>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.root} edges={['top', 'bottom']}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}><Text style={styles.back}>‹ {t.back}</Text></TouchableOpacity>
        <Text style={styles.title}>{train.name}</Text>
        <Text style={styles.sub}>{train.number} · {train.type}</Text>
      </View>

      <ScrollView contentContainerStyle={styles.body}>
        <View style={styles.card}>
          <View style={styles.row}>
            <View>
              <Text style={styles.time}>{train.departureTime}</Text>
              <Text style={styles.muted}>{localStationName(params.fromStation?.name ?? 'Mumbai (BKC)', language)}</Text>
            </View>
            <Text style={styles.muted}>{train.duration}</Text>
            <View style={{ alignItems: 'flex-end' }}>
              <Text style={styles.time}>{train.arrivalTime}</Text>
              <Text style={styles.muted}>{localStationName(params.toStation?.name ?? 'Ahmedabad', language)}</Text>
            </View>
          </View>
        </View>

        <Text style={styles.section}>{t.chooseClass}</Text>
        <View style={styles.row}>
          {(['standard', 'business'] as const).map((c) => (
            <TouchableOpacity
              key={c}
              style={[styles.classBtn, selectedClass === c && styles.classBtnOn]}
              onPress={() => setSelectedClass(c)}
            >
              <Text style={[styles.classLabel, selectedClass === c && { color: '#fff' }]}>
                {c === 'standard' ? t.standardClass : t.businessClass}
              </Text>
              <Text style={[styles.classFare, selectedClass === c && { color: Colors.accent }]}>
                ₹{train.fare[c].toLocaleString('en-IN')}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        <Text style={styles.section}>{t.amenities}</Text>
        <View style={styles.chips}>
          {train.amenities.map((a) => (
            <View key={a} style={styles.chip}><Text style={styles.chipText}>{a}</Text></View>
          ))}
        </View>
        <Text style={styles.muted}>{t.runsOn}: {train.daysOfOperation.map((d) => t.weekdays[WEEK_ORDER.indexOf(d)]).join(', ')} · {train.availableSeats} {t.seatsLeft}</Text>
      </ScrollView>

      <TouchableOpacity style={styles.cta} onPress={() => router.push('/seat-selection')}>
        <Text style={styles.ctaText}>{t.selectSeatsTitle}</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: Colors.surface },
  center: { flex: 1, alignItems: 'center', justifyContent: 'center', gap: 8 },
  header: { backgroundColor: Colors.primary, padding: 20, paddingBottom: 24 },
  back: { color: Colors.textOnDark, marginBottom: 10, fontSize: 15 },
  title: { color: Colors.textOnDark, fontSize: 22, fontWeight: '800' },
  sub: { color: '#B8C7DA', marginTop: 2 },
  body: { padding: 16, gap: 12 },
  card: { backgroundColor: Colors.surfaceCard, borderRadius: BorderRadius.lg, padding: 16 },
  row: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', gap: 10 },
  time: { fontSize: 26, fontWeight: '800', color: Colors.textPrimary },
  muted: { color: Colors.textSecondary, fontSize: 13 },
  section: { fontSize: 16, fontWeight: '700', color: Colors.textPrimary, marginTop: 8 },
  classBtn: { flex: 1, backgroundColor: Colors.surfaceCard, borderRadius: BorderRadius.md, padding: 14, borderWidth: 1, borderColor: Colors.divider },
  classBtnOn: { backgroundColor: Colors.primary, borderColor: Colors.primary },
  classLabel: { fontWeight: '700', color: Colors.textPrimary },
  classFare: { marginTop: 4, fontSize: 18, fontWeight: '800', color: Colors.secondary },
  chips: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  chip: { backgroundColor: Colors.surfaceCard, borderRadius: BorderRadius.full, paddingHorizontal: 12, paddingVertical: 6, borderWidth: 1, borderColor: Colors.divider },
  chipText: { fontSize: 12, color: Colors.textPrimary },
  link: { color: Colors.secondary, fontWeight: '700' },
  cta: { margin: 16, backgroundColor: Colors.accent, borderRadius: BorderRadius.md, padding: 16, alignItems: 'center' },
  ctaText: { color: Colors.primary, fontWeight: '800', fontSize: 16 },
});
