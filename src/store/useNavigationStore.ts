import { create } from 'zustand';
import { StationFacility } from '../types/navigation';
import { fetchStationFacilities } from '../Services/supabaseClient';

interface NavigationState {
  activeTab: 'outdoor' | 'indoor';
  selectedStation: string;
  facilities: StationFacility[];
  selectedFacility: StationFacility | null;
  searchQuery: string;
  userLocation: { latitude: number; longitude: number } | null;
  permissionGranted: boolean;
  
  setTab: (tab: 'outdoor' | 'indoor') => void;
  setSearchQuery: (query: string) => void;
  selectFacility: (facility: StationFacility | null) => void;
  loadFacilities: (stationCode: string) => Promise<void>;
  setUserLocation: (loc: { latitude: number; longitude: number } | null, granted: boolean) => void;
}

export const useNavigationStore = create<NavigationState>((set, get) => ({
  activeTab: 'outdoor',
  selectedStation: 'BKC',
  facilities: [],
  selectedFacility: null,
  searchQuery: '',
  userLocation: null,
  permissionGranted: false,

  setTab: (activeTab) => set({ activeTab }),
  setSearchQuery: (searchQuery) => set({ searchQuery }),
  selectFacility: (selectedFacility) => set({ selectedFacility }),
  loadFacilities: async (stationCode) => {
    const data = await fetchStationFacilities(stationCode);
    set({ facilities: data, selectedStation: stationCode });
  },
  setUserLocation: (userLocation, permissionGranted) => set({ userLocation, permissionGranted }),
}));