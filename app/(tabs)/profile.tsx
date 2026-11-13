import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { Colors, BorderRadius } from '../../src/constants/theme';
import { useAuthStore } from '../../src/store/useAuthStore';

export default function ProfileTabScreen() {
  const user = useAuthStore((s) => s.user);
  const isGuest = useAuthStore((s) => s.isGuest);
  const logout = useAuthStore((s) => s.logout);

  const handleLogout = () => {
    logout();
    router.replace('/auth/login');
  };

  return (
    <SafeAreaView style={styles.root} edges={['top']}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Passenger Profile</Text>
      </View>

      <View style={styles.body}>
        <View style={styles.card}>
          <View style={styles.avatarCircle}>
            <Text style={styles.avatarText}>{user?.name ? user.name.charAt(0).toUpperCase() : 'P'}</Text>
          </View>
          <Text style={styles.userName}>{user?.name || 'High-Speed Rail Passenger'}</Text>
          <Text style={styles.userRole}>{isGuest ? 'Guest Session' : 'Verified Member'}</Text>

          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Email</Text>
            <Text style={styles.infoValue}>{user?.email || 'N/A'}</Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Mobile Number</Text>
            <Text style={styles.infoValue}>{user?.mobile || 'N/A'}</Text>
          </View>
        </View>

        <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
          <Text style={styles.logoutButtonText}>Log Out</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: Colors.primary },
  header: { paddingHorizontal: 16, paddingVertical: 14, borderBottomWidth: 1, borderBottomColor: 'rgba(255,255,255,0.1)' },
  headerTitle: { fontSize: 18, fontWeight: '800', color: '#FFFFFF' },
  body: { padding: 16, gap: 16 },
  card: { backgroundColor: '#FFFFFF', borderRadius: BorderRadius.xl, padding: 24, alignItems: 'center', shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.1, shadowRadius: 4, elevation: 3 },
  avatarCircle: { width: 70, height: 70, borderRadius: 35, backgroundColor: Colors.primary, justifyContent: 'center', alignItems: 'center', marginBottom: 12 },
  avatarText: { fontSize: 28, fontWeight: '900', color: '#FFFFFF' },
  userName: { fontSize: 18, fontWeight: '800', color: Colors.textPrimary },
  userRole: { fontSize: 12, color: '#3182CE', fontWeight: '700', marginTop: 2, marginBottom: 20, backgroundColor: '#EBF8FF', paddingHorizontal: 10, paddingVertical: 4, borderRadius: 12 },
  infoRow: { width: '100%', flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 10, borderBottomWidth: 1, borderBottomColor: '#EDF2F7' },
  infoLabel: { fontSize: 13, color: '#718096', fontWeight: '600' },
  infoValue: { fontSize: 13, color: Colors.textPrimary, fontWeight: '700' },
  logoutButton: { backgroundColor: '#E53E3E', height: 50, borderRadius: BorderRadius.md, justifyContent: 'center', alignItems: 'center' },
  logoutButtonText: { color: '#FFFFFF', fontSize: 15, fontWeight: '800' },
});