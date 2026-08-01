"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Gauge, Keyboard, Navigation, Rocket, X } from "lucide-react";
import { PLANETS, usePortfolioStore } from "@/store/usePortfolioStore";
import { shipTelemetry } from "@/lib/worldRefs";

export default function ShipHUD() {
  const { pilotMode, activePlanet } = usePortfolioStore();
  const [speed, setSpeed] = useState(0);
  const [target, setTarget] = useState<string | null>(null);
  const [dist, setDist] = useState(0);
  const [dockReady, setDockReady] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setSpeed(shipTelemetry.speed);
      setTarget(shipTelemetry.nearestPlanet);
      setDist(shipTelemetry.nearestDistance);
      setDockReady(shipTelemetry.dockReady);
    }, 120);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const state = usePortfolioStore.getState();
      if (state.showTerminal || state.activePlanet) return;
      if (e.key.toLowerCase() === "p") {
        if (state.pilotMode) {
          state.setPilotMode(false);
          state.setFlyBackHome(true);
        } else {
          state.setFlyToPlanet(null);
          state.setFlyBackHome(false);
          state.setPilotMode(true);
        }
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  if (activePlanet) return null;

  const targetPlanet = target ? PLANETS.find((p) => p.id === target) : null;

  return (
    <>
      {/* Center steering reticle */}
      {pilotMode && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="pointer-events-none fixed left-1/2 top-1/2 z-20 -translate-x-1/2 -translate-y-1/2"
        >
          <div className="relative h-16 w-16">
            <div className="absolute left-1/2 top-0 h-4 w-px -translate-x-1/2 bg-cyan-400/50" />
            <div className="absolute bottom-0 left-1/2 h-4 w-px -translate-x-1/2 bg-cyan-400/50" />
            <div className="absolute left-0 top-1/2 h-px w-4 -translate-y-1/2 bg-cyan-400/50" />
            <div className="absolute right-0 top-1/2 h-px w-4 -translate-y-1/2 bg-cyan-400/50" />
            <div className="absolute left-1/2 top-1/2 h-1.5 w-1.5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-cyan-300 shadow-[0_0_10px_rgba(34,211,238,0.9)]" />
          </div>
        </motion.div>
      )}

      {pilotMode ? (
        <AnimatePresence>
          <motion.div
            initial={{ opacity: 0, y: -16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -16 }}
            className="fixed top-5 left-5 z-20"
          >
            <div className="rounded-xl border border-cyan-400/30 bg-[#070b1a]/80 px-5 py-4 backdrop-blur-md shadow-[0_0_25px_rgba(34,211,238,0.15)]">
              <div className="flex items-center gap-2 font-mono text-[10px] tracking-[0.3em] text-cyan-300">
                <span className="inline-block h-1.5 w-1.5 rounded-full bg-cyan-400 animate-pulse-glow" />
                PILOT MODE ENGAGED
              </div>

              <div className="mt-3 flex items-end gap-2">
                <Gauge size={16} className="text-cyan-400/70" />
                <span className="font-mono text-2xl font-bold text-white tabular-nums">
                  {speed.toFixed(1)}
                </span>
                <span className="font-mono text-[10px] text-cyan-500/70 mb-1 tracking-widest">
                  M/S
                </span>
              </div>

              <div className="mt-3 h-px bg-gradient-to-r from-cyan-400/40 to-transparent" />

              <div className="mt-2.5 flex items-center gap-2 font-mono text-[11px]">
                <Navigation size={12} className="text-slate-400" />
                {targetPlanet ? (
                  <>
                    <span className="text-slate-200 tracking-widest">{targetPlanet.name}</span>
                    <span className="text-slate-500">
                      · {dist.toFixed(1)}u {dockReady && <span className="text-emerald-400">· DOCK RANGE</span>}
                    </span>
                  </>
                ) : (
                  <span className="text-slate-500 tracking-widest">NO TARGET</span>
                )}
              </div>
            </div>
          </motion.div>
        </AnimatePresence>
      ) : (
        <motion.button
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.7 }}
          onClick={() => {
            const state = usePortfolioStore.getState();
            state.setFlyToPlanet(null);
            state.setFlyBackHome(false);
            state.setPilotMode(true);
          }}
          className="group fixed bottom-5 left-5 z-20 flex items-center gap-3 rounded-full border border-cyan-400/40 bg-cyan-500/10 px-5 py-3 font-mono text-xs tracking-[0.25em] text-cyan-300 backdrop-blur-md transition-all hover:bg-cyan-400/20 hover:text-white hover:shadow-[0_0_25px_rgba(34,211,238,0.35)]"
        >
          <Rocket size={15} className="transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
          LAUNCH SHIP
          <kbd className="rounded border border-cyan-400/30 bg-[#070b1a]/70 px-1.5 py-0.5 text-[9px] text-cyan-400">
            P
          </kbd>
        </motion.button>
      )}

      {pilotMode && (
        <>
          {/* Dock prompt */}
          <AnimatePresence>
            {dockReady && (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                className="fixed left-1/2 top-24 z-20 -translate-x-1/2"
              >
                <div className="flex items-center gap-3 rounded-full border border-emerald-400/50 bg-emerald-500/10 px-5 py-2.5 font-mono text-xs tracking-[0.3em] text-emerald-300 shadow-[0_0_25px_rgba(52,211,153,0.3)] backdrop-blur-md">
                  <span className="inline-block h-2 w-2 rounded-full bg-emerald-400 animate-pulse-glow" />
                  DOCK READY · PRESS F
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Dock / Abort buttons */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            className="fixed bottom-5 right-5 z-20 flex flex-col items-end gap-2.5"
          >
            {dockReady && (
              <button
                onClick={() => {
                  const state = usePortfolioStore.getState();
                  if (!shipTelemetry.nearestPlanet) return;
                  state.setActivePlanet(shipTelemetry.nearestPlanet);
                  state.setPilotMode(false);
                }}
                className="flex items-center gap-2 rounded-full border border-emerald-400/50 bg-emerald-500/15 px-5 py-2.5 font-mono text-xs tracking-[0.25em] text-emerald-300 backdrop-blur-md transition-all hover:bg-emerald-400/25 hover:text-white hover:shadow-[0_0_25px_rgba(52,211,153,0.35)]"
              >
                <Navigation size={14} />
                DOCK
              </button>
            )}
            <button
              onClick={() => {
                usePortfolioStore.getState().setPilotMode(false);
                usePortfolioStore.getState().setFlyBackHome(true);
              }}
              className="flex items-center gap-2 rounded-full border border-slate-600/50 bg-[#0a0f1e]/80 px-5 py-2.5 font-mono text-xs tracking-[0.25em] text-slate-400 backdrop-blur-md transition-all hover:text-white hover:border-red-400/50 hover:shadow-[0_0_25px_rgba(248,113,113,0.2)]"
            >
              <X size={14} />
              ABORT FLIGHT
            </button>
          </motion.div>

          {/* Controls help */}
          <motion.div
            initial={{ opacity: 0, x: -16 }}
            animate={{ opacity: 1, x: 0 }}
            className="fixed bottom-5 left-5 z-20 hidden md:block"
          >
            <div className="flex items-center gap-2 font-mono text-[10px] tracking-widest text-slate-500">
              <Keyboard size={12} className="text-slate-500" />
              <span>
                <b className="text-slate-300">W</b> THRUST · <b className="text-slate-300">S</b>{" "}
                BRAKE · <b className="text-slate-300">A/D</b> TURN ·{" "}
                <b className="text-slate-300">SPACE/CTRL</b> PITCH ·{" "}
                <b className="text-slate-300">SHIFT</b> BOOST · <b className="text-slate-300">F</b>{" "}
                DOCK · <b className="text-slate-300">P</b> ABORT
              </span>
            </div>
          </motion.div>
        </>
      )}
    </>
  );
}
