"use client";

import { Bomb, Rocket, RotateCcw, Sparkles, Swords, X, Zap } from "lucide-react";
import { motion } from "framer-motion";
import { usePortfolioStore, type WeaponId } from "@/store/usePortfolioStore";

const WEAPONS: { id: WeaponId; label: string; icon: typeof Zap; color: string; glow: string }[] = [
  { id: "asteroid", label: "ASTEROID", icon: Rocket, color: "#d6b98a", glow: "rgba(214,185,138,0.4)" },
  { id: "laser", label: "LASER", icon: Zap, color: "#4ade80", glow: "rgba(74,222,128,0.4)" },
  { id: "nuke", label: "NUKE", icon: Bomb, color: "#fbbf24", glow: "rgba(251,191,36,0.4)" },
  { id: "firework", label: "FIREWORK", icon: Sparkles, color: "#f472b6", glow: "rgba(244,114,182,0.4)" },
];

export default function SandboxMenu() {
  const { sandboxMode, exitSandbox, weapon, setWeapon, resetSandbox } = usePortfolioStore();

  if (!sandboxMode) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 24 }}
      transition={{ duration: 0.3 }}
      className="fixed bottom-24 left-1/2 -translate-x-1/2 z-20"
    >
      <div className="relative rounded-2xl p-[1px] overflow-hidden" style={{ background: "linear-gradient(135deg, #f472b666, transparent 40%, transparent 60%, #f472b666)" }}>
        <div className="relative rounded-2xl bg-[#070b1a]/95 backdrop-blur-xl px-3 py-3">
          {/* Header */}
          <div className="flex items-center gap-2 px-2 pb-2.5 mb-2 border-b border-slate-700/40">
            <Swords size={14} className="text-pink-400" />
            <span className="font-mono text-[11px] tracking-[0.3em] text-pink-300">DESTRUCTION PROTOCOL</span>
            <span className="font-mono text-[10px] tracking-widest text-slate-500">CLICK A PLANET TO FIRE</span>
            <div className="flex-1" />
            <span className="font-mono text-[10px] text-slate-500">WEAPON :: {weapon.toUpperCase()}</span>
          </div>

          {/* Weapons */}
          <div className="flex items-center gap-2">
            {WEAPONS.map((w) => {
              const Icon = w.icon;
              const active = weapon === w.id;
              return (
                <motion.button
                  key={w.id}
                  whileHover={{ scale: 1.06 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setWeapon(w.id)}
                  className="flex flex-col items-center gap-1.5 rounded-xl px-4 py-2.5 border transition-all"
                  style={{
                    borderColor: active ? `${w.color}66` : "rgba(148,163,184,0.15)",
                    background: active ? `${w.color}14` : "rgba(255,255,255,0.02)",
                    boxShadow: active ? `0 0 18px ${w.glow}` : "none",
                  }}
                >
                  <Icon size={18} style={{ color: active ? w.color : "#94a3b8" }} />
                  <span className="font-mono text-[9px] tracking-[0.2em]" style={{ color: active ? w.color : "#64748b" }}>
                    {w.label}
                  </span>
                </motion.button>
              );
            })}
          </div>

          {/* Actions */}
          <div className="flex items-center gap-2 mt-3 px-1">
            <button
              onClick={resetSandbox}
              className="flex items-center gap-2 rounded-full border border-slate-600/40 px-4 py-1.5 font-mono text-[10px] tracking-[0.2em] text-slate-400 hover:text-white hover:border-cyan-400/50 hover:bg-cyan-400/10 transition-all"
            >
              <RotateCcw size={12} />
              RESET UNIVERSE
            </button>
            <div className="flex-1" />
            <button
              onClick={exitSandbox}
              className="flex items-center gap-2 rounded-full border border-pink-400/40 bg-pink-500/10 px-4 py-1.5 font-mono text-[10px] tracking-[0.2em] text-pink-300 hover:text-white hover:bg-pink-500/20 transition-all"
            >
              <X size={12} />
              EXIT SANDBOX
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
