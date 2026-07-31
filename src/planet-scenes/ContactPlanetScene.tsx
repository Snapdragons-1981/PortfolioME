"use client";

import { OrbitControls, PerspectiveCamera } from "@react-three/drei";
import { Bloom, EffectComposer, Vignette } from "@react-three/postprocessing";
import * as THREE from "three";
import { Atmosphere, Core, Label, OrbitRing, SignalRing, WireShell } from "./PlanetEffects";
import { Habitat } from "./CityScape";

const ContactPlanetScene = () => {
  return (
    <>
      <PerspectiveCamera makeDefault position={[0, 2.4, 11]} fov={55} />
      <OrbitControls enableZoom enablePan enableRotate enableDamping minDistance={3.5} maxDistance={26} />

      <Atmosphere color="#ec4899" ground="#22051a" />

      <Habitat accent="#f472b6" seed={66} buildings={18} people={4} />

      <group>
        <Core color="#ec4899" radius={1.1} />
        <mesh rotation={[0.3, 0.3, 0]}>
          <octahedronGeometry args={[1.05, 0]} />
          <meshStandardMaterial
            color="#f472b6"
            emissive="#ec4899"
            emissiveIntensity={1.6}
            transparent
            opacity={0.85}
            roughness={0.1}
            metalness={0.4}
            toneMapped={false}
          />
        </mesh>
        <WireShell radius={1.8} color="#ec4899" opacity={0.22} />

        <SignalRing color="#f472b6" delay={0} />
        <SignalRing color="#f9a8d4" delay={0.9} />
        <SignalRing color="#f472b6" delay={1.8} />

        <OrbitRing radius={3.2} color="#f472b6" tilt={0.7} speed={0.6} count={3} opacity={0.35} />
      </group>

      {/* Beacon light beam */}
      <mesh position={[0, 1.8, 0]}>
        <cylinderGeometry args={[0.06, 0.6, 7, 24, 1, true]} />
        <meshBasicMaterial
          color="#f472b6"
          transparent
          opacity={0.3}
          side={THREE.DoubleSide}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
          toneMapped={false}
        />
      </mesh>

      <Label position={[0, 3.6, 0]} fontSize={0.6} color="#fce7f3">
        GET IN TOUCH
      </Label>
      <Label position={[0, 2.8, 0]} fontSize={0.26} color="#f472b6">
        ganaswenrick90@gmail.com
      </Label>

      <EffectComposer>
        <Bloom luminanceThreshold={0.2} luminanceSmoothing={0.85} intensity={1.2} mipmapBlur />
        <Vignette eskil={false} offset={0.15} darkness={0.8} />
      </EffectComposer>
    </>
  );
};

export default ContactPlanetScene;
