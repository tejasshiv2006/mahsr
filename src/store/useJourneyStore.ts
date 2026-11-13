import { create } from 'zustand';

interface JourneyState {
  currentSpeed: number; // km/h
  nextStation: string;
  distanceToNext: number; // km
  etaMinutes: number;
  platformNumber: string;
  coachPosition: string;
  destinationAlertEnabled: boolean;
  toggleDestinationAlert: () => void;
}

export const useJourneyStore = create<JourneyState>((set) => ({
  currentSpeed: 315, // High-speed bullet train speed
  nextStation: 'Surat (ST)',
  distanceToNext: 42,
  etaMinutes: 11,
  platformNumber: 'Platform 2, Gate B',
  coachPosition: 'Mid-Platform (Coach C3 - C5)',
  destinationAlertEnabled: false,
  toggleDestinationAlert: () =>
    set((state) => ({ destinationAlertEnabled: !state.destinationAlertEnabled })),
}));