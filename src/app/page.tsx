"use client";

import BootSequence from "@/components/BootSequence";
import CustomCursor from "@/components/CustomCursor";
import HackerTerminal from "@/components/HackerTerminal";
import HolographicNav from "@/components/HolographicNav";
import PlanetSceneView from "@/components/PlanetSceneView";
import SandboxMenu from "@/components/SandboxMenu";
import ShipHUD from "@/components/ShipHUD";
import SimulationControls from "@/components/SimulationControls";
import Workspace from "@/components/Workspace";
import { usePortfolioStore } from "@/store/usePortfolioStore";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Toaster } from "sonner";

function WelcomeBanner() {
  const [glitchActive, setGlitchActive] = useState(false);
  const [typedText, setTypedText] = useState("");
  const fullText = "CLICK ON A PLANET TO EXPLORE";
  const pilotMode = usePortfolioStore((s) => s.pilotMode);

  useEffect(() => {
    const glitchInterval = setInterval(() => {
      setGlitchActive(true);
      setTimeout(() => setGlitchActive(false), 200);
    }, 4000);
    return () => clearInterval(glitchInterval);
  }, []);

  useEffect(() => {
    let i = 0;
    const timer = setInterval(() => {
      if (i <= fullText.length) {
        setTypedText(fullText.slice(0, i));
        i++;
      } else {
        clearInterval(timer);
      }
    }, 50);
    return () => clearInterval(timer);
  }, []);

  if (pilotMode) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3, duration: 0.8, ease: "easeOut" }}
      className="fixed top-6 left-1/2 -translate-x-1/2 z-10 text-center"
    >
      {/* Main title with glitch effect */}
      <div className="relative mb-3">
        <h1
          className={`font-mono text-3xl md:text-4xl font-bold tracking-[0.15em] text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-blue-300 to-cyan-400 ${
            glitchActive ? "animate-glitch" : ""
          }`}
          style={{
            textShadow: glitchActive
              ? "2px 0 #ff00ff, -2px 0 #00ffff"
              : "0 0 30px rgba(34,211,238,0.3)",
          }}
        >
          WELCOME TO WENRICK&apos;S
          <br />
          DIGITAL UNIVERSE
        </h1>

        {/* Glitch copies */}
        {glitchActive && (
          <>
            <h1
              className="absolute inset-0 font-mono text-3xl md:text-4xl font-bold tracking-[0.15em] text-cyan-400/50"
              style={{ clipPath: "inset(20% 0 40% 0)", transform: "translate(-2px, -1px)" }}
            >
              WELCOME TO WENRICK&apos;S
              <br />
              DIGITAL UNIVERSE
            </h1>
            <h1
              className="absolute inset-0 font-mono text-3xl md:text-4xl font-bold tracking-[0.15em] text-pink-400/30"
              style={{ clipPath: "inset(60% 0 10% 0)", transform: "translate(2px, 1px)" }}
            >
              WELCOME TO WENRICK&apos;S
              <br />
              DIGITAL UNIVERSE
            </h1>
          </>
        )}
      </div>

      {/* Typing subtitle */}
      <p className="text-slate-400 text-sm md:text-base font-mono tracking-wider">
        {typedText}
        <span className="inline-block w-2 h-4 bg-cyan-400/80 ml-1 animate-typing-cursor align-middle" />
      </p>

      {/* Keyboard hint */}
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2 }}
        className="text-slate-600 text-xs font-mono mt-3 tracking-wider"
      >
        PRESS <kbd className="px-1.5 py-0.5 bg-slate-800/80 border border-slate-700/50 rounded text-slate-500">`</kbd> FOR TERMINAL · PRESS <kbd className="px-1.5 py-0.5 bg-slate-800/80 border border-slate-700/50 rounded text-slate-500">P</kbd> TO LAUNCH SHIP
      </motion.p>
    </motion.div>
  );
}

export default function Home() {
  const [bootComplete, setBootComplete] = useState(false);
  const { setFlyToPlanet } = usePortfolioStore();
  const sandboxMode = usePortfolioStore((s) => s.sandboxMode);
  const pilotMode = usePortfolioStore((s) => s.pilotMode);

  return (
    <>
      <CustomCursor />
      <Toaster
        position="bottom-right"
        toastOptions={{
          style: {
            background: "#0a0f1e",
            border: "1px solid rgba(34,211,238,0.2)",
            color: "#e5e7eb",
            fontFamily: "var(--font-geist-mono), monospace",
          },
        }}
      />

      <AnimatePresence mode="wait">
        {!bootComplete && (
          <BootSequence onComplete={() => setBootComplete(true)} />
        )}
      </AnimatePresence>

      {bootComplete && (
        <>
          <Workspace />
          <HolographicNav
            onSelect={(id) => {
              if (!sandboxMode && !pilotMode) setFlyToPlanet(id);
            }}
          />
          <SimulationControls />
          <SandboxMenu />
          <PlanetSceneView />
          <HackerTerminal />
          <WelcomeBanner />
          <ShipHUD />
        </>
      )}
    </>
  );
}
