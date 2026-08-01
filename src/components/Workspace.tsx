"use client";

import { PLANETS, usePortfolioStore } from "@/store/usePortfolioStore";
import { Billboard, Float, OrbitControls, Stars, Text } from "@react-three/drei";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { AnimatePresence, motion } from "framer-motion";
import { toast } from "sonner";
import { useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";
import * as THREE from "three";
import {
  createCloudTexture,
  createGasTexture,
  createRingTexture,
  createTerrestrialTexture,
  createVolcanicTextures,
  mulberry32,
} from "@/lib/planetTextures";
import { planetPositionsRef } from "@/lib/worldRefs";
import { Nebula, PlanetGlow, Moons, SpaceDust } from "@/components/UniverseAmbience";
import { ExplosionField, Projectiles } from "@/components/SandboxFX";
import Spaceship from "@/components/Spaceship";

const HOME_POSITION = new THREE.Vector3(0, 12, 22);
const FLIGHT_TIMEOUT_MS = 2400;

type PlanetKind = "terrestrial" | "gas" | "volcanic";

const PLANET_RENDER: Record<
  string,
  { kind: PlanetKind; seed: number; clouds?: boolean; rings?: boolean }
> = {
  about: { kind: "terrestrial", seed: 101, clouds: true },
  skills: { kind: "terrestrial", seed: 202, clouds: true },
  projects: { kind: "gas", seed: 303 },
  experience: { kind: "terrestrial", seed: 404 },
  education: { kind: "gas", seed: 505, rings: true },
  contact: { kind: "volcanic", seed: 606 },
};

const PLANET_MOONS: Record<string, { orbit: number; count: number; speed: number; color: string }> = {
  about: { orbit: 1.7, count: 1, speed: 0.9, color: "#7dd3fc" },
  projects: { orbit: 2.4, count: 3, speed: 0.5, color: "#c4b5fd" },
  experience: { orbit: 2.1, count: 2, speed: 0.7, color: "#6ee7b7" },
  education: { orbit: 2.2, count: 2, speed: 0.6, color: "#fde047" },
};

const Sun = () => {
  const [pulse, setPulse] = useState(1);
  const [hovered, setHovered] = useState(false);
  const { chargeSun, sunCharges } = usePortfolioStore();
  const chargeRef = useRef(0);

  useEffect(() => {
    let t = 0;
    const interval = setInterval(() => {
      t += 0.02;
      setPulse(1 + Math.sin(t) * 0.05);
    }, 16);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    chargeRef.current = sunCharges;
  }, [sunCharges]);

  const handleClick = (e: { stopPropagation: () => void }) => {
    e.stopPropagation();
    if (chargeRef.current >= 5) {
      toast("SOLAR CORE AT FULL CAPACITY", { description: "Sandbox mode is already unlocked." });
      return;
    }
    chargeRef.current += 1;
    chargeSun();
    if (chargeRef.current >= 5) {
      toast("SANDBOX MODE UNLOCKED", {
        description: "Select a weapon from the protocol menu and fire at a planet.",
      });
    } else {
      toast(`SOLAR CORE CHARGING ${chargeRef.current}/5`, {
        description: "Keep clicking the sun to unlock destruction protocol.",
      });
    }
  };

  const charge = Math.min(sunCharges / 5, 1);

  return (
    <group>
      <mesh
        scale={[pulse + charge * 0.25, pulse + charge * 0.25, pulse + charge * 0.25]}
        onClick={handleClick}
        onPointerOver={() => setHovered(true)}
        onPointerOut={() => setHovered(false)}
      >
        <sphereGeometry args={[1, 64, 64]} />
        <meshStandardMaterial
          color="#ffd700"
          emissive="#ff8c00"
          emissiveIntensity={2.5}
          toneMapped={false}
        />
      </mesh>

      {/* Charge progress ring */}
      <mesh rotation={[Math.PI / 2, 0, 0]} position={[0, 0, 0]} raycast={() => null}>
        <ringGeometry args={[1.7, 1.85, 64]} />
        <meshBasicMaterial
          color="#ffd700"
          transparent
          opacity={0.08 + charge * 0.7}
          side={THREE.DoubleSide}
        />
      </mesh>
      <mesh rotation={[Math.PI / 2, 0, 0]} position={[0, 0, 0]} raycast={() => null}>
        <ringGeometry args={[1.78, 1.8, 64, 1, 0, Math.PI * 2 * charge]} />
        <meshBasicMaterial
          color="#ffa500"
          transparent
          opacity={0.9}
          side={THREE.DoubleSide}
          toneMapped={false}
        />
      </mesh>

      {/* Hover highlight */}
      {hovered && (
        <mesh rotation={[Math.PI / 2, 0, 0]} raycast={() => null}>
          <ringGeometry args={[1.4, 1.55, 64]} />
          <meshBasicMaterial color="#ffd700" opacity={0.35} transparent side={THREE.DoubleSide} />
        </mesh>
      )}

      <pointLight position={[0, 0, 0]} intensity={70} color="#ffd7a0" distance={100} decay={2} />
      <pointLight position={[0, 0, 0]} intensity={10} color="#ff6b00" distance={25} decay={2} />
    </group>
  );
};

const OrbitRing = ({ radius, color }: { radius: number; color: string }) => {
  const points = useMemo(() => {
    const pts: THREE.Vector3[] = [];
    const segments = 128;
    for (let i = 0; i <= segments; i++) {
      const angle = (i / segments) * Math.PI * 2;
      pts.push(new THREE.Vector3(Math.cos(angle) * radius, 0, Math.sin(angle) * radius));
    }
    return pts;
  }, [radius]);

  const lineGeometry = useMemo(() => {
    return new THREE.BufferGeometry().setFromPoints(points);
  }, [points]);

  return (
    <line>
      <bufferGeometry attach="geometry" {...lineGeometry} />
      <lineBasicMaterial attach="material" color={color} opacity={0.12} transparent linewidth={1} />
    </line>
  );
};

const AsteroidBelt = ({
  innerRadius,
  outerRadius,
  count = 450,
}: {
  innerRadius: number;
  outerRadius: number;
  count?: number;
}) => {
  const mesh = useRef<THREE.InstancedMesh>(null);
  const group = useRef<THREE.Group>(null);
  const dummy = useMemo(() => new THREE.Object3D(), []);
  const { paused, timeScale } = usePortfolioStore();

  const rocks = useMemo(() => {
    const rand = mulberry32(20260731);
    const arr: {
      pos: THREE.Vector3;
      scale: number;
      rot: [number, number, number];
    }[] = [];
    for (let i = 0; i < count; i++) {
      const a = rand() * Math.PI * 2;
      const r = innerRadius + rand() * (outerRadius - innerRadius);
      arr.push({
        pos: new THREE.Vector3(Math.cos(a) * r, (rand() - 0.5) * 0.9, Math.sin(a) * r),
        scale: 0.5 + rand() * 1.8,
        rot: [rand() * Math.PI, rand() * Math.PI, rand() * Math.PI],
      });
    }
    return arr;
  }, [count, innerRadius, outerRadius]);

  useLayoutEffect(() => {
    const m = mesh.current;
    if (!m) return;
    rocks.forEach((rock, i) => {
      dummy.position.copy(rock.pos);
      dummy.scale.setScalar(rock.scale);
      dummy.rotation.set(rock.rot[0], rock.rot[1], rock.rot[2]);
      dummy.updateMatrix();
      m.setMatrixAt(i, dummy.matrix);
    });
    m.instanceMatrix.needsUpdate = true;
  }, [rocks, dummy]);

  useFrame((_, delta) => {
    if (group.current) group.current.rotation.y += delta * 0.008 * (paused ? 0 : timeScale);
  });

  return (
    <group ref={group} rotation={[0.25, 0, 0]}>
      <instancedMesh ref={mesh} args={[undefined, undefined, count]}>
        <dodecahedronGeometry args={[0.06, 0]} />
        <meshStandardMaterial color="#8d8374" roughness={1} metalness={0.05} />
      </instancedMesh>
    </group>
  );
};

const Comet = ({ phase = 0, speed = 0.055 }: { phase?: number; speed?: number }) => {
  const group = useRef<THREE.Group>(null);
  const { paused, timeScale } = usePortfolioStore();

  useFrame((state) => {
    if (group.current) {
      const t = state.clock.elapsedTime * speed * (paused ? 0 : timeScale) + phase;
      const x = Math.cos(t) * 17;
      const z = Math.sin(t) * 11;
      const y = Math.sin(t * 2) * 2.5 + 1;
      group.current.position.set(x, y, z);
      const vx = -Math.sin(t) * 17;
      const vz = Math.cos(t) * 11;
      group.current.lookAt(x + vx, y, z + vz);
    }
  });

  return (
    <group ref={group}>
      <mesh>
        <sphereGeometry args={[0.1, 16, 16]} />
        <meshBasicMaterial color="#ffffff" toneMapped={false} />
      </mesh>
      <mesh>
        <sphereGeometry args={[0.26, 16, 16]} />
        <meshBasicMaterial
          color="#9be8ff"
          transparent
          opacity={0.4}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
          toneMapped={false}
        />
      </mesh>
      <mesh position={[0, 0, -2.2]} rotation={[-Math.PI / 2, 0, 0]}>
        <coneGeometry args={[0.16, 4.5, 12, 1, true]} />
        <meshBasicMaterial
          color="#7dd3fc"
          transparent
          opacity={0.5}
          side={THREE.DoubleSide}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
          toneMapped={false}
        />
      </mesh>
      <pointLight intensity={2} distance={10} color="#bfe9ff" />
    </group>
  );
};

const PlanetMesh = ({
  data,
  hovered,
}: {
  data: (typeof PLANETS)[0];
  hovered: boolean;
}) => {
  const config = PLANET_RENDER[data.id] ?? { kind: "gas" as PlanetKind, seed: 1 };
  const planetRef = useRef<THREE.Group>(null);
  const cloudRef = useRef<THREE.Mesh>(null);
  const { paused, timeScale } = usePortfolioStore();

  const textures = useMemo(() => {
    const t: {
      map: THREE.CanvasTexture;
      emissiveMap?: THREE.CanvasTexture;
      cloud?: THREE.CanvasTexture;
      rings?: THREE.CanvasTexture;
    } = { map: createGasTexture(data.color, config.seed) };

    if (config.kind === "terrestrial") {
      t.map = createTerrestrialTexture(data.color, config.seed);
    } else if (config.kind === "volcanic") {
      const v = createVolcanicTextures(data.color, config.seed);
      t.map = v.map;
      t.emissiveMap = v.emissiveMap;
    }
    if (config.clouds) t.cloud = createCloudTexture(config.seed + 5);
    if (config.rings) t.rings = createRingTexture(data.color, config.seed);
    return t;
  }, [data.color, config.seed, config.kind, config.clouds, config.rings]);

  useFrame((_, delta) => {
    const d = paused ? 0 : delta * timeScale;
    if (planetRef.current) planetRef.current.rotation.y += d * 0.06;
    if (cloudRef.current) cloudRef.current.rotation.y += d * 0.09;
  });

  return (
    <group scale={[data.size, data.size, data.size]}>
      <group ref={planetRef}>
        <mesh>
          <sphereGeometry args={[1, 48, 48]} />
          <meshStandardMaterial
            map={textures.map}
            emissiveMap={textures.emissiveMap}
            emissive={config.kind === "volcanic" ? "#ffffff" : data.color}
            emissiveIntensity={config.kind === "volcanic" ? 1.1 : hovered ? 0.5 : 0.15}
            roughness={0.9}
            metalness={0.04}
          />
        </mesh>

        {textures.cloud && (
          <mesh ref={cloudRef}>
            <sphereGeometry args={[1.035, 48, 48]} />
            <meshStandardMaterial
              color="#ffffff"
              alphaMap={textures.cloud}
              transparent
              opacity={0.8}
              depthWrite={false}
            />
          </mesh>
        )}

        {textures.rings && (
          <mesh rotation={[-Math.PI / 2 + 0.45, 0, 0]}>
            <ringGeometry args={[1.4, 2.0, 128]} />
            <meshBasicMaterial
              map={textures.rings}
              transparent
              side={THREE.DoubleSide}
              depthWrite={false}
            />
          </mesh>
        )}
      </group>
    </group>
  );
};

const Planet = ({
  data,
  onClick,
}: {
  data: (typeof PLANETS)[0];
  onClick: (id: string) => void;
}) => {
  const { paused, timeScale, sandboxMode, weapon, explosions, spawnProjectile } = usePortfolioStore();
  const [hovered, setHovered] = useState(false);
  const angleRef = useRef(Math.random() * Math.PI * 2);
  const outerRef = useRef<THREE.Group>(null);
  const exploded = !!explosions[data.id];
  const moons = PLANET_MOONS[data.id];

  useEffect(() => {
    if (!planetPositionsRef.current[data.id]) {
      planetPositionsRef.current[data.id] = new THREE.Vector3();
    }
    const x = Math.cos(angleRef.current) * data.distance;
    const z = Math.sin(angleRef.current) * data.distance;
    planetPositionsRef.current[data.id].set(x, 0, z);
  }, [data.id, data.distance]);

  useFrame((_, delta) => {
    if (!outerRef.current) return;
    angleRef.current += (paused ? 0 : delta * timeScale) * data.speed;
    const x = Math.cos(angleRef.current) * data.distance;
    const z = Math.sin(angleRef.current) * data.distance;
    outerRef.current.position.set(x, 0, z);
    if (planetPositionsRef.current[data.id]) {
      planetPositionsRef.current[data.id].set(x, 0, z);
    }
  });

  const handleClick = (e: { stopPropagation: () => void }) => {
    e.stopPropagation();
    if (exploded) return;
    if (sandboxMode) {
      spawnProjectile(weapon, data.id);
    } else {
      onClick(data.id);
    }
  };

  return (
    <group ref={outerRef}>
      {!exploded && (
        <>
          <Float speed={2} rotationIntensity={0.3} floatIntensity={0.5}>
            <mesh
              onClick={handleClick}
              onPointerOver={() => setHovered(true)}
              onPointerOut={() => setHovered(false)}
              scale={hovered ? [1.15, 1.15, 1.15] : [1, 1, 1]}
            >
              <PlanetMesh data={data} hovered={hovered} />
            </mesh>
          </Float>

          <PlanetGlow color={data.color} size={data.size * 2.6} />

          {moons && (
            <Moons
              color={moons.color}
              orbit={moons.orbit * data.size}
              count={moons.count}
              speed={moons.speed}
            />
          )}

          {/* Planet label */}
          <Billboard position={[0, data.size + 0.7, 0]}>
            <Text
              fontSize={0.35}
              color={hovered ? "#ffffff" : data.color}
              anchorX="center"
              anchorY="middle"
              outlineWidth={0.02}
              outlineColor="#000000"
              letterSpacing={0.08}
            >
              {data.name}
            </Text>
          </Billboard>

          {/* Sandbox target hint */}
          {hovered && sandboxMode && (
            <Billboard position={[0, data.size - 0.9, 0]}>
              <Text
                fontSize={0.18}
                color="#f472b6"
                anchorX="center"
                anchorY="middle"
                outlineWidth={0.012}
                outlineColor="#000000"
                letterSpacing={0.08}
              >
                TARGET · {weapon.toUpperCase()}
              </Text>
            </Billboard>
          )}

          {/* Glow ring on hover */}
          {hovered && (
            <mesh rotation={[Math.PI / 2, 0, 0]}>
              <ringGeometry args={[data.size + 0.2, data.size + 0.35, 64]} />
              <meshBasicMaterial color={data.color} opacity={0.4} transparent side={THREE.DoubleSide} />
            </mesh>
          )}
        </>
      )}
    </group>
  );
};

const CameraRig = () => {
  const camera = useThree((s) => s.camera) as THREE.Camera;
  const controls = useThree((s) => s.controls) as unknown as {
    enabled: boolean;
    target: THREE.Vector3;
    update: () => void;
  } | null;

  const { flyToPlanet, setFlyToPlanet, setActivePlanet, flyBackHome, setFlyBackHome, pilotMode } =
    usePortfolioStore();
  const arrivedRef = useRef(false);
  const flightStartRef = useRef(0);

  useEffect(() => {
    arrivedRef.current = false;
    if (flyToPlanet || flyBackHome) {
      flightStartRef.current = Date.now();
    }
  }, [flyToPlanet, flyBackHome]);

  useFrame((_, delta) => {
    if (pilotMode) return;
    const forceArrive = Date.now() - flightStartRef.current > FLIGHT_TIMEOUT_MS;

    if (flyToPlanet) {
      const pos = planetPositionsRef.current[flyToPlanet];
      const planet = PLANETS.find((p) => p.id === flyToPlanet);
      if (pos && planet) {
        const outward = pos.clone().normalize();
        const target = pos.clone().add(outward.multiplyScalar(planet.size + 2));
        target.y += 0.8;

        const t = 1 - Math.pow(0.003, delta);
        camera.position.lerp(target, t);
        camera.lookAt(pos);

        if (controls) {
          controls.enabled = false;
          controls.target.copy(pos);
          controls.update();
        }

        if (!arrivedRef.current && (camera.position.distanceTo(target) < 0.4 || forceArrive)) {
          arrivedRef.current = true;
          setFlyToPlanet(null);
          setActivePlanet(flyToPlanet);
        }
      } else if (forceArrive) {
        arrivedRef.current = true;
        setFlyToPlanet(null);
        setActivePlanet(flyToPlanet);
      }
      return;
    }

    if (flyBackHome) {
      const t = 1 - Math.pow(0.003, delta);
      camera.position.lerp(HOME_POSITION, t);
      camera.lookAt(0, 0, 0);

      if (controls) {
        controls.enabled = false;
        controls.target.set(0, 0, 0);
        controls.update();
      }

      if (!arrivedRef.current && (camera.position.distanceTo(HOME_POSITION) < 0.4 || forceArrive)) {
        arrivedRef.current = true;
        setFlyBackHome(false);
      }
      return;
    }

    if (controls && !controls.enabled) {
      controls.enabled = true;
      controls.update();
    }
  });

  return null;
};

const Scene = () => {
  const { setFlyToPlanet, flyToPlanet, flyBackHome, activePlanet, pilotMode } = usePortfolioStore();

  const handleSelect = (id: string) => {
    if (flyToPlanet || flyBackHome || activePlanet || pilotMode) return;
    setFlyToPlanet(id);
  };

  return (
    <>
      <ambientLight intensity={0.22} />
      <directionalLight position={[10, 12, 6]} intensity={1.3} color="#fff3df" />

      <Stars radius={100} depth={60} count={4500} factor={4} saturation={0.2} fade speed={0.4} />

      <Nebula />
      <SpaceDust />

      <Sun />

      {PLANETS.map((planet) => (
        <group key={planet.id}>
          <OrbitRing radius={planet.distance} color={planet.color} />
          <Planet data={planet} onClick={handleSelect} />
        </group>
      ))}

      <AsteroidBelt innerRadius={6.3} outerRadius={7.0} />
      <AsteroidBelt innerRadius={17.4} outerRadius={18.2} count={280} />

      <Comet />
      <Comet phase={Math.PI * 1.4} speed={0.09} />

      <Projectiles />
      <ExplosionField />

      {pilotMode && <Spaceship />}

      <OrbitControls
        makeDefault
        minDistance={8}
        maxDistance={45}
        enablePan={false}
        autoRotate
        autoRotateSpeed={0.3}
        maxPolarAngle={Math.PI / 2.2}
        minPolarAngle={Math.PI / 4}
      />
    </>
  );
};

const WarpOverlay = () => {
  const { flyToPlanet, flyBackHome } = usePortfolioStore();
  const target = PLANETS.find((p) => p.id === flyToPlanet);

  return (
    <AnimatePresence>
      {(flyToPlanet || flyBackHome) && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          className="absolute inset-0 z-10 flex items-center justify-center overflow-hidden pointer-events-none"
        >
          <div
            className="absolute inset-0"
            style={{
              background:
                "radial-gradient(circle, rgba(34,211,238,0.06) 0%, rgba(34,211,238,0.12) 35%, rgba(2,6,23,0.8) 100%)",
            }}
          />

          <div className="absolute inset-0 animate-warp-lines" />

          <div
            className="absolute w-40 h-40 rounded-full border-2 border-cyan-400/50 animate-warp-ring"
            style={{ left: "50%", top: "50%", marginLeft: -80, marginTop: -80 }}
          />
          <div
            className="absolute w-28 h-28 rounded-full border border-cyan-400/30 animate-warp-ring"
            style={{ left: "50%", top: "50%", marginLeft: -56, marginTop: -56, animationDelay: "0.35s" }}
          />
          <div
            className="absolute w-16 h-16 rounded-full border border-cyan-300/40 animate-warp-ring"
            style={{ left: "50%", top: "50%", marginLeft: -32, marginTop: -32, animationDelay: "0.7s" }}
          />

          <div className="relative text-center px-6">
            <p className="font-mono text-2xl md:text-3xl text-cyan-300 tracking-[0.4em] drop-shadow-[0_0_15px_rgba(34,211,238,0.6)]">
              HYPERSPACE WARP
            </p>
            <p className="font-mono text-sm md:text-base text-cyan-500/80 mt-3 tracking-widest">
              {flyToPlanet ? `TRAVELING TO ${target?.name} ...` : "RETURNING TO SOLAR SYSTEM ..."}
            </p>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default function Workspace() {
  const { activePlanet } = usePortfolioStore();

  return (
    <div
      className={`fixed inset-0 z-0 transition-opacity duration-700 ${
        activePlanet ? "opacity-0 pointer-events-none" : "opacity-100"
      }`}
    >
      <div className="absolute inset-0 bg-gradient-to-br from-[#020617] via-[#0a0f1e] to-[#020617]" />

      <div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full opacity-20"
        style={{
          background: "radial-gradient(circle, rgba(255,165,0,0.3) 0%, transparent 70%)",
        }}
      />

      <Canvas camera={{ position: [0, 12, 22], fov: 55 }} gl={{ antialias: true, alpha: true }}>
        <Scene />
        <CameraRig />
      </Canvas>

      <WarpOverlay />
    </div>
  );
}
