import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';

const Globe = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const globeRef = useRef<{
    scene: THREE.Scene;
    camera: THREE.PerspectiveCamera;
    renderer: THREE.WebGLRenderer;
    globe: THREE.Mesh;
    points: THREE.Points;
  } | null>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    // Scene setup
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(
      75,
      containerRef.current.clientWidth / containerRef.current.clientHeight,
      0.1,
      1000
    );
    const renderer = new THREE.WebGLRenderer({ antialias: true });
    
    renderer.setSize(containerRef.current.clientWidth, containerRef.current.clientHeight);
    containerRef.current.appendChild(renderer.domElement);

    // Create globe
    const globeGeometry = new THREE.SphereGeometry(2, 64, 64);
    const globeMaterial = new THREE.MeshPhongMaterial({
      map: new THREE.TextureLoader().load('/earth-texture.jpg'),
      bumpMap: new THREE.TextureLoader().load('/earth-bump.jpg'),
      bumpScale: 0.1,
      specularMap: new THREE.TextureLoader().load('/earth-specular.jpg'),
      specular: new THREE.Color('grey'),
      shininess: 10,
    });
    const globe = new THREE.Mesh(globeGeometry, globeMaterial);

    // Add random data points
    const pointsGeometry = new THREE.BufferGeometry();
    const pointsCount = 100;
    const positions = new Float32Array(pointsCount * 3);
    const colors = new Float32Array(pointsCount * 3);

    for (let i = 0; i < pointsCount; i++) {
      // Generate random spherical coordinates
      const phi = Math.random() * Math.PI * 2;
      const theta = Math.random() * Math.PI;
      const radius = 2.1; // Slightly larger than globe radius

      // Convert to Cartesian coordinates
      positions[i * 3] = radius * Math.sin(theta) * Math.cos(phi);
      positions[i * 3 + 1] = radius * Math.sin(theta) * Math.sin(phi);
      positions[i * 3 + 2] = radius * Math.cos(theta);

      // Random colors (green to match theme)
      colors[i * 3] = 0.5;
      colors[i * 3 + 1] = 0.8;
      colors[i * 3 + 2] = 0.2;
    }

    pointsGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    pointsGeometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));

    const pointsMaterial = new THREE.PointsMaterial({
      size: 0.1,
      vertexColors: true,
      blending: THREE.AdditiveBlending,
    });

    const points = new THREE.Points(pointsGeometry, pointsMaterial);

    // Add everything to scene
    scene.add(globe);
    scene.add(points);

    // Lighting
    const ambientLight = new THREE.AmbientLight(0x404040);
    const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
    directionalLight.position.set(5, 3, 5);
    scene.add(ambientLight);
    scene.add(directionalLight);

    camera.position.z = 5;

    // Animation
    const animate = () => {
      requestAnimationFrame(animate);

      globe.rotation.y += 0.002;
      points.rotation.y += 0.002;

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
    globeRef.current = { scene, camera, renderer, globe, points };

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