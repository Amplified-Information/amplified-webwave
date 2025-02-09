export interface CloudLocation {
  provider: 'AWS' | 'Google Cloud' | 'Azure';
  name: string;
  lat: number;
  lng: number;
  type: 'Region' | 'Edge Location' | 'CDN';
  performance?: number;
  regionBounds?: {
    north: number;
    south: number;
    east: number;
    west: number;
  };
  services?: string[];
  yearEstablished?: number;
  capacity?: {
    servers: number;
    storage: string;
  };
  sustainability?: {
    renewable: number;
    carbonNeutral: boolean;
  };
  availability?: {
    zones: number;
    sla: number;
  };
}

export const cloudLocations: CloudLocation[] = [
  // AWS US Locations
  { 
    provider: 'AWS', 
    name: 'N. Virginia', 
    lat: 38.9519, 
    lng: -77.4480, 
    type: 'Region',
    services: ['EC2', 'S3', 'RDS', 'Lambda', 'DynamoDB'],
    yearEstablished: 2006,
    capacity: {
      servers: 150000,
      storage: '100+ PB'
    },
    sustainability: {
      renewable: 65,
      carbonNeutral: true
    },
    availability: {
      zones: 6,
      sla: 99.99
    },
    regionBounds: {
      north: 39.5,
      south: 38.5,
      east: -76.5,
      west: -78.5
    }
  },
  { 
    provider: 'AWS', 
    name: 'Ohio', 
    lat: 40.4173, 
    lng: -82.9071, 
    type: 'Region',
    services: ['EC2', 'S3', 'RDS', 'CloudFront', 'Route53'],
    yearEstablished: 2016,
    capacity: {
      servers: 100000,
      storage: '75+ PB'
    },
    sustainability: {
      renewable: 75,
      carbonNeutral: true
    },
    availability: {
      zones: 3,
      sla: 99.99
    },
    regionBounds: {
      north: 41.0,
      south: 40.0,
      east: -82.0,
      west: -83.5
    }
  },
  { provider: 'AWS', name: 'Oregon', lat: 45.8399, lng: -119.7006, type: 'Region' },
  { provider: 'AWS', name: 'N. California', lat: 37.7749, lng: -122.4194, type: 'Region' },
  { provider: 'AWS', name: 'Montreal', lat: 45.5017, lng: -73.5673, type: 'Region' },
  { provider: 'AWS', name: 'Central Canada', lat: 43.6532, lng: -79.3832, type: 'Region' },

  // AWS Edge Locations
  { provider: 'AWS', name: 'Miami Edge', lat: 25.7617, lng: -80.1918, type: 'CDN', performance: 12 },
  { provider: 'AWS', name: 'Chicago Edge', lat: 41.8781, lng: -87.6298, type: 'CDN', performance: 10 },
  { provider: 'AWS', name: 'Los Angeles Edge', lat: 34.0522, lng: -118.2437, type: 'CDN', performance: 15 },
  { provider: 'AWS', name: 'New York Edge', lat: 40.7128, lng: -74.0060, type: 'CDN', performance: 8 },
  { provider: 'AWS', name: 'Seattle Edge', lat: 47.6062, lng: -122.3321, type: 'CDN', performance: 14 },
  { provider: 'AWS', name: 'Toronto Edge', lat: 43.6532, lng: -79.3832, type: 'CDN', performance: 11 },
  { provider: 'AWS', name: 'Vancouver Edge', lat: 49.2827, lng: -123.1207, type: 'CDN', performance: 16 },

  // Google Cloud US/Canada Locations
  { provider: 'Google Cloud', name: 'Iowa', lat: 41.8780, lng: -93.0977, type: 'Region' },
  { provider: 'Google Cloud', name: 'South Carolina', lat: 34.0007, lng: -81.0348, type: 'Region' },
  { provider: 'Google Cloud', name: 'Oregon', lat: 45.5155, lng: -122.6789, type: 'Region' },
  { provider: 'Google Cloud', name: 'Los Angeles', lat: 34.0522, lng: -118.2437, type: 'Region' },
  { provider: 'Google Cloud', name: 'Las Vegas', lat: 36.1699, lng: -115.1398, type: 'Region' },
  { provider: 'Google Cloud', name: 'Salt Lake City', lat: 40.7608, lng: -111.8910, type: 'Region' },
  { provider: 'Google Cloud', name: 'Montreal', lat: 45.5017, lng: -73.5673, type: 'Region' },
  { provider: 'Google Cloud', name: 'Toronto', lat: 43.6532, lng: -79.3832, type: 'Region' },

  // Google Cloud Edge Locations
  { provider: 'Google Cloud', name: 'Chicago Edge', lat: 41.8781, lng: -87.6298, type: 'CDN', performance: 9 },
  { provider: 'Google Cloud', name: 'Dallas Edge', lat: 32.7767, lng: -96.7970, type: 'CDN', performance: 13 },
  { provider: 'Google Cloud', name: 'Miami Edge', lat: 25.7617, lng: -80.1918, type: 'CDN', performance: 15 },
  { provider: 'Google Cloud', name: 'Seattle Edge', lat: 47.6062, lng: -122.3321, type: 'CDN', performance: 12 },
  { provider: 'Google Cloud', name: 'Vancouver Edge', lat: 49.2827, lng: -123.1207, type: 'CDN', performance: 14 },

  // Azure US/Canada Locations
  { provider: 'Azure', name: 'East US', lat: 37.3719, lng: -79.8164, type: 'Region' },
  { provider: 'Azure', name: 'East US 2', lat: 36.6681, lng: -78.3889, type: 'Region' },
  { provider: 'Azure', name: 'Central US', lat: 41.8781, lng: -87.6298, type: 'Region' },
  { provider: 'Azure', name: 'North Central US', lat: 43.0831, lng: -87.9712, type: 'Region' },
  { provider: 'Azure', name: 'South Central US', lat: 29.4241, lng: -98.4936, type: 'Region' },
  { provider: 'Azure', name: 'West US', lat: 36.7783, lng: -119.4179, type: 'Region' },
  { provider: 'Azure', name: 'West US 2', lat: 47.6062, lng: -122.3321, type: 'Region' },
  { provider: 'Azure', name: 'West US 3', lat: 33.4484, lng: -112.0740, type: 'Region' },
  { provider: 'Azure', name: 'Canada Central', lat: 43.6532, lng: -79.3832, type: 'Region' },
  { provider: 'Azure', name: 'Canada East', lat: 46.8139, lng: -71.2080, type: 'Region' },

  // Azure Edge Locations
  { provider: 'Azure', name: 'New York Edge', lat: 40.7128, lng: -74.0060, type: 'CDN', performance: 10 },
  { provider: 'Azure', name: 'San Francisco Edge', lat: 37.7749, lng: -122.4194, type: 'CDN', performance: 16 },
  { provider: 'Azure', name: 'Denver Edge', lat: 39.7392, lng: -104.9903, type: 'CDN', performance: 18 },
  { provider: 'Azure', name: 'Toronto Edge', lat: 43.6532, lng: -79.3832, type: 'CDN', performance: 12 },
  { provider: 'Azure', name: 'Montreal Edge', lat: 45.5017, lng: -73.5673, type: 'CDN', performance: 15 },

  // Keep other global locations
  { provider: 'AWS', name: 'Ireland', lat: 53.3498, lng: -6.2603, type: 'Region' },
  { provider: 'AWS', name: 'Singapore', lat: 1.3521, lng: 103.8198, type: 'Region' },
  { provider: 'AWS', name: 'Tokyo', lat: 35.6762, lng: 139.6503, type: 'Region' },
  // New AWS locations
  { provider: 'AWS', name: 'Frankfurt', lat: 50.1109, lng: 8.6821, type: 'Region' },
  { provider: 'AWS', name: 'Mumbai', lat: 19.0760, lng: 72.8777, type: 'Region' },
  { provider: 'AWS', name: 'São Paulo', lat: -23.5505, lng: -46.6333, type: 'Region' },
  
  // Google Cloud Locations
  { provider: 'Google Cloud', name: 'Netherlands', lat: 52.3676, lng: 4.9041, type: 'Region' },
  { provider: 'Google Cloud', name: 'Taiwan', lat: 23.6978, lng: 120.9605, type: 'Region' },
  { provider: 'Google Cloud', name: 'London', lat: 51.5074, lng: -0.1278, type: 'Region' },
  { provider: 'Google Cloud', name: 'Sydney', lat: -33.8688, lng: 151.2093, type: 'Region' },
  // New Google Cloud locations
  { provider: 'Google Cloud', name: 'Tokyo', lat: 35.6762, lng: 139.6503, type: 'Region' },
  { provider: 'Google Cloud', name: 'Frankfurt', lat: 50.1109, lng: 8.6821, type: 'Region' },
  { provider: 'Google Cloud', name: 'Mumbai', lat: 19.0760, lng: 72.8777, type: 'Region' },

  // Azure Locations
  { provider: 'Azure', name: 'West Europe', lat: 52.3667, lng: 4.8945, type: 'Region' },
  { provider: 'Azure', name: 'Southeast Asia', lat: 1.3521, lng: 103.8198, type: 'Region' },
  { provider: 'Azure', name: 'Brazil South', lat: -23.5505, lng: -46.6333, type: 'Region' },
  { provider: 'Azure', name: 'Australia East', lat: -33.8688, lng: 151.2093, type: 'Region' },
  // New Azure locations
  { provider: 'Azure', name: 'Japan East', lat: 35.6762, lng: 139.6503, type: 'Region' },
  { provider: 'Azure', name: 'North Europe', lat: 53.3498, lng: -6.2603, type: 'Region' },

  // CDN Edge Locations
  { provider: 'AWS', name: 'Dubai Edge', lat: 25.2048, lng: 55.2708, type: 'CDN', performance: 20 },
  { provider: 'Google Cloud', name: 'Paris Edge', lat: 48.8566, lng: 2.3522, type: 'CDN', performance: 15 },
  { provider: 'Google Cloud', name: 'Mexico City Edge', lat: 19.4326, lng: -99.1332, type: 'CDN', performance: 17 },
  { provider: 'Azure', name: 'Tokyo Edge', lat: 35.6762, lng: 139.6503, type: 'CDN', performance: 18 },
  { provider: 'Azure', name: 'Cape Town Edge', lat: -33.9249, lng: 18.4241, type: 'CDN', performance: 25 }
];
