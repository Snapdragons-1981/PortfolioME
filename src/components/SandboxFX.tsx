"use client";

import { useFrame } from "@react-three/fiber";
import { useMemo, useRef, useState } from "react";
import * as THREE from "three";
import { mulberry32 } from "@/lib/planetTextures";
import { planetPositionsRef } from "@/lib/worldRefs";
import { PLANETS, usePortfolioStore, type Projectile, type WeaponId } from "@/store/usePortfolioStore";
import { makeRadialTexture } from "./UniverseAmbience";

const WEAPON_CONFIG: Record<WeaponId, { speed: number; debris: number; fireball: number; shockwave: number; color: string; size: number }> = {
  asteroid: { speed: 7, debris: 70, fireball: 1, shockwave: 1, color: "#d6b98a", size: 0.35 },
  laser: { speed: 26, debris: 150, fireball: 1.8, shockwave: 1.3, color: "#4ade80", size: 0.5 },
  nuke: { speed: 12, debris: 240, fireball: 2.6, shockwave: 1.8, color: "#fbbf24", size: 0.7 },
  firework: { speed: 14, debris: 0, fireball: 0.4, shockwave: 0, color: "#f472b6", size: 0.3 },
};

const FlightProjectile = ({
  p,
  onFireworkBurst,
}: {
  p: Projectile;
  onFireworkBurst: (pos: THREE.Vector3, color: string) => void;
}) => {
  const groupRef = useRef<THREE.Group>(null);
  const doneRef = useRef(false);
  const { paused, timeScale, removeProjectile, explodePlanet } = usePortfolioStore();
  const cfg = WEAPON_CONFIG[p.type];

  const spawn = useMemo(() => {
    const target = planetPositionsRef.current[p.targetId];
    const rand = mulberry32(p.id.split("").reduce((a, c) => a + c.charCodeAt(0), 0));
    const dir = rand() * Math.PI * 2;
    const dist = 14 + rand() * 6;
    const height = 6 + rand() * 8;
    return new THREE.Vector3(
      (target?.x ?? 0) + Math.cos(dir) * dist,
      (target?.y ?? 0) + height,
      (target?.z ?? 0) + Math.sin(dir) * dist
    );
  }, [p]);

  const glowTex = useMemo(() => makeRadialTexture(cfg.color, "#ffffff", 128), [cfg.color]);

  useFrame((_, delta) => {
    if (doneRef.current || !groupRef.current) return;
    const target = planetPositionsRef.current[p.targetId];
    if (!target) return;

    if (p.type === "firework") {
      const apex = target.clone().add(new THREE.Vector3(0, 3.5, 0));
      const dist = groupRef.current.position.distanceTo(apex);
      if (dist < 0.6) {
        doneRef.current = true;
        onFireworkBurst(apex, cfg.color);
        removeProjectile(p.id);
        return;
      }
      groupRef.current.position.addScaledVector(apex.sub(groupRef.current.position).normalize(), cfg.speed * (paused ? 0 : timeScale) * delta);
      return;
    }

    const dir = new THREE.Vector3().subVectors(target, groupRef.current.position);
    const dist = dir.length();
    if (dist < 0.6) {
      doneRef.current = true;
      removeProjectile(p.id);
      explodePlanet(p.targetId, p.type);
      return;
    }
    groupRef.current.position.addScaledVector(dir.normalize(), cfg.speed * (paused ? 0 : timeScale) * delta);
    groupRef.current.lookAt(target);
    groupRef.current.rotateOnAxis(new THREE.Vector3(0.4, 1, 0.2).normalize(), delta * 2.5);
  });

  return (
    <group ref={groupRef} position={spawn}>
      <mesh>
        <icosahedronGeometry args={[cfg.size, 0]} />
        <meshStandardMaterial color={cfg.color} emissive={p.type === "nuke" ? "#ff6b00" : "#000000"} emissiveIntensity={p.type === "nuke" ? 1.4 : 0} roughness={1} />
      </mesh>
      <mesh scale={1.4}>
        <dodecahedronGeometry args={[cfg.size, 0]} />
        <meshStandardMaterial color={cfg.color} roughness={1} wireframe />
      </mesh>
      <sprite scale={[cfg.size * 5, cfg.size * 5, 1]}>
        <spriteMaterial map={glowTex} transparent opacity={0.5} blending={THREE.AdditiveBlending} depthWrite={false} />
      </sprite>
    </group>
  );
};

