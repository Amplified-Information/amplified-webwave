import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';

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
  { name: 'Cairo', lat: 30.0444, lng: 31.2357 },
  { name: 'Ottawa', lat: 45.4215, lng: -75.6972 },
  { name: 'Courtenay', lat: 49.6835, lng: -124.9957 }
];

const Globe = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const labelRef = useRef<HTMLDivElement>(null);
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

    // Create label element
    const label = document.createElement('div');
    label.style.position = 'absolute';
    label.style.backgroundColor = 'rgba(0, 0, 0, 0.8)';
    label.style.color = 'white';
    label.style.padding = '4px 8px';
    label.style.borderRadius = '4px';
    label.style.fontSize = '14px';
    label.style.pointerEvents = 'none';
    label.style.display = 'none';
    label.style.transform = 'translate(-50%, -100%)'; // Center the label above the cursor
    containerRef.current.appendChild(label);
    labelRef.current = label;

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

    // Add capital cities as points with improved appearance
    const pointsGeometry = new THREE.BufferGeometry();
    const positions = new Float32Array(CAPITAL_CITIES.length * 3);
    const colors = new Float32Array(CAPITAL_CITIES.length * 3);

    CAPITAL_CITIES.forEach((city, i) => {
      const position = latLngToVector3(city.lat, city.lng, 2.1);
      positions[i * 3] = position.x;
      positions[i * 3 + 1] = position.y;
      positions[i * 3 + 2] = position.z;

      // Brighter purple color with higher saturation
      colors[i * 3] = 0.6;     // R: Higher red value
      colors[i * 3 + 1] = 0.4; // G: Adjusted green
      colors[i * 3 + 2] = 0.9; // B: Higher blue value for more vibrant purple
    });

    pointsGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    pointsGeometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));

    const pointsMaterial = new THREE.PointsMaterial({
      size: 0.12, // Slightly smaller size
      vertexColors: true,
      blending: THREE.AdditiveBlending,
      transparent: true,
      opacity: 0.8,
      sizeAttenuation: true, // Points change size based on distance
      map: (() => {
        // Create a circular point texture
        const canvas = document.createElement('canvas');
        canvas.width = 64;
        canvas.height = 64;
        const context = canvas.getContext('2d')!;
        
        // Create gradient for a glowing effect
        const gradient = context.createRadialGradient(
          32, 32, 0,
          32, 32, 32
        );
        gradient.addColorStop(0, 'rgba(255, 255, 255, 1)');
        gradient.addColorStop(0.3, 'rgba(255, 255, 255, 0.8)');
        gradient.addColorStop(0.7, 'rgba(255, 255, 255, 0.3)');
        gradient.addColorStop(1, 'rgba(255, 255, 255, 0)');
        
        context.fillStyle = gradient;
        context.fillRect(0, 0, 64, 64);
        
        const texture = new THREE.Texture(canvas);
        texture.needsUpdate = true;
        return texture;
      })()
    });

    const points = new THREE.Points(pointsGeometry, pointsMaterial);

    // Add everything to scene
    scene.add(globe);
    scene.add(points);

    // Lighting
    const ambientLight = new THREE.AmbientLight(0x404040, 2);
    scene.add(ambientLight);
    
    const directionalLight = new THREE.DirectionalLight(0xffffff, 2);
    directionalLight.position.set(5, 3, 5);
    scene.add(directionalLight);

    camera.position.z = 5;

    // Raycaster for point interaction
    const raycaster = new THREE.Raycaster();
    const mouse = new THREE.Vector2();

    // Handle mouse move for labels
    const onMouseMove = (event: MouseEvent) => {
      if (!containerRef.current || !labelRef.current) return;

      const rect = containerRef.current.getBoundingClientRect();
      mouse.x = ((event.clientX - rect.left) / containerRef.current.clientWidth) * 2 - 1;
      mouse.y = -((event.clientY - rect.top) / containerRef.current.clientHeight) * 2 + 1;

      raycaster.setFromCamera(mouse, camera);
      const intersects = raycaster.intersectObject(points);

      if (intersects.length > 0) {
        const index = intersects[0].index;
        if (index !== undefined && index < CAPITAL_CITIES.length) {
          const city = CAPITAL_CITIES[index];
          labelRef.current.textContent = city.name;
          labelRef.current.style.display = 'block';
          labelRef.current.style.left = `${event.clientX}px`;
          labelRef.current.style.top = `${event.clientY}px`;
        }
      } else {
        labelRef.current.style.display = 'none';
      }
    };

    containerRef.current.addEventListener('mousemove', onMouseMove);

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
        containerRef.current.removeEventListener('mousemove', onMouseMove);
        containerRef.current.removeChild(renderer.domElement);
        if (labelRef.current) {
          containerRef.current.removeChild(labelRef.current);
        }
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
