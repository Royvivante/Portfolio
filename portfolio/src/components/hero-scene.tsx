"use client";

import { useRef, useMemo, useCallback } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";

const PARTICLE_COUNT = 800;
const FIELD_SIZE = 18;
const DEPTH = 30;

function Particles() {
  const meshRef = useRef<THREE.InstancedMesh>(null);
  const mouseRef = useRef({ x: 0, y: 0 });
  const { viewport } = useThree();

  const dummy = useMemo(() => new THREE.Object3D(), []);

  const particles = useMemo(() => {
    const arr = [];
    for (let i = 0; i < PARTICLE_COUNT; i++) {
      arr.push({
        x: (Math.random() - 0.5) * FIELD_SIZE * 2,
        y: (Math.random() - 0.5) * FIELD_SIZE,
        z: (Math.random() - 0.5) * DEPTH - 5,
        baseX: 0,
        baseY: 0,
        scale: Math.random() * 0.6 + 0.2,
        speed: Math.random() * 0.3 + 0.1,
        offset: Math.random() * Math.PI * 2,
      });
    }
    arr.forEach((p) => {
      p.baseX = p.x;
      p.baseY = p.y;
    });
    return arr;
  }, []);

  const handlePointerMove = useCallback(
    (e: { clientX: number; clientY: number }) => {
      mouseRef.current.x =
        ((e.clientX / window.innerWidth) * 2 - 1) * viewport.width * 0.3;
      mouseRef.current.y =
        (-(e.clientY / window.innerHeight) * 2 + 1) * viewport.height * 0.3;
    },
    [viewport]
  );

  useFrame(({ clock }) => {
    if (!meshRef.current) return;
    const t = clock.getElapsedTime();

    for (let i = 0; i < PARTICLE_COUNT; i++) {
      const p = particles[i];

      // Gentle floating drift
      const floatX = Math.sin(t * p.speed + p.offset) * 0.3;
      const floatY = Math.cos(t * p.speed * 0.7 + p.offset) * 0.2;

      // Mouse influence (subtle parallax)
      const depth01 = (p.z + DEPTH * 0.5 + 5) / DEPTH;
      const mouseInfluence = depth01 * 0.15;

      dummy.position.set(
        p.baseX + floatX + mouseRef.current.x * mouseInfluence,
        p.baseY + floatY + mouseRef.current.y * mouseInfluence,
        p.z
      );
      dummy.scale.setScalar(p.scale * (0.5 + depth01 * 0.5));
      dummy.updateMatrix();
      meshRef.current.setMatrixAt(i, dummy.matrix);
    }
    meshRef.current.instanceMatrix.needsUpdate = true;

    // Also listen for mouse
    window.addEventListener("pointermove", handlePointerMove, {
      passive: true,
    });
  });

  return (
    <instancedMesh ref={meshRef} args={[undefined, undefined, PARTICLE_COUNT]}>
      <circleGeometry args={[0.03, 8]} />
      <meshBasicMaterial color="#6366f1" transparent opacity={0.5} />
    </instancedMesh>
  );
}

function ConnectionLines() {
  const lineRef = useRef<THREE.LineSegments>(null);
  const positionsRef = useRef<Float32Array | null>(null);
  const colorsRef = useRef<Float32Array | null>(null);

  const nodes = useMemo(() => {
    const arr = [];
    const count = 40;
    for (let i = 0; i < count; i++) {
      arr.push({
        x: (Math.random() - 0.5) * FIELD_SIZE * 1.5,
        y: (Math.random() - 0.5) * FIELD_SIZE * 0.8,
        z: (Math.random() - 0.5) * 8 - 3,
        speed: Math.random() * 0.2 + 0.05,
        offset: Math.random() * Math.PI * 2,
      });
    }
    return arr;
  }, []);

  const maxConnections = nodes.length * nodes.length;

  useMemo(() => {
    positionsRef.current = new Float32Array(maxConnections * 6);
    colorsRef.current = new Float32Array(maxConnections * 6);
  }, [maxConnections]);

  useFrame(({ clock }) => {
    if (!lineRef.current || !positionsRef.current || !colorsRef.current) return;
    const t = clock.getElapsedTime();
    const positions = positionsRef.current;
    const colors = colorsRef.current;

    let idx = 0;
    const threshold = 5;

    for (let i = 0; i < nodes.length; i++) {
      const a = nodes[i];
      const ax = a.x + Math.sin(t * a.speed + a.offset) * 0.5;
      const ay = a.y + Math.cos(t * a.speed * 0.7 + a.offset) * 0.3;

      for (let j = i + 1; j < nodes.length; j++) {
        const b = nodes[j];
        const bx = b.x + Math.sin(t * b.speed + b.offset) * 0.5;
        const by = b.y + Math.cos(t * b.speed * 0.7 + b.offset) * 0.3;

        const dx = ax - bx;
        const dy = ay - by;
        const dz = a.z - b.z;
        const dist = Math.sqrt(dx * dx + dy * dy + dz * dz);

        if (dist < threshold) {
          const alpha = (1 - dist / threshold) * 0.15;
          positions[idx * 6] = ax;
          positions[idx * 6 + 1] = ay;
          positions[idx * 6 + 2] = a.z;
          positions[idx * 6 + 3] = bx;
          positions[idx * 6 + 4] = by;
          positions[idx * 6 + 5] = b.z;
          colors[idx * 6] = 0.39;
          colors[idx * 6 + 1] = 0.4;
          colors[idx * 6 + 2] = 0.95;
          colors[idx * 6 + 3] = 0.39;
          colors[idx * 6 + 4] = 0.4;
          colors[idx * 6 + 5] = alpha;
          idx++;
        }
      }
    }

    const geom = lineRef.current.geometry;
    geom.setAttribute(
      "position",
      new THREE.BufferAttribute(positions.slice(0, idx * 6), 3)
    );
    geom.setAttribute(
      "color",
      new THREE.BufferAttribute(colors.slice(0, idx * 6), 3)
    );
    geom.attributes.position.needsUpdate = true;
    geom.attributes.color.needsUpdate = true;
  });

  return (
    <lineSegments ref={lineRef}>
      <bufferGeometry />
      <lineBasicMaterial vertexColors transparent opacity={0.3} />
    </lineSegments>
  );
}

export function HeroScene() {
  return (
    <div className="absolute inset-0 z-0">
      <Canvas
        camera={{ position: [0, 0, 10], fov: 60 }}
        dpr={[1, 1.5]}
        gl={{ antialias: true, alpha: true }}
        style={{ background: "transparent" }}
      >
        <Particles />
        <ConnectionLines />
      </Canvas>
    </div>
  );
}
