import * as THREE from "three";

type RGB = [number, number, number];

export function mulberry32(seed: number) {
  let a = seed >>> 0;
  return () => {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function makeNoise(rand: () => number) {
  const perm = new Uint8Array(512);
  const p = new Uint8Array(256);
  for (let i = 0; i < 256; i++) p[i] = i;
  for (let i = 255; i > 0; i--) {
    const j = Math.floor(rand() * (i + 1));
    const tmp = p[i];
    p[i] = p[j];
    p[j] = tmp;
  }
  for (let i = 0; i < 512; i++) perm[i] = p[i & 255];
  const fade = (t: number) => t * t * (3 - 2 * t);
  const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
  return (x: number, y: number) => {
    const xi = Math.floor(x) & 255;
    const yi = Math.floor(y) & 255;
    const xf = x - Math.floor(x);
    const yf = y - Math.floor(y);
    const u = fade(xf);
    const v = fade(yf);
    const aa = perm[perm[xi] + yi];
    const ab = perm[perm[xi] + yi + 1];
    const ba = perm[perm[xi + 1] + yi];
    const bb = perm[perm[xi + 1] + yi + 1];
    const x1 = lerp(aa, ba, u);
    const x2 = lerp(ab, bb, u);
    return lerp(x1, x2, v) / 255;
  };
}

type Noise2D = (x: number, y: number) => number;

function makeFbm(seed: number, octaves: number): Noise2D {
  const noise = makeNoise(mulberry32(seed));
  return (x, y) => {
    let amp = 1;
    let freq = 1;
    let sum = 0;
    let norm = 0;
    for (let i = 0; i < octaves; i++) {
      sum += amp * noise(x * freq, y * freq);
      norm += amp;
      amp *= 0.5;
      freq *= 2.03;
    }
    return sum / norm;
  };
}

function clamp01(v: number) {
  return Math.min(1, Math.max(0, v));
}

function smoothstep(edge0: number, edge1: number, x: number) {
  const t = clamp01((x - edge0) / (edge1 - edge0));
  return t * t * (3 - 2 * t);
}

function hexToRgb(hex: string): RGB {
  const n = parseInt(hex.replace("#", ""), 16);
  return [((n >> 16) & 255) / 255, ((n >> 8) & 255) / 255, (n & 255) / 255];
}

function mix(a: RGB, b: RGB, t: number): RGB {
  return [a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t, a[2] + (b[2] - a[2]) * t];
}

function shade(rgb: RGB, f: number): RGB {
  return [
    Math.min(1, rgb[0] * f),
    Math.min(1, rgb[1] * f),
    Math.min(1, rgb[2] * f),
  ];
}

function makeCanvas(w: number, h: number) {
  const canvas = document.createElement("canvas");
  canvas.width = w;
  canvas.height = h;
  const ctx = canvas.getContext("2d")!;
  return { canvas, ctx };
}

export function createTerrestrialTexture(baseColor: string, seed: number): THREE.CanvasTexture {
  const W = 512;
  const H = 256;
  const { canvas, ctx } = makeCanvas(W, H);
  const img = ctx.createImageData(W, H);
  const base = hexToRgb(baseColor);
  const fbm = makeFbm(seed, 5);
  const detail = makeFbm(seed + 999, 4);
  const ocean = mix(shade(base, 0.16), shade(base, 0.4), 0.4);
  const coast = shade(base, 0.5);
  const land = shade(base, 0.78);
  const highland = shade(base, 1.2);
  const peak = shade(base, 1.6);
  const snow: RGB = [0.93, 0.96, 1];
  const waterLevel = 0.48;

  for (let y = 0; y < H; y++) {
    const lat = y / H;
    const polar = Math.abs(lat * 2 - 1);
    for (let x = 0; x < W; x++) {
      const lon = x / W;
      let e = fbm(lon * 5 + 0.37, lat * 3);
      e = e * 0.72 + detail(lon * 16, lat * 12) * 0.28;

      let col: RGB;
      if (e < waterLevel - 0.045) col = ocean;
      else if (e < waterLevel) col = coast;
      else if (e < waterLevel + 0.13) col = land;
      else if (e < waterLevel + 0.22) col = highland;
      else col = mix(highland, peak, (e - waterLevel - 0.22) / 0.16);

      const ice = smoothstep(0.68, 0.94, polar) * smoothstep(0.72, 0.95, e + 0.08);
      col = mix(col, snow, ice);

      const i = (y * W + x) * 4;
      img.data[i] = col[0] * 255;
      img.data[i + 1] = col[1] * 255;
      img.data[i + 2] = col[2] * 255;
      img.data[i + 3] = 255;
    }
  }

  ctx.putImageData(img, 0, 0);
  const tex = new THREE.CanvasTexture(canvas);
  tex.colorSpace = THREE.SRGBColorSpace;
  tex.anisotropy = 4;
  return tex;
}

export function createGasTexture(baseColor: string, seed: number): THREE.CanvasTexture {
  const W = 512;
  const H = 256;
  const { canvas, ctx } = makeCanvas(W, H);
  const img = ctx.createImageData(W, H);
  const base = hexToRgb(baseColor);
  const bands = makeFbm(seed, 4);
  const swirl = makeFbm(seed + 7, 4);
  const dark = shade(base, 0.4);
  const light = shade(base, 1.8);
  const spotX = 0.72;
  const spotY = 0.58;
  const spotR = 0.11;

  for (let y = 0; y < H; y++) {
    const lat = y / H;
    for (let x = 0; x < W; x++) {
      const lon = x / W;
      const band = bands(lon * 0.8, lat * 9 + Math.sin(lon * 6) * 0.45);
      const w = swirl(lon * 5, lat * 14);
      let t = clamp01(band * 0.6 + w * 0.4);

      const dx = lon - spotX;
      const dy = lat - spotY;
      const d = Math.sqrt(dx * dx + dy * dy);
      const spot = smoothstep(spotR, spotR * 0.35, d);
      t = clamp01(t * (1 - spot * 0.5) + spot * 0.9);

      const col = mix(dark, light, t);
      const i = (y * W + x) * 4;
      img.data[i] = col[0] * 255;
      img.data[i + 1] = col[1] * 255;
      img.data[i + 2] = col[2] * 255;
      img.data[i + 3] = 255;
    }
  }

  ctx.putImageData(img, 0, 0);
  const tex = new THREE.CanvasTexture(canvas);
  tex.colorSpace = THREE.SRGBColorSpace;
  tex.anisotropy = 4;
  return tex;
}

export function createVolcanicTextures(
  baseColor: string,
  seed: number
): { map: THREE.CanvasTexture; emissiveMap: THREE.CanvasTexture } {
  const W = 512;
  const H = 256;
  const base = hexToRgb(baseColor);
  const fbm = makeFbm(seed, 5);
  const cracks = makeFbm(seed + 31, 4);
  const rockDark = shade(base, 0.16);
  const rock = shade(base, 0.5);
  const lava: RGB = [1, 0.45, 0.06];
  const lavaHot: RGB = [1, 0.92, 0.35];

  const mk = (emissive: boolean) => {
    const { canvas, ctx } = makeCanvas(W, H);
    const img = ctx.createImageData(W, H);
    for (let y = 0; y < H; y++) {
      const lat = y / H;
      for (let x = 0; x < W; x++) {
        const lon = x / W;
        const e = fbm(lon * 4, lat * 4);
        const r = Math.abs(cracks(lon * 22, lat * 22) * 2 - 1);
        const mask = smoothstep(0.16, 0.04, r) * smoothstep(0.4, 0.62, e + 0.2);
        const ground = mix(rockDark, rock, e);
        const lavaCol = mix(lava, lavaHot, smoothstep(0, 0.08, r));
        const col = emissive ? (mask > 0.05 ? shade(lavaCol, 1.4) : [0, 0, 0]) : mix(ground, lavaCol, mask);
        const i = (y * W + x) * 4;
        img.data[i] = col[0] * 255;
        img.data[i + 1] = col[1] * 255;
        img.data[i + 2] = col[2] * 255;
        img.data[i + 3] = 255;
      }
    }
    ctx.putImageData(img, 0, 0);
    const tex = new THREE.CanvasTexture(canvas);
    tex.colorSpace = THREE.SRGBColorSpace;
    tex.anisotropy = 4;
    return tex;
  };

  return { map: mk(false), emissiveMap: mk(true) };
}

export function createCloudTexture(seed: number): THREE.CanvasTexture {
  const W = 512;
  const H = 256;
  const { canvas, ctx } = makeCanvas(W, H);
  const img = ctx.createImageData(W, H);
  const fbm = makeFbm(seed, 5);
  const swirl = makeFbm(seed + 13, 4);

  for (let y = 0; y < H; y++) {
    const lat = y / H;
    for (let x = 0; x < W; x++) {
      const lon = x / W;
      const c = smoothstep(
        0.52,
        0.85,
        fbm(lon * 3, lat * 3) * 0.72 + swirl(lon * 7 + Math.sin(lat * 9) * 0.3, lat * 9) * 0.28
      );
      const i = (y * W + x) * 4;
      img.data[i] = 255;
      img.data[i + 1] = 255;
      img.data[i + 2] = 255;
      img.data[i + 3] = c * 255;
    }
  }

  ctx.putImageData(img, 0, 0);
  const tex = new THREE.CanvasTexture(canvas);
  tex.colorSpace = THREE.SRGBColorSpace;
  tex.anisotropy = 4;
  return tex;
}

export function createRingTexture(baseColor: string, seed: number): THREE.CanvasTexture {
  const S = 256;
  const { canvas, ctx } = makeCanvas(S, S);
  const img = ctx.createImageData(S, S);
  const base = hexToRgb(baseColor);
  const fbm = makeFbm(seed, 3);
  const innerRatio = 0.68;
  const outerRatio = 1.02;

  for (let y = 0; y < S; y++) {
    for (let x = 0; x < S; x++) {
      const dx = x / S - 0.5;
      const dy = y / S - 0.5;
      const r = Math.sqrt(dx * dx + dy * dy) * 2;
      const i = (y * S + x) * 4;
      if (r < innerRatio || r > outerRatio) {
        img.data[i + 3] = 0;
        continue;
      }
      let a = 0.4 + 0.6 * fbm(r * 10, 0.5);
      const gap = Math.sin(r * Math.PI * 10) + Math.sin(r * Math.PI * 26) * 0.35;
      a *= clamp01(gap * 0.75 + 0.32);
      a *= smoothstep(innerRatio, innerRatio + 0.05, r) * (1 - smoothstep(outerRatio - 0.03, outerRatio, r));
      const col = mix(shade(base, 0.55), shade(base, 1.6), clamp01((r - innerRatio) / (outerRatio - innerRatio)));
      img.data[i] = col[0] * 255;
      img.data[i + 1] = col[1] * 255;
      img.data[i + 2] = col[2] * 255;
      img.data[i + 3] = a * 255;
    }
  }

  ctx.putImageData(img, 0, 0);
  const tex = new THREE.CanvasTexture(canvas);
  tex.colorSpace = THREE.SRGBColorSpace;
  tex.anisotropy = 4;
  return tex;
}
