import { View, Text, TouchableOpacity, ScrollView, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { Colors, BorderRadius } from '../src/constants/theme';
import { DEMO_JOURNEY_UPDATES, localStationName } from '../src/constants/stations';
import { useAppStore } from '../src/store/useAppStore';
import { translations } from '../src/constants/translations';

const COLOR = { departed: Colors.success, arriving: Colors.accent, upcoming: Colors.unavailable } as const;

export default function JourneyTracking() {
  const language = useAppStore((s) => s.language);
  const t = translations[language];
  const LABEL = { departed: t.departed, arriving: t.arrivingNext, upcoming: t.upcoming } as const;
  return (
    <SafeAreaView style={styles.root} edges={['top', 'bottom']}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}><Text style={styles.back}>‹ {t.back}</Text></TouchableOpacity>
        <Text style={styles.title}>{t.journeyTracking}</Text>
        <Text style={styles.sub}>{t.simulatedStatus}</Text>
      </View>

      <ScrollView contentContainerStyle={styles.body}>
        {DEMO_JOURNEY_UPDATES.map((u, i) => (
          <View key={u.station} style={styles.row}>
            <Text style={styles.time}>{u.time}</Text>
            <View style={styles.rail}>
              <View style={[styles.dot, { backgroundColor: COLOR[u.status] }]} />
              {i < DEMO_JOURNEY_UPDATES.length - 1 && <View style={styles.line} />}
            </View>
            <View style={styles.info}>
              <Text style={styles.station}>{localStationName(u.station, language)}</Text>
              <Text style={styles.status}>{LABEL[u.status]}{u.delay ? ` · ${t.minLate.replace('{n}', String(u.delay))}` : ''}</Text>
            </View>
          </View>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: Colors.surface },
  header: { backgroundColor: Colors.primary, padding: 20, paddingBottom: 24, borderBottomLeftRadius: BorderRadius.xl, borderBottomRightRadius: BorderRadius.xl },
  back: { color: Colors.textOnDark, marginBottom: 10, fontSize: 15 },
  title: { color: Colors.textOnDark, fontSize: 22, fontWeight: '800' },
  sub: { color: '#B8C7DA', marginTop: 2 },
  body: { padding: 20 },
  row: { flexDirection: 'row', minHeight: 56 },
  time: { width: 52, fontWeight: '700', color: Colors.textPrimary },
  rail: { width: 24, alignItems: 'center' },
  dot: { width: 14, height: 14, borderRadius: 7 },
  line: { flex: 1, width: 2, backgroundColor: Colors.divider },
  info: { flex: 1, paddingLeft: 8 },
  station: { fontSize: 16, fontWeight: '700', color: Colors.textPrimary },
  status: { color: Colors.textSecondary, fontSize: 12 },
});
