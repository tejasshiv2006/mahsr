import React from 'react';
import { View, Text, ScrollView, StyleSheet } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import { useTicketStore } from '../src/store/useTicketStore';

export default function TicketDetailScreen() {
  const { id } = useLocalSearchParams();
  const tickets = useTicketStore((s: any) => s.tickets);
  const ticket = tickets.find((t: any) => String(t.id) === String(id));

  // Station text helper
  const getStationText = (station: any) => {
    if (!station) return '';
    if (typeof station === 'string') return station;
    if (typeof station === 'object') {
      const name = station.name || station.nameHi || station.nameMr || station.nameGu || station.code;
      if (typeof name === 'string') return name;
      if (name && typeof name === 'object') return name.en || name.name || '';
    }
    return '';
  };

  const safeText = (val: any) => {
    if (!val) return '';
    if (typeof val === 'string' || typeof val === 'number') return String(val);
    if (typeof val === 'object') {
      const obj: any = val;
      return obj.name || obj.en || obj.code || obj.title || '';
    }
    return String(val);
  };

  if (!ticket) {
    return (
      <View style={styles.center}>
        <Text style={{ color: '#000' }}>Ticket not found!</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      {/* Route Name - Using getStationText to prevent object crash */}
      <Text style={styles.title}>
        {getStationText(ticket.fromStation)} → {getStationText(ticket.toStation)}
      </Text>

      <Text>Train: {safeText(ticket.trainNumber)} - {safeText(ticket.trainName)}</Text>
      <Text>Passenger: {safeText(ticket.passengerName)}</Text>
      <Text>Booking ID: {safeText(ticket.bookingId)}</Text>
      <Text>Travel Date: {safeText(ticket.travelDate)}</Text>
      <Text>Seats: {Array.isArray(ticket.seats) ? ticket.seats.join(', ') : safeText(ticket.seats)}</Text>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, backgroundColor: '#fff' },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  title: { fontSize: 18, fontWeight: 'bold', marginBottom: 12 },
});