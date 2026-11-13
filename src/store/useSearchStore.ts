import { create } from 'zustand';
import type { Station } from '../constants/stations';
import { MAHSR_STATIONS, DEMO_TRAINS } from '../constants/stations';

export type TripType = 'oneway' | 'round';

export interface SearchParams {
  fromStation: Station | null;
  toStation: Station | null;
  travelDate: Date;
  returnDate: Date;
  tripType: TripType;
  passengers: number;
}

interface SearchState {
  params: SearchParams;
  selectedTrain: typeof DEMO_TRAINS[0] | null;
  setParams: (params: Partial<SearchParams>) => void;
  setSelectedTrain: (train: typeof DEMO_TRAINS[0] | null) => void;
}

const defaultReturnDate = new Date();
defaultReturnDate.setDate(defaultReturnDate.getDate() + 2);

export const useSearchStore = create<SearchState>((set) => ({
  params: {
    fromStation: MAHSR_STATIONS[0],
    toStation: MAHSR_STATIONS[MAHSR_STATIONS.length - 1],
    travelDate: new Date(),
    returnDate: defaultReturnDate,
    tripType: 'oneway',
    passengers: 1,
  },
  selectedTrain: null,
  setParams: (newParams) =>
    set((state) => ({ params: { ...state.params, ...newParams } })),
  setSelectedTrain: (train) => set({ selectedTrain: train }),
}));

// Ticket check karne ka function jo batayega ki ticket valid hai ya 12 hours baad expire ho chuki hai
export function isTicketValid(createdAtTimestamp: number): boolean {
  const TWELVE_HOURS_IN_MS = 12 * 60 * 60 * 1000;
  const currentTime = Date.now();
  
  // Agar 12 hours (43200000 ms) se kam waqt hua hai, toh valid hai
  return (currentTime - createdAtTimestamp) < TWELVE_HOURS_IN_MS;
}