const LaserStrike = ({ p }: { p: Projectile }) => {
  const groupRef = useRef<THREE.Group>(null);
  const beamRef = useRef<THREE.Mesh>(null);
  const coreRef = useRef<THREE.Mesh>(null);
  const flashRef = useRef<THREE.Sprite>(null);
  const doneRef = useRef(false);
  const tRef = useRef(0);
  const { removeProjectile, explodePlanet } = usePortfolioStore();
  const glowTex = useMemo(() => makeRadialTexture("#4ade80", "#eaffea", 128), []);

  useFrame((_, delta) => {
    if (doneRef.current) return;
    tRef.current += delta;
    const target = planetPositionsRef.current[p.targetId];
    if (groupRef.current && target) {
      groupRef.current.position.set(target.x, target.y, target.z);
    }
    const active = Math.min(tRef.current / 0.22, 1);
    const flicker = 0.65 + Math.sin(tRef.current * 55) * 0.35;
    const height = 34 * active;
    if (beamRef.current) {
      beamRef.current.scale.y = height;
      (beamRef.current.material as THREE.MeshBasicMaterial).opacity = 0.4 * active * flicker;
    }
    if (coreRef.current) {
      coreRef.current.scale.y = height;
      (coreRef.current.material as THREE.MeshBasicMaterial).opacity = 0.95 * active;
    }
    if (flashRef.current) {
      const f = Math.max(0, 1 - tRef.current / 0.7);
      flashRef.current.scale.setScalar(1.5 + (1 - f) * 4);
      (flashRef.current.material as THREE.SpriteMaterial).opacity = f * 0.85;
    }
    if (tRef.current >= 0.7) {
      doneRef.current = true;
      removeProjectile(p.id);
      explodePlanet(p.targetId, p.type);
    }
  });

  return (
    <group ref={groupRef}>
      <mesh ref={beamRef} position={[0, 17, 0]}>
        <cylinderGeometry args={[0.14, 0.5, 1, 16, 1, true]} />
        <meshBasicMaterial color="#4ade80" transparent opacity={0.4} blending={THREE.AdditiveBlending} depthWrite={false} side={THREE.DoubleSide} toneMapped={false} />
      </mesh>
      <mesh ref={coreRef} position={[0, 17, 0]}>
        <cylinderGeometry args={[0.035, 0.1, 1, 8, 1, true]} />
        <meshBasicMaterial color="#eaffea" transparent opacity={0.95} blending={THREE.AdditiveBlending} depthWrite={false} toneMapped={false} />
      </mesh>
      <sprite ref={flashRef} position={[0, 0, 0]} scale={[2, 2, 1]}>
        <spriteMaterial map={glowTex} transparent opacity={0.85} blending={THREE.AdditiveBlending} depthWrite={false} />
      </sprite>
    </group>
  );
};

export const Projectiles = () => {
  const { projectiles } = usePortfolioStore();
  const [bursts, setBursts] = useState<{ id: number; pos: THREE.Vector3; color: string }[]>([]);

  const handleFirework = (pos: THREE.Vector3, color: string) => {
    setBursts((b) => [...b, { id: Date.now() + Math.random(), pos: pos.clone(), color }]);
  };

  return (
    <group>
      {projectiles.map((p) =>
        p.type === "laser" ? <LaserStrike key={p.id} p={p} /> : <FlightProjectile key={p.id} p={p} onFireworkBurst={handleFirework} />
      )}
      {bursts.map((b) => (
        <FireworkBurst key={b.id} position={b.pos} color={b.color} onDone={() => setBursts((arr) => arr.filter((x) => x.id !== b.id))} />
      ))}
    </group>
  );
};

