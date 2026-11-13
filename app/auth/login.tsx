import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, KeyboardAvoidingView, Platform, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { Colors, BorderRadius } from '../../src/constants/theme';
import { useAuthStore } from '../../src/store/useAuthStore';

export default function LoginScreen() {
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');

  const login = useAuthStore((s) => s.login);
  const loginAsGuest = useAuthStore((s) => s.loginAsGuest);

  const handleLogin = () => {
    setError('');
    if (!identifier.trim() || !password.trim()) {
      setError('Please enter both email/mobile and password.');
      return;
    }
    // Simulated authentication check for prototype
    login({
      name: identifier.includes('@') ? identifier.split('@')[0].toUpperCase() : 'Valued Passenger',
      email: identifier.includes('@') ? identifier : `${identifier}@mahsr.connect`,
      mobile: identifier.includes('@') ? '+91 9876543210' : identifier,
    });
    router.replace('/(tabs)/search');
  };

  const handleGuestLogin = () => {
    loginAsGuest();
    router.replace('/(tabs)/search');
  };

  return (
    <SafeAreaView style={styles.root}>
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={{ flex: 1 }}>
        <ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>
          <View style={styles.headerContainer}>
            <Text style={styles.appName}>MAHSR Connect One</Text>
            <Text style={styles.subtitle}>Mumbai-Ahmedabad High-Speed Rail Corridor</Text>
          </View>

          <View style={styles.card}>
            <Text style={styles.title}>Welcome Back</Text>
            <Text style={styles.instruction}>Sign in to access your tickets & high-speed journey</Text>

            {error ? <Text style={styles.errorText}>{error}</Text> : null}

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Email or Mobile Number</Text>
              <TextInput
                style={styles.input}
                placeholder="Enter email or 10-digit mobile"
                placeholderTextColor="#A0AEC0"
                value={identifier}
                onChangeText={setIdentifier}
                autoCapitalize="none"
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Password</Text>
              <View style={styles.passwordContainer}>
                <TextInput
                  style={[styles.input, { flex: 1, borderWidth: 0 }]}
                  placeholder="Enter password"
                  placeholderTextColor="#A0AEC0"
                  secureTextEntry={!showPassword}
                  value={password}
                  onChangeText={setPassword}
                />
                <TouchableOpacity onPress={() => setShowPassword(!showPassword)} style={styles.eyeBtn}>
                  <Text style={styles.eyeText}>{showPassword ? 'Hide' : 'Show'}</Text>
                </TouchableOpacity>
              </View>
            </View>

            <TouchableOpacity style={styles.forgotBtn} onPress={() => router.push('/auth/forgot-password')}>
              <Text style={styles.forgotText}>Forgot Password?</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.primaryButton} onPress={handleLogin}>
              <Text style={styles.primaryButtonText}>Login</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.guestButton} onPress={handleGuestLogin}>
              <Text style={styles.guestButtonText}>Continue as Guest</Text>
            </TouchableOpacity>

            <View style={styles.footerRow}>
              <Text style={styles.footerText}>Don't have an account? </Text>
              <TouchableOpacity onPress={() => router.push('/auth/register')}>
                <Text style={styles.linkText}>Create Account</Text>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: Colors.primary },
  container: { flexGrow: 1, padding: 20, justifyContent: 'center' },
  headerContainer: { alignItems: 'center', marginBottom: 24 },
  appName: { fontSize: 24, fontWeight: '900', color: '#FFFFFF', letterSpacing: 0.5 },
  subtitle: { fontSize: 12, color: '#CBD5E0', marginTop: 4, fontWeight: '600' },
  card: { backgroundColor: '#FFFFFF', borderRadius: BorderRadius.xl, padding: 24, shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.15, shadowRadius: 12, elevation: 5 },
  title: { fontSize: 22, fontWeight: '800', color: Colors.textPrimary },
  instruction: { fontSize: 13, color: '#718096', marginTop: 4, marginBottom: 20 },
  errorText: { color: '#E53E3E', fontSize: 13, marginBottom: 12, fontWeight: '600', backgroundColor: '#FFF5F5', padding: 8, borderRadius: BorderRadius.sm },
  inputGroup: { marginBottom: 16 },
  label: { fontSize: 12, fontWeight: '700', color: Colors.textPrimary, marginBottom: 6 },
  input: { borderWidth: 1, borderColor: '#E2E8F0', borderRadius: BorderRadius.md, paddingHorizontal: 14, height: 48, fontSize: 14, color: Colors.textPrimary, backgroundColor: '#F7FAFC' },
  passwordContainer: { flexDirection: 'row', alignItems: 'center', borderWidth: 1, borderColor: '#E2E8F0', borderRadius: BorderRadius.md, backgroundColor: '#F7FAFC' },
  eyeBtn: { paddingHorizontal: 14, justifyContent: 'center' },
  eyeText: { fontSize: 12, fontWeight: '700', color: Colors.primary },
  forgotBtn: { alignSelf: 'flex-end', marginBottom: 20 },
  forgotText: { fontSize: 12, color: Colors.primary, fontWeight: '700' },
  primaryButton: { backgroundColor: Colors.primary, height: 50, borderRadius: BorderRadius.md, justifyContent: 'center', alignItems: 'center', marginBottom: 12 },
  primaryButtonText: { color: '#FFFFFF', fontSize: 15, fontWeight: '800' },
  guestButton: { backgroundColor: '#EDF2F7', height: 46, borderRadius: BorderRadius.md, justifyContent: 'center', alignItems: 'center', marginBottom: 20 },
  guestButtonText: { color: Colors.textPrimary, fontSize: 14, fontWeight: '700' },
  footerRow: { flexDirection: 'row', justifyContent: 'center', alignItems: 'center' },
  footerText: { fontSize: 13, color: '#718096' },
  linkText: { fontSize: 13, color: Colors.primary, fontWeight: '800' },
});