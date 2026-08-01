"use client";

import { usePortfolioStore } from "@/store/usePortfolioStore";
import { motion } from "framer-motion";
import {
  Terminal,
  Cpu,
  Briefcase,
  GraduationCap,
  MessageSquare,
  Code2,
  Phone,
  Mail,
  MapPin,
  Zap,
  Server,
  Globe,
  BookOpen,
  ShoppingCart,
  Send,
} from "lucide-react";

const SECTION_IDS = ["about", "skills", "experience", "projects", "education", "contact"] as const;

const sectionConfig = {
  about: { icon: Terminal, color: "#22d3ee", label: "ABOUT" },
  skills: { icon: Cpu, color: "#60a5fa", label: "SKILLS" },
  experience: { icon: Briefcase, color: "#34d399", label: "EXPERIENCE" },
  projects: { icon: Code2, color: "#a78bfa", label: "PROJECTS" },
  education: { icon: GraduationCap, color: "#fbbf24", label: "EDUCATION" },
  contact: { icon: MessageSquare, color: "#f472b6", label: "CONTACT" },
};

const technicalSkills = [
  { name: "Technical Support & Troubleshooting", level: 90 },
  { name: "Hardware & Software Installation", level: 85 },
  { name: "Basic Network Configuration", level: 75 },
  { name: "System Maintenance", level: 88 },
  { name: "User Account Management", level: 82 },
  { name: "Data Backup & Recovery", level: 80 },
  { name: "IT Documentation", level: 78 },
];

const tools = [
  { name: "Windows", icon: "🪟" },
  { name: "Google Workspace", icon: "☁️" },
  { name: "Microsoft Office", icon: "📊" },
  { name: "Android Studio", icon: "🤖" },
  { name: "VS Code", icon: "💻" },
  { name: "Remote Support", icon: "🔗" },
];

const projects = [
  {
    title: "Library Management System",
    icon: BookOpen,
    description: "A comprehensive library management system for tracking books, borrowers, and transactions with an intuitive admin dashboard.",
    tags: ["System Design", "Database", "CRUD"],
  },
  {
    title: "ClassSchedularApp & Web",
    icon: Code2,
    description: "Cross-platform class scheduling and timetable management application for educational institutions.",
    tags: ["Scheduling", "Cross-Platform", "UI/UX"],
  },
  {
    title: "Shopping Cart Web",
    icon: ShoppingCart,
    description: "Full-featured e-commerce shopping cart application with product catalog, cart management, and checkout flow.",
    tags: ["E-Commerce", "Web App", "Frontend"],
  },
];

const responsibilities = [
  "Technical support and troubleshooting for hardware and software issues",
  "Hardware and software installation and configuration",
  "User account management and access control",
  "System maintenance and performance optimization",
  "Data backup, recovery, and integrity management",
  "Network configuration and connectivity troubleshooting",
  "IT documentation and standard operating procedures",
];

