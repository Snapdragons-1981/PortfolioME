"use client";

import { usePortfolioStore } from "@/store/usePortfolioStore";
import { X, Terminal as TerminalIcon } from "lucide-react";
import React, { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const commands = {
  help: () => `Available commands:
  help           - Show this help message
  about          - About me
  skills         - My skills
  projects       - My projects
  experience     - Work experience
  education      - Education
  contact        - Contact info
  clear          - Clear terminal
  coffee         - Get coffee
  joke           - Tell a joke
  whoami         - Who are you?
  date           - Current date & time
  sudo hire wenrick  - Hire me!`,
  about: () =>
    `Hi, I'm Wenrick Jay Z. Ganas!
I'm a detail-oriented and solutions-driven IT Specialist
with experience in technical support, system maintenance,
and basic network troubleshooting.`,
  skills: () => `My skills include:
  > Technical Support & Troubleshooting
  > Hardware & Software Installation
  > Basic Network Configuration
  > System Maintenance
  > User Account Management
  > Data Backup & Recovery
  > IT Documentation & SOP Creation`,
  projects: () => `My projects:
  [1] Library Management System
  [2] ClassSchedularApp and Web
  [3] Shopping Cart Web`,
  experience: () => `Work Experience:
  IT Specialist | Remote, Philippines
  > Technical support & troubleshooting
  > System maintenance & optimization
  > Network configuration & troubleshooting`,
  education: () => `Education:
  BS Information Technology (2022 - 2026)
  Currently pursuing my degree!`,
  contact: () => `Contact:
  Phone : +63 965 064 9357
  Email : ganaswenrick90@gmail.com
  Web   : wenrick.dev`,
  clear: () => "CLEAR",
  coffee: () => `     ( (
      ) )
   .______.
   |      |]
   \\      /
    \`----'
  Here's your coffee! Enjoy!`,
  joke: () =>
    `Why do programmers prefer dark mode?
Because light attracts bugs! 🐛`,
  whoami: () => "wenrick@digital-universe:~$ A passionate Full-Stack Developer",
  date: () => new Date().toLocaleString("en-US", { dateStyle: "full", timeStyle: "long" }),
  "sudo hire wenrick": () =>
    `🎉🎉🎉🎉🎉🎉🎉🎉🎉🎉
  YOU HAVE BEEN HIRED!
  🎉🎉🎉🎉🎉🎉🎉🎉🎉🎉`,
};

const welcomeArt = `
╔══════════════════════════════════════════════╗
║  WENRICK SYSTEMS TERMINAL v3.0              ║
║  Type "help" to see available commands       ║
╚══════════════════════════════════════════════╝`;

export default function HackerTerminal() {
  const { showTerminal, setShowTerminal } = usePortfolioStore();
  const [history, setHistory] = useState<string[]>([welcomeArt]);
  const [input, setInput] = useState("");
  const bottomRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [history]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "`") {
        e.preventDefault();
        setShowTerminal(!showTerminal);
      }
      if (e.key === "Escape" && showTerminal) {
        setShowTerminal(false);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [showTerminal, setShowTerminal]);

  useEffect(() => {
    if (showTerminal) {
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [showTerminal]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const cmd = input.trim().toLowerCase();

    if (cmd) {
      setHistory((prev) => [...prev, `\x1b[32mroot@wenrick:~$\x1b[0m ${input}`]);

      if (cmd in commands) {
        const result = commands[cmd as keyof typeof commands]();
        if (result === "CLEAR") {
          setHistory([welcomeArt]);
        } else {
          setHistory((prev) => [...prev, result]);
        }
      } else {
        setHistory((prev) => [
          ...prev,
          `bash: ${cmd}: command not found. Type "help" for available commands.`,
        ]);
      }
    }

    setInput("");
  };

  return (
    <AnimatePresence>
      {showTerminal && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          style={{
            background: "radial-gradient(ellipse at center, rgba(0,0,0,0.85), rgba(0,0,0,0.95))",
          }}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            transition={{ type: "spring", damping: 20, stiffness: 300 }}
            className="w-full max-w-4xl"
          >
            {/* Terminal frame */}
            <div className="rounded-2xl overflow-hidden border border-green-500/30 shadow-[0_0_60px_rgba(34,197,94,0.1)]">
              {/* Title bar */}
              <div className="flex items-center justify-between px-4 py-3 bg-[#0a120a] border-b border-green-500/20">
                <div className="flex items-center gap-3">
                  <div className="flex gap-2">
                    <div className="w-3 h-3 rounded-full bg-red-500/80 hover:bg-red-500 transition-colors" />
                    <div className="w-3 h-3 rounded-full bg-yellow-500/80 hover:bg-yellow-500 transition-colors" />
                    <div className="w-3 h-3 rounded-full bg-green-500/80 hover:bg-green-500 transition-colors" />
                  </div>
                  <div className="flex items-center gap-2 ml-2">
                    <TerminalIcon size={14} className="text-green-500/60" />
                    <span className="text-green-500/60 font-mono text-xs tracking-wider">
                      root@wenrick:~
                    </span>
                  </div>
                </div>
                <button
                  onClick={() => setShowTerminal(false)}
                  className="text-green-500/40 hover:text-green-400 transition-colors p-1 rounded-lg hover:bg-green-500/10"
                >
                  <X size={18} />
                </button>
              </div>

              {/* Terminal body with CRT effect */}
              <div className="relative bg-[#0a0f0a]">
                {/* CRT scanlines */}
                <div
                  className="pointer-events-none absolute inset-0 z-10 opacity-[0.03]"
                  style={{
                    background:
                      "repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(34,197,94,0.1) 2px, rgba(34,197,94,0.1) 4px)",
                  }}
                />

                {/* CRT vignette */}
                <div
                  className="pointer-events-none absolute inset-0 z-10"
                  style={{
                    background:
                      "radial-gradient(ellipse at center, transparent 60%, rgba(0,0,0,0.4) 100%)",
                  }}
                />

                {/* Terminal content */}
                <div className="relative z-0 p-5 h-[450px] overflow-y-auto font-mono text-sm leading-relaxed text-green-400">
                  {history.map((line, i) => (
                    <p
                      key={i}
                      className="whitespace-pre-wrap mb-1"
                      style={{
                        textShadow: "0 0 5px rgba(34,197,94,0.3)",
                      }}
                    >
                      {line}
                    </p>
                  ))}

                  {/* Input line */}
                  <form onSubmit={handleSubmit} className="flex gap-2 items-center">
                    <span className="text-green-500 whitespace-nowrap">
                      root@wenrick:~$
                    </span>
                    <input
                      ref={inputRef}
                      type="text"
                      value={input}
                      onChange={(e) => setInput(e.target.value)}
                      className="flex-1 bg-transparent border-none outline-none text-green-300 caret-green-400"
                      autoFocus
                      spellCheck={false}
                      autoComplete="off"
                    />
                  </form>
                  <div ref={bottomRef} />
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
