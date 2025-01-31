import * as THREE from 'three';

// Capital cities data with their coordinates
export const CAPITAL_CITIES = [
  // Canadian Provincial and Territorial Capitals
  { name: 'Victoria', lat: 48.4284, lng: -123.3656 },     // British Columbia
  { name: 'Edmonton', lat: 53.5461, lng: -113.4938 },     // Alberta
  { name: 'Regina', lat: 50.4452, lng: -104.6189 },       // Saskatchewan
  { name: 'Winnipeg', lat: 49.8951, lng: -97.1384 },      // Manitoba
  { name: 'Toronto', lat: 43.6532, lng: -79.3832 },       // Ontario
  { name: 'Quebec City', lat: 46.8139, lng: -71.2080 },   // Quebec
  { name: 'Fredericton', lat: 45.9636, lng: -66.6431 },   // New Brunswick
  { name: 'Halifax', lat: 44.6488, lng: -63.5752 },       // Nova Scotia
  { name: 'Charlottetown', lat: 46.2382, lng: -63.1311 }, // Prince Edward Island
  { name: "St. John's", lat: 47.5615, lng: -52.7126 },    // Newfoundland and Labrador
  { name: 'Whitehorse', lat: 60.7212, lng: -135.0568 },   // Yukon
  { name: 'Yellowknife', lat: 62.4540, lng: -114.3718 },  // Northwest Territories
  { name: 'Iqaluit', lat: 63.7467, lng: -68.5170 },       // Nunavut
  { name: 'Ottawa', lat: 45.4215, lng: -75.6972 },        // National Capital
  { name: 'Courtenay', lat: 49.6835, lng: -124.9957 }     // Keep Courtenay for reference
];

export const latLngToVector3 = (lat: number, lng: number, radius: number) => {
  const phi = (90 - lat) * (Math.PI / 180);
  const theta = (lng + 180) * (Math.PI / 180);

  const x = -(radius * Math.sin(phi) * Math.cos(theta));
  const z = radius * Math.sin(phi) * Math.sin(theta);
  const y = radius * Math.cos(phi);

  return new THREE.Vector3(x, y, z);
};