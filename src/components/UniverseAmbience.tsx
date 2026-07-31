"use client";

import { useFrame } from "@react-three/fiber";
import { useMemo, useRef } from "react";
import * as THREE from "three";
import { mulberry32 } from "@/lib/planetTextures";
import { usePortfolioStore } from "@/store/usePortfolioStore";

export function makeRadialTexture(color: string, inner = "#ffffff", size = 256): THREE.CanvasTexture {
  const canvas = document.createElement("canvas");
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext("2d")!;
  const g = ctx.createRadialGradient(size / 2, size / 2, 0, size / 2, size / 2, size / 2);
  g.addColorStop(0, inner);
  g.addColorStop(0.18, color);
  g.addColorStop(1, "rgba(0,0,0,0)");
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, size, size);
  const tex = new THREE.CanvasTexture(canvas);
  tex.colorSpace = THREE.SRGBColorSpace;
  return tex;
}

export const Nebula = () => {
  const group = useRef<THREE.Group>(null);
  const sprites = useMemo(() => {
    const defs = [
      { color: "#7c3aed", pos: [-9, 3, -34], scale: 46, opacity: 0.3 },
      { color: "#0ea5e9", pos: [8, 6, -36], scale: 52, opacity: 0.24 },
      { color: "#ec4899", pos: [0, -4, -38], scale: 44, opacity: 0.2 },
      { color: "#f59e0b", pos: [18, 2, -30], scale: 38, opacity: 0.16 },
    ];
    return defs.map((d) => ({
      ...d,
      tex: makeRadialTexture(d.color),
    }));
  }, []);

  useFrame((state) => {
    if (group.current) {
      group.current.rotation.y = state.clock.elapsedTime * 0.004;
      group.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.01) * 0.05;
    }
  });

  return (
    <group ref={group}>
      {sprites.map((s, i) => (
        <sprite key={i} position={[s.pos[0], s.pos[1], s.pos[2]]} scale={[s.scale, s.scale, 1]}>
          <spriteMaterial
            map={s.tex}
            transparent
            opacity={s.opacity}
            blending={THREE.AdditiveBlending}
            depthWrite={false}
          />
        </sprite>
      ))}
    </group>
  );
};

export const PlanetGlow = ({ color, size }: { color: string; size: number }) => {
  const tex = useMemo(() => makeRadialTexture(color, "#ffffff", 128), [color]);
  return (
    <sprite scale={[size, size, 1]}>
      <spriteMaterial
        map={tex}
        transparent
        opacity={0.4}
        blending={THREE.AdditiveBlending}
        depthWrite={false}
      />
    </sprite>
  );
};

const Moon = ({
  orbit,
  speed,
  phase,
  tilt,
  color,
  size,
}: {
  orbit: number;
  speed: number;
  phase: number;
  tilt: number;
  color: string;
  size: number;
}) => {
  const ref = useRef<THREE.Mesh>(null);
  const angleRef = useRef(phase);
  const { paused, timeScale } = usePortfolioStore();

  useFrame((_, delta) => {
    if (!ref.current) return;
    angleRef.current += (paused ? 0 : delta * timeScale) * speed;
    const a = angleRef.current;
    ref.current.position.set(Math.cos(a) * orbit, Math.sin(a * 1.7 + phase) * tilt, Math.sin(a) * orbit);
  });

  return (
    <mesh ref={ref}>
      <sphereGeometry args={[size, 12, 12]} />
      <meshStandardMaterial color={color} emissive={color} emissiveIntensity={0.5} roughness={0.6} />
    </mesh>
  );
};

export const Moons = ({
  color,
  orbit,
  count = 2,
  speed = 0.6,
  tilt = 0.3,
  size = 0.07,
}: {
  color: string;
  orbit: number;
  count?: number;
  speed?: number;
  tilt?: number;
  size?: number;
}) => (
  <group>
    {Array.from({ length: count }).map((_, i) => (
      <Moon
        key={i}
        orbit={orbit * (0.9 + i * 0.2)}
        speed={speed * (1 - i * 0.15)}
        phase={(i / count) * Math.PI * 2}
        tilt={tilt}
        color={color}
        size={size * (i % 2 === 0 ? 1 : 0.7)}
      />
    ))}
  </group>
);

export const SpaceDust = () => {
  const positions = useMemo(() => {
    const rand = mulberry32(99123);
    const arr: number[] = [];
    for (let i = 0; i < 900; i++) {
      const a = rand() * Math.PI * 2;
      const r = 18 + rand() * 26;
      arr.push(Math.cos(a) * r, -12 + rand() * 26, Math.sin(a) * r);
    }
    return new Float32Array(arr);
  }, []);

  const ref = useRef<THREE.Points>(null);
  useFrame((state) => {
    if (ref.current) ref.current.rotation.y = state.clock.elapsedTime * 0.006;
  });

  return (
    <points ref={ref}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
      </bufferGeometry>
      <pointsMaterial size={0.045} color="#93b4d8" transparent opacity={0.55} sizeAttenuation depthWrite={false} />
    </points>
  );
};
