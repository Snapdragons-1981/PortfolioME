"use client";

import { motion } from "framer-motion";

export default function ExperienceSection() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="fixed inset-0 z-20 flex items-center justify-center p-4"
    >
      <div className="w-full max-w-4xl bg-slate-900/90 backdrop-blur-xl border border-green-500/40 rounded-2xl p-8 shadow-2xl shadow-green-500/20">
        <h1 className="text-4xl font-bold font-mono text-green-400 mb-8 tracking-widest">
          EXPERIENCE
        </h1>
        
        <div className="space-y-6">
          <div className="border-l-4 border-green-500 pl-6">
            <h2 className="text-2xl font-semibold text-white">IT Specialist</h2>
            <p className="text-green-300 font-mono text-sm mb-2">Remote • Philippines</p>
            <ul className="space-y-2 text-slate-300">
              <li className="flex items-start gap-2">
                <span className="text-green-400 mt-1">•</span>
                <span>Provided technical support for hardware, software, and basic network-related issues</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-green-400 mt-1">•</span>
                <span>Assisted in installing and configuring computers, printers, and networking devices</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-green-400 mt-1">•</span>
                <span>Helped manage user accounts and implemented basic security practices</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-green-400 mt-1">•</span>
                <span>Troubleshot system and software errors to minimize downtime</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-green-400 mt-1">•</span>
                <span>Supported data entry, backups, and basic database maintenance tasks</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-green-400 mt-1">•</span>
                <span>Assisted internal teams with technical setup and IT-related improvements</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-green-400 mt-1">•</span>
                <span>Helped maintain smooth day-to-day IT operations</span>
              </li>
            </ul>
          </div>

          <div className="mt-8 pt-6 border-t border-slate-700">
            <h3 className="text-xl font-semibold text-green-300 mb-4">Tools & Systems</h3>
            <div className="flex flex-wrap gap-3">
              {["Windows OS", "Google Workspace", "Microsoft Office", "Basic Router Configuration", "Printer Configuration", "Android Studio", "Basic Automation Tools", "Cybersecurity Best Practices", "Remote Support Tools"].map((tool, i) => (
                <motion.span
                  key={i}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: i * 0.05 }}
                  className="px-4 py-2 bg-green-500/10 border border-green-500/30 rounded-full text-sm font-mono text-green-300"
                >
                  {tool}
                </motion.span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
