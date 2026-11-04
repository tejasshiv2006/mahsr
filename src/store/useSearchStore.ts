import { create } from 'zustand';
import { DEMO_TRAINS, MAHSR_STATIONS } from '../constants/stations';
import type { Station, Train } from '../constants/stations';

export interface SearchParams {
  fromStation: Station | null;
  toStation: Station | null;
  travelDate: Date;
  passengers: number;
}

interface SearchState {
  params: SearchParams;
  selectedTrain: Train | null;
  selectedClass: 'standard' | 'business';
  selectedSeats: string[];
  setParams: (params: Partial<SearchParams>) => void;
  setSelectedTrain: (train: Train) => void;
  setSelectedClass: (seatClass: 'standard' | 'business') => void;
  toggleSeat: (seat: string) => void;
}

const tomorrow = new Date();
tomorrow.setDate(tomorrow.getDate() + 1);
tomorrow.setHours(0, 0, 0, 0);

export const useSearchStore = create<SearchState>((set) => ({
  params: {
    fromStation: MAHSR_STATIONS[0] ?? null,
    toStation: MAHSR_STATIONS.find((station) => station.id === 'AMD') ?? null,
    travelDate: tomorrow,
    passengers: 1,
  },
  selectedTrain: DEMO_TRAINS[0] ?? null,
  selectedClass: 'standard',
  selectedSeats: [],
  setParams: (params) => set((state) => ({ params: { ...state.params, ...params } })),
  setSelectedTrain: (selectedTrain) => set({ selectedTrain, selectedSeats: [] }),
  setSelectedClass: (selectedClass) => set({ selectedClass }),
  toggleSeat: (seat) => set((state) => {
    if (state.selectedSeats.includes(seat)) {
      return { selectedSeats: state.selectedSeats.filter((item) => item !== seat) };
    }
    if (state.selectedSeats.length >= state.params.passengers) return state;
    return { selectedSeats: [...state.selectedSeats, seat] };
  }),
}));
