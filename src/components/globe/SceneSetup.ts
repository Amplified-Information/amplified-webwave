import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { latLngToVector3 } from './utils';

export const setupScene = (container: HTMLDivElement) => {
  const scene = new THREE.Scene();
  scene.background = new THREE.Color(0x000000);
  
  const camera = new THREE.PerspectiveCamera(
    75,
    container.clientWidth / container.clientHeight,
    0.1,
    1000
  );
  
  const renderer = new THREE.WebGLRenderer({ antialias: true });
  renderer.setSize(container.clientWidth, container.clientHeight);
  
  const controls = new OrbitControls(camera, renderer.domElement);
  controls.enableDamping = true;
  controls.dampingFactor = 0.05;
  controls.minDistance = 3;
  controls.maxDistance = 10;

  const ambientLight = new THREE.AmbientLight(0x404040, 2);
  scene.add(ambientLight);
  
  const directionalLight = new THREE.DirectionalLight(0xffffff, 2);
  directionalLight.position.set(5, 3, 5);
  scene.add(directionalLight);

  // Convert Courtenay's coordinates to 3D position
  const courtenayPosition = latLngToVector3(49.6835, -124.9957, 5);
  camera.position.copy(courtenayPosition);
  
  // Point camera towards the globe's center
  camera.lookAt(new THREE.Vector3(0, 0, 0));

  return { scene, camera, renderer, controls };
};