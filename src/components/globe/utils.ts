import * as THREE from 'three';

// Capital cities data with their coordinates
export const CAPITAL_CITIES = [
  { name: 'London', lat: 51.5074, lng: -0.1278 },
  { name: 'Paris', lat: 48.8566, lng: 2.3522 },
  { name: 'Tokyo', lat: 35.6762, lng: 139.6503 },
  { name: 'Washington DC', lat: 38.9072, lng: -77.0369 },
  { name: 'Beijing', lat: 39.9042, lng: 116.4074 },
  { name: 'Moscow', lat: 55.7558, lng: 37.6173 },
  { name: 'Brasília', lat: -15.7975, lng: -47.8919 },
  { name: 'New Delhi', lat: 28.6139, lng: 77.2090 },
  { name: 'Canberra', lat: -35.2809, lng: 149.1300 },
  { name: 'Cairo', lat: 30.0444, lng: 31.2357 },
  { name: 'Ottawa', lat: 45.4215, lng: -75.6972 },
  { name: 'Courtenay', lat: 49.6835, lng: -124.9957 }
];

export const latLngToVector3 = (lat: number, lng: number, radius: number) => {
  const phi = (90 - lat) * (Math.PI / 180);
  const theta = (lng + 180) * (Math.PI / 180);

  const x = -(radius * Math.sin(phi) * Math.cos(theta));
  const z = radius * Math.sin(phi) * Math.sin(theta);
  const y = radius * Math.cos(phi);

  return new THREE.Vector3(x, y, z);
};