const FireworkBurst = ({ position, color, onDone }: { position: THREE.Vector3; color: string; onDone: () => void }) => {
  const pointsRef = useRef<THREE.Points>(null);
  const tRef = useRef(0);
  const { pos, vel, colors } = useMemo(() => {
    const rand = mulberry32(Math.floor(position.x * 1000));
    const pos: THREE.Vector3[] = [];
    const vel: THREE.Vector3[] = [];
    const palette = ["#f472b6", "#60a5fa", "#facc15", "#4ade80", "#ffffff", "#22d3ee", color];
    const colors: number[] = [];
    const rand2 = mulberry32(Math.floor(position.z * 1000));
    for (let i = 0; i < 120; i++) {
      const dir = new THREE.Vector3(rand() * 2 - 1, rand() * 2 - 1, rand() * 2 - 1).normalize();
      pos.push(new THREE.Vector3());
      vel.push(dir.multiplyScalar(1.2 + rand() * 2.6));
      const c = new THREE.Color(palette[Math.floor(rand2() * palette.length)]);
      colors.push(c.r, c.g, c.b);
    }
    return { pos, vel, colors };
  }, [position, color]);

  const geo = useMemo(() => {
    const g = new THREE.BufferGeometry();
    g.setAttribute("position", new THREE.Float32BufferAttribute(new Float32Array(120 * 3), 3));
    g.setAttribute("color", new THREE.Float32BufferAttribute(colors, 3));
    return g;
  }, [colors]);

  useFrame((_, delta) => {
    tRef.current += delta;
    const dt = Math.min(delta, 0.05);
    const attr = geo.getAttribute("position") as THREE.BufferAttribute;
    pos.forEach((p, i) => {
      p.addScaledVector(vel[i], dt);
      vel[i].multiplyScalar(1 - 0.35 * dt);
      attr.setXYZ(i, p.x, p.y, p.z);
    });
    attr.needsUpdate = true;
    if (pointsRef.current) {
      const mat = pointsRef.current.material as THREE.PointsMaterial;
      mat.opacity = Math.max(0, 1 - tRef.current / 2.6);
    }
    if (tRef.current >= 2.6) onDone();
  });

  return (
    <points ref={pointsRef} position={position} geometry={geo}>
      <pointsMaterial size={0.09} vertexColors transparent opacity={1} depthWrite={false} blending={THREE.AdditiveBlending} sizeAttenuation />
    </points>
  );
};

const Debris = ({ planetId, color, count }: { planetId: string; color: string; count: number }) => {
  const mesh = useRef<THREE.InstancedMesh>(null);
  const dummy = useMemo(() => new THREE.Object3D(), []);
  const elapsed = useRef(0);

  const data = useMemo(() => {
    const planet = PLANETS.find((x) => x.id === planetId);
    const size = planet?.size ?? 1;
    const center = planetPositionsRef.current[planetId]?.clone() ?? new THREE.Vector3();
    const rand = mulberry32(planetId.charCodeAt(0) * 131 + count);
    const arr: { pos: THREE.Vector3; vel: THREE.Vector3; scale: number; rot: THREE.Vector3; rvel: THREE.Vector3 }[] = [];
    for (let i = 0; i < count; i++) {
      const dir = new THREE.Vector3(rand() * 2 - 1, rand() * 2 - 1, rand() * 2 - 1).normalize();
      const r = size * (0.4 + rand() * 0.9);
      const speed = (0.9 + rand() * 1.8) * Math.sqrt(count / 130);
      arr.push({
        pos: center.clone().addScaledVector(dir, r),
        vel: dir.multiplyScalar(speed).add(new THREE.Vector3(0, rand() * 0.6, 0)),
        scale: (0.05 + rand() * 0.11) * size,
        rot: new THREE.Vector3(rand() * Math.PI, rand() * Math.PI, rand() * Math.PI),
        rvel: new THREE.Vector3(rand() * 5 - 2.5, rand() * 5 - 2.5, rand() * 5 - 2.5),
      });
    }
    return arr;
  }, [planetId, count]);

  useFrame((_, delta) => {
    elapsed.current += delta;
    const m = mesh.current;
    if (!m) return;
    const dt = Math.min(delta, 0.05);
    data.forEach((d, i) => {
      d.pos.addScaledVector(d.vel, dt);
      d.vel.multiplyScalar(1 - 0.25 * dt);
      d.rot.addScaledVector(d.rvel, dt);
      dummy.position.copy(d.pos);
      dummy.rotation.set(d.rot.x, d.rot.y, d.rot.z);
      dummy.scale.setScalar(d.scale);
      dummy.updateMatrix();
      m.setMatrixAt(i, dummy.matrix);
    });
    m.instanceMatrix.needsUpdate = true;
    const fade = Math.max(0, 1 - elapsed.current / 9);
    const emerge = Math.min(1, elapsed.current / 0.6);
    (m.material as THREE.MeshStandardMaterial).opacity = emerge * fade;
  });

  return (
    <instancedMesh ref={mesh} args={[undefined, undefined, count]}>
      <dodecahedronGeometry args={[1, 0]} />
      <meshStandardMaterial color={color} emissive={color} emissiveIntensity={0.25} roughness={0.8} transparent opacity={0} />
    </instancedMesh>
  );
};

