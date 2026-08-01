"use client";

import { Billboard, ContactShadows, Sparkles, Stars, Text } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import { useMemo, useRef, type ReactNode } from "react";
import * as THREE from "three";
import { Terrain } from "./CityScape";

export const Core = ({
  color,
  radius = 1.2,
  speed = 0.5,
  emissiveIntensity = 1.5,
}: {
  color: string;
  radius?: number;
  speed?: number;
  emissiveIntensity?: number;
}) => {
  const ref = useRef<THREE.Mesh>(null);

  useFrame((state, delta) => {
    if (ref.current) {
      ref.current.rotation.x += delta * speed * 0.4;
      ref.current.rotation.y += delta * speed;
      const pulse = 1 + Math.sin(state.clock.elapsedTime * 1.8) * 0.07;
      ref.current.scale.setScalar(pulse);
    }
  });

  return (
    <mesh ref={ref}>
      <icosahedronGeometry args={[radius, 1]} />
      <meshStandardMaterial
        color={color}
        emissive={color}
        emissiveIntensity={emissiveIntensity}
        roughness={0.15}
        metalness={0.7}
        toneMapped={false}
      />
    </mesh>
  );
};

export const WireShell = ({
  radius,
  color,
  opacity = 0.18,
  spin = 0.12,
}: {
  radius: number;
  color: string;
  opacity?: number;
  spin?: number;
}) => {
  const ref = useRef<THREE.Mesh>(null);

  useFrame((_, delta) => {
    if (ref.current) {
      ref.current.rotation.y += delta * spin;
      ref.current.rotation.x += delta * spin * 0.6;
    }
  });

  return (
    <mesh ref={ref}>
      <icosahedronGeometry args={[radius, 1]} />
      <meshBasicMaterial color={color} wireframe transparent opacity={opacity} toneMapped={false} />
    </mesh>
  );
};

const Satellite = ({
  radius,
  color,
  speed,
  offset,
}: {
  radius: number;
  color: string;
  speed: number;
  offset: number;
}) => {
  const ref = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (ref.current) {
      const a = offset + state.clock.elapsedTime * speed;
      ref.current.position.set(Math.cos(a) * radius, 0, Math.sin(a) * radius);
    }
  });

  return (
    <mesh ref={ref}>
      <sphereGeometry args={[0.09, 16, 16]} />
      <meshBasicMaterial color={color} toneMapped={false} />
    </mesh>
  );
};

export const OrbitRing = ({
  radius,
  color,
  tilt = 0,
  speed = 0.6,
  count = 3,
  opacity = 0.35,
}: {
  radius: number;
  color: string;
  tilt?: number;
  speed?: number;
  count?: number;
  opacity?: number;
}) => {
  const ringGeo = useMemo(() => {
    const pts: THREE.Vector3[] = [];
    for (let i = 0; i <= 96; i++) {
      const a = (i / 96) * Math.PI * 2;
      pts.push(new THREE.Vector3(Math.cos(a) * radius, 0, Math.sin(a) * radius));
    }
    return new THREE.BufferGeometry().setFromPoints(pts);
  }, [radius]);

  return (
    <group rotation={[tilt, 0, 0]}>
      <line>
        <primitive object={ringGeo} attach="geometry" />
        <lineBasicMaterial attach="material" color={color} transparent opacity={opacity} toneMapped={false} />
      </line>
      {Array.from({ length: count }).map((_, i) => (
        <Satellite
          key={i}
          radius={radius}
          color={color}
          speed={speed}
          offset={(i / count) * Math.PI * 2}
        />
      ))}
    </group>
  );
};

export const Label = ({
  children,
  position = [0, 0, 0],
  fontSize = 0.5,
  color = "#e2e8f0",
  opacity = 1,
}: {
  children: ReactNode;
  position?: [number, number, number];
  fontSize?: number;
  color?: string;
  opacity?: number;
}) => (
  <Billboard position={position}>
    <Text
      fontSize={fontSize}
      color={color}
      anchorX="center"
      anchorY="middle"
      fillOpacity={opacity}
      outlineWidth={0.012}
      outlineColor="#000000"
      letterSpacing={0.08}
      font="https://fonts.gstatic.com/s/jetbrainsmono/v18/tDbY2o-flEEny0FZhsfKu5WU4zr3E_BX0PnT8RD8yKxTPlOVkQ.woff2"
    >
      {children}
    </Text>
  </Billboard>
);

export const Atmosphere = ({ color, ground }: { color: string; ground: string }) => (
  <>
    <ambientLight intensity={0.4} />
    <pointLight position={[0, 6, 0]} intensity={1.8} color={color} distance={30} decay={2} />
    <pointLight position={[9, -3, 6]} intensity={0.5} color="#ffffff" distance={35} decay={2} />
    <Stars radius={60} depth={40} count={2200} factor={3} saturation={0.2} fade speed={0.5} />
    <Sparkles count={120} scale={[16, 10, 16]} size={3} speed={0.3} opacity={0.5} color={color} />
    <Terrain color={ground} />
    <ContactShadows position={[0, -3.9, 0]} opacity={0.55} scale={18} blur={2.8} far={5} color="#000000" frames={1} />
  </>
);

export const SignalRing = ({ color, delay = 0 }: { color: string; delay?: number }) => {
  const ref = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    const mesh = ref.current;
    if (mesh) {
      const t = (state.clock.elapsedTime + delay) % 2.6;
      const p = t / 2.6;
      mesh.scale.setScalar(0.4 + p * 7);
      const mat = mesh.material as THREE.MeshBasicMaterial;
      mat.opacity = Math.max(0, (1 - p) * 0.8);
    }
  });

  return (
    <mesh ref={ref} rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.2, 0]}>
      <ringGeometry args={[0.95, 1, 48]} />
      <meshBasicMaterial
        color={color}
        transparent
        opacity={0.5}
        side={THREE.DoubleSide}
        depthWrite={false}
        toneMapped={false}
      />
    </mesh>
  );
};
