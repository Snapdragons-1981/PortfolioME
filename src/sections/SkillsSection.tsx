"use client";

import { motion } from "framer-motion";
import { Cpu } from "lucide-react";

export default function SkillsSection() {
  const technicalSkills = [
    { name: "Technical Support & Troubleshooting" },
    { name: "Hardware & Software Installation" },
    { name: "Basic Network Configuration" },
    { name: "System Maintenance" },
    { name: "User Account Management" },
    { name: "Data Backup & Recovery" },
    { name: "IT Documentation & SOP Creation" },
    { name: "Database Support (Basic)" },
    { name: "Basic Router & Printer Configuration" },
  ];

  const softSkills = [
    { name: "Systems Thinking" },
    { name: "Problem-Solving" },
    { name: "Process Improvement" },
    { name: "Attention to Detail" },
    { name: "Documentation & Reporting" },
    { name: "Time Management" },
    { name: "Adaptability" },
  ];

  const tools = [
    { name: "Windows OS" },
    { name: "Google Workspace" },
    { name: "Microsoft Office" },
    { name: "Android Studio (App Development)" },
    { name: "Basic Automation Tools" },
    { name: "Remote Support Tools" },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="fixed inset-0 z-20 flex items-center justify-center p-4 overflow-y-auto py-8"
    >
      <div className="w-full max-w-5xl bg-slate-900/90 backdrop-blur-xl border border-blue-500/40 rounded-2xl p-8 shadow-2xl shadow-blue-500/20">
        <div className="flex items-center gap-3 mb-8">
          <Cpu className="text-blue-400" size={48} />
          <h1 className="text-4xl font-bold font-mono text-blue-400 tracking-widest">
            SKILLS
          </h1>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Technical Skills */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
          >
            <h2 className="text-2xl font-bold text-white mb-4 border-l-4 border-blue-500 pl-4">
              Technical Skills
            </h2>
            <ul className="space-y-3">
              {technicalSkills.map((skill, i) => (
                <motion.li
                  key={i}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.05 + 0.3 }}
                  className="flex items-center gap-3 text-slate-300"
                >
                  <span className="text-blue-400">•</span>
                  {skill.name}
                </motion.li>
              ))}
            </ul>
          </motion.div>

          {/* Soft Skills */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
          >
            <h2 className="text-2xl font-bold text-white mb-4 border-l-4 border-blue-500 pl-4">
              Soft Skills
            </h2>
            <ul className="space-y-3">
              {softSkills.map((skill, i) => (
                <motion.li
                  key={i}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.05 + 0.4 }}
                  className="flex items-center gap-3 text-slate-300"
                >
                  <span className="text-blue-400">•</span>
                  {skill.name}
                </motion.li>
              ))}
            </ul>
          </motion.div>
        </div>

        {/* Tools Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="mt-8 pt-6 border-t border-slate-700"
        >
          <h3 className="text-xl font-semibold text-blue-300 mb-4">Tools & Technologies</h3>
          <div className="flex flex-wrap gap-3">
            {tools.map((tool, i) => (
              <motion.span
                key={i}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: i * 0.05 + 0.6 }}
                className="px-4 py-2 bg-blue-500/10 border border-blue-500/30 rounded-full text-sm font-mono text-blue-300"
              >
                {tool.name}
              </motion.span>
            ))}
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
}
