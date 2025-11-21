"use client";

import { useEffect, useRef } from 'react';

import * as THREE from 'three';

import { useMorphController } from '@/components/hooks/useMorphController';
import { usePointer } from '@/components/utility/usePointer';
import { getShapeData } from '@/lib/particle-shapes';



// Helper to create a soft circle texture
function getSoftCircleTexture() {
  if (typeof document === 'undefined') return null;
  const canvas = document.createElement('canvas');
  canvas.width = 32;
  canvas.height = 32;
  const ctx = canvas.getContext('2d');
  if (!ctx) return null;

  const grad = ctx.createRadialGradient(16, 16, 0, 16, 16, 16);
  grad.addColorStop(0, 'rgba(255, 255, 255, 1)');
  grad.addColorStop(0.4, 'rgba(255, 255, 255, 0.8)');
  grad.addColorStop(1, 'rgba(255, 255, 255, 0)');

  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, 32, 32);

  const texture = new THREE.CanvasTexture(canvas);
  texture.minFilter = THREE.LinearFilter;
  texture.magFilter = THREE.LinearFilter;
  return texture;
}

interface HeroMorphingParticlesProps {
  shapeIndex: number; // external desired shape
}

// Bridge for external shape selection; parent passes desired shapeIndex.
export default function HeroMorphingParticles({ shapeIndex }: HeroMorphingParticlesProps) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const sceneRef = useRef<THREE.Scene | null>(null);
  const cameraRef = useRef<THREE.OrthographicCamera | null>(null);
  const pointsRef = useRef<THREE.Points | null>(null);
  const uniformsRef = useRef<Record<string, THREE.IUniform> | null>(null);
  const effectiveShapeIndexRef = useRef<number>(shapeIndex);

  // External shape request handling
  useEffect(() => {
    effectiveShapeIndexRef.current = shapeIndex;
  }, [shapeIndex]);

  const pointer = usePointer();

  const currentRef = useRef(0);
  const nextRef = useRef(0);
  const progressRef = useRef(1);

  const { setShape, tick } = useMorphController((current, next, progress) => {
    currentRef.current = current;
    nextRef.current = next;
    progressRef.current = progress;
    if (uniformsRef.current) {
      uniformsRef.current.uCurrentShape.value = current;
      uniformsRef.current.uNextShape.value = next;
      uniformsRef.current.uMorphProgress.value = progress;
    }
  });

  // Request new shape when prop changes
  useEffect(() => {
    setShape(effectiveShapeIndexRef.current);
  }, [setShape, shapeIndex]);

  useEffect(() => {
    /* eslint-disable no-console */
    if (!containerRef.current) return;

    // Wait for container to have dimensions
    const checkAndInit = () => {
      if (!containerRef.current) return;
      const width = containerRef.current.clientWidth;
      const height = containerRef.current.clientHeight;

      if (width === 0 || height === 0) {
        requestAnimationFrame(checkAndInit);
        return;
      }

      const { shapes, count } = getShapeData();
      const dpr = Math.min(window.devicePixelRatio, 2);

      if (count === 0) {
        console.error('HeroParticles: No particles generated!');
        return;
      }
      console.log('HeroParticles: Rendering', count, 'particles');
      console.log('Sample positions:', shapes.hash.slice(0, 9)); // First 3 particles (x,y,z each)

      const scene = new THREE.Scene();
      sceneRef.current = scene;
      const aspect = width / height;
      const camSize = 1.5; // Larger visible plane to ensure particles are in view
      const camera = new THREE.OrthographicCamera(
        -camSize * aspect,
        camSize * aspect,
        camSize,
        -camSize,
        -10,
        10
      );
      camera.position.z = 1;
      cameraRef.current = camera;

      const renderer = new THREE.WebGLRenderer({ canvas: canvasRef.current!, alpha: true, antialias: true });
      renderer.setClearColor(0x000000, 0); // Transparent background
      renderer.setPixelRatio(dpr);
      renderer.setSize(width, height);
      rendererRef.current = renderer;

      // Geometry with shape attributes
      const geometry = new THREE.BufferGeometry();
      const shape1 = shapes.hash;
      const shape2 = shapes.asterisk;
      const shape3 = shapes.angle;
      geometry.setAttribute('aShape1', new THREE.Float32BufferAttribute(shape1, 3));
      geometry.setAttribute('aShape2', new THREE.Float32BufferAttribute(shape2, 3));
      geometry.setAttribute('aShape3', new THREE.Float32BufferAttribute(shape3, 3));
      // Random seed per particle
      const seeds = new Float32Array(count);
      for (let i = 0; i < count; i++) seeds[i] = Math.random();
      geometry.setAttribute('aSeed', new THREE.Float32BufferAttribute(seeds, 1));

      const uniforms: Record<string, THREE.IUniform> = {
        uTime: { value: 0 },
        uMorphProgress: { value: 1 },
        uCurrentShape: { value: 0 },
        uNextShape: { value: 0 },
        uPointer: { value: new THREE.Vector2(10, 10) }, // off-screen initial
        uPointerRadius: { value: 0.25 },
        uPointerStrength: { value: 0.18 },
      };
      uniformsRef.current = uniforms;

      // Load shaders as raw text (Next.js needs webpack config or inline)
      const vertexShader = `
uniform float uTime;
uniform float uMorphProgress;
uniform int uCurrentShape;
uniform int uNextShape;
uniform vec2 uPointer;
uniform float uPointerRadius;
uniform float uPointerStrength;
attribute vec3 aShape1;
attribute vec3 aShape2;
attribute vec3 aShape3;
attribute float aSeed;
varying float vGlow;
varying float vAlpha;
vec3 pickShape(int idx) {
  if (idx == 0) return aShape1;
  if (idx == 1) return aShape2;
  return aShape3;
}
void main() {
  // Use actual shape data now
  vec3 startPos = pickShape(uCurrentShape);
  vec3 endPos = pickShape(uNextShape);
  float t = uMorphProgress;
  float ease = 1.0 - pow(1.0 - t, 3.0);
  vec3 pos = mix(startPos, endPos, ease);
  
  // No pointer interaction for now - just show the shape
  vAlpha = 1.0;
  vGlow = 0.0;
  gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
  gl_PointSize = 8.0; // Medium size particles
}
`;
      const fragmentShader = `
precision highp float;
varying float vGlow;
varying float vAlpha;
void main() {
  // Circular particle shape
  vec2 center = gl_PointCoord - vec2(0.5);
  float dist = length(center);
  if (dist > 0.5) discard; // Make it circular
  
  // BRIGHT CYAN - very visible on both dark and light backgrounds
  gl_FragColor = vec4(0.0, 1.0, 1.0, 1.0);
}
`;

      // Fallback: dynamic import text (Next may treat raw file differently) – we inline fetch if empty
      const material = new THREE.ShaderMaterial({
        uniforms,
        vertexShader: vertexShader || '',
        fragmentShader: fragmentShader || '',
        transparent: true,
        depthWrite: false,
        blending: THREE.NormalBlending,
      });

      // Check for shader compilation errors
      const testMesh = new THREE.Mesh(new THREE.PlaneGeometry(1, 1), material);
      scene.add(testMesh);
      renderer.render(scene, camera);
      scene.remove(testMesh);
      testMesh.geometry.dispose();
      console.log('HeroParticles: Shaders compiled successfully');

      // Particles as InstancedMesh
      // Use PlaneGeometry for soft sprites, facing camera
      const particleGeo = new THREE.PlaneGeometry(0.04, 0.04);
      const particleTexture = getSoftCircleTexture();

      const particleMat = new THREE.MeshBasicMaterial({
        color: 0x93bbfc, // Google Blue/Light Blue from reference
        transparent: true,
        opacity: 0.9,
        map: particleTexture,
        depthWrite: false, // Important for transparency
        blending: THREE.NormalBlending, // Or AdditiveBlending for glow
      });

      const particlesMesh = new THREE.InstancedMesh(particleGeo, particleMat, count);
      scene.add(particlesMesh);
      pointsRef.current = particlesMesh as unknown as THREE.Points;

      console.log('Added', count, 'particles as InstancedMesh');

      // Initialize positions
      const dummy = new THREE.Object3D();
      const initialPositions = shapes.hash; // Start with hash

      // Add some random jitter to break the grid look
      const jitter = new Float32Array(count * 3);
      for (let i = 0; i < count; i++) {
        jitter[i * 3] = (Math.random() - 0.5) * 0.02;
        jitter[i * 3 + 1] = (Math.random() - 0.5) * 0.02;
        jitter[i * 3 + 2] = 0;
      }

      for (let i = 0; i < count; i++) {
        dummy.position.set(
          initialPositions[i * 3] + jitter[i * 3],
          initialPositions[i * 3 + 1] + jitter[i * 3 + 1],
          0
        );
        dummy.updateMatrix();
        particlesMesh.setMatrixAt(i, dummy.matrix);
      }
      particlesMesh.instanceMatrix.needsUpdate = true;

      // Log particle bounds to verify positions
      geometry.computeBoundingBox();
      console.log('Particle bounding box:', geometry.boundingBox);
      console.log('Camera frustum:', { left: camera.left, right: camera.right, top: camera.top, bottom: camera.bottom });
      console.log('Camera position:', camera.position);

      // Test render to verify scene is working
      renderer.render(scene, camera);
      console.log('HeroParticles: Test render completed');

      // Resize handler
      const handleResize = () => {
        if (!containerRef.current || !rendererRef.current) return;
        const w = containerRef.current.clientWidth;
        const h = containerRef.current.clientHeight;
        const asp = w / h;
        camera.left = -camSize * asp;
        camera.right = camSize * asp;
        camera.top = camSize;
        camera.bottom = -camSize;
        camera.updateProjectionMatrix();
        rendererRef.current.setSize(w, h);
      };
      window.addEventListener('resize', handleResize);

      // DIRECT RAF LOOP - bypass useRaf hook
      let animationId: number;
      let time = 0;

      const animate = () => {
        const dt = 1 / 60;
        time += dt;

        tick(dt);

        if (uniformsRef.current && rendererRef.current && sceneRef.current && cameraRef.current) {
          // Morph particles between shapes
          const currentShapeData = [shapes.hash, shapes.asterisk, shapes.angle][currentRef.current];
          const nextShapeData = [shapes.hash, shapes.asterisk, shapes.angle][nextRef.current];
          const morphProgress = progressRef.current;

          const tempObject = new THREE.Object3D();

          // Pointer interaction
          let px = 0, py = 0;
          let isPointerActive = false;

          if (containerRef.current && pointer.activeRef.current) {
            const rect = containerRef.current.getBoundingClientRect();
            const mx = pointer.targetRef.current.x - rect.left;
            const my = pointer.targetRef.current.y - rect.top;

            // Normalize to -1..1 (approximate based on camera size)
            // Camera size is 1.5 * aspect
            const aspect = rect.width / rect.height;
            const camW = 1.5 * aspect * 2;
            const camH = 1.5 * 2;

            px = (mx / rect.width) * camW - (camW / 2);
            py = -((my / rect.height) * camH - (camH / 2));
            isPointerActive = true;
          }

          for (let i = 0; i < count; i++) {
            const i3 = i * 3;

            // Get positions from current and next shapes
            const x1 = currentShapeData[i3] + jitter[i3];
            const y1 = currentShapeData[i3 + 1] + jitter[i3 + 1];
            const z1 = currentShapeData[i3 + 2];
            const x2 = nextShapeData[i3] + jitter[i3];
            const y2 = nextShapeData[i3 + 1] + jitter[i3 + 1];
            const z2 = nextShapeData[i3 + 2];

            // Ease function
            const ease = 1 - Math.pow(1 - morphProgress, 3);

            // Interpolate position
            let x = x1 + (x2 - x1) * ease;
            let y = y1 + (y2 - y1) * ease;
            const z = z1 + (z2 - z1) * ease;

            // Add idle motion (Sine wave from reference)
            // disp.x += sin((refPos.x * 20.) + (time * 4.)) * .02
            // disp.y += cos((refPos.y * 20.) + (time * 3.)) * .02
            x += Math.sin(x * 10 + time * 2) * 0.005;
            y += Math.cos(y * 10 + time * 1.5) * 0.005;

            // Pointer repel effect
            if (isPointerActive) {
              const dx = x - px;
              const dy = y - py;
              const distSq = dx * dx + dy * dy;
              const dist = Math.sqrt(distSq);
              const radius = 0.4; // Slightly larger radius

              if (dist < radius) {
                // Reference-like repel: pos -= (mouse - pos) * falloff * strength
                const force = Math.pow(1 - dist / radius, 2) * 0.2;
                const angle = Math.atan2(dy, dx);
                x += Math.cos(angle) * force;
                y += Math.sin(angle) * force;
              }
            }

            tempObject.position.set(x, y, z);
            tempObject.updateMatrix();
            (particlesMesh as THREE.InstancedMesh).setMatrixAt(i, tempObject.matrix);
          }
          (particlesMesh as THREE.InstancedMesh).instanceMatrix.needsUpdate = true;

          rendererRef.current.render(sceneRef.current, cameraRef.current);
        }

        animationId = requestAnimationFrame(animate);
      };

      animationId = requestAnimationFrame(animate);
      console.log('🚀 Started DIRECT animation loop');

      return () => {
        cancelAnimationFrame(animationId);
        window.removeEventListener('resize', handleResize);
        geometry.dispose();
        material.dispose();
        renderer.dispose();
      };
    };

    checkAndInit();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Reduced motion: hide component
  const prefersReduced = typeof window !== 'undefined' && window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (prefersReduced) return null;

  return (
    <div ref={containerRef} className="absolute inset-0 pointer-events-none" style={{ zIndex: 0 }} aria-hidden>
      <canvas ref={canvasRef} className="w-full h-full" style={{ display: 'block' }} />
    </div>
  );
}