export default function SimpleResume() {
  const { simpleView, setSimpleView } = usePortfolioStore();

  if (!simpleView) return null;

  return (
    <div className="fixed inset-0 z-50 bg-[#020617] overflow-y-auto">
      {/* Header */}
      <div className="sticky top-0 z-10 bg-[#020617]/95 backdrop-blur-md border-b border-slate-800/50">
        <div className="max-w-4xl mx-auto px-6 py-4 flex items-center justify-between">
          <h1 className="font-mono text-lg tracking-widest text-cyan-400">WENRICK JAY Z. GANAS</h1>
          <button
            onClick={() => setSimpleView(false)}
            className="flex items-center gap-2 px-4 py-2 rounded-full border border-slate-700/50 bg-slate-800/30 text-slate-400 hover:text-cyan-400 hover:border-cyan-400/30 transition-all font-mono text-xs tracking-wider"
          >
            3D VIEW
          </button>
        </div>
      </div>

      {/* Section Nav */}
      <div className="sticky top-[65px] z-10 bg-[#020617]/90 backdrop-blur-md border-b border-slate-800/30">
        <div className="max-w-4xl mx-auto px-6 py-3 flex gap-4 overflow-x-auto">
          {SECTION_IDS.map((id) => {
            const config = sectionConfig[id];
            return (
              <a
                key={id}
                href={`#${id}`}
                className="flex items-center gap-2 px-3 py-1.5 rounded-full border border-slate-700/30 hover:border-slate-600/50 transition-all font-mono text-[10px] tracking-widest text-slate-500 hover:text-slate-300 whitespace-nowrap"
              >
                <config.icon size={12} style={{ color: config.color }} />
                {config.label}
              </a>
            );
          })}
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-6 py-12 space-y-16">
        {/* About */}
        <motion.section
          id="about"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="space-y-6"
        >
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-cyan-500/10 border border-cyan-500/20">
              <Terminal size={24} className="text-cyan-400" />
            </div>
            <h2 className="text-2xl font-bold font-mono tracking-wider text-cyan-400">ABOUT ME</h2>
          </div>
          <div className="h-px bg-gradient-to-r from-cyan-500/50 via-cyan-500/20 to-transparent" />
          <div className="grid md:grid-cols-2 gap-8">
            <div className="space-y-4">
              <p className="text-slate-300 leading-relaxed font-mono">
                Hi, I&apos;m <span className="text-cyan-400 font-semibold">Wenrick Jay Z. Ganas</span> — a detail-oriented and
                solutions-driven IT Specialist with experience in technical support, system maintenance, and
                network troubleshooting.
              </p>
              <p className="text-slate-400 leading-relaxed font-mono">
                I thrive on solving complex technical problems and building efficient systems. Currently pursuing
                my BS in Information Technology while gaining hands-on experience in the field.
              </p>
            </div>
            <div className="grid grid-cols-2 gap-4">
              {[
                { label: "Experience", value: "2+ Years", icon: Briefcase },
                { label: "Projects", value: "10+", icon: Code2 },
                { label: "Speciality", value: "Full-Stack", icon: Globe },
                { label: "Focus", value: "IT Systems", icon: Server },
              ].map((stat, i) => (
                <div key={i} className="p-4 rounded-xl border border-cyan-500/10 bg-cyan-500/5">
                  <stat.icon size={18} className="text-cyan-500/60 mb-2" />
                  <p className="text-xl font-bold text-cyan-400 font-mono">{stat.value}</p>
                  <p className="text-xs text-slate-500 uppercase tracking-wider font-mono">{stat.label}</p>
                </div>
              ))}
            </div>
          </div>
        </motion.section>

        {/* Skills */}
        <motion.section
          id="skills"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="space-y-6"
        >
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-blue-500/10 border border-blue-500/20">
              <Cpu size={24} className="text-blue-400" />
            </div>
            <h2 className="text-2xl font-bold font-mono tracking-wider text-blue-400">SKILLS</h2>
          </div>
          <div className="h-px bg-gradient-to-r from-blue-500/50 via-blue-500/20 to-transparent" />
          <div className="grid md:grid-cols-2 gap-8">
            <div>
              <h3 className="text-sm font-semibold text-white mb-4 flex items-center gap-2 font-mono">
                <Zap size={16} className="text-blue-400" /> Technical Skills
              </h3>
              <div className="space-y-3">
                {technicalSkills.map((skill, i) => (
                  <div key={i}>
                    <div className="flex justify-between mb-1">
                      <span className="text-sm text-slate-300 font-mono">{skill.name}</span>
                      <span className="text-xs text-blue-400/70 font-mono">{skill.level}%</span>
                    </div>
                    <div className="h-1.5 bg-slate-800 rounded-full overflow-hidden">
                      <div
                        className="h-full rounded-full bg-gradient-to-r from-blue-500 to-cyan-400"
                        style={{ width: `${skill.level}%`, boxShadow: "0 0 8px rgba(96,165,250,0.3)" }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div>
              <h3 className="text-sm font-semibold text-white mb-4 flex items-center gap-2 font-mono">
                <Cpu size={16} className="text-blue-400" /> Tools & Platforms
              </h3>
              <div className="grid grid-cols-2 gap-3">
                {tools.map((tool, i) => (
                  <div
                    key={i}
                    className="flex items-center gap-3 p-3 rounded-xl border border-blue-500/15 bg-blue-500/5"
                  >
                    <span className="text-xl">{tool.icon}</span>
                    <span className="text-sm text-slate-300 font-mono">{tool.name}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </motion.section>

        {/* Experience */}
        <motion.section
          id="experience"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="space-y-6"
        >
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-emerald-500/10 border border-emerald-500/20">
              <Briefcase size={24} className="text-emerald-400" />
            </div>
            <h2 className="text-2xl font-bold font-mono tracking-wider text-emerald-400">EXPERIENCE</h2>
          </div>
          <div className="h-px bg-gradient-to-r from-emerald-500/50 via-emerald-500/20 to-transparent" />
          <div className="relative pl-8">
            <div className="absolute left-3 top-0 bottom-0 w-px bg-gradient-to-b from-emerald-500/50 via-emerald-500/20 to-transparent" />
            <div className="relative">
              <div className="absolute -left-8 top-1 w-6 h-6 rounded-full border-2 border-emerald-500/50 bg-[#0a0f1e] flex items-center justify-center">
                <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse-glow" />
              </div>
              <div className="p-6 rounded-2xl border border-emerald-500/15 bg-gradient-to-br from-emerald-500/5 to-transparent">
                <div className="flex flex-wrap items-baseline gap-3 mb-1">
                  <h3 className="text-xl font-bold text-white font-mono">IT Specialist</h3>
                  <span className="px-3 py-0.5 text-xs font-mono text-emerald-300 bg-emerald-500/10 rounded-full border border-emerald-500/20">
                    REMOTE
                  </span>
                </div>
                <p className="text-emerald-300/80 font-mono text-sm mb-5">Philippines</p>
                <ul className="space-y-3">
                  {responsibilities.map((item, i) => (
                    <li key={i} className="flex gap-3 text-slate-300 text-sm font-mono">
                      <span className="mt-1.5 h-1.5 w-1.5 rounded-full bg-emerald-400 shrink-0" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </motion.section>

        {/* Projects */}
        <motion.section
          id="projects"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="space-y-6"
        >
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-purple-500/10 border border-purple-500/20">
              <Code2 size={24} className="text-purple-400" />
            </div>
            <h2 className="text-2xl font-bold font-mono tracking-wider text-purple-400">PROJECTS</h2>
          </div>
          <div className="h-px bg-gradient-to-r from-purple-500/50 via-purple-500/20 to-transparent" />
          <div className="grid md:grid-cols-3 gap-5">
            {projects.map((project, i) => (
              <div
                key={i}
                className="p-6 rounded-2xl border border-purple-500/15 bg-gradient-to-br from-purple-500/5 to-transparent"
              >
                <div className="p-3 rounded-xl bg-purple-500/10 border border-purple-500/20 w-fit mb-4">
                  <project.icon size={24} className="text-purple-400" />
                </div>
                <h3 className="text-lg font-bold text-purple-200 mb-2 font-mono">{project.title}</h3>
                <p className="text-sm text-slate-400 leading-relaxed mb-4 font-mono">{project.description}</p>
                <div className="flex flex-wrap gap-2">
                  {project.tags.map((tag, j) => (
                    <span
                      key={j}
                      className="px-2.5 py-1 text-[11px] font-mono text-purple-300/80 bg-purple-500/10 rounded-lg border border-purple-500/15"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </motion.section>

        {/* Education */}
        <motion.section
          id="education"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="space-y-6"
        >
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-amber-500/10 border border-amber-500/20">
              <GraduationCap size={24} className="text-amber-400" />
            </div>
            <h2 className="text-2xl font-bold font-mono tracking-wider text-amber-400">EDUCATION</h2>
          </div>
          <div className="h-px bg-gradient-to-r from-amber-500/50 via-amber-500/20 to-transparent" />
          <div className="p-6 rounded-2xl border border-amber-500/15 bg-gradient-to-br from-amber-500/5 to-transparent">
            <div className="flex items-start gap-4">
              <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/20 shrink-0">
                <GraduationCap size={28} className="text-amber-400" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-white mb-1 font-mono">
                  Bachelor of Science in Information Technology
                </h3>
                <div className="flex items-center gap-3 mb-4">
                  <span className="font-mono text-sm text-amber-300/80">2022 — 2026</span>
                  <span className="px-2.5 py-0.5 text-[11px] font-mono text-amber-300 bg-amber-500/10 rounded-full border border-amber-500/20">
                    IN PROGRESS
                  </span>
                </div>
                <p className="text-slate-400 leading-relaxed font-mono">
                  Currently pursuing my degree with a focus on web development, software engineering, and IT systems management. Actively building projects and gaining hands-on experience through coursework and personal initiatives.
                </p>
                <div className="grid grid-cols-3 gap-4 mt-6">
                  {[
                    { label: "Year", value: "4th" },
                    { label: "Focus", value: "IT Systems" },
                    { label: "Status", value: "Active" },
                  ].map((item, i) => (
                    <div key={i} className="p-3 rounded-xl bg-amber-500/5 border border-amber-500/10 text-center">
                      <p className="text-lg font-bold text-amber-400 font-mono">{item.value}</p>
                      <p className="text-[11px] text-slate-500 uppercase tracking-wider font-mono">{item.label}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </motion.section>

        {/* Contact */}
        <motion.section
          id="contact"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="space-y-6"
        >
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-pink-500/10 border border-pink-500/20">
              <MessageSquare size={24} className="text-pink-400" />
            </div>
            <h2 className="text-2xl font-bold font-mono tracking-wider text-pink-400">CONTACT</h2>
          </div>
          <div className="h-px bg-gradient-to-r from-pink-500/50 via-pink-500/20 to-transparent" />
          <div className="grid md:grid-cols-2 gap-8">
            <div className="space-y-4">
              <p className="text-slate-400 leading-relaxed mb-6 font-mono">
                Got a project in mind or want to collaborate? Feel free to reach out through any of these channels.
              </p>
              {[
                { icon: Phone, label: "Phone", value: "+63 965 064 9357", href: "tel:+639650649357" },
                { icon: Mail, label: "Email", value: "ganaswenrick90@gmail.com", href: "mailto:ganaswenrick90@gmail.com" },
                { icon: MapPin, label: "Location", value: "Philippines", href: null },
              ].map((item, i) => (
                <div
                  key={i}
                  className="flex items-center gap-4 p-4 rounded-xl border border-pink-500/15 bg-pink-500/5"
                >
                  <div className="p-2.5 rounded-lg bg-pink-500/10 border border-pink-500/15">
                    <item.icon size={20} className="text-pink-400" />
                  </div>
                  <div>
                    <p className="text-xs text-slate-500 uppercase tracking-wider mb-0.5 font-mono">
                      {item.label}
                    </p>
                    {item.href ? (
                      <a
                        href={item.href}
                        className="font-mono text-sm text-pink-300 hover:text-pink-200 transition-colors"
                      >
                        {item.value}
                      </a>
                    ) : (
                      <p className="font-mono text-sm text-pink-300">{item.value}</p>
                    )}
                  </div>
                </div>
              ))}
            </div>
            <div className="space-y-4">
              <div className="space-y-4">
                <input
                  type="text"
                  placeholder="Your Name"
                  className="w-full p-3.5 bg-slate-900/50 border border-pink-500/20 rounded-xl text-white text-sm font-mono placeholder:text-slate-700 focus:outline-none focus:border-pink-500/50 transition-all"
                />
                <input
                  type="email"
                  placeholder="Your Email"
                  className="w-full p-3.5 bg-slate-900/50 border border-pink-500/20 rounded-xl text-white text-sm font-mono placeholder:text-slate-700 focus:outline-none focus:border-pink-500/50 transition-all"
                />
                <textarea
                  placeholder="Tell me about your project..."
                  rows={4}
                  className="w-full p-3.5 bg-slate-900/50 border border-pink-500/20 rounded-xl text-white text-sm font-mono placeholder:text-slate-700 focus:outline-none focus:border-pink-500/50 transition-all resize-none"
                />
              </div>
              <button
                type="button"
                className="w-full py-3.5 bg-gradient-to-r from-pink-500/20 to-purple-500/20 border border-pink-500/30 rounded-xl text-pink-300 font-mono text-sm font-semibold hover:from-pink-500/30 hover:to-purple-500/30 transition-all duration-300 flex items-center justify-center gap-2"
              >
                <Send size={16} />
                SEND MESSAGE
              </button>
            </div>
          </div>
        </motion.section>

        {/* Footer */}
        <div className="pt-8 pb-12 border-t border-slate-800/30 text-center">
          <p className="font-mono text-xs text-slate-600 tracking-wider">
            &copy; 2026 Wenrick Jay Z. Ganas. All rights reserved.
          </p>
        </div>
      </div>
    </div>
  );
}
