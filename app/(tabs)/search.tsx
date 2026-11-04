import { useMemo, useState } from 'react';
import {
  Modal, ScrollView, StyleSheet, Text, TouchableOpacity, View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { BorderRadius, Colors, Spacing } from '../../src/constants/theme';
import { DEMO_TRAINS, MAHSR_STATIONS } from '../../src/constants/stations';
import type { Station } from '../../src/constants/stations';
import { translations } from '../../src/constants/translations';
import type { Language } from '../../src/constants/translations';
import { useAppStore } from '../../src/store/useAppStore';
import { useSearchStore } from '../../src/store/useSearchStore';

const LANGUAGES: { code: Language; label: string }[] = [
  { code: 'en', label: 'EN' },
  { code: 'hi', label: 'हि' },
  { code: 'mr', label: 'म' },
  { code: 'gu', label: 'ગુ' },
  { code: 'ta', label: 'த' },
  { code: 'te', label: 'తె' },
];

export default function SearchScreen() {
  const language = useAppStore((state) => state.language);
  const setLanguage = useAppStore((state) => state.setLanguage);
  const t = translations[language];
  const { params, setParams, setSelectedTrain } = useSearchStore();
  const [stationPicker, setStationPicker] = useState<'fromStation' | 'toStation' | null>(null);
  const [searched, setSearched] = useState(false);

  const results = useMemo(() => {
    const from = params.fromStation?.distance ?? 0;
    const to = params.toStation?.distance ?? Number.MAX_SAFE_INTEGER;
    if (from >= to) return [];
    return DEMO_TRAINS;
  }, [params.fromStation, params.toStation]);

  const dateLabel = params.travelDate.toLocaleDateString(language === 'en' ? 'en-IN' : language, {
    weekday: 'short',
    day: 'numeric',
    month: 'short',
  });

  const changeDate = (offset: number) => {
    const travelDate = new Date(params.travelDate);
    travelDate.setDate(travelDate.getDate() + offset);
    setParams({ travelDate });
  };

  const chooseStation = (station: Station) => {
    if (stationPicker) setParams({ [stationPicker]: station });
    setStationPicker(null);
  };

  const searchTrains = () => {
    if (!params.fromStation || !params.toStation || params.fromStation.distance >= params.toStation.distance) {
      return;
    }
    setSearched(true);
  };

  return (
    <SafeAreaView style={styles.root} edges={['top']}>
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.topRow}>
          <View>
            <Text style={styles.eyebrow}>MAHSR CONNECT ONE</Text>
            <Text style={styles.heading}>{t.trainSearch}</Text>
          </View>
          <View style={styles.languageRow}>
            {LANGUAGES.map((item) => (
              <TouchableOpacity
                key={item.code}
                accessibilityRole="button"
                accessibilityLabel={`Language ${item.code}`}
                onPress={() => setLanguage(item.code)}
                style={[styles.languageChip, language === item.code && styles.languageChipActive]}
              >
                <Text style={[styles.languageText, language === item.code && styles.languageTextActive]}>{item.label}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
        <Text style={styles.notice}>{t.demoData} · Demo booking flow only</Text>

        <View style={styles.searchCard}>
          <StationField label={t.fromStation} station={params.fromStation} onPress={() => setStationPicker('fromStation')} />
          <TouchableOpacity
            style={styles.swapButton}
            accessibilityRole="button"
            accessibilityLabel={t.swap}
            onPress={() => setParams({ fromStation: params.toStation, toStation: params.fromStation })}
          >
            <Text style={styles.swapText}>⇅</Text>
          </TouchableOpacity>
          <StationField label={t.toStation} station={params.toStation} onPress={() => setStationPicker('toStation')} />

          <View style={styles.optionsRow}>
            <View style={styles.option}>
              <Text style={styles.fieldLabel}>{t.travelDate}</Text>
              <View style={styles.stepper}>
                <TouchableOpacity onPress={() => changeDate(-1)} style={styles.stepButton}>
                  <Text style={styles.stepText}>−</Text>
                </TouchableOpacity>
                <Text style={styles.optionValue}>{dateLabel}</Text>
                <TouchableOpacity onPress={() => changeDate(1)} style={styles.stepButton}>
                  <Text style={styles.stepText}>+</Text>
                </TouchableOpacity>
              </View>
            </View>
            <View style={styles.option}>
              <Text style={styles.fieldLabel}>{t.passengers}</Text>
              <View style={styles.stepper}>
                <TouchableOpacity
                  onPress={() => setParams({ passengers: Math.max(1, params.passengers - 1) })}
                  style={styles.stepButton}
                >
                  <Text style={styles.stepText}>−</Text>
                </TouchableOpacity>
                <Text style={styles.optionValue}>{params.passengers}</Text>
                <TouchableOpacity
                  onPress={() => setParams({ passengers: Math.min(6, params.passengers + 1) })}
                  style={styles.stepButton}
                >
                  <Text style={styles.stepText}>+</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>

          <TouchableOpacity
            style={[styles.searchButton, results.length === 0 && styles.searchButtonDisabled]}
            onPress={searchTrains}
            disabled={results.length === 0}
          >
            <Text style={styles.searchButtonText}>⌕  {t.searchTrains}</Text>
          </TouchableOpacity>
        </View>

        {searched && (
          <>
            <View style={styles.resultsHeading}>
              <Text style={styles.sectionTitle}>{t.trainResults}</Text>
              <Text style={styles.resultCount}>{results.length}</Text>
            </View>
            {results.length === 0 ? (
              <Text style={styles.emptyText}>{t.noTrains}</Text>
            ) : results.map((train) => (
              <TouchableOpacity
                key={train.id}
                style={styles.trainCard}
                onPress={() => {
                  setSelectedTrain(train);
                  router.push('/train-details');
                }}
              >
                <View style={styles.trainCardTop}>
                  <View style={styles.trainNameBlock}>
                    <Text style={styles.trainName}>{train.name}</Text>
                    <Text style={styles.trainNumber}>{train.number} · {train.type}</Text>
                  </View>
                  <Text style={styles.trainFare}>₹{train.fare.standard.toLocaleString('en-IN')}</Text>
                </View>
                <View style={styles.trainTimes}>
                  <TimeStation time={train.departureTime} station={params.fromStation?.name ?? ''} label={t.departure} />
                  <View style={styles.duration}>
                    <Text style={styles.durationText}>{train.duration}</Text>
                    <View style={styles.routeLine} />
                  </View>
                  <TimeStation time={train.arrivalTime} station={params.toStation?.name ?? ''} label={t.arrival} right />
                </View>
                <View style={styles.trainCardBottom}>
                  <Text style={styles.seatsText}>{train.availableSeats} {t.seatsAvailable}</Text>
                  <Text style={styles.detailsText}>{t.viewDetails}  ›</Text>
                </View>
              </TouchableOpacity>
            ))}
            <Text style={styles.footerNote}>Schedules and fares shown here are sample data, not live service information.</Text>
          </>
        )}
      </ScrollView>

      <Modal visible={stationPicker !== null} transparent animationType="slide" onRequestClose={() => setStationPicker(null)}>
        <View style={styles.modalBackdrop}>
          <View style={styles.modalCard}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>{stationPicker === 'fromStation' ? t.fromStation : t.toStation}</Text>
              <TouchableOpacity onPress={() => setStationPicker(null)}><Text style={styles.closeText}>✕</Text></TouchableOpacity>
            </View>
            <ScrollView>
              {MAHSR_STATIONS.map((station) => (
                <TouchableOpacity key={station.id} style={styles.stationOption} onPress={() => chooseStation(station)}>
                  <View>
                    <Text style={styles.stationName}>{station.name}</Text>
                    <Text style={styles.stationState}>{station.state} · {station.code}</Text>
                  </View>
                  <Text style={styles.stationDistance}>{station.distance} km</Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

function StationField({ label, station, onPress }: { label: string; station: Station | null; onPress: () => void }) {
  return (
    <TouchableOpacity onPress={onPress} style={styles.stationField}>
      <Text style={styles.fieldLabel}>{label}</Text>
      <Text style={styles.stationValue}>{station?.name ?? 'Select station'}</Text>
      <Text style={styles.stationCode}>{station?.code ?? ''}</Text>
    </TouchableOpacity>
  );
}

function TimeStation({ time, station, label, right = false }: { time: string; station: string; label: string; right?: boolean }) {
  return (
    <View style={[styles.timeStation, right && styles.timeStationRight]}>
      <Text style={styles.timeLabel}>{label}</Text>
      <Text style={styles.timeValue}>{time}</Text>
      <Text style={styles.timePlace} numberOfLines={1}>{station}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: Colors.surface },
  content: { padding: Spacing.base, paddingBottom: 32 },
  topRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: 8 },
  eyebrow: { fontSize: 10, fontWeight: '800', letterSpacing: 1.4, color: Colors.secondary },
  heading: { color: Colors.primary, fontSize: 24, fontWeight: '800', marginTop: 4 },
  languageRow: { flexDirection: 'row', gap: 3 },
  languageChip: { width: 29, height: 29, borderRadius: BorderRadius.full, alignItems: 'center', justifyContent: 'center', backgroundColor: Colors.surfaceCard },
  languageChipActive: { backgroundColor: Colors.primary },
  languageText: { fontSize: 10, fontWeight: '700', color: Colors.textSecondary },
  languageTextActive: { color: Colors.textOnDark },
  notice: { color: Colors.textSecondary, fontSize: 12, marginTop: 5, marginBottom: 16 },
  searchCard: { backgroundColor: Colors.surfaceCard, borderRadius: BorderRadius.xl, padding: 16, borderWidth: 1, borderColor: Colors.divider },
  stationField: { paddingVertical: 8, paddingHorizontal: 12, borderWidth: 1, borderColor: Colors.divider, borderRadius: BorderRadius.md, backgroundColor: '#FBFCFE' },
  fieldLabel: { color: Colors.textSecondary, fontSize: 11, fontWeight: '600' },
  stationValue: { color: Colors.textPrimary, fontSize: 16, fontWeight: '700', marginTop: 3 },
  stationCode: { color: Colors.secondary, fontSize: 11, marginTop: 2 },
  swapButton: { alignSelf: 'flex-end', marginVertical: -14, marginRight: 13, zIndex: 1, width: 30, height: 30, borderRadius: BorderRadius.full, backgroundColor: Colors.surfaceCard, borderWidth: 1, borderColor: Colors.divider, alignItems: 'center', justifyContent: 'center' },
  swapText: { color: Colors.secondary, fontSize: 18, fontWeight: '700' },
  optionsRow: { flexDirection: 'row', gap: 10, marginTop: 12 },
  option: { flex: 1 },
  stepper: { height: 40, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 4, marginTop: 4, borderWidth: 1, borderColor: Colors.divider, borderRadius: BorderRadius.md },
  stepButton: { width: 30, height: 30, alignItems: 'center', justifyContent: 'center' },
  stepText: { color: Colors.secondary, fontSize: 20, fontWeight: '700' },
  optionValue: { color: Colors.textPrimary, fontSize: 13, fontWeight: '700' },
  searchButton: { backgroundColor: Colors.accent, paddingVertical: 14, alignItems: 'center', borderRadius: BorderRadius.md, marginTop: 14 },
  searchButtonDisabled: { opacity: 0.5 },
  searchButtonText: { color: Colors.primary, fontWeight: '800', fontSize: 15 },
  resultsHeading: { flexDirection: 'row', alignItems: 'center', gap: 8, marginTop: 22, marginBottom: 10 },
  sectionTitle: { fontSize: 18, color: Colors.primary, fontWeight: '800' },
  resultCount: { color: Colors.secondary, fontSize: 12, fontWeight: '800', backgroundColor: '#E5F3FD', paddingHorizontal: 8, paddingVertical: 3, borderRadius: BorderRadius.full },
  trainCard: { padding: 14, backgroundColor: Colors.surfaceCard, borderRadius: BorderRadius.lg, borderWidth: 1, borderColor: Colors.divider, marginBottom: 10 },
  trainCardTop: { flexDirection: 'row', justifyContent: 'space-between', gap: 8 },
  trainNameBlock: { flex: 1 },
  trainName: { color: Colors.textPrimary, fontSize: 15, fontWeight: '800' },
  trainNumber: { color: Colors.textSecondary, fontSize: 11, marginTop: 3 },
  trainFare: { color: Colors.primary, fontSize: 16, fontWeight: '800' },
  trainTimes: { flexDirection: 'row', alignItems: 'center', marginTop: 14 },
  timeStation: { width: 90 },
  timeStationRight: { alignItems: 'flex-end' },
  timeLabel: { color: Colors.textSecondary, fontSize: 10 },
  timeValue: { color: Colors.primary, fontSize: 20, fontWeight: '800', marginTop: 2 },
  timePlace: { color: Colors.textSecondary, fontSize: 11, marginTop: 2, maxWidth: 90 },
  duration: { flex: 1, alignItems: 'center', paddingHorizontal: 5 },
  durationText: { color: Colors.textSecondary, fontSize: 10, marginBottom: 5 },
  routeLine: { height: 1, width: '100%', backgroundColor: Colors.divider },
  trainCardBottom: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingTop: 10, marginTop: 10, borderTopWidth: 1, borderTopColor: Colors.divider },
  seatsText: { color: Colors.success, fontSize: 11, fontWeight: '700' },
  detailsText: { color: Colors.secondary, fontSize: 12, fontWeight: '700' },
  emptyText: { color: Colors.textSecondary, backgroundColor: Colors.surfaceCard, padding: 20, borderRadius: BorderRadius.md },
  footerNote: { color: Colors.textSecondary, fontSize: 10, textAlign: 'center', marginTop: 14 },
  modalBackdrop: { flex: 1, justifyContent: 'flex-end', backgroundColor: 'rgba(0,0,0,0.4)' },
  modalCard: { backgroundColor: Colors.surfaceCard, maxHeight: '80%', borderTopLeftRadius: BorderRadius.xl, borderTopRightRadius: BorderRadius.xl, paddingHorizontal: 18, paddingTop: 18, paddingBottom: 24 },
  modalHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingBottom: 12 },
  modalTitle: { color: Colors.primary, fontSize: 18, fontWeight: '800' },
  closeText: { color: Colors.textSecondary, fontSize: 17, padding: 4 },
  stationOption: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 13, borderTopWidth: 1, borderTopColor: Colors.divider },
  stationName: { color: Colors.textPrimary, fontWeight: '700', fontSize: 15 },
  stationState: { color: Colors.textSecondary, fontSize: 11, marginTop: 3 },
  stationDistance: { color: Colors.secondary, fontSize: 12, fontWeight: '700' },
});
