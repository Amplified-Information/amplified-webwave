
import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { cloudLocations } from '@/data/cloudProviderLocations';

const CloudGlobe: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const labelRef = useRef<HTMLDivElement>(null);
  const sceneRef = useRef<{
    scene: THREE.Scene;
    camera: THREE.PerspectiveCamera;
    renderer: THREE.WebGLRenderer;
    controls: OrbitControls;
  } | null>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    // Create label element
    const label = document.createElement('div');
    label.style.position = 'absolute';
    label.style.backgroundColor = 'rgba(0, 0, 0, 0.8)';
    label.style.color = 'white';
    label.style.padding = '8px';
    label.style.borderRadius = '4px';
    label.style.fontSize = '14px';
    label.style.pointerEvents = 'none';
    label.style.display = 'none';
    containerRef.current.appendChild(label);
    labelRef.current = label;

    // Scene setup
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(
      60,
      containerRef.current.clientWidth / containerRef.current.clientHeight,
      0.1,
      1000
    );
    
    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(containerRef.current.clientWidth, containerRef.current.clientHeight);
    containerRef.current.appendChild(renderer.domElement);

    // Controls
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.05;
    controls.minDistance = 5;
    controls.maxDistance = 15;

    // Create Earth
    const earthGeometry = new THREE.SphereGeometry(2, 64, 64);
    const textureLoader = new THREE.TextureLoader();
    const earthMaterial = new THREE.MeshPhongMaterial({
      map: textureLoader.load('/earth-texture.jpg'),
      bumpMap: textureLoader.load('/earth-texture.jpg'),
      bumpScale: 0.05,
    });
    
    const earth = new THREE.Mesh(earthGeometry, earthMaterial);
    scene.add(earth);

    // Store markers for raycasting
    const markers: THREE.Mesh[] = [];

    // Add location markers
    cloudLocations.forEach((location) => {
      const markerGeometry = new THREE.SphereGeometry(0.03, 16, 16);
      const markerMaterial = new THREE.MeshBasicMaterial({
        color: location.provider === 'AWS' 
          ? 0xFF9900 
          : location.provider === 'Google Cloud' 
            ? 0xFF0000 
            : 0x00A4EF
      });
      
      const marker = new THREE.Mesh(markerGeometry, markerMaterial);
      marker.userData = location; // Store location data in the marker
      
      // Convert lat/lng to 3D position
      const phi = (90 - location.lat) * (Math.PI / 180);
      const theta = (location.lng + 180) * (Math.PI / 180);
      
      const x = -(2.1 * Math.sin(phi) * Math.cos(theta));
      const y = 2.1 * Math.cos(phi);
      const z = 2.1 * Math.sin(phi) * Math.sin(theta);
      
      marker.position.set(x, y, z);
      scene.add(marker);
      markers.push(marker);
    });

    // Lighting
    const ambientLight = new THREE.AmbientLight(0x404040, 2);
    scene.add(ambientLight);
    
    const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
    directionalLight.position.set(5, 3, 5);
    scene.add(directionalLight);

    camera.position.z = 8;

    // Raycaster setup
    const raycaster = new THREE.Raycaster();
    const mouse = new THREE.Vector2();

    // Handle mouse move for hover effect
    const onMouseMove = (event: MouseEvent) => {
      if (!containerRef.current || !labelRef.current) return;

      const rect = containerRef.current.getBoundingClientRect();
      mouse.x = ((event.clientX - rect.left) / containerRef.current.clientWidth) * 2 - 1;
      mouse.y = -((event.clientY - rect.top) / containerRef.current.clientHeight) * 2 + 1;

      raycaster.setFromCamera(mouse, camera);
      const intersects = raycaster.intersectObjects(markers);

      if (intersects.length > 0) {
        const location = intersects[0].object.userData;
        labelRef.current.style.display = 'block';
        labelRef.current.style.left = `${event.clientX}px`;
        labelRef.current.style.top = `${event.clientY}px`;
        
        let performanceInfo = location.performance 
          ? `<br>Performance: ${location.performance}ms` 
          : '';
          
        labelRef.current.innerHTML = `
          ${location.provider}<br>
          ${location.name}<br>
          Type: ${location.type}${performanceInfo}
        `;
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

    animate();

    // Handle resize
    const handleResize = () => {
      if (!containerRef.current) return;
      
      camera.aspect = containerRef.current.clientWidth / containerRef.current.clientHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(containerRef.current.clientWidth, containerRef.current.clientHeight);
    };

    window.addEventListener('resize', handleResize);

    // Store refs for cleanup
    sceneRef.current = { scene, camera, renderer, controls };

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
      earthGeometry.dispose();
      earthMaterial.dispose();
      renderer.dispose();
    };
  }, []);

  return (
    <div 
      ref={containerRef} 
      className="w-full h-[600px] rounded-lg overflow-hidden bg-black"
    />
  );
};

export default CloudGlobe;
