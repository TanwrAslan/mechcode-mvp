import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { parseCadToMeshes } from '@/lib/cadGeometry';

async function parseCadFile(file: File): Promise<THREE.Group | null> {
  const meshes = await parseCadToMeshes(file);
  if (!meshes) return null;

  const group = new THREE.Group();
  for (const meshData of meshes) {
    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute(
      'position',
      new THREE.Float32BufferAttribute(meshData.attributes.position.array, 3)
    );
    if (meshData.attributes.normal) {
      geometry.setAttribute(
        'normal',
        new THREE.Float32BufferAttribute(meshData.attributes.normal.array, 3)
      );
    } else {
      geometry.computeVertexNormals();
    }
    geometry.setIndex(meshData.index.array);

    const color = meshData.color
      ? new THREE.Color(meshData.color[0], meshData.color[1], meshData.color[2])
      : new THREE.Color(0xef4444);
    const material = new THREE.MeshStandardMaterial({
      color,
      metalness: 0.55,
      roughness: 0.5,
      side: THREE.DoubleSide,
    });
    group.add(new THREE.Mesh(geometry, material));
  }
  return group;
}

interface StepMeshViewerProps {
  file: File;
  viewMode?: 'shaded' | 'wireframe';
  onParseError?: () => void;
}

export const StepMeshViewer: React.FC<StepMeshViewerProps> = ({
  file,
  viewMode = 'shaded',
  onParseError,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const groupRef = useRef<THREE.Group | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [errored, setErrored] = useState(false);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    let disposed = false;
    let frameId = 0;
    let controls: OrbitControls | null = null;

    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x060a14);

    const width = container.clientWidth || 600;
    const height = container.clientHeight || 400;
    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 10000);

    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    container.appendChild(renderer.domElement);

    scene.add(new THREE.AmbientLight(0xffffff, 0.55));
    const keyLight = new THREE.DirectionalLight(0xffffff, 1.4);
    keyLight.position.set(5, 8, 6);
    scene.add(keyLight);
    const fillLight = new THREE.DirectionalLight(0xef4444, 0.35);
    fillLight.position.set(-6, 2, -4);
    scene.add(fillLight);

    setIsLoading(true);
    setErrored(false);
    parseCadFile(file)
      .then((group) => {
        if (disposed) return;
        if (!group) {
          setErrored(true);
          onParseError?.();
          setIsLoading(false);
          return;
        }
        groupRef.current = group;

        const box = new THREE.Box3().setFromObject(group);
        const center = box.getCenter(new THREE.Vector3());
        const size = box.getSize(new THREE.Vector3());
        const maxDim = Math.max(size.x, size.y, size.z) || 1;
        group.position.sub(center);
        scene.add(group);

        const grid = new THREE.GridHelper(maxDim * 2.5, 24, 0xef4444, 0x1e293b);
        grid.position.y = -size.y / 2 - maxDim * 0.05;
        scene.add(grid);

        camera.position.set(maxDim * 1.1, maxDim * 0.9, maxDim * 1.4);
        camera.near = maxDim / 100;
        camera.far = maxDim * 100;
        camera.updateProjectionMatrix();

        controls = new OrbitControls(camera, renderer.domElement);
        controls.enableDamping = true;
        controls.dampingFactor = 0.08;
        controls.minDistance = maxDim * 0.5;
        controls.maxDistance = maxDim * 5;

        setIsLoading(false);

        const animate = () => {
          frameId = requestAnimationFrame(animate);
          controls?.update();
          renderer.render(scene, camera);
        };
        animate();
      })
      .catch(() => {
        if (disposed) return;
        setErrored(true);
        onParseError?.();
        setIsLoading(false);
      });

    const handleResize = () => {
      const w = container.clientWidth;
      const h = container.clientHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };
    window.addEventListener('resize', handleResize);

    return () => {
      disposed = true;
      cancelAnimationFrame(frameId);
      window.removeEventListener('resize', handleResize);
      controls?.dispose();
      renderer.dispose();
      if (renderer.domElement.parentElement === container) {
        container.removeChild(renderer.domElement);
      }
      scene.traverse((obj) => {
        if (obj instanceof THREE.Mesh) {
          obj.geometry.dispose();
          (Array.isArray(obj.material) ? obj.material : [obj.material]).forEach((m) => m.dispose());
        }
      });
      groupRef.current = null;
    };
  }, [file, onParseError]);

  useEffect(() => {
    const group = groupRef.current;
    if (!group) return;
    group.traverse((obj) => {
      if (obj instanceof THREE.Mesh) {
        (obj.material as THREE.MeshStandardMaterial).wireframe = viewMode === 'wireframe';
      }
    });
  }, [viewMode, isLoading]);

  return (
    <div ref={containerRef} className="absolute inset-0">
      {isLoading && !errored && (
        <div className="absolute inset-0 flex items-center justify-center text-xs font-mono text-[#e05a00] bg-[#050d1c]/85 z-10">
          STEP/IGES geometrisi yükleniyor...
        </div>
      )}
      {errored && (
        <div className="absolute inset-0 flex items-center justify-center text-xs font-mono text-amber-400 bg-[#050d1c]/85 z-10 text-center px-6">
          Bu dosya parse edilemedi. STEP AP203/AP214 veya IGES formatı önerilir.
        </div>
      )}
    </div>
  );
};
