import { useMemo, useState } from 'react';
import {
  Modal, ScrollView, StyleSheet, Text, TouchableOpacity, View, Image,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { BorderRadius, Colors, Spacing } from '../../src/constants/theme';
import { DEMO_TRAINS, MAHSR_STATIONS, type Station } from '../../src/constants/stations';
import { translations, type Language } from '../../src/constants/translations';
import { useAppStore } from '../../src/store/useAppStore';
import { useSearchStore } from '../../src/store/useSearchStore';

const LANGUAGES: { code: Language; label: string; name: string }[] = [
  { code: 'en', label: 'EN', name: 'English' },
  { code: 'hi', label: 'हि', name: 'हिंदी' },
  { code: 'mr', label: 'म', name: 'मराठी' },
  { code: 'gu', label: 'ગુ', name: 'ગુજરાતી' },
  { code: 'ta', label: 'த', name: 'தமிழ்' },
  { code: 'te', label: 'తె', name: 'తెలుగు' },
];

export default function SearchScreen() {
  const language = useAppStore((state) => state.language);
  const setLanguage = useAppStore((state) => state.setLanguage);
  const t = translations[language];
  const { params, setParams, setSelectedTrain } = useSearchStore();
  const [stationPicker, setStationPicker] = useState<'fromStation' | 'toStation' | null>(null);
  const [langModalVisible, setLangModalVisible] = useState(false);
  const [searched, setSearched] = useState(false);

  const results = useMemo(() => {
    if (!params.fromStation || !params.toStation) return [];
    if (params.fromStation.id === params.toStation.id) return [];
    return DEMO_TRAINS;
  }, [params.fromStation, params.toStation]);

  const dateLabel = params.travelDate.toLocaleDateString(language === 'en' ? 'en-IN' : language, {
    weekday: 'short',
    day: 'numeric',
    month: 'short',
  });

  const returnDateLabel = params.returnDate.toLocaleDateString(language === 'en' ? 'en-IN' : language, {
    weekday: 'short',
    day: 'numeric',
    month: 'short',
  });

  const changeDate = (offset: number, type: 'travelDate' | 'returnDate') => {
    const targetDate = new Date(params[type]);
    targetDate.setDate(targetDate.getDate() + offset);
    setParams({ [type]: targetDate });
  };

  const chooseStation = (station: Station) => {
    if (stationPicker) setParams({ [stationPicker]: station });
    setStationPicker(null);
  };

  const searchTrains = () => {
    if (!params.fromStation || !params.toStation || params.fromStation.id === params.toStation.id) {
      return;
    }
    setSearched(true);
  };

  return (
    <SafeAreaView style={styles.root} edges={['top']}>
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        {/* Header with App Logo & Globe Language Icon */}
        <View style={styles.topRow}>
          <View style={styles.brandContainer}>
            <Image 
              source={require('../../assets/AppLogo.png')} 
              style={styles.logoImage} 
              resizeMode="contain"
            />
            <View style={styles.brandTextContainer}>
              <Text style={styles.eyebrow}>MAHSR CONNECT ONE</Text>
              <Text style={styles.heading} numberOfLines={1}>{t.trainSearch}</Text>
            </View>
          </View>

          {/* Language Globe Icon Button */}
          <TouchableOpacity 
            style={styles.langIconButton}
            onPress={() => setLangModalVisible(true)}
            activeOpacity={0.8}
            accessibilityRole="button"
            accessibilityLabel="Select Language"
          >
            <Ionicons name="globe-outline" size={20} color={Colors.primary} />
            <Text style={styles.currentLangText}>{language.toUpperCase()}</Text>
          </TouchableOpacity>
        </View>

        <Text style={styles.notice}>{t.demoData} · Demo booking flow only</Text>

        {/* Quick Access Buttons */}
        <View style={styles.quickActionsContainer}>
          <TouchableOpacity 
            style={styles.actionCard} 
            onPress={() => router.push('/ai-assistant' as any)}
            activeOpacity={0.8}
          >
            <Ionicons name="chatbubbles" size={18} color={Colors.primary} />
            <Text style={styles.actionText}>AI Assistant</Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={styles.actionCard} 
            onPress={() => router.push('/journey-tracking' as any)}
            activeOpacity={0.8}
          >
            <Ionicons name="location" size={18} color={Colors.primary} />
            <Text style={styles.actionText}>Live Status</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.searchCard}>
          {/* Trip Type Selector */}
          <View style={styles.tripTypeRow}>
            <TouchableOpacity 
              style={[styles.tripTypeChip, params.tripType === 'oneway' && styles.tripTypeChipActive]}
              onPress={() => setParams({ tripType: 'oneway' })}
            >
              <Text style={[styles.tripTypeText, params.tripType === 'oneway' && styles.tripTypeTextActive]}>One-Way</Text>
            </TouchableOpacity>

            <TouchableOpacity 
              style={[styles.tripTypeChip, params.tripType === 'round' && styles.tripTypeChipActive]}
              onPress={() => setParams({ tripType: 'round' })}
            >
              <Text style={[styles.tripTypeText, params.tripType === 'round' && styles.tripTypeTextActive]}>Round-Trip</Text>
            </TouchableOpacity>
          </View>

          <StationField 
            label={t.fromStation} 
            station={params.fromStation} 
            onPress={() => setStationPicker('fromStation')} 
            icon="radio-button-on" 
            iconColor="#0052cc"
          />
          
          <TouchableOpacity
            style={styles.swapButton}
            accessibilityRole="button"
            accessibilityLabel={t.swap}
            activeOpacity={0.7}
            onPress={() => setParams({ fromStation: params.toStation, toStation: params.fromStation })}
          >
            <Ionicons name="swap-vertical" size={18} color={Colors.secondary} />
          </TouchableOpacity>

          <StationField 
            label={t.toStation} 
            station={params.toStation} 
            onPress={() => setStationPicker('toStation')} 
            icon="location" 
            iconColor="#ff4d4d"
          />

          <View style={styles.optionsRow}>
            <View style={styles.option}>
              <Text style={styles.fieldLabel}>{t.travelDate}</Text>
              <View style={styles.stepper}>
                <TouchableOpacity onPress={() => changeDate(-1, 'travelDate')} style={styles.stepButton}>
                  <Ionicons name="remove" size={16} color={Colors.secondary} />
                </TouchableOpacity>
                <Text style={styles.optionValue}>{dateLabel}</Text>
                <TouchableOpacity onPress={() => changeDate(1, 'travelDate')} style={styles.stepButton}>
                  <Ionicons name="add" size={16} color={Colors.secondary} />
                </TouchableOpacity>
              </View>
            </View>

            {params.tripType === 'round' ? (
              <View style={styles.option}>
                <Text style={styles.fieldLabel}>Return Date</Text>
                <View style={styles.stepper}>
                  <TouchableOpacity onPress={() => changeDate(-1, 'returnDate')} style={styles.stepButton}>
                    <Ionicons name="remove" size={16} color={Colors.secondary} />
                  </TouchableOpacity>
                  <Text style={styles.optionValue}>{returnDateLabel}</Text>
                  <TouchableOpacity onPress={() => changeDate(1, 'returnDate')} style={styles.stepButton}>
                    <Ionicons name="add" size={16} color={Colors.secondary} />
                  </TouchableOpacity>
                </View>
              </View>
            ) : (
              <View style={styles.option}>
                <Text style={styles.fieldLabel}>{t.passengers}</Text>
                <View style={styles.stepper}>
                  <TouchableOpacity
                    onPress={() => setParams({ passengers: Math.max(1, params.passengers - 1) })}
                    style={styles.stepButton}
                  >
                    <Ionicons name="remove" size={16} color={Colors.secondary} />
                  </TouchableOpacity>
                  <Text style={styles.optionValue}>{params.passengers}</Text>
                  <TouchableOpacity
                    onPress={() => setParams({ passengers: Math.min(6, params.passengers + 1) })}
                    style={styles.stepButton}
                  >
                    <Ionicons name="add" size={16} color={Colors.secondary} />
                  </TouchableOpacity>
                </View>
              </View>
            )}
          </View>

          {params.tripType === 'round' && (
            <View style={[styles.option, { marginTop: 12 }]}>
              <Text style={styles.fieldLabel}>{t.passengers}</Text>
              <View style={styles.stepper}>
                <TouchableOpacity
                  onPress={() => setParams({ passengers: Math.max(1, params.passengers - 1) })}
                  style={styles.stepButton}
                >
                  <Ionicons name="remove" size={16} color={Colors.secondary} />
                </TouchableOpacity>
                <Text style={styles.optionValue}>{params.passengers} Passenger(s)</Text>
                <TouchableOpacity
                  onPress={() => setParams({ passengers: Math.min(6, params.passengers + 1) })}
                  style={styles.stepButton}
                >
                  <Ionicons name="add" size={16} color={Colors.secondary} />
                </TouchableOpacity>
              </View>
            </View>
          )}

          <TouchableOpacity
            style={[styles.searchButton, (!params.fromStation || !params.toStation || params.fromStation.id === params.toStation.id) && styles.searchButtonDisabled]}
            onPress={searchTrains}
            activeOpacity={0.8}
            disabled={!params.fromStation || !params.toStation || params.fromStation.id === params.toStation.id}
          >
            <Ionicons name="search" size={18} color={Colors.primary} style={{ marginRight: 6 }} />
            <Text style={styles.searchButtonText}>{t.searchTrains}</Text>
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
                activeOpacity={0.9}
                onPress={() => {
                  setSelectedTrain(train);
                  router.push('/train-details' as any);
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
                  <View style={styles.detailsRow}>
                    <Text style={styles.detailsText}>{t.viewDetails}</Text>
                    <Ionicons name="chevron-forward" size={14} color={Colors.secondary} />
                  </View>
                </View>
              </TouchableOpacity>
            ))}
            <Text style={styles.footerNote}>Schedules and fares shown here are sample data, not live service information.</Text>
          </>
        )}
      </ScrollView>

      {/* Station Picker Modal */}
      <Modal visible={stationPicker !== null} transparent animationType="slide" onRequestClose={() => setStationPicker(null)}>
        <View style={styles.modalBackdrop}>
          <View style={styles.modalCard}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>{stationPicker === 'fromStation' ? t.fromStation : t.toStation}</Text>
              <TouchableOpacity onPress={() => setStationPicker(null)}>
                <Ionicons name="close" size={22} color={Colors.textSecondary} />
              </TouchableOpacity>
            </View>
            <ScrollView showsVerticalScrollIndicator={false}>
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

      {/* Language Selection Modal */}
      <Modal visible={langModalVisible} transparent animationType="fade" onRequestClose={() => setLangModalVisible(false)}>
        <TouchableOpacity style={styles.modalBackdrop} activeOpacity={1} onPress={() => setLangModalVisible(false)}>
          <View style={styles.langModalCard}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Select Language</Text>
              <TouchableOpacity onPress={() => setLangModalVisible(false)}>
                <Ionicons name="close" size={22} color={Colors.textSecondary} />
              </TouchableOpacity>
            </View>
            {LANGUAGES.map((item) => {
              const isSelected = language === item.code;
              return (
                <TouchableOpacity
                  key={item.code}
                  style={[styles.langOptionRow, isSelected && styles.langOptionRowActive]}
                  onPress={() => {
                    setLanguage(item.code);
                    setLangModalVisible(false);
                  }}
                >
                  <Text style={[styles.langOptionText, isSelected && styles.langOptionTextActive]}>
                    {item.name} ({item.label})
                  </Text>
                  {isSelected && <Ionicons name="checkmark" size={18} color={Colors.secondary} />}
                </TouchableOpacity>
              );
            })}
          </View>
        </TouchableOpacity>
      </Modal>
    </SafeAreaView>
  );
}

