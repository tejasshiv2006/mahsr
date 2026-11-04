import { Tabs } from 'expo-router';
import { Colors } from '../../src/constants/theme';
import { translations } from '../../src/constants/translations';
import { useAppStore } from '../../src/store/useAppStore';

export default function TabLayout() {
  const t = translations[useAppStore((state) => state.language)];

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: Colors.secondary,
        tabBarInactiveTintColor: Colors.textSecondary,
        tabBarStyle: { backgroundColor: Colors.surfaceCard, borderTopColor: Colors.divider },
      }}
    >
      <Tabs.Screen name="search" options={{ title: t.trainSearch, tabBarLabel: t.search }} />
      <Tabs.Screen name="tickets" options={{ title: t.myTickets, tabBarLabel: t.myTickets }} />
    </Tabs>
  );
}
