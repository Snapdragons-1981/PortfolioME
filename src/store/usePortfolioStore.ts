import { create } from 'zustand';

export interface PlanetData {
  id: string;
  name: string;
  color: string;
  size: number;
  distance: number;
  speed: number;
  position: [number, number, number];
}

export const PLANETS: PlanetData[] = [
  { id: 'about', name: 'ABOUT', color: '#22d3ee', size: 0.8, distance: 3, speed: 0.15, position: [0, 0, 0] },
  { id: 'skills', name: 'SKILLS', color: '#60a5fa', size: 1, distance: 5, speed: 0.12, position: [0, 0, 0] },
  { id: 'projects', name: 'PROJECTS', color: '#a78bfa', size: 1.7, distance: 7.5, speed: 0.1, position: [0, 0, 0] },
  { id: 'experience', name: 'EXPERIENCE', color: '#34d399', size: 1, distance: 10, speed: 0.08, position: [0, 0, 0] },
  { id: 'education', name: 'EDUCATION', color: '#fbbf24', size: 1.2, distance: 12.5, speed: 0.06, position: [0, 0, 0] },
  { id: 'contact', name: 'CONTACT', color: '#f472b6', size: 0.85, distance: 15, speed: 0.05, position: [0, 0, 0] },
];

export type WeaponId = 'asteroid' | 'laser' | 'nuke' | 'firework';

export interface Projectile {
  id: string;
  type: WeaponId;
  targetId: string;
  born: number;
}

export interface ExplosionInfo {
  startedAt: number;
  type: WeaponId;
}

interface PortfolioStore {
  activePlanet: string | null;
  setActivePlanet: (id: string | null) => void;
  flyToPlanet: string | null;
  setFlyToPlanet: (id: string | null) => void;
  flyBackHome: boolean;
  setFlyBackHome: (value: boolean) => void;
  showTerminal: boolean;
  setShowTerminal: (show: boolean) => void;
  showPerf: boolean;
  setShowPerf: (show: boolean) => void;
  achievements: string[];
  addAchievement: (id: string) => void;
  paused: boolean;
  setPaused: (value: boolean) => void;
  timeScale: number;
  setTimeScale: (value: number) => void;
  sandboxMode: boolean;
  setSandboxMode: (value: boolean) => void;
  pilotMode: boolean;
  setPilotMode: (value: boolean) => void;
  weapon: WeaponId;
  setWeapon: (value: WeaponId) => void;
  sunCharges: number;
  chargeSun: () => void;
  explosions: Record<string, ExplosionInfo>;
  explodePlanet: (id: string, type: WeaponId) => void;
  projectiles: Projectile[];
  spawnProjectile: (type: WeaponId, targetId: string) => void;
  removeProjectile: (id: string) => void;
  resetSandbox: () => void;
  exitSandbox: () => void;
  simpleView: boolean;
  setSimpleView: (value: boolean) => void;
}

let projectileSeq = 0;

export const usePortfolioStore = create<PortfolioStore>((set) => ({
  activePlanet: null,
  setActivePlanet: (id) => set({ activePlanet: id }),
  flyToPlanet: null,
  setFlyToPlanet: (id) => set({ flyToPlanet: id }),
  flyBackHome: false,
  setFlyBackHome: (value) => set({ flyBackHome: value }),
  showTerminal: false,
  setShowTerminal: (show) => set({ showTerminal: show }),
  showPerf: false,
  setShowPerf: (show) => set({ showPerf: show }),
  achievements: [],
  addAchievement: (id) =>
    set((state) => ({
      achievements: state.achievements.includes(id)
        ? state.achievements
        : [...state.achievements, id],
    })),
  paused: false,
  setPaused: (value) => set({ paused: value }),
  timeScale: 1,
  setTimeScale: (value) => set({ timeScale: value }),
  sandboxMode: false,
  setSandboxMode: (value) => set({ sandboxMode: value }),
  pilotMode: false,
  setPilotMode: (value) => set({ pilotMode: value }),
  weapon: 'asteroid',
  setWeapon: (value) => set({ weapon: value }),
  sunCharges: 0,
  chargeSun: () =>
    set((state) => {
      const next = Math.min(state.sunCharges + 1, 5);
      return { sunCharges: next, sandboxMode: next >= 5 ? true : state.sandboxMode };
    }),
  explosions: {},
  explodePlanet: (id, type) =>
    set((state) => ({
      explosions: { ...state.explosions, [id]: { startedAt: Date.now(), type } },
    })),
  projectiles: [],
  spawnProjectile: (type, targetId) =>
    set((state) => ({
      projectiles: [
        ...state.projectiles,
        { id: `proj-${++projectileSeq}`, type, targetId, born: Date.now() },
      ],
    })),
  removeProjectile: (id) =>
    set((state) => ({ projectiles: state.projectiles.filter((p) => p.id !== id) })),
  resetSandbox: () => set({ explosions: {}, projectiles: [], weapon: 'asteroid' }),
  exitSandbox: () =>
    set({ sandboxMode: false, explosions: {}, projectiles: [], weapon: 'asteroid', sunCharges: 0 }),
  simpleView: false,
  setSimpleView: (value) => set({ simpleView: value }),
}));
