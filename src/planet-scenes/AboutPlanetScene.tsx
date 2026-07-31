"use client";

import { OrbitControls, PerspectiveCamera } from "@react-three/drei";
import { Bloom, EffectComposer, Vignette } from "@react-three/postprocessing";
import { Atmosphere, Core, Label, OrbitRing, WireShell } from "./PlanetEffects";
import { Habitat } from "./CityScape";

const AboutPlanetScene = () => {
  return (
    <>
      <PerspectiveCamera makeDefault position={[0, 2.4, 11]} fov={55} />
      <OrbitControls
        enableZoom
        enablePan
        enableRotate
        enableDamping
        minDistance={3.5}
        maxDistance={26}
      />

      <Atmosphere color="#22d3ee" ground="#06121f" />

      <Habitat accent="#22d3ee" seed={11} buildings={22} people={5} />

      <group>
        <Core color="#22d3ee" radius={1.2} />
        <WireShell radius={2} color="#22d3ee" opacity={0.2} />
        <OrbitRing radius={3} color="#22d3ee" tilt={0.5} speed={0.7} count={3} />
        <OrbitRing radius={3.9} color="#67e8f9" tilt={1.15} speed={-0.45} count={2} opacity={0.25} />
      </group>

      <Label position={[0, 3.3, 0]} fontSize={0.55} color="#e0f2fe">
        WENRICK JAY Z. GANAS
      </Label>
      <Label position={[0, 2.55, 0]} fontSize={0.3} color="#22d3ee">
        FULL-STACK DEVELOPER · IT SPECIALIST
      </Label>

      <EffectComposer>
        <Bloom luminanceThreshold={0.2} luminanceSmoothing={0.85} intensity={1.2} mipmapBlur />
        <Vignette eskil={false} offset={0.15} darkness={0.8} />
      </EffectComposer>
    </>
  );
};

export default AboutPlanetScene;