const Shockwave = ({ planetId, color, power, delay = 0 }: { planetId: string; color: string; power: number; delay?: number }) => {
  const ref = useRef<THREE.Mesh>(null);
  const tRef = useRef(-delay);
  const pos = useMemo(() => planetPositionsRef.current[planetId]?.clone() ?? new THREE.Vector3(), [planetId]);

  useFrame((_, delta) => {
    tRef.current += delta;
    const t = tRef.current;
    if (t < 0 || !ref.current) return;
    const p = Math.min(t / 1.5, 1);
    const scale = 0.6 + p * 8 * power;
    ref.current.scale.set(scale, 1, scale);
    (ref.current.material as THREE.MeshBasicMaterial).opacity = (1 - p) * 0.85;
  });

  return (
    <mesh ref={ref} rotation={[-Math.PI / 2, 0, 0]} position={pos}>
      <ringGeometry args={[0.92, 1, 64]} />
      <meshBasicMaterial color={color} transparent opacity={0.85} side={THREE.DoubleSide} blending={THREE.AdditiveBlending} depthWrite={false} toneMapped={false} />
    </mesh>
  );
};

const Fireball = ({ planetId, color, size }: { planetId: string; color: string; size: number }) => {
  const glowRef = useRef<THREE.Sprite>(null);
  const coreRef = useRef<THREE.Mesh>(null);
  const tRef = useRef(0);
  const tex = useMemo(() => makeRadialTexture(color, "#ffffff", 256), [color]);
  const pos = useMemo(() => planetPositionsRef.current[planetId]?.clone() ?? new THREE.Vector3(), [planetId]);

  useFrame((_, delta) => {
    tRef.current += delta;
    const t = tRef.current;
    const p = Math.min(t / 1.6, 1);
    if (coreRef.current) {
      coreRef.current.scale.setScalar(size * (1 + p * 1.6) * (1 - p * 0.35));
      (coreRef.current.material as THREE.MeshBasicMaterial).opacity = Math.max(0, 1 - t / 1.5) * 0.95;
    }
    if (glowRef.current) {
      glowRef.current.scale.setScalar(size * 6 * (1 + p * 3));
      (glowRef.current.material as THREE.SpriteMaterial).opacity = Math.max(0, 1 - t / 2.2) * 0.9;
    }
  });

  return (
    <group position={pos}>
      <mesh ref={coreRef}>
        <sphereGeometry args={[size, 20, 20]} />
        <meshBasicMaterial color="#ffffff" transparent opacity={0.95} blending={THREE.AdditiveBlending} depthWrite={false} toneMapped={false} />
      </mesh>
      <sprite ref={glowRef} scale={[size * 4, size * 4, 1]}>
        <spriteMaterial map={tex} transparent opacity={0.9} blending={THREE.AdditiveBlending} depthWrite={false} />
      </sprite>
    </group>
  );
};

const ExplosionFX = ({ planetId, type }: { planetId: string; type: WeaponId }) => {
  const planet = PLANETS.find((p) => p.id === planetId);
  const color = planet?.color ?? "#ffffff";
  const cfg = WEAPON_CONFIG[type];

  return (
    <group>
      {cfg.debris > 0 && <Debris planetId={planetId} color={color} count={cfg.debris} />}
      {cfg.shockwave > 0 && (
        <>
          <Shockwave planetId={planetId} color={color} power={cfg.shockwave} />
          <Shockwave planetId={planetId} color="#ffffff" power={cfg.shockwave * 0.7} delay={0.18} />
        </>
      )}
      <Fireball planetId={planetId} color={color} size={cfg.fireball} />
    </group>
  );
};

export const ExplosionField = () => {
  const { explosions } = usePortfolioStore();
  return (
    <group>
      {Object.entries(explosions).map(([id, info]) => (
        <ExplosionFX key={id} planetId={id} type={info.type} />
      ))}
    </group>
  );
};
