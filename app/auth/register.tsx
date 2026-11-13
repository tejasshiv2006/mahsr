import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, KeyboardAvoidingView, Platform, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { Colors, BorderRadius } from '../../src/constants/theme';
import { useAuthStore } from '../../src/store/useAuthStore';

export default function RegisterScreen() {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [mobile, setMobile] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');

  const register = useAuthStore((s) => s.register);

  const handleRegister = () => {
    setError('');
    if (!fullName.trim() || !email.trim() || !mobile.trim() || !password.trim()) {
      setError('Please fill in all required fields.');
      return;
    }
    if (password.length < 6) {
      setError('Password must be at least 6 characters long.');
      return;
    }

    register({ name: fullName, email, mobile });
    router.replace('/(tabs)/search');
  };

  return (
    <SafeAreaView style={styles.root}>
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={{ flex: 1 }}>
        <ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>
          <View style={styles.headerContainer}>
            <Text style={styles.appName}>MAHSR Connect One</Text>
            <Text style={styles.subtitle}>Bullet Train Passenger Portal</Text>
          </View>

          <View style={styles.card}>
            <Text style={styles.title}>Create Account</Text>
            <Text style={styles.instruction}>Register to book high-speed rail tickets seamlessly</Text>

            {error ? <Text style={styles.errorText}>{error}</Text> : null}

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Full Name</Text>
              <TextInput style={styles.input} placeholder="Enter your full name" placeholderTextColor="#A0AEC0" value={fullName} onChangeText={setFullName} />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Email Address</Text>
              <TextInput style={styles.input} placeholder="name@example.com" placeholderTextColor="#A0AEC0" value={email} onChangeText={setEmail} autoCapitalize="none" />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Mobile Number</Text>
              <TextInput style={styles.input} placeholder="10-digit mobile number" placeholderTextColor="#A0AEC0" value={mobile} onChangeText={setMobile} keyboardType="phone-pad" />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Password</Text>
              <View style={styles.passwordContainer}>
                <TextInput style={[styles.input, { flex: 1, borderWidth: 0 }]} placeholder="Create password (min 6 chars)" placeholderTextColor="#A0AEC0" secureTextEntry={!showPassword} value={password} onChangeText={setPassword} />
                <TouchableOpacity onPress={() => setShowPassword(!showPassword)} style={styles.eyeBtn}>
                  <Text style={styles.eyeText}>{showPassword ? 'Hide' : 'Show'}</Text>
                </TouchableOpacity>
              </View>
            </View>

            <TouchableOpacity style={styles.primaryButton} onPress={handleRegister}>
              <Text style={styles.primaryButtonText}>Register & Proceed</Text>
            </TouchableOpacity>

            <View style={styles.footerRow}>
              <Text style={styles.footerText}>Already have an account? </Text>
              <TouchableOpacity onPress={() => router.back()}>
                <Text style={styles.linkText}>Login</Text>
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
  headerContainer: { alignItems: 'center', marginBottom: 20 },
  appName: { fontSize: 24, fontWeight: '900', color: '#FFFFFF' },
  subtitle: { fontSize: 12, color: '#CBD5E0', marginTop: 4, fontWeight: '600' },
  card: { backgroundColor: '#FFFFFF', borderRadius: BorderRadius.xl, padding: 24, shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.15, shadowRadius: 12, elevation: 5 },
  title: { fontSize: 22, fontWeight: '800', color: Colors.textPrimary },
  instruction: { fontSize: 13, color: '#718096', marginTop: 4, marginBottom: 16 },
  errorText: { color: '#E53E3E', fontSize: 13, marginBottom: 12, fontWeight: '600', backgroundColor: '#FFF5F5', padding: 8, borderRadius: BorderRadius.sm },
  inputGroup: { marginBottom: 14 },
  label: { fontSize: 12, fontWeight: '700', color: Colors.textPrimary, marginBottom: 6 },
  input: { borderWidth: 1, borderColor: '#E2E8F0', borderRadius: BorderRadius.md, paddingHorizontal: 14, height: 46, fontSize: 14, color: Colors.textPrimary, backgroundColor: '#F7FAFC' },
  passwordContainer: { flexDirection: 'row', alignItems: 'center', borderWidth: 1, borderColor: '#E2E8F0', borderRadius: BorderRadius.md, backgroundColor: '#F7FAFC' },
  eyeBtn: { paddingHorizontal: 14, justifyContent: 'center' },
  eyeText: { fontSize: 12, fontWeight: '700', color: Colors.primary },
  primaryButton: { backgroundColor: Colors.primary, height: 50, borderRadius: BorderRadius.md, justifyContent: 'center', alignItems: 'center', marginTop: 6, marginBottom: 16 },
  primaryButtonText: { color: '#FFFFFF', fontSize: 15, fontWeight: '800' },
  footerRow: { flexDirection: 'row', justifyContent: 'center', alignItems: 'center' },
  footerText: { fontSize: 13, color: '#718096' },
  linkText: { fontSize: 13, color: Colors.primary, fontWeight: '800' },
});