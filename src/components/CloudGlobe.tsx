import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { cloudLocations } from '@/data/cloudProviderLocations';

const CloudGlobe: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const labelRef = useRef<HTMLDivElement>(null);
  const regionBoundsRef = useRef<THREE.LineSegments | null>(null);
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

    // Function to create region bounds
    const createRegionBounds = (bounds: { north: number; south: number; east: number; west: number }) => {
      if (regionBoundsRef.current) {
        scene.remove(regionBoundsRef.current);
      }

      const points: THREE.Vector3[] = [];
      const radius = 2.1; // Slightly larger than Earth radius

      // Create a box of lines around the region
      const corners = [
        { lat: bounds.north, lng: bounds.west },
        { lat: bounds.north, lng: bounds.east },
        { lat: bounds.south, lng: bounds.east },
        { lat: bounds.south, lng: bounds.west },
      ];

      corners.forEach((corner, i) => {
        const phi = (90 - corner.lat) * (Math.PI / 180);
        const theta = (corner.lng + 180) * (Math.PI / 180);
        
        const x = -(radius * Math.sin(phi) * Math.cos(theta));
        const y = radius * Math.cos(phi);
        const z = radius * Math.sin(phi) * Math.sin(theta);
        
        points.push(new THREE.Vector3(x, y, z));
        // Connect to next corner
        if (i < corners.length - 1) {
          points.push(new THREE.Vector3(x, y, z));
          const nextCorner = corners[i + 1];
          const nextPhi = (90 - nextCorner.lat) * (Math.PI / 180);
          const nextTheta = (nextCorner.lng + 180) * (Math.PI / 180);
          points.push(new THREE.Vector3(
            -(radius * Math.sin(nextPhi) * Math.cos(nextTheta)),
            radius * Math.cos(nextPhi),
            radius * Math.sin(nextPhi) * Math.sin(nextTheta)
          ));
        }
      });

      // Connect last corner to first corner
      const firstCorner = corners[0];
      const lastCorner = corners[corners.length - 1];
      points.push(new THREE.Vector3(
        -(radius * Math.sin((90 - lastCorner.lat) * (Math.PI / 180)) * Math.cos((lastCorner.lng + 180) * (Math.PI / 180))),
        radius * Math.cos((90 - lastCorner.lat) * (Math.PI / 180)),
        radius * Math.sin((90 - lastCorner.lat) * (Math.PI / 180)) * Math.sin((lastCorner.lng + 180) * (Math.PI / 180))
      ));
      points.push(new THREE.Vector3(
        -(radius * Math.sin((90 - firstCorner.lat) * (Math.PI / 180)) * Math.cos((firstCorner.lng + 180) * (Math.PI / 180))),
        radius * Math.cos((90 - firstCorner.lat) * (Math.PI / 180)),
        radius * Math.sin((90 - firstCorner.lat) * (Math.PI / 180)) * Math.sin((firstCorner.lng + 180) * (Math.PI / 180))
      ));

      const geometry = new THREE.BufferGeometry().setFromPoints(points);
      const material = new THREE.LineBasicMaterial({ color: 0xffff00, linewidth: 2 });
      regionBoundsRef.current = new THREE.LineSegments(geometry, material);
      scene.add(regionBoundsRef.current);
    };

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
      marker.userData = location;
      
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
          
        let servicesInfo = location.services 
          ? `<br>Services: ${location.services.join(', ')}` 
          : '';
          
        let capacityInfo = location.capacity 
          ? `<br>Capacity: ${location.capacity.servers.toLocaleString()} servers, ${location.capacity.storage} storage` 
          : '';
          
        let sustainabilityInfo = location.sustainability 
          ? `<br>Renewable Energy: ${location.sustainability.renewable}%` 
          : '';
          
        let availabilityInfo = location.availability 
          ? `<br>Availability Zones: ${location.availability.zones}<br>SLA: ${location.availability.sla}%` 
          : '';
          
        let yearInfo = location.yearEstablished 
          ? `<br>Established: ${location.yearEstablished}` 
          : '';
        
        labelRef.current.innerHTML = `
          <div class="font-bold">${location.provider}</div>
          ${location.name}<br>
          Type: ${location.type}
          ${performanceInfo}
          ${yearInfo}
          ${servicesInfo}
          ${capacityInfo}
          ${sustainabilityInfo}
          ${availabilityInfo}
        `;

        // Show region bounds if available
        if (location.regionBounds) {
          createRegionBounds(location.regionBounds);
        } else if (regionBoundsRef.current) {
          scene.remove(regionBoundsRef.current);
          regionBoundsRef.current = null;
        }
      } else {
        labelRef.current.style.display = 'none';
        if (regionBoundsRef.current) {
          scene.remove(regionBoundsRef.current);
          regionBoundsRef.current = null;
        }
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
