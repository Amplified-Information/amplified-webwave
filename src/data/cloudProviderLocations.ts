
export interface CloudLocation {
  provider: 'AWS' | 'Google Cloud' | 'Azure';
  name: string;
  lat: number;
  lng: number;
  type: 'Region' | 'Edge Location' | 'CDN';
  performance?: number;
}

export const cloudLocations: CloudLocation[] = [
  // AWS Locations
  { provider: 'AWS', name: 'N. Virginia', lat: 38.9519, lng: -77.4480, type: 'Region' },
  { provider: 'AWS', name: 'Oregon', lat: 45.8399, lng: -119.7006, type: 'Region' },
  { provider: 'AWS', name: 'Ireland', lat: 53.3498, lng: -6.2603, type: 'Region' },
  { provider: 'AWS', name: 'Singapore', lat: 1.3521, lng: 103.8198, type: 'Region' },
  { provider: 'AWS', name: 'Tokyo', lat: 35.6762, lng: 139.6503, type: 'Region' },
  
  // Google Cloud Locations
  { provider: 'Google Cloud', name: 'Iowa', lat: 41.8780, lng: -93.0977, type: 'Region' },
  { provider: 'Google Cloud', name: 'Netherlands', lat: 52.3676, lng: 4.9041, type: 'Region' },
  { provider: 'Google Cloud', name: 'Taiwan', lat: 23.6978, lng: 120.9605, type: 'Region' },
  { provider: 'Google Cloud', name: 'London', lat: 51.5074, lng: -0.1278, type: 'Region' },
  { provider: 'Google Cloud', name: 'Sydney', lat: -33.8688, lng: 151.2093, type: 'Region' },

  // Azure Locations
  { provider: 'Azure', name: 'East US', lat: 37.3719, lng: -79.8164, type: 'Region' },
  { provider: 'Azure', name: 'West Europe', lat: 52.3667, lng: 4.8945, type: 'Region' },
  { provider: 'Azure', name: 'Southeast Asia', lat: 1.3521, lng: 103.8198, type: 'Region' },
  { provider: 'Azure', name: 'Brazil South', lat: -23.5505, lng: -46.6333, type: 'Region' },
  { provider: 'Azure', name: 'Australia East', lat: -33.8688, lng: 151.2093, type: 'Region' },

  // CDN Edge Locations
  { provider: 'AWS', name: 'Miami Edge', lat: 25.7617, lng: -80.1918, type: 'CDN', performance: 12 },
  { provider: 'Google Cloud', name: 'Paris Edge', lat: 48.8566, lng: 2.3522, type: 'CDN', performance: 15 },
  { provider: 'Azure', name: 'Tokyo Edge', lat: 35.6762, lng: 139.6503, type: 'CDN', performance: 18 },
];
