"use client";

import { FastForward, Pause, Play, Zap } from "lucide-react";
import { motion } from "framer-motion";
import { usePortfolioStore } from "@/store/usePortfolioStore";

const SPEEDS = [1, 2, 4, 8];

export default function SimulationControls() {
  const { paused, setPaused, timeScale, setTimeScale, activePlanet, sandboxMode, pilotMode } = usePortfolioStore();

  if (activePlanet || pilotMode) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.6 }}
      className="fixed bottom-4 left-1/2 -translate-x-1/2 z-10"
    >
      <div
        className={`flex items-center gap-1.5 rounded-full border bg-[#0a0f1e]/85 backdrop-blur-md px-2.5 py-2 font-mono text-[11px] tracking-widest ${
          sandboxMode ? "border-pink-400/40" : "border-slate-700/60"
        }`}
      >
        {/* Play / Pause */}
        <button
          onClick={() => setPaused(!paused)}
          className={`flex h-9 w-9 items-center justify-center rounded-full transition-all ${
            paused
              ? "bg-cyan-400/20 text-cyan-300 border border-cyan-400/40 shadow-[0_0_12px_rgba(34,211,238,0.35)]"
              : "text-slate-400 hover:text-white hover:bg-slate-800/60"
          }`}
          title={paused ? "PLAY" : "PAUSE"}
        >
          {paused ? <Play size={15} /> : <Pause size={15} />}
        </button>

        <div className="mx-1 h-6 w-px bg-slate-700/60" />

        {SPEEDS.map((s) => {
          const active = !paused && timeScale === s;
          return (
            <button
              key={s}
              onClick={() => {
                setPaused(false);
                setTimeScale(s);
              }}
              className={`flex items-center gap-1 rounded-full px-3 py-1.5 transition-all ${
                active
                  ? "bg-cyan-400/15 text-cyan-300 border border-cyan-400/40 shadow-[0_0_10px_rgba(34,211,238,0.25)]"
                  : "text-slate-400 hover:text-white hover:bg-slate-800/60"
              }`}
            >
              {s >= 8 && <FastForward size={12} />}
              {s === 4 && <Zap size={12} />}
              {s}x
            </button>
          );
        })}

        <div className="ml-1 flex items-center gap-1.5 pl-2 border-l border-slate-700/60">
          <span className={paused ? "text-amber-300" : "text-cyan-300"}>
            {paused ? "PAUSED" : timeScale >= 8 ? "FLASH" : timeScale >= 4 ? "FAST" : "TIME"}
          </span>
        </div>
      </div>
    </motion.div>
  );
}
