import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';

// Capital cities data with their coordinates
const CAPITAL_CITIES = [
  { name: 'London', lat: 51.5074, lng: -0.1278 },
  { name: 'Paris', lat: 48.8566, lng: 2.3522 },
  { name: 'Tokyo', lat: 35.6762, lng: 139.6503 },
  { name: 'Washington DC', lat: 38.9072, lng: -77.0369 },
  { name: 'Beijing', lat: 39.9042, lng: 116.4074 },
  { name: 'Moscow', lat: 55.7558, lng: 37.6173 },
  { name: 'Brasília', lat: -15.7975, lng: -47.8919 },
  { name: 'New Delhi', lat: 28.6139, lng: 77.2090 },
  { name: 'Canberra', lat: -35.2809, lng: 149.1300 },
  { name: 'Cairo', lat: 30.0444, lng: 31.2357 }
];

const Globe = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const globeRef = useRef<{
    scene: THREE.Scene;
    camera: THREE.PerspectiveCamera;
    renderer: THREE.WebGLRenderer;
    controls: OrbitControls;
    globe: THREE.Mesh;
    points: THREE.Points;
  } | null>(null);

  // Convert lat/lng to 3D coordinates
  const latLngToVector3 = (lat: number, lng: number, radius: number) => {
    const phi = (90 - lat) * (Math.PI / 180);
    const theta = (lng + 180) * (Math.PI / 180);

    const x = -(radius * Math.sin(phi) * Math.cos(theta));
    const z = radius * Math.sin(phi) * Math.sin(theta);
    const y = radius * Math.cos(phi);

    return new THREE.Vector3(x, y, z);
  };

  useEffect(() => {
    if (!containerRef.current) return;

    // Scene setup
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x000000);
    
    const camera = new THREE.PerspectiveCamera(
      75,
      containerRef.current.clientWidth / containerRef.current.clientHeight,
      0.1,
      1000
    );
    
    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(containerRef.current.clientWidth, containerRef.current.clientHeight);
    containerRef.current.appendChild(renderer.domElement);

    // Add OrbitControls
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.05;
    controls.minDistance = 3;
    controls.maxDistance = 10;

    // Create globe with texture
    const globeGeometry = new THREE.SphereGeometry(2, 64, 64);
    const textureLoader = new THREE.TextureLoader();
    
    // Add loading manager to handle errors
    const loadingManager = new THREE.LoadingManager();
    loadingManager.onError = (url) => {
      console.error('Error loading texture:', url);
    };

    textureLoader.setPath('/');
    const globeMaterial = new THREE.MeshPhongMaterial({
      map: textureLoader.load('earth-texture.jpg', 
        undefined,
        undefined,
        (error) => {
          console.error('Error loading earth texture:', error);
        }
      ),
      specular: new THREE.Color('grey'),
      shininess: 10,
    });
    
    const globe = new THREE.Mesh(globeGeometry, globeMaterial);

    // Add capital cities as points
    const pointsGeometry = new THREE.BufferGeometry();
    const positions = new Float32Array(CAPITAL_CITIES.length * 3);
    const colors = new Float32Array(CAPITAL_CITIES.length * 3);

    CAPITAL_CITIES.forEach((city, i) => {
      const position = latLngToVector3(city.lat, city.lng, 2.1);
      positions[i * 3] = position.x;
      positions[i * 3 + 1] = position.y;
      positions[i * 3 + 2] = position.z;

      // Purple color to match theme
      colors[i * 3] = 0.43;     // R: 110/255
      colors[i * 3 + 1] = 0.35; // G: 89/255
      colors[i * 3 + 2] = 0.65; // B: 166/255
    });

    pointsGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    pointsGeometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));

    const pointsMaterial = new THREE.PointsMaterial({
      size: 0.15,
      vertexColors: true,
      blending: THREE.AdditiveBlending,
    });

    const points = new THREE.Points(pointsGeometry, pointsMaterial);

    // Add everything to scene
    scene.add(globe);
    scene.add(points);

    // Lighting
    const ambientLight = new THREE.AmbientLight(0x404040, 2); // Increased intensity
    scene.add(ambientLight);
    
    const directionalLight = new THREE.DirectionalLight(0xffffff, 2); // Increased intensity
    directionalLight.position.set(5, 3, 5);
    scene.add(directionalLight);

    camera.position.z = 5;

    // Animation
    const animate = () => {
      requestAnimationFrame(animate);
      controls.update();
      renderer.render(scene, camera);
    };

    // Handle resize
    const handleResize = () => {
      if (!containerRef.current) return;
      
      camera.aspect = containerRef.current.clientWidth / containerRef.current.clientHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(containerRef.current.clientWidth, containerRef.current.clientHeight);
    };

    window.addEventListener('resize', handleResize);

    // Store refs for cleanup
    globeRef.current = { scene, camera, renderer, controls, globe, points };

    animate();

    // Cleanup
    return () => {
      window.removeEventListener('resize', handleResize);
      if (containerRef.current) {
        containerRef.current.removeChild(renderer.domElement);
      }
      scene.remove(globe);
      scene.remove(points);
      globeGeometry.dispose();
      globeMaterial.dispose();
      pointsGeometry.dispose();
      pointsMaterial.dispose();
    };
  }, []);

  return (
    <div 
      ref={containerRef} 
      className="w-full h-[600px] rounded-lg overflow-hidden bg-black"
    />
  );
};

export default Globe;