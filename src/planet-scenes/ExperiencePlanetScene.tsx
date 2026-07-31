"use client";

import { OrbitControls, PerspectiveCamera } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import { Bloom, EffectComposer, Vignette } from "@react-three/postprocessing";
import { useRef } from "react";
import * as THREE from "three";
import { Atmosphere, Label } from "./PlanetEffects";
import { Habitat } from "./CityScape";

const MILESTONES: { label: string; y: number; z: number }[] = [
  { label: "IT SPECIALIST", y: 0.6, z: -4.2 },
  { label: "SYSTEM ADMIN", y: 1.0, z: -2.1 },
  { label: "NETWORK OPS", y: 1.3, z: 0 },
  { label: "FULL-STACK", y: 1.6, z: 2.1 },
  { label: "CLOUD · DEVOPS", y: 1.9, z: 4.2 },
];

const pathGeo = (() => {
  const pts: THREE.Vector3[] = [];
  for (let i = 0; i <= 80; i++) {
    const t = (i / 80) * 9 - 4.5;
    const y = 0.8 + Math.sin((t + 4.5) * 0.35) * 0.5;
    pts.push(new THREE.Vector3(Math.sin(t * 0.8) * 1.2, y, t));
  }
  return new THREE.BufferGeometry().setFromPoints(pts);
})();

const Pillar = ({ milestone, color }: { milestone: (typeof MILESTONES)[0]; color: string }) => (
  <group position={[Math.sin(milestone.z * 0.8) * 1.2, 0, milestone.z]}>
    <mesh position={[0, milestone.y, 0]}>
      <cylinderGeometry args={[0.1, 0.16, 1.4, 16]} />
      <meshStandardMaterial
        color="#0a1f14"
        emissive={color}
        emissiveIntensity={0.3}
        metalness={0.7}
        roughness={0.3}
      />
    </mesh>
    <mesh position={[0, milestone.y + 0.8, 0]}>
      <sphereGeometry args={[0.18, 20, 20]} />
      <meshStandardMaterial color={color} emissive={color} emissiveIntensity={2} toneMapped={false} />
    </mesh>
    <Label position={[0, milestone.y + 1.4, 0]} fontSize={0.24} color={color}>
      {milestone.label}
    </Label>
  </group>
);

const Runner = ({ color }: { color: string }) => {
  const ref = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (ref.current) {
      const t = ((state.clock.elapsedTime * 0.35) % 9) - 4.5;
      const y = 0.8 + Math.sin((t + 4.5) * 0.35) * 0.5;
      ref.current.position.set(Math.sin(t * 0.8) * 1.2, y, t);
    }
  });

  return (
    <mesh ref={ref}>
      <sphereGeometry args={[0.16, 20, 20]} />
      <meshBasicMaterial color={color} toneMapped={false} />
    </mesh>
  );
};

const ExperiencePlanetScene = () => {
  const color = "#10b981";
  const pathColor = "#34d399";

  return (
    <>
      <PerspectiveCamera makeDefault position={[4, 2.6, 12]} fov={55} />
      <OrbitControls enableZoom enablePan enableRotate enableDamping minDistance={4} maxDistance={28} />

      <Atmosphere color={color} ground="#05231a" />

      <Habitat accent="#34d399" seed={44} buildings={20} people={6} />

      <line>
        <primitive object={pathGeo} attach="geometry" />
        <lineBasicMaterial attach="material" color={pathColor} transparent opacity={0.5} toneMapped={false} />
      </line>

      {MILESTONES.map((m) => (
        <Pillar key={m.label} milestone={m} color={color} />
      ))}

      <Runner color="#6ee7b7" />

      <Label position={[0, 4.6, 0]} fontSize={0.6} color="#d1fae5">
        CAREER PATHWAY
      </Label>

      <EffectComposer>
        <Bloom luminanceThreshold={0.2} luminanceSmoothing={0.85} intensity={1.2} mipmapBlur />
        <Vignette eskil={false} offset={0.15} darkness={0.8} />
      </EffectComposer>
    </>
  );
};

export default ExperiencePlanetScene;
