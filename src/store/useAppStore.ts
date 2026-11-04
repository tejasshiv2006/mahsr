import { create } from 'zustand';
import type { Language } from '../constants/translations';

interface AppState {
  language: Language;
  user: { name: string } | null;
  setLanguage: (language: Language) => void;
}

export const useAppStore = create<AppState>((set) => ({
  language: 'en',
  user: { name: 'Guest' },
  setLanguage: (language) => set({ language }),
}));
