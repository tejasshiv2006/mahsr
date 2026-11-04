import { Stack } from 'expo-router';
import { StatusBar } from 'react-native';
import { Colors } from '../src/constants/theme';

export default function RootLayout() {
  return (
    <>
      {/* Global Status Bar with matching theme */}
      <StatusBar barStyle="light-content" backgroundColor={Colors.surface} />
      
      <Stack 
        screenOptions={{ 
          headerShown: false, 
          contentStyle: { backgroundColor: Colors.surface },
          // Smooth slide animation from right for standard screens
          animation: 'slide_from_right', 
        }}
      >
        {/* Main Tabs Navigation */}
        <Stack.Screen name="(tabs)" />

        {/* Train Details with standard transition */}
        <Stack.Screen name="train-details" />

        {/* Seat Selection as a slide-up or push screen */}
        <Stack.Screen name="seat-selection" />

        {/* Ticket Screen styled smoothly */}
        <Stack.Screen name="ticket" />

        {/* Journey Tracking Screen */}
        <Stack.Screen name="journey-tracking" />
      </Stack>
    </>
  );
}