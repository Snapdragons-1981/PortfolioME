"use client";

import { Float, OrbitControls, PerspectiveCamera, RoundedBox } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import { Bloom, EffectComposer, Vignette } from "@react-three/postprocessing";
import { useRef } from "react";
import * as THREE from "three";
import { Atmosphere, Core, Label, OrbitRing, WireShell } from "./PlanetEffects";
import { Habitat } from "./CityScape";

const PROJECTS: { title: string; color: string; pos: [number, number, number] }[] = [
  { title: "LIBRARY MGMT SYSTEM", color: "#c4b5fd", pos: [3.6, 1.3, 0] },
  { title: "CLASS SCHEDULER", color: "#a78bfa", pos: [-3.6, 1.9, 1.2] },
  { title: "SHOPPING CART WEB", color: "#f0abfc", pos: [0.4, -1.7, 3.4] },
];

const ProjectModule = ({ project, index }: { project: (typeof PROJECTS)[0]; index: number }) => {
  const groupRef = useRef<THREE.Group>(null);

  useFrame((state) => {
    if (groupRef.current) {
      groupRef.current.rotation.y += 0.005;
      groupRef.current.position.y =
        project.pos[1] + Math.sin(state.clock.elapsedTime * 1.1 + index * 1.7) * 0.14;
    }
  });

  return (
    <Float speed={1.6} rotationIntensity={0.5} floatIntensity={0.5}>
      <group ref={groupRef} position={project.pos}>
        <RoundedBox args={[1.8, 1.05, 0.9]} radius={0.14} smoothness={4}>
          <meshStandardMaterial
            color="#1e1b4b"
            emissive={project.color}
            emissiveIntensity={0.45}
            roughness={0.3}
            metalness={0.65}
          />
        </RoundedBox>
        <mesh position={[0, 0.53, 0]}>
          <boxGeometry args={[1.2, 0.04, 0.5]} />
          <meshBasicMaterial color={project.color} toneMapped={false} />
        </mesh>
        <Label position={[0, 0, 0.58]} fontSize={0.22} color={project.color}>
          {project.title}
        </Label>
      </group>
    </Float>
  );
};

const ProjectsPlanetScene = () => {
  return (
    <>
      <PerspectiveCamera makeDefault position={[0, 2.4, 12]} fov={55} />
      <OrbitControls enableZoom enablePan enableRotate enableDamping minDistance={4} maxDistance={28} />

      <Atmosphere color="#8b5cf6" ground="#140b26" />

      <Habitat accent="#a78bfa" seed={33} buildings={24} people={5} />

      <group>
        <Core color="#8b5cf6" radius={1} />
        <WireShell radius={1.9} color="#8b5cf6" opacity={0.2} />
        <mesh rotation={[Math.PI / 2, 0, 0]}>
          <torusGeometry args={[2.7, 0.04, 16, 100]} />
          <meshBasicMaterial color="#a78bfa" transparent opacity={0.6} toneMapped={false} />
        </mesh>
        <OrbitRing radius={3.8} color="#a78bfa" tilt={0.6} speed={0.4} count={3} opacity={0.3} />
      </group>

      {PROJECTS.map((project, i) => (
        <ProjectModule key={project.title} project={project} index={i} />
      ))}

      <Label position={[0, 4.8, 0]} fontSize={0.6} color="#ede9fe">
        PROJECT NEXUS
      </Label>

      <EffectComposer>
        <Bloom luminanceThreshold={0.2} luminanceSmoothing={0.85} intensity={1.2} mipmapBlur />
        <Vignette eskil={false} offset={0.15} darkness={0.8} />
      </EffectComposer>
    </>
  );
};

export default ProjectsPlanetScene;
