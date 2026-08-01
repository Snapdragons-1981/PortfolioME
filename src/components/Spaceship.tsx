"use client";

import { useFrame, useThree } from "@react-three/fiber";
import { useCallback, useEffect, useMemo, useRef } from "react";
import * as THREE from "three";
import { toast } from "sonner";
import { PLANETS, usePortfolioStore } from "@/store/usePortfolioStore";
import { planetPositionsRef, shipTelemetry } from "@/lib/worldRefs";

const CHASE_OFFSET = new THREE.Vector3(0, 1.7, 4.6);
const WORLD_RADIUS = 44;
const MAX_SPEED = 30;
const PREVENT_KEYS = new Set(["w", "a", "s", "d", " ", "control", "shift"]);

const clamp = (v: number, min: number, max: number) => Math.max(min, Math.min(max, v));

export default function Spaceship() {
  const camera = useThree((s) => s.camera) as THREE.PerspectiveCamera;
  const controls = useThree((s) => s.controls) as unknown as { enabled: boolean } | null;

  const shipRef = useRef<THREE.Group>(null);
  const exhaustRef = useRef<THREE.Mesh>(null);
  const flameRef = useRef<THREE.Mesh>(null);
  const lightRef = useRef<THREE.PointLight>(null);

  const keysRef = useRef<Record<string, boolean>>({});
  const cursorRef = useRef<{ x: number; y: number }>({ x: 0, y: 0 });
  const yawRef = useRef(0);
  const pitchRef = useRef(0);
  const bankRef = useRef(0);
  const velocityRef = useRef(new THREE.Vector3());
  const boostRef = useRef(0);

  const forwardVector = useMemo(() => new THREE.Vector3(), []);
  const tmpOffset = useMemo(() => new THREE.Vector3(), []);
  const tmpEuler = useMemo(() => new THREE.Euler(0, 0, 0, "YXZ"), []);
  const tmpQuat = useMemo(() => new THREE.Quaternion(), []);

  const dock = useCallback(() => {
    if (!shipTelemetry.dockReady || !shipTelemetry.nearestPlanet) return;
    const id = shipTelemetry.nearestPlanet;
    const planet = PLANETS.find((p) => p.id === id);
    usePortfolioStore.getState().setActivePlanet(id);
    usePortfolioStore.getState().setPilotMode(false);
    toast(`DOCKED AT ${planet?.name}`, {
      description: "Entering the planetary sector...",
    });
  }, []);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const state = usePortfolioStore.getState();
      if (state.showTerminal || state.activePlanet) return;
      const key = e.key.toLowerCase();
      if (PREVENT_KEYS.has(key)) e.preventDefault();
      if (key === "f") dock();
      keysRef.current[key] = true;
    };
    const handleKeyUp = (e: KeyboardEvent) => {
      keysRef.current[e.key.toLowerCase()] = false;
    };
    const handleMouseMove = (e: MouseEvent) => {
      cursorRef.current.x = (e.clientX / window.innerWidth) * 2 - 1;
      cursorRef.current.y = (e.clientY / window.innerHeight) * 2 - 1;
    };
    const handleBlur = () => {
      keysRef.current = {};
    };

    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("keyup", handleKeyUp);
    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("blur", handleBlur);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("keyup", handleKeyUp);
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("blur", handleBlur);
    };
  }, [dock]);

  useEffect(() => {
    const ship = shipRef.current;
    if (!ship) return;

    ship.position.copy(camera.position);
    ship.rotation.order = "YXZ";

    const toOrigin = ship.position.clone().multiplyScalar(-1);
    yawRef.current = Math.atan2(toOrigin.x, toOrigin.z);
    pitchRef.current = 0;
    bankRef.current = 0;
    velocityRef.current.set(0, 0, 0);
    shipTelemetry.speed = 0;
    shipTelemetry.nearestPlanet = null;
    shipTelemetry.nearestDistance = Infinity;
    shipTelemetry.dockReady = false;

    if (controls) controls.enabled = false;
  }, [camera, controls]);

  useEffect(() => {
    return () => {
      shipTelemetry.speed = 0;
      shipTelemetry.nearestPlanet = null;
      shipTelemetry.nearestDistance = Infinity;
      shipTelemetry.dockReady = false;
      if (controls) controls.enabled = true;
    };
  }, [controls]);

  useFrame((_, delta) => {
    const ship = shipRef.current;
    if (!ship) return;
    const dt = Math.min(delta, 0.05);
    const keys = keysRef.current;

    const boost = keys.shift ? 1 : 0;
    boostRef.current += (boost - boostRef.current) * Math.min(1, 6 * dt);

    const steerYaw = cursorRef.current.x * 0.9;
    const steerPitch = -cursorRef.current.y * 0.55;
    yawRef.current += (steerYaw - yawRef.current) * Math.min(1, 5 * dt);
    pitchRef.current += (steerPitch - pitchRef.current) * Math.min(1, 5 * dt);

    const rollInput = (keys.a ? 1 : 0) - (keys.d ? 1 : 0);
    const rollTarget = clamp(-cursorRef.current.x * 0.5 + rollInput * 0.6, -0.85, 0.85);
    bankRef.current += (rollTarget - bankRef.current) * Math.min(1, 6 * dt);

    forwardVector.set(
      -Math.sin(yawRef.current),
      Math.cos(yawRef.current) * Math.sin(pitchRef.current),
      -Math.cos(yawRef.current) * Math.cos(pitchRef.current),
    );

    const throttle = (keys.w ? 1 : 0) - (keys.s ? 1 : 0);
    const velocity = velocityRef.current;
    const accel = 18 * (1 + boostRef.current * 2.2);
    velocity.addScaledVector(forwardVector, throttle * accel * dt);
    velocity.y += ((keys[" "] ? 1 : 0) - (keys.control ? 1 : 0)) * 15 * dt;
    velocity.multiplyScalar(Math.exp(-1.4 * dt));
    if (velocity.length() > MAX_SPEED * (1 + boostRef.current * 0.35)) {
      velocity.setLength(MAX_SPEED * (1 + boostRef.current * 0.35));
    }

    const pos = ship.position;
    pos.addScaledVector(velocity, dt);
    const radius = pos.length();
    if (radius > WORLD_RADIUS) {
      const dir = pos.clone().normalize();
      pos.copy(dir.multiplyScalar(WORLD_RADIUS));
      const radial = velocity.dot(dir);
      if (radial > 0) velocity.addScaledVector(dir, -radial);
    }

    ship.rotation.set(pitchRef.current, yawRef.current, bankRef.current);
    ship.quaternion.setFromEuler(ship.rotation);

    const speed = velocity.length();
    shipTelemetry.speed = speed;

    let nearest: string | null = null;
    let nearestDist = Infinity;
    for (const planet of PLANETS) {
      const planetPos = planetPositionsRef.current[planet.id];
      if (!planetPos) continue;
      const dist = pos.distanceTo(planetPos);
      if (dist < nearestDist) {
        nearestDist = dist;
        nearest = planet.id;
      }
    }
    shipTelemetry.nearestPlanet = nearest;
    shipTelemetry.nearestDistance = nearestDist;
    const planet = nearest ? PLANETS.find((p) => p.id === nearest) : null;
    shipTelemetry.dockReady = !!planet && nearestDist < planet.size * 2.0 + 1.7;

    tmpEuler.set(pitchRef.current, yawRef.current, 0);
    tmpQuat.setFromEuler(tmpEuler);
    tmpOffset.copy(CHASE_OFFSET).applyQuaternion(tmpQuat);
    camera.position.lerp(tmpOffset.add(pos), 1 - Math.exp(-4 * dt));
    camera.lookAt(pos);

    const speedNorm = clamp(speed / MAX_SPEED, 0, 1);
    camera.fov += (55 + speedNorm * 16 - camera.fov) * Math.min(1, 4 * dt);
    camera.updateProjectionMatrix();

    if (exhaustRef.current) {
      exhaustRef.current.scale.set(1, 1, 0.8 + speedNorm * 2.4 + Math.random() * 0.35);
    }
    if (flameRef.current) {
      flameRef.current.scale.set(1, 1, 0.55 + speedNorm * 1.8 + Math.random() * 0.3);
    }
    if (lightRef.current) {
      lightRef.current.intensity = 4 + speedNorm * 14 + Math.random() * 2;
    }
  });

  return (
    <group ref={shipRef}>
      {/* Nose */}
      <mesh position={[0, 0, -1.15]} rotation={[-Math.PI / 2, 0, 0]}>
        <coneGeometry args={[0.3, 1.9, 12]} />
        <meshStandardMaterial color="#e2e8f0" metalness={0.75} roughness={0.25} />
      </mesh>

      {/* Fuselage */}
      <mesh position={[0, 0, 0.1]} rotation={[Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[0.3, 0.52, 2.2, 12]} />
        <meshStandardMaterial color="#94a3b8" metalness={0.85} roughness={0.3} />
      </mesh>

      {/* Cockpit */}
      <mesh position={[0, 0.3, -0.45]} scale={[1, 0.6, 1.7]}>
        <sphereGeometry args={[0.28, 16, 16]} />
        <meshStandardMaterial
          color="#0e7490"
          emissive="#22d3ee"
          emissiveIntensity={0.5}
          metalness={0.6}
          roughness={0.15}
        />
      </mesh>

      {/* Wings */}
      <mesh position={[-0.95, -0.12, 0.4]} rotation={[0, 0, 0.35]}>
        <boxGeometry args={[1.4, 0.07, 1.15]} />
        <meshStandardMaterial color="#cbd5e1" metalness={0.8} roughness={0.3} />
      </mesh>
      <mesh position={[0.95, -0.12, 0.4]} rotation={[0, 0, -0.35]}>
        <boxGeometry args={[1.4, 0.07, 1.15]} />
        <meshStandardMaterial color="#cbd5e1" metalness={0.8} roughness={0.3} />
      </mesh>

      {/* Wing tips */}
      <mesh position={[-1.6, -0.32, 0.5]} rotation={[0, 0, 0.5]}>
        <boxGeometry args={[0.45, 0.06, 1.3]} />
        <meshStandardMaterial color="#f97316" emissive="#fb923c" emissiveIntensity={0.7} />
      </mesh>
      <mesh position={[1.6, -0.32, 0.5]} rotation={[0, 0, -0.5]}>
        <boxGeometry args={[0.45, 0.06, 1.3]} />
        <meshStandardMaterial color="#f97316" emissive="#fb923c" emissiveIntensity={0.7} />
      </mesh>

      {/* Tail fins */}
      <mesh position={[-0.18, 0.42, 0.9]} rotation={[0.15, 0, 0.18]}>
        <boxGeometry args={[0.07, 0.62, 0.6]} />
        <meshStandardMaterial color="#f87171" metalness={0.6} roughness={0.3} />
      </mesh>
      <mesh position={[0.18, 0.42, 0.9]} rotation={[0.15, 0, -0.18]}>
        <boxGeometry args={[0.07, 0.62, 0.6]} />
        <meshStandardMaterial color="#f87171" metalness={0.6} roughness={0.3} />
      </mesh>

      {/* Engine housings */}
      <mesh position={[-0.35, -0.05, 1.15]} rotation={[Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[0.16, 0.22, 0.7, 10]} />
        <meshStandardMaterial color="#64748b" metalness={0.9} roughness={0.25} />
      </mesh>
      <mesh position={[0.35, -0.05, 1.15]} rotation={[Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[0.16, 0.22, 0.7, 10]} />
        <meshStandardMaterial color="#64748b" metalness={0.9} roughness={0.25} />
      </mesh>

      {/* Engine flames */}
      <mesh ref={exhaustRef} position={[0, -0.05, 1.55]} rotation={[Math.PI / 2, 0, 0]}>
        <coneGeometry args={[0.16, 0.8, 8]} />
        <meshBasicMaterial
          color="#67e8f9"
          transparent
          opacity={0.85}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
          toneMapped={false}
        />
      </mesh>
      <mesh ref={flameRef} position={[0, -0.05, 1.45]} rotation={[Math.PI / 2, 0, 0]}>
        <coneGeometry args={[0.09, 0.55, 8]} />
        <meshBasicMaterial
          color="#fbbf24"
          transparent
          opacity={0.9}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
          toneMapped={false}
        />
      </mesh>

      <pointLight ref={lightRef} position={[0, -0.05, 1.5]} intensity={5} distance={14} color="#67e8f9" />
    </group>
  );
}
