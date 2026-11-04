import type { Language } from './translations';

export interface Station {
  id: string;
  name: string;
  nameHi: string;
  nameMr: string;
  nameGu: string;
  code: string;
  state: string;
  distance: number; // km from Mumbai
  platforms: number;
}

export const MAHSR_STATIONS: Station[] = [
  { id: 'MUM', name: 'Mumbai (BKC)', nameHi: 'मुंबई (बीकेसी)', nameMr: 'मुंबई (बीकेसी)', nameGu: 'મુંબઈ (BKC)', code: 'BKC', state: 'Maharashtra', distance: 0, platforms: 4 },
  { id: 'THA', name: 'Thane', nameHi: 'ठाणे', nameMr: 'ठाणे', nameGu: 'ઠાણે', code: 'TNA', state: 'Maharashtra', distance: 25, platforms: 2 },
  { id: 'VIR', name: 'Virar', nameHi: 'विरार', nameMr: 'विरार', nameGu: 'વિરાર', code: 'VR', state: 'Maharashtra', distance: 60, platforms: 2 },
  { id: 'BOI', name: 'Boisar', nameHi: 'बोईसर', nameMr: 'बोईसर', nameGu: 'બોઈસર', code: 'BSR', state: 'Maharashtra', distance: 89, platforms: 2 },
  { id: 'VAP', name: 'Vapi', nameHi: 'वापी', nameMr: 'वापी', nameGu: 'વાપી', code: 'VAPI', state: 'Gujarat', distance: 131, platforms: 2 },
  { id: 'BIL', name: 'Bilimora', nameHi: 'बिलीमोरा', nameMr: 'बिलीमोरा', nameGu: 'બીલીમોરા', code: 'BIM', state: 'Gujarat', distance: 163, platforms: 2 },
  { id: 'SUR', name: 'Surat', nameHi: 'सूरत', nameMr: 'सुरत', nameGu: 'સુરત', code: 'ST', state: 'Gujarat', distance: 200, platforms: 4 },
  { id: 'BHA', name: 'Bharuch', nameHi: 'भरूच', nameMr: 'भरूच', nameGu: 'ભરૂચ', code: 'BH', state: 'Gujarat', distance: 250, platforms: 2 },
  { id: 'VAD', name: 'Vadodara', nameHi: 'वडोदरा', nameMr: 'वडोदरा', nameGu: 'વડોદરા', code: 'BRC', state: 'Gujarat', distance: 310, platforms: 4 },
  { id: 'ANA', name: 'Anand', nameHi: 'आनंद', nameMr: 'आनंद', nameGu: 'આણંદ', code: 'ANND', state: 'Gujarat', distance: 355, platforms: 2 },
  { id: 'AMD', name: 'Ahmedabad', nameHi: 'अहमदाबाद', nameMr: 'अहमदाबाद', nameGu: 'અમદાવાદ', code: 'ADI', state: 'Gujarat', distance: 508, platforms: 4 },
  { id: 'SAB', name: 'Sabarmati', nameHi: 'साबरमती', nameMr: 'साबरमती', nameGu: 'સાબરમતી', code: 'SBI', state: 'Gujarat', distance: 520, platforms: 2 },
];

export interface Train {
  id: string;
  name: string;
  number: string;
  type: string;
  departureTime: string;
  arrivalTime: string;
  duration: string;
  fromStation: string;
  toStation: string;
  fare: {
    standard: number;
    business: number;
  };
  totalSeats: number;
  availableSeats: number;
  amenities: string[];
  daysOfOperation: string[];
}

export const DEMO_TRAINS: Train[] = [
  {
    id: 'T001',
    name: 'MAHSR Shinkansen Express',
    number: 'HS-101',
    type: 'High-Speed Express',
    departureTime: '06:00',
    arrivalTime: '08:57',
    duration: '2h 57m',
    fromStation: 'MUM',
    toStation: 'AMD',
    fare: { standard: 2500, business: 4800 },
    totalSeats: 240,
    availableSeats: 42,
    amenities: ['WiFi', 'Café', 'AC', 'Power Outlets', 'Luggage Storage'],
    daysOfOperation: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
  },
  {
    id: 'T002',
    name: 'MAHSR Rajdhani Bullet',
    number: 'HS-105',
    type: 'Premium Express',
    departureTime: '09:30',
    arrivalTime: '12:27',
    duration: '2h 57m',
    fromStation: 'MUM',
    toStation: 'AMD',
    fare: { standard: 2750, business: 5200 },
    totalSeats: 240,
    availableSeats: 89,
    amenities: ['WiFi', 'Café', 'AC', 'Power Outlets', 'Panoramic Windows', 'Meal Service'],
    daysOfOperation: ['Mon', 'Wed', 'Fri', 'Sun'],
  },
  {
    id: 'T003',
    name: 'MAHSR Evening Flyer',
    number: 'HS-201',
    type: 'High-Speed Express',
    departureTime: '17:45',
    arrivalTime: '20:42',
    duration: '2h 57m',
    fromStation: 'MUM',
    toStation: 'AMD',
    fare: { standard: 2200, business: 4200 },
    totalSeats: 240,
    availableSeats: 156,
    amenities: ['WiFi', 'AC', 'Power Outlets'],
    daysOfOperation: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
  },
];

export interface JourneyUpdate {
  time: string;
  station: string;
  status: 'departed' | 'arriving' | 'upcoming';
  delay?: number;
}

export const DEMO_JOURNEY_UPDATES: JourneyUpdate[] = [
  { time: '06:00', station: 'Mumbai (BKC)', status: 'departed' },
  { time: '06:14', station: 'Thane', status: 'departed' },
  { time: '06:35', station: 'Virar', status: 'departed' },
  { time: '06:52', station: 'Boisar', status: 'arriving' },
  { time: '07:12', station: 'Vapi', status: 'upcoming' },
  { time: '07:28', station: 'Bilimora', status: 'upcoming' },
  { time: '07:48', station: 'Surat', status: 'upcoming' },
  { time: '08:12', station: 'Bharuch', status: 'upcoming' },
  { time: '08:32', station: 'Vadodara', status: 'upcoming' },
  { time: '08:49', station: 'Anand', status: 'upcoming' },
  { time: '08:57', station: 'Ahmedabad', status: 'upcoming' },
];

export const WEEK_ORDER = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

// Station names exist in en/hi/mr/gu; ta and te fall back to English.
export function localStationName(name: string, lang: Language): string {
  const st = MAHSR_STATIONS.find((s) => s.name === name);
  if (!st) return name;
  if (lang === 'hi') return st.nameHi;
  if (lang === 'mr') return st.nameMr;
  if (lang === 'gu') return st.nameGu;
  return st.name;
}
