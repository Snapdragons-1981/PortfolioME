"use client";

import { motion } from "framer-motion";
import { GraduationCap } from "lucide-react";

export default function EducationSection() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="fixed inset-0 z-20 flex items-center justify-center p-4"
    >
      <div className="w-full max-w-4xl bg-slate-900/90 backdrop-blur-xl border border-yellow-500/40 rounded-2xl p-8 shadow-2xl shadow-yellow-500/20">
        <div className="flex items-center gap-3 mb-8">
          <GraduationCap className="text-yellow-400" size={48} />
          <h1 className="text-4xl font-bold font-mono text-yellow-400 tracking-widest">
            EDUCATION
          </h1>
        </div>
        
        <div className="space-y-6">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="border-l-4 border-yellow-500 pl-6"
          >
            <h2 className="text-2xl font-semibold text-white">Bachelor of Science in Information Technology</h2>
            <p className="text-yellow-300 font-mono text-lg mb-2">2022 - 2026</p>
            <p className="text-slate-300">
              Focused on software development, network administration, IT management, and modern technology practices.
            </p>
          </motion.div>

          <div className="mt-8 pt-6 border-t border-slate-700">
            <h3 className="text-xl font-semibold text-yellow-300 mb-4">Academic Highlights</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {["Software Development", "Network Administration", "Database Management", "Web Technologies", "System Analysis", "IT Project Management"].map((item, i) => (
                <div key={i} className="flex items-center gap-2 text-slate-300">
                  <span className="text-yellow-400">✓</span>
                  {item}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
