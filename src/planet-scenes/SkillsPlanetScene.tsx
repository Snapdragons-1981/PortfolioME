"use client";

import { Float, OrbitControls, PerspectiveCamera } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import { Bloom, EffectComposer, Vignette } from "@react-three/postprocessing";
import { useMemo, useRef } from "react";
import * as THREE from "three";
import { Atmosphere, Core, Label, WireShell } from "./PlanetEffects";
import { Habitat } from "./CityScape";

const SKILLS: { label: string; color: string; pos: [number, number, number] }[] = [
  { label: "TECH SUPPORT", color: "#60a5fa", pos: [-4, 1.6, 0] },
  { label: "HARDWARE & SOFTWARE", color: "#93c5fd", pos: [4, 2.1, -1] },
  { label: "NETWORK CONFIG", color: "#38bdf8", pos: [-3.2, -1.2, 3] },
  { label: "SYSTEM MAINTENANCE", color: "#a5b4fc", pos: [3.4, -1.6, -2.8] },
  { label: "ACCOUNT MGMT", color: "#22d3ee", pos: [0, 3.6, 1.6] },
  { label: "DATA RECOVERY", color: "#7dd3fc", pos: [0.6, -2.2, 3] },
];

const SkillOrb = ({ skill, index }: { skill: (typeof SKILLS)[0]; index: number }) => {
  const groupRef = useRef<THREE.Group>(null);
  const spokeGeo = useMemo(
    () =>
      new THREE.BufferGeometry().setFromPoints([
        new THREE.Vector3(0, 0, 0),
        new THREE.Vector3(skill.pos[0], skill.pos[1], skill.pos[2]),
      ]),
    [skill.pos]
  );

  useFrame((state) => {
    if (groupRef.current) {
      groupRef.current.position.y =
        skill.pos[1] + Math.sin(state.clock.elapsedTime * 1.2 + index) * 0.18;
      groupRef.current.rotation.y += 0.004;
    }
  });

  return (
    <group>
      <line>
        <primitive object={spokeGeo} attach="geometry" />
        <lineBasicMaterial attach="material" color={skill.color} transparent opacity={0.35} toneMapped={false} />
      </line>
      <Float speed={1.8} rotationIntensity={0.7} floatIntensity={0.7}>
        <group ref={groupRef} position={skill.pos}>
          <mesh>
            <octahedronGeometry args={[0.42, 0]} />
            <meshStandardMaterial
              color={skill.color}
              emissive={skill.color}
              emissiveIntensity={1.2}
              roughness={0.2}
              metalness={0.5}
              toneMapped={false}
            />
          </mesh>
          <Label position={[0, -1, 0]} fontSize={0.24} color={skill.color}>
            {skill.label}
          </Label>
        </group>
      </Float>
    </group>
  );
};

const SkillsPlanetScene = () => {
  return (
    <>
      <PerspectiveCamera makeDefault position={[0, 2.2, 12]} fov={55} />
      <OrbitControls enableZoom enablePan enableRotate enableDamping minDistance={4} maxDistance={28} />

      <Atmosphere color="#3b82f6" ground="#071426" />

      <Habitat accent="#60a5fa" seed={22} buildings={26} people={7} />

      <Core color="#60a5fa" radius={0.9} speed={0.65} />
      <WireShell radius={1.8} color="#60a5fa" opacity={0.18} />

      {SKILLS.map((skill, i) => (
        <SkillOrb key={skill.label} skill={skill} index={i} />
      ))}

      <Label position={[0, 4.6, 0]} fontSize={0.6} color="#dbeafe">
        SKILL CONSTELLATION
      </Label>

      <EffectComposer>
        <Bloom luminanceThreshold={0.2} luminanceSmoothing={0.85} intensity={1.2} mipmapBlur />
        <Vignette eskil={false} offset={0.15} darkness={0.8} />
      </EffectComposer>
    </>
  );
};

export default SkillsPlanetScene;
