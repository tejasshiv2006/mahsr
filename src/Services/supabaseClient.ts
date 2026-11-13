import { createClient } from '@supabase/supabase-js';
import { StationFacility } from '../types/navigation';

const SUPABASE_URL = process.env.EXPO_PUBLIC_SUPABASE_URL || 'https://demo.supabase.co';
const SUPABASE_ANON_KEY = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY || 'demo-anon-key';

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// Demo Fallback Data (Mumbai BKC Station Prototype)
export const DEMO_FACILITIES: StationFacility[] = [
  { id: '1', station_code: 'BKC', name: 'Main Concourse Entrance', category: 'gate', floor: 'G', x_coord: 15, y_coord: 85, description: 'Gate 1 - Main Drop-off', is_accessible: true },
  { id: '2', station_code: 'BKC', name: 'Security Checkpoint A', category: 'security', floor: 'G', x_coord: 35, y_coord: 70, description: 'Baggage scanner & Metal Detector', is_accessible: true },
  { id: '3', station_code: 'BKC', name: 'High-Speed Ticket Counter', category: 'ticket', floor: 'G', x_coord: 60, y_coord: 80, description: 'Counter 1-8 & Self-Service Kiosks', is_accessible: true },
  { id: '4', station_code: 'BKC', name: 'Executive Waiting Lounge', category: 'amenity', floor: '1', x_coord: 40, y_coord: 45, description: 'Complimentary Wi-Fi & Refreshments', is_accessible: true },
  { id: '5', station_code: 'BKC', name: 'Platform 2 (Ahm-bound)', category: 'platform', floor: '2', x_coord: 80, y_coord: 25, description: 'E5 Shinkansen Boarding Platform', is_accessible: true },
  { id: '6', station_code: 'BKC', name: 'Coach C3 - C5 Boarding Point', category: 'platform', floor: '2', x_coord: 85, y_coord: 30, description: 'Standard & Executive Coach Zone', is_accessible: true },
  { id: '7', station_code: 'BKC', name: 'Wheelchair Elevator / Lift L2', category: 'accessibility', floor: 'G', x_coord: 50, y_coord: 60, description: 'Direct access from Concourse to Platform 2', is_accessible: true },
  { id: '8', station_code: 'BKC', name: 'Food Court & Refreshments', category: 'food', floor: '1', x_coord: 25, y_coord: 35, description: 'Cafes and snacks', is_accessible: true },
  { id: '9', station_code: 'BKC', name: 'Help Desk & Lost/Found', category: 'amenity', floor: 'G', x_coord: 45, y_coord: 75, description: 'Passenger support desk', is_accessible: true },
];

export const fetchStationFacilities = async (stationCode: string): Promise<StationFacility[]> => {
  try {
    const { data, error } = await supabase
      .from('station_facilities')
      .select('*')
      .eq('station_code', stationCode);

    if (error || !data || data.length === 0) {
      return DEMO_FACILITIES.filter((f) => f.station_code === stationCode || stationCode === 'BKC');
    }
    return data;
  } catch (e) {
    return DEMO_FACILITIES;
  }
};