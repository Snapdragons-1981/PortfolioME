"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Terminal,
  Cpu,
  Briefcase,
  GraduationCap,
  MessageSquare,
  Code2,
} from "lucide-react";

export type NavItem = {
  id: string;
  label: string;
  icon: React.ReactNode;
  color: string;
  glowColor: string;
};

const navItems: NavItem[] = [
  { id: "about", label: "ABOUT", icon: <Terminal size={18} />, color: "text-cyan-400", glowColor: "rgba(34,211,238,0.4)" },
  { id: "skills", label: "SKILLS", icon: <Cpu size={18} />, color: "text-green-400", glowColor: "rgba(74,222,128,0.4)" },
  { id: "projects", label: "PROJECTS", icon: <Code2 size={18} />, color: "text-purple-400", glowColor: "rgba(168,85,247,0.4)" },
  { id: "experience", label: "EXPERIENCE", icon: <Briefcase size={18} />, color: "text-orange-400", glowColor: "rgba(251,146,60,0.4)" },
  { id: "education", label: "EDUCATION", icon: <GraduationCap size={18} />, color: "text-yellow-400", glowColor: "rgba(250,204,21,0.4)" },
  { id: "contact", label: "CONTACT", icon: <MessageSquare size={18} />, color: "text-pink-400", glowColor: "rgba(244,114,182,0.4)" },
];

interface HolographicNavProps {
  onSelect: (id: string) => void;
}

export default function HolographicNav({ onSelect }: HolographicNavProps) {
  const [hoveredItem, setHoveredItem] = useState<string | null>(null);

  return (
    <div className="fixed right-6 top-1/2 -translate-y-1/2 z-10">
      <div className="flex flex-col items-center gap-1">
        {/* Vertical line connector */}
        <div className="absolute top-0 bottom-0 w-px bg-gradient-to-b from-transparent via-slate-700/50 to-transparent right-1/2 translate-x-1/2" />

        {navItems.map((item, index) => (
          <motion.button
            key={item.id}
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.5 + index * 0.08, ease: "easeOut" }}
            onMouseEnter={() => setHoveredItem(item.id)}
            onMouseLeave={() => setHoveredItem(null)}
            onClick={() => onSelect(item.id)}
            className="group relative flex items-center justify-center z-10"
          >
            {/* Icon button */}
            <motion.div
              className={`relative flex h-11 w-11 items-center justify-center rounded-full border border-slate-700/60 bg-[#0a0f1e]/80 backdrop-blur-md transition-all duration-300 ${item.color}`}
              whileHover={{
                scale: 1.15,
                boxShadow: `0 0 20px ${item.glowColor}, 0 0 40px ${item.glowColor.replace("0.4", "0.15")}`,
              }}
              style={{
                borderColor:
                  hoveredItem === item.id
                    ? item.glowColor.replace("0.4", "0.5")
                    : undefined,
              }}
            >
              {item.icon}
            </motion.div>

            {/* Tooltip */}
            <AnimatePresence>
              {hoveredItem === item.id && (
                <motion.div
                  initial={{ opacity: 0, x: -10, scale: 0.95 }}
                  animate={{ opacity: 1, x: 0, scale: 1 }}
                  exit={{ opacity: 0, x: -10, scale: 0.95 }}
                  transition={{ duration: 0.15 }}
                  className="absolute right-full mr-4 whitespace-nowrap rounded-lg border border-slate-700/60 bg-[#0a0f1e]/95 backdrop-blur-md px-3.5 py-2 font-mono text-xs text-slate-200 shadow-xl"
                  style={{
                    boxShadow: `0 0 15px rgba(0,0,0,0.3), 0 0 10px ${item.glowColor.replace("0.4", "0.1")}`,
                  }}
                >
                  {item.label}
                  {/* Arrow */}
                  <div
                    className="absolute -right-1.5 top-1/2 h-2.5 w-2.5 -translate-y-1/2 rotate-45 bg-[#0a0f1e]/95 border-r border-t border-slate-700/60"
                  />
                </motion.div>
              )}
            </AnimatePresence>
          </motion.button>
        ))}
      </div>
    </div>
  );
}
