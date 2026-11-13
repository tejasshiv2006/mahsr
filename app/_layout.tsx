import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { Colors } from '../src/constants/theme';

export default function RootLayout() {
  return (
    <>
      <StatusBar style="light" />
      <Stack 
        screenOptions={{ 
          headerShown: false, 
          contentStyle: { backgroundColor: Colors.surface },
          animation: 'slide_from_right', 
        }}
      >
        <Stack.Screen name="index" />
        <Stack.Screen name="(tabs)" />
        <Stack.Screen name="train-details" />
        <Stack.Screen name="seat-selection" />
        <Stack.Screen name="ticket" />
        <Stack.Screen name="journey-tracking" />
      </Stack>
    </>
  );
}