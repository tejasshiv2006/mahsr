import { Stack } from 'expo-router';
import { StatusBar } from 'react-native';
import { Colors } from '../src/constants/theme';

export default function RootLayout() {
  return (
    <>
      <StatusBar barStyle="light-content" />
      <Stack screenOptions={{ headerShown: false, contentStyle: { backgroundColor: Colors.surface } }}>
        <Stack.Screen name="(tabs)" />
        <Stack.Screen name="train-details" />
        <Stack.Screen name="seat-selection" />
        <Stack.Screen name="ticket" />
        <Stack.Screen name="journey-tracking" />
      </Stack>
    </>
  );
}
