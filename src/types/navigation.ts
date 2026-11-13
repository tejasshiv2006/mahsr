export interface StationFacility {
  id: string;
  station_code: string;
  name: string;
  category: 'gate' | 'platform' | 'security' | 'ticket' | 'amenity' | 'accessibility' | 'food';
  floor: 'G' | '1' | '2';
  x_coord: number; // Percentage for 2D map canvas
  y_coord: number;
  description: string;
  is_accessible: boolean;
}

export interface StationLocation {
  code: string;
  name: string;
  city: string;
  latitude: number;
  longitude: number;
  facilities: StationFacility[];
}