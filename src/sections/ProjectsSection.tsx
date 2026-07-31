"use client";

import { motion } from "framer-motion";
import { FolderOpen } from "lucide-react";

export default function ProjectsSection() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="fixed inset-0 z-20 flex items-center justify-center p-4"
    >
      <div className="w-full max-w-4xl bg-slate-900/90 backdrop-blur-xl border border-purple-500/40 rounded-2xl p-8 shadow-2xl shadow-purple-500/20">
        <div className="flex items-center gap-3 mb-8">
          <FolderOpen className="text-purple-400" size={48} />
          <h1 className="text-4xl font-bold font-mono text-purple-400 tracking-widest">
            PROJECTS
          </h1>
        </div>
        
        <div className="text-center py-12">
          <p className="text-slate-400 text-lg mb-4">Coming Soon!</p>
          <p className="text-slate-500 font-mono">
            This section will showcase amazing projects!
          </p>
        </div>
      </div>
    </motion.div>
  );
}
