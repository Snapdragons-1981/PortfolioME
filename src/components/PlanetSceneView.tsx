"use client";

import { Canvas } from "@react-three/fiber";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowLeft, Orbit, Satellite } from "lucide-react";
import { usePortfolioStore } from "@/store/usePortfolioStore";
import AboutPlanetScene from "@/planet-scenes/AboutPlanetScene";
import SkillsPlanetScene from "@/planet-scenes/SkillsPlanetScene";
import ProjectsPlanetScene from "@/planet-scenes/ProjectsPlanetScene";
import ExperiencePlanetScene from "@/planet-scenes/ExperiencePlanetScene";
import EducationPlanetScene from "@/planet-scenes/EducationPlanetScene";
import ContactPlanetScene from "@/planet-scenes/ContactPlanetScene";

interface PlanetWorldConfig {
  Scene: React.ComponentType;
  color: string;
  sector: string;
  title: string;
  description: string;
  hint: string;
}

const PLANET_WORLDS: Record<string, PlanetWorldConfig> = {
  about: {
    Scene: AboutPlanetScene,
    color: "#22d3ee",
    sector: "SECTOR · IDENTITY",
    title: "IDENTITY CORE",
    description:
      "Wenrick Jay Z. Ganas — full-stack developer & IT specialist. A rotating identity core surrounded by orbiting data streams.",
    hint: "DRAG TO ORBIT THE CORE · SCROLL TO ZOOM · ROTATE TO INSPECT",
  },
  skills: {
    Scene: SkillsPlanetScene,
    color: "#60a5fa",
    sector: "SECTOR · CAPABILITIES",
    title: "SKILL CONSTELLATION",
    description:
      "A network of core capabilities — technical support, systems administration, networking, and data recovery — linked to a central node.",
    hint: "EXPLORE THE CONSTELLATION NODES AND THEIR LINKED SKILLS",
  },
  projects: {
    Scene: ProjectsPlanetScene,
    color: "#a78bfa",
    sector: "SECTOR · BUILT SYSTEMS",
    title: "PROJECT NEXUS",
    description:
      "The systems built: a library management platform, a class scheduling app, and an e-commerce shopping cart.",
    hint: "INSPECT THE ORBITING PROJECT MODULES AROUND THE NEXUS",
  },
  experience: {
    Scene: ExperiencePlanetScene,
    color: "#34d399",
    sector: "SECTOR · CAREER",
    title: "CAREER PATHWAY",
    description:
      "The professional journey — from IT specialist through systems administration, networking, and toward full-stack development.",
    hint: "FOLLOW THE LIGHT TRAIL ALONG THE MILESTONE BEACONS",
  },
  education: {
    Scene: EducationPlanetScene,
    color: "#fbbf24",
    sector: "SECTOR · ACADEMIA",
    title: "LIBRARY OF KNOWLEDGE",
    description:
      "Bachelor of Science in Information Technology (2022 — 2026). A floating library core with orbiting spheres of knowledge.",
    hint: "TRACE THE ORBITING KNOWLEDGE SPHERES AROUND THE TOME",
  },
  contact: {
    Scene: ContactPlanetScene,
    color: "#f472b6",
    sector: "SECTOR · COMMS",
    title: "TRANSMISSION BEACON",
    description: "📞 +63 965 064 9357  ·  ✉️ ganaswenrick90@gmail.com",
    hint: "TUNE INTO THE BEACON · THE SIGNAL RINGS NEVER STOP BROADCASTING",
  },
};

export default function PlanetSceneView() {
  const { activePlanet, setActivePlanet, setFlyBackHome } = usePortfolioStore();
  const config = activePlanet ? PLANET_WORLDS[activePlanet] : null;

  const handleBack = () => {
    setActivePlanet(null);
    setFlyBackHome(true);
  };

  return (
    <AnimatePresence>
      {config && (
        <motion.div
          key={activePlanet}
          initial={{ opacity: 0, scale: 0.72, filter: "blur(14px)" }}
          animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
          exit={{ opacity: 0, scale: 1.12, filter: "blur(14px)" }}
          transition={{ duration: 0.7, ease: "easeOut" }}
          className="fixed inset-0 z-20"
        >
          {/* Materialize shockwave ring */}
          <motion.div
            className="absolute rounded-full border-2 pointer-events-none"
            style={{
              left: "50%",
              top: "50%",
              width: 64,
              height: 64,
              marginLeft: -32,
              marginTop: -32,
              borderColor: config.color,
              boxShadow: `0 0 40px ${config.color}80`,
            }}
            initial={{ scale: 0.2, opacity: 1 }}
            animate={{ scale: 32, opacity: 0 }}
            transition={{ duration: 0.9, ease: "easeOut" }}
          />

          <Canvas gl={{ antialias: true, alpha: true }}>
            <config.Scene />
          </Canvas>

          {/* Back button */}
          <motion.button
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.35 }}
            onClick={handleBack}
            className="fixed top-6 left-6 z-10 flex items-center gap-3 px-5 py-2.5 rounded-full border bg-[#070b1a]/70 backdrop-blur-md text-white/80 hover:text-white transition-all group"
            style={{ borderColor: `${config.color}55`, boxShadow: `0 0 25px ${config.color}25` }}
          >
            <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
            <span className="font-mono text-xs tracking-[0.25em]">EXIT SECTOR</span>
          </motion.button>

          {/* Control hint (top right) */}
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="fixed top-6 right-6 z-10 hidden md:flex items-center gap-3 px-4 py-2 rounded-full border bg-[#070b1a]/60 backdrop-blur-md"
            style={{ borderColor: `${config.color}30` }}
          >
            <Orbit size={14} style={{ color: config.color }} />
            <span className="font-mono text-[10px] tracking-widest text-slate-400">
              DRAG · ZOOM · ROTATE
            </span>
          </motion.div>

          {/* HUD info panel */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.45 }}
            className="fixed bottom-6 left-1/2 -translate-x-1/2 z-10 w-[92vw] max-w-3xl"
          >
            <div
              className="relative rounded-2xl p-[1px] overflow-hidden"
              style={{
                background: `linear-gradient(135deg, ${config.color}66, transparent 40%, transparent 60%, ${config.color}66)`,
              }}
            >
              <div className="relative rounded-2xl bg-[#070b1a]/92 backdrop-blur-xl p-6 overflow-hidden">
                {/* Corner accents */}
                <div
                  className="absolute top-0 left-0 h-10 w-10 border-t-2 border-l-2"
                  style={{ borderColor: `${config.color}80` }}
                />
                <div
                  className="absolute bottom-0 right-0 h-10 w-10 border-b-2 border-r-2"
                  style={{ borderColor: `${config.color}80` }}
                />

                <div className="flex items-center gap-3 mb-2">
                  <Satellite size={14} style={{ color: config.color }} />
                  <span
                    className="font-mono text-[11px] tracking-[0.3em]"
                    style={{ color: config.color }}
                  >
                    {config.sector}
                  </span>
                  <div
                    className="h-px flex-1"
                    style={{ background: `linear-gradient(90deg, ${config.color}60, transparent)` }}
                  />
                </div>

                <h2
                  className="text-2xl md:text-3xl font-bold font-mono mb-3"
                  style={{ color: config.color, textShadow: `0 0 20px ${config.color}60` }}
                >
                  {config.title}
                </h2>
                <p className="text-slate-300 leading-relaxed mb-3">{config.description}</p>
                <p className="font-mono text-sm" style={{ color: `${config.color}cc` }}>
                  &gt; {config.hint}
                </p>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
