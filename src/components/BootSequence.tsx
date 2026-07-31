"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";

interface BootStep {
  id: number;
  text: string;
  duration: number;
  icon: string;
}

const bootSteps: BootStep[] = [
  { id: 0, text: "INITIALIZING AI SYSTEM", duration: 800, icon: "◆" },
  { id: 1, text: "SYNCHRONIZING NEURAL NETWORKS", duration: 1000, icon: "◆" },
  { id: 2, text: "CALIBRATING GPU CORES", duration: 900, icon: "◆" },
  { id: 3, text: "LOADING DIGITAL WORKSPACE MODULES", duration: 1200, icon: "◆" },
  { id: 4, text: "SYSTEM DIAGNOSTICS COMPLETE", duration: 600, icon: "◆" },
];

export default function BootSequence({
  onComplete,
}: {
  onComplete: () => void;
}) {
  const [currentStep, setCurrentStep] = useState(-1);
  const [progress, setProgress] = useState(0);
  const [glitchActive, setGlitchActive] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setGlitchActive(true);
      setTimeout(() => setGlitchActive(false), 150);
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    let totalDuration = 0;

    bootSteps.forEach((step, index) => {
      setTimeout(() => {
        setCurrentStep(index);
        setProgress(((index + 1) / bootSteps.length) * 100);
      }, totalDuration);
      totalDuration += step.duration;
    });

    const completeTimeout = setTimeout(onComplete, totalDuration + 300);

    return () => {
      clearTimeout(completeTimeout);
    };
  }, [onComplete]);

  return (
    <motion.div
      className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950 font-mono text-cyan-400 overflow-hidden"
      exit={{ opacity: 0 }}
      transition={{ duration: 0.8 }}
    >
      {/* Scanline overlay */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div
          className="absolute inset-0 h-[200%] opacity-[0.03]"
          style={{
            background:
              "repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(34,211,238,0.1) 2px, rgba(34,211,238,0.1) 4px)",
          }}
        />
        <div
          className="absolute left-0 right-0 h-32 bg-gradient-to-b from-transparent via-cyan-500/10 to-transparent animate-scanline"
        />
      </div>

      {/* Grid background */}
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.04]"
        style={{
          backgroundImage:
            "linear-gradient(rgba(34,211,238,0.3) 1px, transparent 1px), linear-gradient(90deg, rgba(34,211,238,0.3) 1px, transparent 1px)",
          backgroundSize: "60px 60px",
        }}
      />

      <div className="w-full max-w-3xl p-8 relative z-10">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
        >
          {/* Logo / Title */}
          <div className="mb-10 relative">
            <motion.div
              className={`text-5xl font-bold tracking-[0.3em] text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-blue-400 to-cyan-300 ${
                glitchActive ? "animate-glitch" : ""
              }`}
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              WENRICK
            </motion.div>
            <motion.div
              className="text-lg tracking-[0.5em] text-cyan-600 mt-1 font-light"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3, duration: 0.5 }}
            >
              SYSTEMS
            </motion.div>
            <div className="absolute -bottom-3 left-0 h-px w-32 bg-gradient-to-r from-cyan-500 to-transparent" />
          </div>

          {/* Boot steps */}
          <div className="space-y-3 mb-10">
            {bootSteps.map((step, index) => (
              <motion.div
                key={step.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{
                  opacity: index <= currentStep ? 1 : 0.15,
                  x: index <= currentStep ? 0 : -20,
                }}
                transition={{ duration: 0.4, ease: "easeOut" }}
                className="flex items-center gap-4"
              >
                <motion.span
                  className={
                    index < currentStep
                      ? "text-emerald-400"
                      : index === currentStep
                        ? "text-cyan-400 animate-pulse-glow"
                        : "text-slate-700"
                  }
                  animate={
                    index === currentStep
                      ? { scale: [1, 1.2, 1] }
                      : {}
                  }
                  transition={{ duration: 0.5, repeat: Infinity }}
                >
                  {index < currentStep ? "✓" : index === currentStep ? "►" : "○"}
                </motion.span>
                <span
                  className={`text-sm tracking-wider ${
                    index < currentStep
                      ? "text-emerald-400/80"
                      : index === currentStep
                        ? "text-cyan-300"
                        : "text-slate-700"
                  }`}
                >
                  {step.text}
                </span>
                {index < currentStep && (
                  <motion.span
                    initial={{ opacity: 0, scale: 0 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="ml-auto text-xs text-emerald-500/60"
                  >
                    [OK]
                  </motion.span>
                )}
                {index === currentStep && (
                  <motion.span
                    className="ml-auto text-xs text-cyan-500/60"
                    animate={{ opacity: [1, 0.3, 1] }}
                    transition={{ duration: 0.8, repeat: Infinity }}
                  >
                    [LOADING]
                  </motion.span>
                )}
              </motion.div>
            ))}
          </div>

          {/* Progress bar */}
          <div className="mb-8">
            <div className="mb-3 flex justify-between text-xs text-cyan-700 tracking-widest">
              <span>SYSTEM BOOT</span>
              <span className="tabular-nums">{Math.round(progress)}%</span>
            </div>
            <div className="h-1.5 w-full overflow-hidden rounded-full bg-slate-800/80 border border-slate-700/50">
              <motion.div
                className="h-full rounded-full bg-gradient-to-r from-cyan-500 via-blue-500 to-cyan-400"
                initial={{ width: 0 }}
                animate={{ width: `${progress}%` }}
                transition={{ duration: 0.3, ease: "easeOut" }}
                style={{
                  boxShadow: "0 0 20px rgba(34, 211, 238, 0.5)",
                }}
              />
            </div>
          </div>

          {/* System info */}
          <motion.div
            className="flex items-center justify-between text-[10px] text-slate-600 tracking-wider"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
          >
            <span>v3.0.1 | CORES: 8 | RAM: 32GB</span>
            <span className="flex items-center gap-2">
              <span className="inline-block h-1.5 w-1.5 rounded-full bg-cyan-500 animate-pulse-glow" />
              ONLINE
            </span>
          </motion.div>
        </motion.div>
      </div>

      {/* Corner decorations */}
      <div className="absolute top-6 left-6 w-16 h-16 border-l-2 border-t-2 border-cyan-500/20 rounded-tl-sm" />
      <div className="absolute top-6 right-6 w-16 h-16 border-r-2 border-t-2 border-cyan-500/20 rounded-tr-sm" />
      <div className="absolute bottom-6 left-6 w-16 h-16 border-l-2 border-b-2 border-cyan-500/20 rounded-bl-sm" />
      <div className="absolute bottom-6 right-6 w-16 h-16 border-r-2 border-b-2 border-cyan-500/20 rounded-br-sm" />
    </motion.div>
  );
}
