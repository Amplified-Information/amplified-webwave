import * as THREE from 'three';
import { CAPITAL_CITIES, latLngToVector3 } from './utils';

export const createCityMarkers = () => {
  const pointsGeometry = new THREE.BufferGeometry();
  const positions = new Float32Array(CAPITAL_CITIES.length * 3);
  const colors = new Float32Array(CAPITAL_CITIES.length * 3);

  CAPITAL_CITIES.forEach((city, i) => {
    const position = latLngToVector3(city.lat, city.lng, 2.1);
    positions[i * 3] = position.x;
    positions[i * 3 + 1] = position.y;
    positions[i * 3 + 2] = position.z;

    colors[i * 3] = 0.6;
    colors[i * 3 + 1] = 0.4;
    colors[i * 3 + 2] = 0.9;
  });

  pointsGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
  pointsGeometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));

  const pointsMaterial = new THREE.PointsMaterial({
    size: 0.12,
    vertexColors: true,
    blending: THREE.AdditiveBlending,
    transparent: true,
    opacity: 0.8,
    sizeAttenuation: true,
    map: createPointTexture()
  });

  return new THREE.Points(pointsGeometry, pointsMaterial);
};

const createPointTexture = () => {
  const canvas = document.createElement('canvas');
  canvas.width = 64;
  canvas.height = 64;
  const context = canvas.getContext('2d')!;
  
  const gradient = context.createRadialGradient(32, 32, 0, 32, 32, 32);
  gradient.addColorStop(0, 'rgba(255, 255, 255, 1)');
  gradient.addColorStop(0.3, 'rgba(255, 255, 255, 0.8)');
  gradient.addColorStop(0.7, 'rgba(255, 255, 255, 0.3)');
  gradient.addColorStop(1, 'rgba(255, 255, 255, 0)');
  
  context.fillStyle = gradient;
  context.fillRect(0, 0, 64, 64);
  
  const texture = new THREE.Texture(canvas);
  texture.needsUpdate = true;
  return texture;
};