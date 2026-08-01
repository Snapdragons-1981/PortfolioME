import * as THREE from "three";

export const planetPositionsRef: { current: Record<string, THREE.Vector3> } = {
  current: {},
};

export interface ShipTelemetry {
  speed: number;
  nearestPlanet: string | null;
  nearestDistance: number;
  dockReady: boolean;
}

export const shipTelemetry: ShipTelemetry = {
  speed: 0,
  nearestPlanet: null,
  nearestDistance: Infinity,
  dockReady: false,
};
