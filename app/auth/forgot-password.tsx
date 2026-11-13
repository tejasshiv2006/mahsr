import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { Colors, BorderRadius } from '../../src/constants/theme';

export default function ForgotPasswordScreen() {
  const [step, setStep] = useState<'request' | 'verify'>('request');
  const [identifier, setIdentifier] = useState('');
  const [otp, setOtp] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [message, setMessage] = useState('');

  const handleSendOtp = () => {
    if (!identifier.trim()) {
      setMessage('Please enter your registered email or mobile.');
      return;
    }
    setMessage('Simulated OTP sent successfully! (Demo OTP: 1234)');
    setStep('verify');
  };

  const handleResetPassword = () => {
    if (otp !== '1234') {
      setMessage('Invalid OTP. Please enter 1234.');
      return;
    }
    if (!newPassword || newPassword.length < 6) {
      setMessage('Password must be at least 6 characters.');
      return;
    }
    alert('Password updated successfully! Please login with your new password.');
    router.replace('/auth/login');
  };

  return (
    <SafeAreaView style={styles.root}>
      <View style={styles.container}>
        <View style={styles.card}>
          <Text style={styles.title}>Reset Password</Text>
          <Text style={styles.instruction}>
            {step === 'request' ? 'Enter your credentials to receive a simulated verification code.' : 'Enter demo OTP (1234) and set a new password.'}
          </Text>

          {message ? <Text style={styles.msgText}>{message}</Text> : null}

          {step === 'request' ? (
            <>
              <View style={styles.inputGroup}>
                <Text style={styles.label}>Email or Mobile</Text>
                <TextInput style={styles.input} placeholder="Registered email/mobile" placeholderTextColor="#A0AEC0" value={identifier} onChangeText={setIdentifier} />
              </View>
              <TouchableOpacity style={styles.primaryButton} onPress={handleSendOtp}>
                <Text style={styles.primaryButtonText}>Send Simulated OTP</Text>
              </TouchableOpacity>
            </>
          ) : (
            <>
              <View style={styles.inputGroup}>
                <Text style={styles.label}>Enter 4-digit OTP (Demo: 1234)</Text>
                <TextInput style={styles.input} placeholder="1234" placeholderTextColor="#A0AEC0" keyboardType="number-pad" maxLength={4} value={otp} onChangeText={setOtp} />
              </View>
              <View style={styles.inputGroup}>
                <Text style={styles.label}>New Password</Text>
                <TextInput style={styles.input} placeholder="Enter new password" placeholderTextColor="#A0AEC0" secureTextEntry value={newPassword} onChangeText={setNewPassword} />
              </View>
              <TouchableOpacity style={styles.primaryButton} onPress={handleResetPassword}>
                <Text style={styles.primaryButtonText}>Update Password & Login</Text>
              </TouchableOpacity>
            </>
          )}

          <TouchableOpacity style={styles.backBtn} onPress={() => router.back()}>
            <Text style={styles.backText}>Back to Login</Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: Colors.primary },
  container: { flex: 1, padding: 20, justifyContent: 'center' },
  card: { backgroundColor: '#FFFFFF', borderRadius: BorderRadius.xl, padding: 24, shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.15, shadowRadius: 12, elevation: 5 },
  title: { fontSize: 22, fontWeight: '800', color: Colors.textPrimary },
  instruction: { fontSize: 13, color: '#718096', marginTop: 4, marginBottom: 16 },
  msgText: { color: Colors.primary, fontSize: 13, marginBottom: 12, fontWeight: '600', backgroundColor: '#EBF8FF', padding: 8, borderRadius: BorderRadius.sm },
  inputGroup: { marginBottom: 14 },
  label: { fontSize: 12, fontWeight: '700', color: Colors.textPrimary, marginBottom: 6 },
  input: { borderWidth: 1, borderColor: '#E2E8F0', borderRadius: BorderRadius.md, paddingHorizontal: 14, height: 46, fontSize: 14, color: Colors.textPrimary, backgroundColor: '#F7FAFC' },
  primaryButton: { backgroundColor: Colors.primary, height: 50, borderRadius: BorderRadius.md, justifyContent: 'center', alignItems: 'center', marginTop: 6, marginBottom: 12 },
  primaryButtonText: { color: '#FFFFFF', fontSize: 15, fontWeight: '800' },
  backBtn: { alignItems: 'center', marginTop: 10 },
  backText: { color: '#718096', fontWeight: '700', fontSize: 13 },
});