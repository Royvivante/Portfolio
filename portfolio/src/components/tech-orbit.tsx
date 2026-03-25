"use client";

import { useRef, useMemo } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Text } from "@react-three/drei";
import * as THREE from "three";

const ORBIT_TECHS = [
  { label: "Python", ring: 0 },
  { label: "Django", ring: 0 },
  { label: "PostgreSQL", ring: 0 },
  { label: "REST APIs", ring: 0 },
  { label: "JWT", ring: 0 },
  { label: "React", ring: 1 },
  { label: "Next.js", ring: 1 },
  { label: "TypeScript", ring: 1 },
  { label: "Tailwind", ring: 1 },
  { label: "Framer Motion", ring: 1 },
  { label: "Docker", ring: 2 },
  { label: "Vercel", ring: 2 },
  { label: "Supabase", ring: 2 },
  { label: "Git", ring: 2 },
  { label: "TensorFlow", ring: 2 },
  { label: "Pandas", ring: 2 },
];

const RING_RADII = [2.8, 4.5, 6.2];
const RING_SPEEDS = [0.15, -0.1, 0.07];
const RING_COLORS = ["#818cf8", "#6366f1", "#4f46e5"];

function OrbitRing({
  radius,
  speed,
  color,
}: {
  radius: number;
  speed: number;
  color: string;
}) {
  const ref = useRef<THREE.Group>(null);
  const positions = useMemo(() => {
    const arr = new Float32Array(129 * 3);
    for (let i = 0; i <= 128; i++) {
      const angle = (i / 128) * Math.PI * 2;
      arr[i * 3] = Math.cos(angle) * radius;
      arr[i * 3 + 1] = Math.sin(angle) * radius * 0.3;
      arr[i * 3 + 2] = 0;
    }
    return arr;
  }, [radius]);

  useFrame((_, delta) => {
    if (ref.current) {
      ref.current.rotation.z += speed * delta;
    }
  });

  return (
    <group ref={ref}>
      <line>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            args={[positions, 3]}
          />
        </bufferGeometry>
        <lineBasicMaterial color={color} transparent opacity={0.1} />
      </line>
    </group>
  );
}

function OrbitNode({
  label,
  ring,
  index,
  total,
}: {
  label: string;
  ring: number;
  index: number;
  total: number;
}) {
  const ref = useRef<THREE.Group>(null);
  const radius = RING_RADII[ring];
  const speed = RING_SPEEDS[ring];
  const startAngle = (index / total) * Math.PI * 2;

  useFrame(({ clock }) => {
    if (!ref.current) return;
    const t = clock.getElapsedTime();
    const angle = startAngle + t * speed;
    ref.current.position.x = Math.cos(angle) * radius;
    ref.current.position.y = Math.sin(angle) * radius * 0.3;
    ref.current.position.z = Math.sin(angle) * 1.5;
  });

  return (
    <group ref={ref}>
      <mesh>
        <sphereGeometry args={[0.08, 12, 12]} />
        <meshBasicMaterial color={RING_COLORS[ring]} />
      </mesh>
      <Text
        position={[0, 0.25, 0]}
        fontSize={0.22}
        color="#a1a1aa"
        anchorX="center"
        anchorY="bottom"
        font={undefined}
      >
        {label}
      </Text>
    </group>
  );
}

function Scene() {
  const groupRef = useRef<THREE.Group>(null);

  useFrame(({ pointer }) => {
    if (!groupRef.current) return;
    groupRef.current.rotation.x =
      THREE.MathUtils.lerp(groupRef.current.rotation.x, pointer.y * 0.1 + 0.3, 0.02);
    groupRef.current.rotation.y =
      THREE.MathUtils.lerp(groupRef.current.rotation.y, pointer.x * 0.15, 0.02);
  });

  const nodesByRing = useMemo(() => {
    const grouped: Record<number, { label: string; ring: number }[]> = {};
    ORBIT_TECHS.forEach((tech) => {
      if (!grouped[tech.ring]) grouped[tech.ring] = [];
      grouped[tech.ring].push(tech);
    });
    return grouped;
  }, []);

  return (
    <group ref={groupRef} rotation={[0.3, 0, 0]}>
      {/* Center dot */}
      <mesh>
        <sphereGeometry args={[0.15, 16, 16]} />
        <meshBasicMaterial color="#6366f1" />
      </mesh>

      {/* Rings */}
      {RING_RADII.map((r, i) => (
        <OrbitRing key={r} radius={r} speed={RING_SPEEDS[i]} color={RING_COLORS[i]} />
      ))}

      {/* Nodes */}
      {Object.entries(nodesByRing).map(([ring, techs]) =>
        techs.map((tech, i) => (
          <OrbitNode
            key={tech.label}
            label={tech.label}
            ring={Number(ring)}
            index={i}
            total={techs.length}
          />
        ))
      )}
    </group>
  );
}

export function TechOrbit() {
  return (
    <div className="h-[400px] sm:h-[500px] w-full">
      <Canvas
        camera={{ position: [0, 0, 12], fov: 50 }}
        dpr={[1, 1.5]}
        gl={{ antialias: true, alpha: true }}
        style={{ background: "transparent" }}
      >
        <Scene />
      </Canvas>
    </div>
  );
}
