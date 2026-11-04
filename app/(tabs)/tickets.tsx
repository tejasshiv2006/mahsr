import React from 'react';
import {
  View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import { Colors, Spacing, BorderRadius, Shadow } from '../../src/constants/theme';
import { useAppStore } from '../../src/store/useAppStore';
import { useTicketStore } from '../../src/store/useTicketStore';
import { translations } from '../../src/constants/translations';

export default function TicketsScreen() {
  const { language } = useAppStore();
  const t = translations[language];
  const { tickets, removeTicket } = useTicketStore();

  return (
    <View style={styles.container}>
      <LinearGradient colors={['#0B1F3A', '#1685D5']} style={styles.header}>
        <Text style={styles.headerTitle}>🎫 {t.myTickets}</Text>
        <Text style={styles.headerSub}>Your demo bookings</Text>
      </LinearGradient>

      <ScrollView contentContainerStyle={styles.body} showsVerticalScrollIndicator={false}>
        {/* Demo notice */}
        <View style={styles.demoNotice}>
          <Text style={styles.demoNoticeText}>⚠️ All tickets are DEMO only – not valid for actual travel.</Text>
        </View>

        {tickets.length === 0 ? (
          <View style={styles.emptyState}>
            <Text style={styles.emptyEmoji}>🎫</Text>
            <Text style={styles.emptyTitle}>No Demo Tickets Yet</Text>
            <Text style={styles.emptySub}>Search for a train and book a demo ticket to see it here.</Text>
            <TouchableOpacity style={styles.searchBtn} onPress={() => router.push('/(tabs)/search')}>
              <LinearGradient colors={['#1685D5', '#0B6DAE']} style={styles.searchBtnGrad}>
                <Text style={styles.searchBtnText}>🔍 Search Trains</Text>
              </LinearGradient>
            </TouchableOpacity>
          </View>
        ) : (
          tickets.map((ticket) => (
            <View key={ticket.id} style={styles.ticketCard}>
              {/* Header */}
              <LinearGradient colors={['#0B1F3A', '#1685D5']} style={styles.ticketHeader}>
                <View>
                  <Text style={styles.ticketAppName}>MAHSR Connect One</Text>
                  <View style={styles.demoBadge}><Text style={styles.demoBadgeText}>DEMO TICKET</Text></View>
                </View>
                <Text style={styles.ticketEmoji}>🎫</Text>
              </LinearGradient>

              {/* Body */}
              <View style={styles.ticketBody}>
                <View style={styles.ticketRow}>
                  <View style={styles.ticketStation}>
                    <Text style={styles.ticketTime}>{ticket.departureTime}</Text>
                    <Text style={styles.ticketStationName}>{ticket.fromStation}</Text>
                  </View>
                  <View style={styles.ticketMid}>
                    <Text style={styles.ticketDuration}>🚄</Text>
                    <View style={styles.ticketLine} />
                  </View>
                  <View style={[styles.ticketStation, { alignItems: 'flex-end' }]}>
                    <Text style={styles.ticketTime}>{ticket.arrivalTime}</Text>
                    <Text style={styles.ticketStationName}>{ticket.toStation}</Text>
                  </View>
                </View>

                <View style={styles.ticketDividerDashed} />

                <View style={styles.ticketInfoGrid}>
                  <View style={styles.ticketInfo}>
                    <Text style={styles.ticketInfoLabel}>Passenger</Text>
                    <Text style={styles.ticketInfoValue}>{ticket.passengerName}</Text>
                  </View>
                  <View style={styles.ticketInfo}>
                    <Text style={styles.ticketInfoLabel}>Booking ID</Text>
                    <Text style={[styles.ticketInfoValue, { color: Colors.secondary }]}>{ticket.bookingId}</Text>
                  </View>
                  <View style={styles.ticketInfo}>
                    <Text style={styles.ticketInfoLabel}>Seat(s)</Text>
                    <Text style={styles.ticketInfoValue}>{ticket.seats.join(', ')}</Text>
                  </View>
                  <View style={styles.ticketInfo}>
                    <Text style={styles.ticketInfoLabel}>Class</Text>
                    <Text style={styles.ticketInfoValue}>{ticket.seatClass === 'standard' ? 'Standard' : 'Business'}</Text>
                  </View>
                  <View style={styles.ticketInfo}>
                    <Text style={styles.ticketInfoLabel}>Date</Text>
                    <Text style={styles.ticketInfoValue}>{ticket.travelDate}</Text>
                  </View>
                  <View style={styles.ticketInfo}>
                    <Text style={styles.ticketInfoLabel}>Fare</Text>
                    <Text style={[styles.ticketInfoValue, { color: '#10B981', fontWeight: '800' }]}>
                      ₹{ticket.fare.toLocaleString('en-IN')}
                    </Text>
                  </View>
                </View>
              </View>

              {/* Actions */}
              <View style={styles.ticketActions}>
                <TouchableOpacity style={styles.viewBtn} onPress={() => router.push({ pathname: '/ticket', params: { id: ticket.id } })}>
                  <Text style={styles.viewBtnText}>👁️ View Full Ticket</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.deleteBtn}
                  onPress={() => Alert.alert('Delete Ticket', 'Remove this demo ticket?', [
                    { text: 'Cancel', style: 'cancel' },
                    { text: 'Delete', style: 'destructive', onPress: () => removeTicket(ticket.id) },
                  ])}
                >
                  <Text style={styles.deleteBtnText}>🗑️</Text>
                </TouchableOpacity>
              </View>
            </View>
          ))
        )}
        <View style={{ height: 30 }} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.surface },
  header: { paddingTop: 55, paddingBottom: 28, paddingHorizontal: Spacing.base },
  headerTitle: { fontSize: 24, fontWeight: '800', color: Colors.textOnDark, marginBottom: 4 },
  headerSub: { fontSize: 12, color: 'rgba(255,255,255,0.65)' },
  body: { padding: Spacing.base },
  demoNotice: {
    backgroundColor: '#FFF3E0', borderRadius: BorderRadius.lg, padding: Spacing.sm,
    marginBottom: Spacing.base, borderWidth: 1, borderColor: '#FFE082',
  },
  demoNoticeText: { fontSize: 12, color: '#E65100', textAlign: 'center', fontWeight: '600' },
  emptyState: { alignItems: 'center', paddingVertical: 60 },
  emptyEmoji: { fontSize: 64, marginBottom: Spacing.base },
  emptyTitle: { fontSize: 22, fontWeight: '800', color: Colors.primary, marginBottom: 8 },
  emptySub: { fontSize: 14, color: Colors.textSecondary, textAlign: 'center', lineHeight: 20, marginBottom: Spacing.xl },
  searchBtn: { borderRadius: BorderRadius.lg, overflow: 'hidden', width: 180 },
  searchBtnGrad: { paddingVertical: 14, alignItems: 'center' },
  searchBtnText: { fontSize: 15, fontWeight: '700', color: Colors.textOnDark },
  ticketCard: { backgroundColor: Colors.background, borderRadius: BorderRadius.xl, marginBottom: Spacing.base, overflow: 'hidden', ...Shadow.md },
  ticketHeader: { padding: Spacing.base, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  ticketAppName: { fontSize: 14, fontWeight: '800', color: Colors.textOnDark },
  demoBadge: { backgroundColor: '#EF4444', paddingVertical: 2, paddingHorizontal: 8, borderRadius: BorderRadius.full, marginTop: 4, alignSelf: 'flex-start' },
  demoBadgeText: { fontSize: 9, fontWeight: '800', color: '#FFFFFF' },
  ticketEmoji: { fontSize: 32 },
  ticketBody: { padding: Spacing.base },
  ticketRow: { flexDirection: 'row', alignItems: 'center', marginBottom: Spacing.base },
  ticketStation: { flex: 1 },
  ticketTime: { fontSize: 22, fontWeight: '800', color: Colors.primary },
  ticketStationName: { fontSize: 12, color: Colors.textSecondary, marginTop: 2 },
  ticketMid: { alignItems: 'center', paddingHorizontal: 8 },
  ticketDuration: { fontSize: 20, marginBottom: 4 },
  ticketLine: { width: 60, height: 2, backgroundColor: Colors.divider },
  ticketDividerDashed: { borderBottomWidth: 1, borderColor: Colors.divider, borderStyle: 'dashed', marginVertical: Spacing.base },
  ticketInfoGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: Spacing.sm },
  ticketInfo: { width: '47%' },
  ticketInfoLabel: { fontSize: 11, color: Colors.textLight, fontWeight: '500', marginBottom: 2 },
  ticketInfoValue: { fontSize: 13, fontWeight: '700', color: Colors.primary },
  ticketActions: { flexDirection: 'row', padding: Spacing.base, gap: Spacing.sm, borderTopWidth: 1, borderTopColor: Colors.divider },
  viewBtn: {
    flex: 1, backgroundColor: Colors.secondary, borderRadius: BorderRadius.lg,
    paddingVertical: 12, alignItems: 'center',
  },
  viewBtnText: { fontSize: 13, fontWeight: '700', color: Colors.textOnDark },
  deleteBtn: {
    backgroundColor: '#FEE2E2', borderRadius: BorderRadius.lg,
    paddingVertical: 12, paddingHorizontal: 16, alignItems: 'center',
  },
  deleteBtnText: { fontSize: 18 },
});
