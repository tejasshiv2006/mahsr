import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface UserProfile {
  name: string;
  email: string;
  mobile: string;
}

interface AuthState {
  isAuthenticated: boolean;
  isGuest: boolean;
  user: UserProfile | null;
  login: (user: UserProfile) => void;
  register: (user: UserProfile) => void;
  loginAsGuest: () => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      isAuthenticated: false,
      isGuest: false,
      user: null,
      login: (user) => set({ isAuthenticated: true, isGuest: false, user }),
      register: (user) => set({ isAuthenticated: true, isGuest: false, user }),
      loginAsGuest: () => set({ 
        isAuthenticated: false, 
        isGuest: true, 
        user: { name: 'Guest Passenger', email: 'guest@mahsr.connect', mobile: '+91 9000000000' } 
      }),
      logout: () => set({ isAuthenticated: false, isGuest: false, user: null }),
    }),
    {
      name: 'mahsr-auth-storage',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);