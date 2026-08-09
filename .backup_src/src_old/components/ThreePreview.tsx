import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { Task } from '../types';

interface ThreePreviewProps {
  task: Task;
  heightPx?: number;
}

// Görev kategorisine göre temsili (mock) parça geometrisi üretir.
// Gerçek entegrasyonda backend'den gelecek tesselasyon (glTF/mesh) yüklenecek.
function buildMockPart(task: Task): THREE.Group {
  const group = new THREE.Group();

  const bodyMaterial = new THREE.MeshStandardMaterial({
    color: 0x94a3b8,
    metalness: 0.85,
    roughness: 0.35,
  });
  const holeMaterial = new THREE.MeshStandardMaterial({
    color: 0x0f172a,
    metalness: 0.4,
    roughness: 0.7,
  });

  if (task.category === 'Havacılık') {
    // Flanş: silindirik gövde + PCD delikleri
    const flange = new THREE.Mesh(new THREE.CylinderGeometry(2.2, 2.2, 0.5, 48), bodyMaterial);
    group.add(flange);
    const hub = new THREE.Mesh(new THREE.CylinderGeometry(0.9, 0.9, 1.1, 32), bodyMaterial);
    hub.position.y = 0.5;
    group.add(hub);
    const centerHole = new THREE.Mesh(new THREE.CylinderGeometry(0.45, 0.45, 1.3, 32), holeMaterial);
    centerHole.position.y = 0.5;
    group.add(centerHole);
    for (let i = 0; i < 4; i++) {
      const angle = (i * Math.PI) / 2;
      const bolt = new THREE.Mesh(new THREE.CylinderGeometry(0.16, 0.16, 0.6, 20), holeMaterial);
      bolt.position.set(Math.cos(angle) * 1.6, 0, Math.sin(angle) * 1.6);
      group.add(bolt);
    }
  } else {
    // Braket / muhafaza: plaka + cıvata delikleri + hafifletme cebi
    const base = new THREE.Mesh(new THREE.BoxGeometry(3.4, 0.5, 2.2), bodyMaterial);
    group.add(base);
    const rib = new THREE.Mesh(new THREE.BoxGeometry(3.0, 0.8, 0.4), bodyMaterial);
    rib.position.set(0, 0.6, 0);
    group.add(rib);
    const pocket = new THREE.Mesh(new THREE.BoxGeometry(1.6, 0.3, 1.2), holeMaterial);
    pocket.position.set(0, 0.18, 0.35);
    group.add(pocket);
    const corners: Array<[number, number]> = [
      [-1.35, -0.8],
      [1.35, -0.8],
      [-1.35, 0.8],
      [1.35, 0.8],
    ];
    corners.forEach(([x, z]) => {
      const hole = new THREE.Mesh(new THREE.CylinderGeometry(0.14, 0.14, 0.6, 20), holeMaterial);
      hole.position.set(x, 0, z);
      group.add(hole);
    });
  }

  return group;
}

export const ThreePreview: React.FC<ThreePreviewProps> = ({ task, heightPx = 260 }) => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const width = container.clientWidth;
    const height = heightPx;

    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x0f172a);

    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 100);
    camera.position.set(4.5, 3.5, 5.5);

    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    container.appendChild(renderer.domElement);

    scene.add(new THREE.AmbientLight(0xffffff, 0.55));
    const keyLight = new THREE.DirectionalLight(0xffffff, 1.4);
    keyLight.position.set(5, 8, 6);
    scene.add(keyLight);
    const fillLight = new THREE.DirectionalLight(0x3b82f6, 0.5);
    fillLight.position.set(-6, 2, -4);
    scene.add(fillLight);

    const grid = new THREE.GridHelper(12, 24, 0x1d4ed8, 0x1e293b);
    grid.position.y = -1.2;
    scene.add(grid);

    const part = buildMockPart(task);
    scene.add(part);

    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.08;
    controls.minDistance = 3;
    controls.maxDistance = 12;

    let frameId = 0;
    const animate = () => {
      frameId = requestAnimationFrame(animate);
      part.rotation.y += 0.004;
      controls.update();
      renderer.render(scene, camera);
    };
    animate();

    const handleResize = () => {
      const w = container.clientWidth;
      camera.aspect = w / height;
      camera.updateProjectionMatrix();
      renderer.setSize(w, height);
    };
    window.addEventListener('resize', handleResize);

    return () => {
      cancelAnimationFrame(frameId);
      window.removeEventListener('resize', handleResize);
      controls.dispose();
      renderer.dispose();
      container.removeChild(renderer.domElement);
      scene.traverse((obj) => {
        if (obj instanceof THREE.Mesh) {
          obj.geometry.dispose();
          (Array.isArray(obj.material) ? obj.material : [obj.material]).forEach((m) => m.dispose());
        }
      });
    };
  }, [task, heightPx]);

  return (
    <div
      ref={containerRef}
      className="w-full rounded-xl overflow-hidden border border-slate-700"
      style={{ height: heightPx }}
      title={`${task.title} - 3D Önizleme (Three.js)`}
    />
  );
};
