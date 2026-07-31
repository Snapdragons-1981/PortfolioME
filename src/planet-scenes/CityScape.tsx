"use client";

import { useFrame } from "@react-three/fiber";
import { useMemo, useRef } from "react";
import * as THREE from "three";
import { mulberry32 } from "@/lib/planetTextures";

export function terrainHeight(x: number, z: number): number {
  const r = Math.hypot(x, z);
  if (r < 5.5) return 0;
  const t = Math.min((r - 5.5) / 13, 1);
  const roll = Math.sin(x * 0.28 + z * 0.19) * Math.cos(z * 0.33 - x * 0.12);
  const ridge = Math.abs(Math.sin(x * 0.41 + 1.7) * Math.cos(z * 0.37 + 0.6));
  return (roll * 0.9 + ridge * 0.5) * t * t;
}

export const Terrain = ({ color, y = -4, size = 46 }: { color: string; y?: number; size?: number }) => {
  const geometry = useMemo(() => {
    const seg = 80;
    const half = size / 2;
    const positions: number[] = [];
    const uvs: number[] = [];
    const indices: number[] = [];
    for (let j = 0; j <= seg; j++) {
      for (let i = 0; i <= seg; i++) {
        const x = -half + (i / seg) * size;
        const z = -half + (j / seg) * size;
        positions.push(x, terrainHeight(x, z), z);
        uvs.push(i / seg, j / seg);
      }
    }
    for (let j = 0; j < seg; j++) {
      for (let i = 0; i < seg; i++) {
        const a = j * (seg + 1) + i;
        const b = a + 1;
        const c = a + seg + 1;
        const d = c + 1;
        indices.push(a, c, b, b, c, d);
      }
    }
    const geo = new THREE.BufferGeometry();
    geo.setAttribute("position", new THREE.Float32BufferAttribute(positions, 3));
    geo.setAttribute("uv", new THREE.Float32BufferAttribute(uvs, 2));
    geo.setIndex(indices);
    geo.computeVertexNormals();
    return geo;
  }, [size]);

  return (
    <mesh geometry={geometry} position={[0, y, 0]} receiveShadow>
      <meshStandardMaterial color={color} roughness={1} metalness={0.02} />
    </mesh>
  );
};

function createWindowTexture(accent: string, seed: number): THREE.CanvasTexture {
  const W = 64;
  const H = 160;
  const rand = mulberry32(seed);
  const canvas = document.createElement("canvas");
  canvas.width = W;
  canvas.height = H;
  const ctx = canvas.getContext("2d")!;
  ctx.fillStyle = "#0a0d1c";
  ctx.fillRect(0, 0, W, H);
  for (let y = 6; y < H - 6; y += 9) {
    for (let x = 4; x < W - 4; x += 7) {
      if (rand() < 0.3) continue;
      ctx.fillStyle = rand() < 0.18 ? "#ffffff" : accent;
      ctx.globalAlpha = 0.3 + rand() * 0.7;
      ctx.fillRect(x, y, 3, 5);
    }
  }
  ctx.globalAlpha = 1;
  const tex = new THREE.CanvasTexture(canvas);
  tex.colorSpace = THREE.SRGBColorSpace;
  tex.anisotropy = 2;
  return tex;
}

type BuildingData = {
  kind: "tower" | "block" | "cyl" | "dome" | "podium";
  x: number;
  z: number;
  h: number;
  w: number;
  d: number;
  rot: number;
  tex: THREE.CanvasTexture;
};

const Building = ({ accent, b }: { accent: string; b: BuildingData }) => {
  const y = terrainHeight(b.x, b.z);
  const mat = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: "#151b33",
        emissive: accent,
        emissiveIntensity: 0.45,
        emissiveMap: b.tex,
        roughness: 0.65,
        metalness: 0.4,
      }),
    [accent, b.tex]
  );
  const topMat = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: accent,
        emissive: accent,
        emissiveIntensity: 1.6,
        toneMapped: false,
      }),
    [accent]
  );

  return (
    <group position={[b.x, y, b.z]} rotation={[0, b.rot, 0]}>
      {b.kind === "cyl" ? (
        <mesh material={mat} position={[0, b.h / 2, 0]}>
          <cylinderGeometry args={[b.w, b.w * 1.15, b.h, 16]} />
        </mesh>
      ) : (
        <mesh material={mat} position={[0, b.h / 2, 0]}>
          <boxGeometry args={[b.w, b.h, b.d]} />
        </mesh>
      )}

      {b.kind === "tower" && (
        <mesh material={topMat} position={[0, b.h + 0.35, 0]}>
          <coneGeometry args={[b.w * 0.55, 0.7, 6]} />
        </mesh>
      )}
      {b.kind === "dome" && (
        <mesh material={topMat} position={[0, b.h + 0.22, 0]}>
          <sphereGeometry args={[b.w * 0.7, 12, 8]} />
        </mesh>
      )}
      {b.kind === "podium" && (
        <mesh material={topMat} position={[0, b.h + 0.32, 0]}>
          <boxGeometry args={[b.w * 0.6, 0.64, b.d * 0.6]} />
        </mesh>
      )}
      {(b.kind === "block" || b.kind === "cyl") && (
        <mesh material={topMat} position={[0, b.h + 0.4, 0]}>
          <cylinderGeometry args={[0.035, 0.035, 0.8, 6]} />
        </mesh>
      )}
    </group>
  );
};

