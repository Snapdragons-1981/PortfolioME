"use client";

import BootSequence from "@/components/BootSequence";
import CustomCursor from "@/components/CustomCursor";
import HackerTerminal from "@/components/HackerTerminal";
import HolographicNav from "@/components/HolographicNav";
import PlanetSceneView from "@/components/PlanetSceneView";
import SandboxMenu from "@/components/SandboxMenu";
import ShipHUD from "@/components/ShipHUD";
import SimpleResume from "@/components/SimpleResume";
import SimulationControls from "@/components/SimulationControls";
import Workspace from "@/components/Workspace";
import { usePortfolioStore } from "@/store/usePortfolioStore";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Toaster } from "sonner";
import { HelpCircle, X, FileText } from "lucide-react";

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
    </motion.div>
  );
}

function HelpTooltip() {
  const [dismissed, setDismissed] = useState(false);
  const [visible, setVisible] = useState(false);
  const pilotMode = usePortfolioStore((s) => s.pilotMode);

  useEffect(() => {
    const timer = setTimeout(() => setVisible(true), 3000);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => setDismissed(true), 12000);
    return () => clearTimeout(timer);
  }, []);

  if (pilotMode || dismissed || !visible) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 10 }}
      transition={{ duration: 0.4 }}
      className="fixed bottom-6 right-6 z-10"
    >
      <div className="relative rounded-xl border border-slate-700/50 bg-[#0a0f1e]/90 backdrop-blur-md px-4 py-3 max-w-[260px] shadow-xl">
        <button
          onClick={() => setDismissed(true)}
          className="absolute top-2 right-2 text-slate-500 hover:text-slate-300 transition-colors"
        >
          <X size={14} />
        </button>
        <div className="flex items-center gap-2 mb-2">
          <HelpCircle size={14} className="text-cyan-400" />
          <span className="font-mono text-[10px] tracking-widest text-cyan-400 uppercase">Quick Tips</span>
        </div>
        <div className="space-y-1.5">
          <p className="font-mono text-[11px] text-slate-400 flex items-center gap-2">
            <kbd className="px-1.5 py-0.5 bg-slate-800/80 border border-slate-700/50 rounded text-slate-500 text-[10px]">`</kbd>
            <span>Terminal</span>
          </p>
          <p className="font-mono text-[11px] text-slate-400 flex items-center gap-2">
            <kbd className="px-1.5 py-0.5 bg-slate-800/80 border border-slate-700/50 rounded text-slate-500 text-[10px]">P</kbd>
            <span>Launch Ship</span>
          </p>
        </div>
      </div>
    </motion.div>
  );
}

export default function Home() {
  const [bootComplete, setBootComplete] = useState(false);
  const { setFlyToPlanet, simpleView, setSimpleView } = usePortfolioStore();
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

      {/* Simple Resume View */}
      <SimpleResume />

      {bootComplete && !simpleView && (
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
          <HelpTooltip />
          <ShipHUD />

          {/* View Toggle Button */}
          <motion.button
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 1.5 }}
            onClick={() => setSimpleView(true)}
            className="fixed top-6 right-6 z-30 flex items-center gap-2 px-4 py-2.5 rounded-full border border-slate-700/50 bg-[#0a0f1e]/80 backdrop-blur-md text-slate-400 hover:text-cyan-400 hover:border-cyan-400/30 transition-all group"
            title="Switch to Simple View"
          >
            <FileText size={16} className="group-hover:rotate-12 transition-transform" />
            <span className="font-mono text-xs tracking-wider">SIMPLE VIEW</span>
          </motion.button>
        </>
      )}
    </>
  );
}
