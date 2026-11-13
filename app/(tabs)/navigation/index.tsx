import React, { useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, TextInput, ScrollView, Dimensions, Linking } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import MapView, { Marker, Polyline, PROVIDER_GOOGLE } from 'react-native-maps';
import * as Location from 'expo-location';
import { router } from 'expo-router';
import { Colors, BorderRadius } from '../../../src/constants/theme';
import { useNavigationStore } from '../../../src/store/useNavigationStore';
import { useTicketStore } from '../../../src/store/useTicketStore';

const BKC_COORDS = { latitude: 19.0657, longitude: 72.8686 };
const SURAT_COORDS = { latitude: 21.1702, longitude: 72.8311 };

export default function SmartNavigationScreen() {
  const { 
    activeTab, setTab, facilities, selectedFacility, selectFacility, 
    loadFacilities, searchQuery, setSearchQuery, permissionGranted, setUserLocation 
  } = useNavigationStore();
  
  const tickets = useTicketStore((s: any) => s.tickets);
  const activeTicket = tickets && tickets.length > 0 ? tickets[0] : null;

  useEffect(() => {
    loadFacilities('BKC');
    requestLocationPermission();
  }, []);

  const requestLocationPermission = async () => {
    try {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        setUserLocation(null, false);
        return;
      }
      let loc = await Location.getCurrentPositionAsync({});
      setUserLocation({ latitude: loc.coords.latitude, longitude: loc.coords.longitude }, true);
    } catch (e) {
      setUserLocation(null, false);
    }
  };

  const filteredFacilities = facilities.filter((f: any) => 
    f.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
    f.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const openExternalDirections = () => {
    const url = `https://www.google.com/maps/dir/?api=1&destination=${BKC_COORDS.latitude},${BKC_COORDS.longitude}`;
    Linking.openURL(url);
  };

  return (
    <SafeAreaView style={styles.root} edges={['top']}>
      {/* Header Tabs */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <Text style={styles.backText}>← Back</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Station Navigation</Text>
      </View>

      <View style={styles.tabBar}>
        <TouchableOpacity style={[styles.tab, activeTab === 'outdoor' && styles.activeTab]} onPress={() => setTab('outdoor')}>
          <Text style={[styles.tabText, activeTab === 'outdoor' && styles.activeTabText]}>Outdoor Route</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.tab, activeTab === 'indoor' && styles.activeTab]} onPress={() => setTab('indoor')}>
          <Text style={[styles.tabText, activeTab === 'indoor' && styles.activeTabText]}>Indoor 2D Map</Text>
        </TouchableOpacity>
      </View>

      {/* Ticket/Journey Banner */}
      {activeTicket && (
        <View style={styles.ticketBanner}>
          <Text style={styles.ticketBannerTitle}>Active Journey: {activeTicket.fromStation?.name || 'Mumbai BKC'} → {activeTicket.toStation?.name || 'Surat'}</Text>
          <Text style={styles.ticketBannerSub}>Coach: C3 | Seat: 12A | Gate: 2B | Platform: 2</Text>
        </View>
      )}

      {activeTab === 'outdoor' ? (
        <View style={styles.mapContainer}>
          <MapView
            style={styles.map}
            provider={PROVIDER_GOOGLE}
            initialRegion={{
              latitude: 20.1,
              longitude: 72.85,
              latitudeDelta: 2.5,
              longitudeDelta: 2.5,
            }}
          >
            <Marker coordinate={BKC_COORDS} title="Mumbai BKC Station" description="MAHSR Terminus" />
            <Marker coordinate={SURAT_COORDS} title="Surat Station" description="High-Speed Stop" />
            <Polyline coordinates={[BKC_COORDS, SURAT_COORDS]} strokeColor={Colors.primary} strokeWidth={4} />
          </MapView>

          {!permissionGranted && (
            <View style={styles.permissionFallback}>
              <Text style={styles.fallbackText}>Location access denied. Using demo station coordinates.</Text>
            </View>
          )}

          <View style={styles.outdoorOverlay}>
            <Text style={styles.overlayTitle}>Estimated Travel Time</Text>
            <Text style={styles.overlayValue}>1h 12m <Text style={styles.overlayUnit}>(320 km/h Shinkansen)</Text></Text>
            <TouchableOpacity style={styles.directionsBtn} onPress={openExternalDirections}>
              <Text style={styles.directionsBtnText}>Get Directions to Station</Text>
            </TouchableOpacity>
          </View>
        </View>
      ) : (
        <View style={styles.indoorContainer}>
          <TextInput
            style={styles.searchInput}
            placeholder="Search facility (e.g. Lift, Gate, Platform 2, Washroom)"
            placeholderTextColor="#A0AEC0"
            value={searchQuery}
            onChangeText={setSearchQuery}
          />

          <View style={styles.mapCanvas}>
            <Text style={styles.canvasTitle}>MUMBAI BKC - CONCOURSE & PLATFORM MAP [DEMO]</Text>
            
            {facilities.map((fac: any) => (
              <TouchableOpacity
                key={fac.id}
                style={[
                  styles.facilityMarker,
                  { left: `${fac.x_coord}%`, top: `${fac.y_coord}%` },
                  selectedFacility?.id === fac.id && styles.selectedMarker,
                ]}
                onPress={() => selectFacility(fac)}
              >
                <Text style={styles.markerText}>{fac.name.charAt(0)}</Text>
              </TouchableOpacity>
            ))}

            {selectedFacility && (
              <View style={styles.simulatedPathBox}>
                <Text style={styles.pathText}>
                  Route: Main Gate → Security → {selectedFacility.name} ({selectedFacility.floor} Floor)
                </Text>
              </View>
            )}
          </View>

          <ScrollView style={styles.facilityList} showsVerticalScrollIndicator={false}>
            {filteredFacilities.map((fac: any) => (
              <TouchableOpacity
                key={fac.id}
                style={[styles.facilityCard, selectedFacility?.id === fac.id && styles.selectedCard]}
                onPress={() => selectFacility(fac)}
              >
                <View style={{ flex: 1 }}>
                  <Text style={styles.facilityName}>{fac.name} {fac.is_accessible ? '♿' : ''}</Text>
                  <Text style={styles.facilityDesc}>{fac.description} • Floor {fac.floor}</Text>
                </View>
                <Text style={styles.navigateText}>View Route</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: Colors.primary },
  header: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 16, paddingVertical: 12 },
  backBtn: { marginRight: 16 },
  backText: { color: '#FFF', fontWeight: '700' },
  headerTitle: { fontSize: 18, fontWeight: '800', color: '#FFF' },
  tabBar: { flexDirection: 'row', backgroundColor: '#1A202C', marginHorizontal: 16, borderRadius: BorderRadius.md, padding: 4 },
  tab: { flex: 1, paddingVertical: 10, alignItems: 'center', borderRadius: BorderRadius.sm },
  activeTab: { backgroundColor: Colors.primary },
  tabText: { color: '#A0AEC0', fontWeight: '700', fontSize: 13 },
  activeTabText: { color: '#FFF' },
  ticketBanner: { backgroundColor: '#EBF8FF', marginHorizontal: 16, marginTop: 10, padding: 10, borderRadius: BorderRadius.md, borderWidth: 1, borderColor: '#BEE3F8' },
  ticketBannerTitle: { fontSize: 13, fontWeight: '800', color: '#2B6CB0' },
  ticketBannerSub: { fontSize: 11, color: '#4A5568', marginTop: 2, fontWeight: '600' },
  mapContainer: { flex: 1, marginTop: 10 },
  map: { flex: 1 },
  permissionFallback: { position: 'absolute', top: 10, left: 16, right: 16, backgroundColor: '#FFF5F5', padding: 8, borderRadius: 8, borderWidth: 1, borderColor: '#FEB2B2' },
  fallbackText: { fontSize: 11, color: '#C53030', textAlign: 'center', fontWeight: '600' },
  outdoorOverlay: { position: 'absolute', bottom: 20, left: 16, right: 16, backgroundColor: '#FFF', padding: 16, borderRadius: BorderRadius.xl, shadowColor: '#000', shadowOpacity: 0.1, shadowRadius: 10, elevation: 5 },
  overlayTitle: { fontSize: 12, color: '#718096', fontWeight: '600' },
  overlayValue: { fontSize: 22, fontWeight: '900', color: Colors.textPrimary },
  overlayUnit: { fontSize: 12, color: '#718096', fontWeight: '600' },
  directionsBtn: { backgroundColor: Colors.primary, marginTop: 12, paddingVertical: 12, borderRadius: BorderRadius.md, alignItems: 'center' },
  directionsBtnText: { color: '#FFF', fontWeight: '800', fontSize: 14 },
  indoorContainer: { flex: 1, padding: 16 },
  searchInput: { backgroundColor: '#FFF', borderRadius: BorderRadius.md, paddingHorizontal: 14, height: 44, fontSize: 13, marginBottom: 10 },
  mapCanvas: { height: 200, backgroundColor: '#EDF2F7', borderRadius: BorderRadius.lg, borderWidth: 1, borderColor: '#CBD5E0', position: 'relative', overflow: 'hidden', padding: 8 },
  canvasTitle: { fontSize: 10, fontWeight: '800', color: '#718096', letterSpacing: 0.5 },
  facilityMarker: { position: 'absolute', width: 24, height: 24, borderRadius: 12, backgroundColor: Colors.primary, justifyContent: 'center', alignItems: 'center' },
  selectedMarker: { backgroundColor: '#E53E3E', transform: [{ scale: 1.3 }] },
  markerText: { color: '#FFF', fontSize: 10, fontWeight: '900' },
  simulatedPathBox: { position: 'absolute', bottom: 8, left: 8, right: 8, backgroundColor: 'rgba(26, 32, 44, 0.9)', padding: 6, borderRadius: 6 },
  pathText: { color: '#38A169', fontSize: 11, fontWeight: '700', textAlign: 'center' },
  facilityList: { flex: 1, marginTop: 12 },
  facilityCard: { backgroundColor: '#FFF', padding: 12, borderRadius: BorderRadius.md, marginBottom: 8, flexDirection: 'row', alignItems: 'center' },
  selectedCard: { borderWidth: 2, borderColor: Colors.primary, backgroundColor: '#EBF8FF' },
  facilityName: { fontSize: 14, fontWeight: '800', color: Colors.textPrimary },
  facilityDesc: { fontSize: 11, color: '#718096', marginTop: 2 },
  navigateText: { fontSize: 12, fontWeight: '800', color: Colors.primary },
});