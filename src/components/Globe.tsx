import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { setupScene } from './globe/SceneSetup';
import { createCityMarkers } from './globe/CityMarkers';
import { CAPITAL_CITIES } from './globe/utils';

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
    label.style.transform = 'translate(-50%, -100%)';
    containerRef.current.appendChild(label);
    labelRef.current = label;

    // Setup scene
    const { scene, camera, renderer, controls } = setupScene(containerRef.current);
    containerRef.current.appendChild(renderer.domElement);

    // Create globe
    const globeGeometry = new THREE.SphereGeometry(2, 64, 64);
    const textureLoader = new THREE.TextureLoader();
    textureLoader.setPath('/');
    
    const globeMaterial = new THREE.MeshPhongMaterial({
      map: textureLoader.load('earth-texture.jpg'),
      specular: new THREE.Color('grey'),
      shininess: 10,
    });
    
    const globe = new THREE.Mesh(globeGeometry, globeMaterial);
    scene.add(globe);

    // Add city markers
    const points = createCityMarkers();
    scene.add(points);

    // Raycaster setup
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