export const Buildings = ({
  accent,
  seed = 1,
  count = 26,
}: {
  accent: string;
  seed?: number;
  count?: number;
}) => {
  const list = useMemo(() => {
    const rand = mulberry32(seed);
    const kinds: BuildingData["kind"][] = ["tower", "block", "cyl", "dome", "podium"];
    const arr: BuildingData[] = [];
    for (let i = 0; i < count; i++) {
      const a = rand() * Math.PI * 2;
      const r = 6.5 + rand() * 11;
      const kind = kinds[Math.floor(rand() * kinds.length)];
      const h = 1.3 + rand() * 2.7;
      arr.push({
        kind,
        x: Math.cos(a) * r,
        z: Math.sin(a) * r,
        h,
        w: 0.8 + rand() * 1.1,
        d: 0.8 + rand() * 1.1,
        rot: rand() * Math.PI,
        tex: createWindowTexture(accent, seed * 31 + i * 7),
      });
    }
    return arr;
  }, [accent, seed, count]);

  return (
    <group>
      {list.map((b, i) => (
        <Building key={i} accent={accent} b={b} />
      ))}
    </group>
  );
};

type PersonData = {
  radius: number;
  speed: number;
  phase: number;
  dir: number;
  stride: number;
  swing: number;
  scale: number;
  color: string;
};

const Person = ({ data }: { data: PersonData }) => {
  const root = useRef<THREE.Group>(null);
  const legL = useRef<THREE.Group>(null);
  const legR = useRef<THREE.Group>(null);
  const armL = useRef<THREE.Group>(null);
  const armR = useRef<THREE.Group>(null);

  useFrame((state) => {
    const t = state.clock.elapsedTime * data.speed + data.phase;
    const x = Math.cos(t) * data.radius;
    const z = Math.sin(t) * data.radius;
    const step = Math.sin(state.clock.elapsedTime * data.stride);
    const swing = step * data.swing;
    if (root.current) {
      root.current.position.set(x, terrainHeight(x, z), z);
      root.current.position.y += Math.abs(swing) * 0.06;
      root.current.rotation.y = t + data.dir;
      root.current.scale.setScalar(data.scale);
    }
    if (legL.current) legL.current.rotation.x = swing;
    if (legR.current) legR.current.rotation.x = -swing;
    if (armL.current) armL.current.rotation.x = -swing * 0.8;
    if (armR.current) armR.current.rotation.x = swing * 0.8;
  });

  return (
    <group ref={root}>
      <group ref={legL} position={[0, 0.42, 0]}>
        <mesh position={[0, -0.21, 0]}>
          <boxGeometry args={[0.12, 0.42, 0.14]} />
          <meshStandardMaterial color="#232a3d" roughness={0.85} />
        </mesh>
      </group>
      <group ref={legR} position={[0, 0.42, 0]}>
        <mesh position={[0, -0.21, 0]}>
          <boxGeometry args={[0.12, 0.42, 0.14]} />
          <meshStandardMaterial color="#232a3d" roughness={0.85} />
        </mesh>
      </group>
      <mesh position={[0, 0.72, 0]}>
        <capsuleGeometry args={[0.16, 0.42, 4, 8]} />
        <meshStandardMaterial
          color={data.color}
          emissive={data.color}
          emissiveIntensity={0.3}
          roughness={0.5}
          metalness={0.2}
        />
      </mesh>
      <group ref={armL} position={[-0.21, 0.82, 0]}>
        <mesh position={[0, -0.16, 0]}>
          <boxGeometry args={[0.09, 0.36, 0.1]} />
          <meshStandardMaterial color="#232a3d" roughness={0.85} />
        </mesh>
      </group>
      <group ref={armR} position={[0.21, 0.82, 0]}>
        <mesh position={[0, -0.16, 0]}>
          <boxGeometry args={[0.09, 0.36, 0.1]} />
          <meshStandardMaterial color="#232a3d" roughness={0.85} />
        </mesh>
      </group>
      <mesh position={[0, 1.1, 0]}>
        <sphereGeometry args={[0.15, 12, 12]} />
        <meshStandardMaterial color="#eab58d" roughness={0.55} />
      </mesh>
    </group>
  );
};

export const People = ({
  accent,
  seed = 1,
  count = 6,
}: {
  accent: string;
  seed?: number;
  count?: number;
}) => {
  const list = useMemo(() => {
    const rand = mulberry32(seed);
    const palette = [
      "#fbbf24",
      "#60a5fa",
      "#34d399",
      "#f472b6",
      "#a78bfa",
      "#facc15",
      "#22d3ee",
      "#fb7185",
      "#4ade80",
    ];
    const arr: PersonData[] = [];
    for (let i = 0; i < count; i++) {
      arr.push({
        radius: 2.3 + rand() * 2.6,
        speed: 0.12 + rand() * 0.18,
        phase: rand() * Math.PI * 2,
        dir: rand() < 0.5 ? Math.PI / 2 : -Math.PI / 2,
        stride: 2.2 + rand() * 1.6,
        swing: 0.5 + rand() * 0.35,
        scale: 0.82 + rand() * 0.36,
        color: rand() < 0.5 ? accent : palette[Math.floor(rand() * palette.length)],
      });
    }
    return arr;
  }, [accent, seed, count]);

  return (
    <group>
      {list.map((p, i) => (
        <Person key={i} data={p} />
      ))}
    </group>
  );
};

export const Habitat = ({
  accent,
  seed = 1,
  buildings = 24,
  people = 6,
}: {
  accent: string;
  seed?: number;
  buildings?: number;
  people?: number;
}) => (
  <group>
    <Buildings accent={accent} seed={seed} count={buildings} />
    <People accent={accent} seed={seed + 500} count={people} />
  </group>
);