function StationField({ label, station, onPress, icon, iconColor }: { label: string; station: Station | null; onPress: () => void; icon: any; iconColor: string }) {
  return (
    <TouchableOpacity onPress={onPress} style={styles.stationField} activeOpacity={0.7}>
      <Ionicons name={icon} size={18} color={iconColor} style={styles.stationIcon} />
      <View style={{ flex: 1 }}>
        <Text style={styles.fieldLabel}>{label}</Text>
        <Text style={styles.stationValue}>{station?.name ?? 'Select station'}</Text>
      </View>
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
  topRow: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    justifyContent: 'space-between', 
    gap: 8 
  },
  brandContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    flex: 1,
  },
  logoImage: {
    width: 38,
    height: 38,
    borderRadius: BorderRadius.md,
  },
  brandTextContainer: {
    flex: 1,
    justifyContent: 'center',
  },
  eyebrow: { 
    fontSize: 9, 
    fontWeight: '800', 
    letterSpacing: 1.2, 
    color: Colors.secondary,
    marginBottom: 1 
  },
  heading: { 
    color: Colors.primary, 
    fontSize: 18, 
    fontWeight: '800', 
    marginTop: 0,
    includeFontPadding: false,
  },
  langIconButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.surfaceCard,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: BorderRadius.full,
    borderWidth: 1,
    borderColor: Colors.divider,
    gap: 4,
  },
  currentLangText: {
    fontSize: 12,
    fontWeight: '700',
    color: Colors.primary,
  },
  notice: { color: Colors.textSecondary, fontSize: 12, marginTop: 5, marginBottom: 12 },
  quickActionsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
    gap: 10,
  },
  actionCard: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.surfaceCard,
    paddingVertical: 12,
    paddingHorizontal: 12,
    borderRadius: BorderRadius.lg,
    borderWidth: 1,
    borderColor: Colors.divider,
    gap: 6,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.03,
    shadowRadius: 4,
    elevation: 1,
  },
  actionText: {
    fontSize: 13,
    fontWeight: '700',
    color:Colors.primary,
  },
  searchCard: { 
    backgroundColor: Colors.surfaceCard, 
    borderRadius: BorderRadius.xl, 
    padding: 16, 
    borderWidth: 1, 
    borderColor: Colors.divider,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 8,
    elevation: 2,
  },
  tripTypeRow: {
    flexDirection: 'row',
    backgroundColor: '#F0F4F8',
    borderRadius: BorderRadius.md,
    padding: 3,
    marginBottom: 14,
  },
  tripTypeChip: {
    flex: 1,
    paddingVertical: 8,
    alignItems: 'center',
    borderRadius: BorderRadius.sm,
  },
  tripTypeChipActive: {
    backgroundColor: Colors.primary,
  },
  tripTypeText: {
    fontSize: 12,
    fontWeight: '700',
    color: Colors.textSecondary,
  },
  tripTypeTextActive: {
    color: '#fff',
  },
  stationField: { 
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10, 
    paddingHorizontal: 12, 
    borderWidth: 1, 
    borderColor: Colors.divider, 
    borderRadius: BorderRadius.md, 
    backgroundColor: '#FBFCFE' 
  },
  stationIcon: { marginRight: 10 },
  fieldLabel: { color: Colors.textSecondary, fontSize: 11, fontWeight: '600' },
  stationValue: { color: Colors.textPrimary, fontSize: 15, fontWeight: '700', marginTop: 2 },
  stationCode: { color: Colors.secondary, fontSize: 12, fontWeight: '700' },
  swapButton: { 
    alignSelf: 'center', 
    marginVertical: -14, 
    zIndex: 2, 
    width: 32, 
    height: 32, 
    borderRadius: BorderRadius.full, 
    backgroundColor: Colors.surfaceCard, 
    borderWidth: 1, 
    borderColor: Colors.divider, 
    alignItems: 'center', 
    justifyContent: 'center',
    elevation: 3,
  },
  optionsRow: { flexDirection: 'row', gap: 10, marginTop: 12 },
  option: { flex: 1 },
  stepper: { 
    height: 42, 
    flexDirection: 'row', 
    alignItems: 'center', 
    justifyContent: 'space-between', 
    paddingHorizontal: 4, 
    marginTop: 4, 
    borderWidth: 1, 
    borderColor: Colors.divider, 
    borderRadius: BorderRadius.md,
    backgroundColor: '#FBFCFE'
  },
  stepButton: { width: 32, height: 32, alignItems: 'center', justifyContent: 'center' },
  optionValue: { color: Colors.textPrimary, fontSize: 13, fontWeight: '700' },
  searchButton: { 
    flexDirection: 'row',
    backgroundColor: Colors.accent, 
    paddingVertical: 14, 
    alignItems: 'center', 
    justifyContent: 'center',
    borderRadius: BorderRadius.md, 
    marginTop: 16 
  },
  searchButtonDisabled: { opacity: 0.5 },
  searchButtonText: { color: Colors.primary, fontWeight: '800', fontSize: 15 },
  resultsHeading: { flexDirection: 'row', alignItems: 'center', gap: 8, marginTop: 24, marginBottom: 12 },
  sectionTitle: { fontSize: 18, color: Colors.primary, fontWeight: '800' },
  resultCount: { color: Colors.secondary, fontSize: 12, fontWeight: '800', backgroundColor: '#E5F3FD', paddingHorizontal: 8, paddingVertical: 3, borderRadius: BorderRadius.full },
  trainCard: { 
    padding: 16, 
    backgroundColor: Colors.surfaceCard, 
    borderRadius: BorderRadius.lg, 
    borderWidth: 1, 
    borderColor: Colors.divider, 
    marginBottom: 12,
    elevation: 1,
  },
  trainCardTop: { flexDirection: 'row', justifyContent: 'space-between', gap: 8 },
  trainNameBlock: { flex: 1 },
  trainName: { color: Colors.textPrimary, fontSize: 16, fontWeight: '800' },
  trainNumber: { color: Colors.textSecondary, fontSize: 11, marginTop: 2 },
  trainFare: { color: Colors.primary, fontSize: 17, fontWeight: '800' },
  trainTimes: { flexDirection: 'row', alignItems: 'center', marginTop: 14 },
  timeStation: { width: 95 },
  timeStationRight: { alignItems: 'flex-end' },
  timeLabel: { color: Colors.textSecondary, fontSize: 10 },
  timeValue: { color: Colors.primary, fontSize: 20, fontWeight: '800', marginTop: 2 },
  timePlace: { color: Colors.textSecondary, fontSize: 11, marginTop: 2, maxWidth: 95 },
  duration: { flex: 1, alignItems: 'center', paddingHorizontal: 5 },
  durationText: { color: Colors.textSecondary, fontSize: 10, marginBottom: 4 },
  routeLine: { height: 1, width: '100%', backgroundColor: Colors.divider },
  trainCardBottom: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingTop: 12, marginTop: 12, borderTopWidth: 1, borderTopColor: Colors.divider },
  seatsText: { color: Colors.success, fontSize: 12, fontWeight: '700' },
  detailsRow: { flexDirection: 'row', alignItems: 'center', gap: 2 },
  detailsText: { color: Colors.secondary, fontSize: 12, fontWeight: '700' },
  emptyText: { color: Colors.textSecondary, backgroundColor: Colors.surfaceCard, padding: 20, borderRadius: BorderRadius.md },
  footerNote: { color: Colors.textSecondary, fontSize: 10, textAlign: 'center', marginTop: 14 },
  modalBackdrop: { flex: 1, justifyContent: 'flex-end', backgroundColor: 'rgba(0,0,0,0.4)' },
  modalCard: { backgroundColor: Colors.surfaceCard, maxHeight: '80%', borderTopLeftRadius: BorderRadius.xl, borderTopRightRadius: BorderRadius.xl, paddingHorizontal: 18, paddingTop: 18, paddingBottom: 24 },
  langModalCard: { backgroundColor: Colors.surfaceCard, width: '80%', alignSelf: 'center', marginTop: 'auto', marginBottom: 'auto', borderRadius: BorderRadius.xl, padding: 18, borderWidth: 1, borderColor: Colors.divider },
  modalHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingBottom: 14 },
  modalTitle: { color: Colors.primary, fontSize: 18, fontWeight: '800' },
  stationOption: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 14, borderTopWidth: 1, borderTopColor: Colors.divider },
  stationName: { color: Colors.textPrimary, fontWeight: '700', fontSize: 15 },
  stationState: { color: Colors.textSecondary, fontSize: 11, marginTop: 3 },
  stationDistance: { color: Colors.secondary, fontSize: 12, fontWeight: '700' },
  langOptionRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 12, borderTopWidth: 1, borderTopColor: Colors.divider },
  langOptionRowActive: { backgroundColor: '#E5F3FD', paddingHorizontal: 8, borderRadius: BorderRadius.md },
  langOptionText: { fontSize: 15, fontWeight: '600', color: Colors.textPrimary },
  langOptionTextActive: { fontWeight: '800', color: Colors.primary },
});