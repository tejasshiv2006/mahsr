import { useMemo, useState } from 'react';
import {
  Modal, ScrollView, StyleSheet, Text, TouchableOpacity, View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
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
        {/* Top Header & Language Picker */}
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

        {/* Main Search Card */}
        <View style={styles.searchCard}>
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

          {/* Date & Passenger Steppers */}
          <View style={styles.optionsRow}>
            <View style={styles.option}>
              <Text style={styles.fieldLabel}>{t.travelDate}</Text>
              <View style={styles.stepper}>
                <TouchableOpacity onPress={() => changeDate(-1)} style={styles.stepButton}>
                  <Ionicons name="remove" size={16} color={Colors.secondary} />
                </TouchableOpacity>
                <Text style={styles.optionValue}>{dateLabel}</Text>
                <TouchableOpacity onPress={() => changeDate(1)} style={styles.stepButton}>
                  <Ionicons name="add" size={16} color={Colors.secondary} />
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
          </View>

          {/* Search Button */}
          <TouchableOpacity
            style={[styles.searchButton, results.length === 0 && styles.searchButtonDisabled]}
            onPress={searchTrains}
            activeOpacity={0.8}
            disabled={results.length === 0}
          >
            <Ionicons name="search" size={18} color={Colors.primary} style={{ marginRight: 6 }} />
            <Text style={styles.searchButtonText}>{t.searchTrains}</Text>
          </TouchableOpacity>
        </View>

        {/* Results List */}
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

      {/* Station Selector Modal */}
      <Modal visible={stationPicker !== null} transparent animationType="slide" onRequestClose={() => setStationPicker(null)}>
        <View style={styles.modalBackdrop}>
          <View style={styles.modalCard}></View>