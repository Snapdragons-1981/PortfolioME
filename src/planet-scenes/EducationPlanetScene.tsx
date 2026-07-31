"use client";

import { OrbitControls, PerspectiveCamera } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import { Bloom, EffectComposer, Vignette } from "@react-three/postprocessing";
import { useRef } from "react";
import * as THREE from "three";
import { Atmosphere, Label, OrbitRing } from "./PlanetEffects";
import { Habitat } from "./CityScape";

const ORBS: { color: string; radius: number; height: number; offset: number }[] = [
  { color: "#f59e0b", radius: 1.6, height: 0.6, offset: 0 },
  { color: "#fbbf24", radius: 2.1, height: 1.1, offset: 1.2 },
  { color: "#fde047", radius: 2.6, height: 1.6, offset: 2.4 },
  { color: "#f59e0b", radius: 1.9, height: 2.1, offset: 3.6 },
  { color: "#fbbf24", radius: 2.4, height: 2.6, offset: 4.8 },
  { color: "#fde047", radius: 1.5, height: 3.0, offset: 6 },
];

const OpenBook = ({ color }: { color: string }) => (
  <group position={[0, -0.3, 0]}>
    {/* Left page */}
    <mesh position={[-0.62, 0, 0]} rotation={[0, 0, 0.32]}>
      <boxGeometry args={[1.3, 0.1, 0.9]} />
      <meshStandardMaterial color="#3b2412" emissive={color} emissiveIntensity={0.35} roughness={0.4} metalness={0.2} />
    </mesh>
    {/* Right page */}
    <mesh position={[0.62, 0, 0]} rotation={[0, 0, -0.32]}>
      <boxGeometry args={[1.3, 0.1, 0.9]} />
      <meshStandardMaterial color="#3b2412" emissive={color} emissiveIntensity={0.35} roughness={0.4} metalness={0.2} />
    </mesh>
    {/* Glowing page surface */}
    <mesh position={[0, 0.06, 0]}>
      <planeGeometry args={[1.7, 0.9]} />
      <meshBasicMaterial
        color={color}
        transparent
        opacity={0.5}
        toneMapped={false}
        side={THREE.DoubleSide}
        blending={THREE.AdditiveBlending}
        depthWrite={false}
      />
    </mesh>
    {/* Spine */}
    <mesh rotation={[0, 0, Math.PI / 2]}>
      <cylinderGeometry args={[0.14, 0.14, 0.9, 16]} />
      <meshStandardMaterial color={color} emissive={color} emissiveIntensity={1.2} metalness={0.5} roughness={0.3} />
    </mesh>
  </group>
);

const KnowledgeOrb = ({ orb }: { orb: (typeof ORBS)[0] }) => {
  const ref = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (ref.current) {
      const a = orb.offset + state.clock.elapsedTime * 0.5;
      ref.current.position.set(Math.cos(a) * orb.radius, orb.height, Math.sin(a) * orb.radius);
    }
  });

  return (
    <mesh ref={ref}>
      <sphereGeometry args={[0.16, 20, 20]} />
      <meshStandardMaterial color={orb.color} emissive={orb.color} emissiveIntensity={1.6} toneMapped={false} />
    </mesh>
  );
};

const EducationPlanetScene = () => {
  return (
    <>
      <PerspectiveCamera makeDefault position={[0, 2.4, 11]} fov={55} />
      <OrbitControls enableZoom enablePan enableRotate enableDamping minDistance={3.5} maxDistance={26} />

      <Atmosphere color="#f59e0b" ground="#241204" />

      <Habitat accent="#fbbf24" seed={55} buildings={22} people={6} />

      <OpenBook color="#fbbf24" />

      <OrbitRing radius={3.4} color="#f59e0b" tilt={0.5} speed={0.35} count={3} opacity={0.3} />

      {ORBS.map((orb, i) => (
        <KnowledgeOrb key={i} orb={orb} />
      ))}

      <Label position={[0, 4.6, 0]} fontSize={0.6} color="#fef3c7">
        LIBRARY OF KNOWLEDGE
      </Label>
      <Label position={[0, 3.85, 0]} fontSize={0.28} color="#f59e0b">
        BACHELOR OF SCIENCE IN INFORMATION TECHNOLOGY
      </Label>

      <EffectComposer>
        <Bloom luminanceThreshold={0.2} luminanceSmoothing={0.85} intensity={1.2} mipmapBlur />
        <Vignette eskil={false} offset={0.15} darkness={0.8} />
      </EffectComposer>
    </>
  );
};

export default EducationPlanetScene;
