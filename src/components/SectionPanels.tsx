"use client";

import React, { useEffect, useRef, useState } from "react";
import {
  ArrowLeft,
  Terminal,
  Cpu,
  Briefcase,
  GraduationCap,
  MessageSquare,
  BookOpen,
  ShoppingCart,
  Gamepad2,
  Phone,
  Mail,
  MapPin,
  Send,
  Zap,
  Code2,
  Server,
  Globe,
} from "lucide-react";
import { gsap } from "gsap";
import { motion, AnimatePresence } from "framer-motion";
import { usePortfolioStore } from "@/store/usePortfolioStore";

/* ──────────────────── Tic Tac Toe ──────────────────── */
const TicTacToe = () => {
  const [board, setBoard] = React.useState(Array(9).fill(null));
  const [xTurn, setXTurn] = React.useState(true);
  const [winner, setWinner] = React.useState<string | null>(null);

  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ];

  const checkWinner = (squares: (string | null)[]) => {
    for (const line of lines) {
      const [a, b, c] = line;
      if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c])
        return squares[a];
    }
    return null;
  };

  const handleClick = (index: number) => {
    if (board[index] || winner) return;
    const newBoard = [...board];
    newBoard[index] = xTurn ? "X" : "O";
    setBoard(newBoard);
    setXTurn(!xTurn);
    const gameWinner = checkWinner(newBoard);
    if (gameWinner) setWinner(gameWinner);
    else if (!newBoard.includes(null)) setWinner("Draw!");
  };

  const reset = () => {
    setBoard(Array(9).fill(null));
    setXTurn(true);
    setWinner(null);
  };

  return (
    <div className="p-5 rounded-2xl border border-cyan-500/20 bg-gradient-to-br from-cyan-500/5 to-transparent backdrop-blur-sm">
      <h3 className="text-lg font-bold text-cyan-400 font-mono mb-4 flex items-center gap-2">
        <Gamepad2 size={20} /> MINI GAME: TIC TAC TOE
      </h3>
      <div className="grid grid-cols-3 gap-2 max-w-[240px] mx-auto mb-4">
        {board.map((cell, i) => (
          <button
            key={i}
            onClick={() => handleClick(i)}
            disabled={!!cell || !!winner}
            className={`aspect-square flex items-center justify-center text-2xl font-bold rounded-xl border transition-all duration-200
              ${cell === "X" ? "text-cyan-400 border-cyan-500/40 bg-cyan-500/10" : cell === "O" ? "text-pink-400 border-pink-500/40 bg-pink-500/10" : "text-transparent border-slate-700/50 bg-slate-800/50 hover:bg-slate-700/50 hover:border-slate-600/50"}`}
          >
            {cell}
          </button>
        ))}
      </div>
      <p className="text-center text-slate-300 font-mono text-sm mb-3">
        {winner
          ? winner === "Draw!"
            ? "It's a draw!"
            : `Winner: ${winner}`
          : `Turn: ${xTurn ? "X" : "O"}`}
      </p>
      <button
        onClick={reset}
        className="w-full py-2.5 bg-cyan-500/10 border border-cyan-500/30 rounded-xl text-cyan-400 font-mono text-sm hover:bg-cyan-500/20 transition-all"
      >
        Reset
      </button>
    </div>
  );
};

/* ──────────────────── Snake ──────────────────── */
const Snake = () => {
  const gridSize = 12;
  const [snake, setSnake] = React.useState([{ x: 6, y: 6 }]);
  const [food, setFood] = React.useState({ x: 9, y: 9 });
  const [direction, setDirection] = React.useState({ x: 1, y: 0 });
  const [gameOver, setGameOver] = React.useState(false);
  const [score, setScore] = React.useState(0);

  const generateFood = () => ({
    x: Math.floor(Math.random() * gridSize),
    y: Math.floor(Math.random() * gridSize),
  });

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "ArrowUp" && direction.y !== 1) setDirection({ x: 0, y: -1 });
      if (e.key === "ArrowDown" && direction.y !== -1) setDirection({ x: 0, y: 1 });
      if (e.key === "ArrowLeft" && direction.x !== 1) setDirection({ x: -1, y: 0 });
      if (e.key === "ArrowRight" && direction.x !== -1) setDirection({ x: 1, y: 0 });
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [direction]);

  useEffect(() => {
    if (gameOver) return;
    const gameLoop = setInterval(() => {
      setSnake((prev) => {
        const head = prev[0];
        const newHead = {
          x: head.x + direction.x,
          y: head.y + direction.y,
        };

        if (
          newHead.x < 0 ||
          newHead.x >= gridSize ||
          newHead.y < 0 ||
          newHead.y >= gridSize ||
          prev.some((s) => s.x === newHead.x && s.y === newHead.y)
        ) {
          setGameOver(true);
          return prev;
        }

        const newSnake = [newHead, ...prev];
        if (newHead.x === food.x && newHead.y === food.y) {
          setScore((s) => s + 10);
          setFood(generateFood());
        } else {
          newSnake.pop();
        }
        return newSnake;
      });
    }, 180);
    return () => clearInterval(gameLoop);
  }, [direction, food, gameOver]);

  const reset = () => {
    setSnake([{ x: 6, y: 6 }]);
    setFood({ x: 9, y: 9 });
    setDirection({ x: 1, y: 0 });
    setGameOver(false);
    setScore(0);
  };

  return (
    <div className="p-5 rounded-2xl border border-green-500/20 bg-gradient-to-br from-green-500/5 to-transparent backdrop-blur-sm">
      <h3 className="text-lg font-bold text-green-400 font-mono mb-2 flex items-center gap-2">
        <Gamepad2 size={20} /> MINI GAME: SNAKE
      </h3>
      <div className="flex items-center justify-between mb-3">
        <p className="text-green-300/80 font-mono text-sm">Score: {score}</p>
        <p className="text-slate-500 font-mono text-xs">Arrow keys to move</p>
      </div>
      <div
        className="grid gap-[2px] bg-slate-900/80 p-2 rounded-xl mx-auto border border-slate-800/50"
        style={{
          gridTemplateColumns: `repeat(${gridSize}, 1fr)`,
          maxWidth: "264px",
        }}
      >
        {Array.from({ length: gridSize * gridSize }).map((_, i) => {
          const x = i % gridSize;
          const y = Math.floor(i / gridSize);
          const isSnake = snake.some((s) => s.x === x && s.y === y);
          const isHead = snake[0]?.x === x && snake[0]?.y === y;
          const isFood = food.x === x && food.y === y;
          return (
            <div
              key={i}
              className="aspect-square rounded-sm transition-colors duration-75"
              style={{
                backgroundColor: isHead
                  ? "#4ade80"
                  : isSnake
                    ? "#22c55e"
                    : isFood
                      ? "#ef4444"
                      : "#0f172a",
                boxShadow: isFood ? "0 0 6px rgba(239,68,68,0.5)" : isHead ? "0 0 6px rgba(74,222,128,0.5)" : "none",
              }}
            />
          );
        })}
      </div>
      <div className="mt-3">
        {gameOver && (
          <p className="text-red-400 font-mono text-center text-sm mb-2">
            Game Over!
          </p>
        )}
        <button
          onClick={reset}
          className="w-full py-2.5 bg-green-500/10 border border-green-500/30 rounded-xl text-green-400 font-mono text-sm hover:bg-green-500/20 transition-all"
        >
          {gameOver ? "Play Again" : "Reset"}
        </button>
      </div>
    </div>
  );
};

/* ──────────────────── Animated Border Wrapper ──────────────────── */
const PanelWrapper = ({
  children,
  borderColor,
  glowColor,
}: {
  children: React.ReactNode;
  borderColor: string;
  glowColor: string;
}) => (
  <div
    className="relative rounded-2xl p-[1px] overflow-hidden"
    style={{
      background: `linear-gradient(135deg, ${borderColor}40, transparent 40%, transparent 60%, ${borderColor}40)`,
    }}
  >
    <div
      className="relative rounded-2xl bg-[#0a0f1e]/95 backdrop-blur-xl p-8 overflow-hidden"
      style={{
        boxShadow: `0 0 40px ${glowColor}10, inset 0 1px 0 ${borderColor}15`,
      }}
    >
      {/* Corner accents */}
      <div
        className="absolute top-0 left-0 w-20 h-20 opacity-30"
        style={{
          background: `linear-gradient(135deg, ${borderColor}20, transparent)`,
        }}
      />
      <div
        className="absolute bottom-0 right-0 w-20 h-20 opacity-20"
        style={{
          background: `linear-gradient(-45deg, ${borderColor}20, transparent)`,
        }}
      />
      {children}
    </div>
  </div>
);

/* ──────────────────── About Panel ──────────────────── */
const AboutPanel = () => (
  <PanelWrapper borderColor="#22d3ee" glowColor="#22d3ee">
    <div className="max-w-4xl">
      <div className="flex items-center gap-3 mb-2">
        <div className="p-2 rounded-xl bg-cyan-500/10 border border-cyan-500/20">
          <Terminal size={28} className="text-cyan-400" />
        </div>
        <h1 className="text-4xl font-bold text-gradient-cyan">ABOUT ME</h1>
      </div>
      <div className="h-px bg-gradient-to-r from-cyan-500/50 via-cyan-500/20 to-transparent mb-6" />

      <div className="grid md:grid-cols-2 gap-8 mb-8">
        <div className="space-y-4">
          <p className="text-slate-300 text-lg leading-relaxed">
            Hi, I&apos;m <span className="text-cyan-400 font-semibold">Wenrick Jay Z. Ganas</span> — a detail-oriented and
            solutions-driven IT Specialist with experience in technical support, system maintenance, and
            network troubleshooting.
          </p>
          <p className="text-slate-400 leading-relaxed">
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
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 + i * 0.1 }}
              className="p-4 rounded-xl border border-cyan-500/10 bg-cyan-500/5"
            >
              <stat.icon size={18} className="text-cyan-500/60 mb-2" />
              <p className="text-2xl font-bold text-cyan-400">{stat.value}</p>
              <p className="text-xs text-slate-500 uppercase tracking-wider">{stat.label}</p>
            </motion.div>
          ))}
        </div>
      </div>

      <TicTacToe />
    </div>
  </PanelWrapper>
);

/* ──────────────────── Skills Panel ──────────────────── */
const SkillsPanel = () => {
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

  return (
    <PanelWrapper borderColor="#4ade80" glowColor="#4ade80">
      <div className="max-w-5xl">
        <div className="flex items-center gap-3 mb-2">
          <div className="p-2 rounded-xl bg-green-500/10 border border-green-500/20">
            <Cpu size={28} className="text-green-400" />
          </div>
          <h1 className="text-4xl font-bold text-gradient-green">SKILLS</h1>
        </div>
        <div className="h-px bg-gradient-to-r from-green-500/50 via-green-500/20 to-transparent mb-6" />

        <div className="grid md:grid-cols-2 gap-8 mb-8">
          {/* Technical Skills */}
          <div>
            <h2 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
              <Zap size={18} className="text-green-400" /> Technical Skills
            </h2>
            <div className="space-y-3">
              {technicalSkills.map((skill, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.1 + i * 0.05 }}
                >
                  <div className="flex justify-between mb-1">
                    <span className="text-sm text-slate-300">{skill.name}</span>
                    <span className="text-xs text-green-400/70 font-mono">{skill.level}%</span>
                  </div>
                  <div className="h-1.5 bg-slate-800 rounded-full overflow-hidden">
                    <motion.div
                      className="h-full rounded-full bg-gradient-to-r from-green-500 to-emerald-400"
                      initial={{ width: 0 }}
                      animate={{ width: `${skill.level}%` }}
                      transition={{ delay: 0.3 + i * 0.05, duration: 0.8, ease: "easeOut" }}
                      style={{ boxShadow: "0 0 8px rgba(74,222,128,0.3)" }}
                    />
                  </div>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Tools */}
          <div>
            <h2 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
              <Wrench size={18} className="text-green-400" /> Tools & Platforms
            </h2>
            <div className="grid grid-cols-2 gap-3">
              {tools.map((tool, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.2 + i * 0.05 }}
                  className="flex items-center gap-3 p-3 rounded-xl border border-green-500/15 bg-green-500/5 hover:bg-green-500/10 transition-all group"
                >
                  <span className="text-xl">{tool.icon}</span>
                  <span className="text-sm text-slate-300 group-hover:text-green-300 transition-colors">
                    {tool.name}
                  </span>
                </motion.div>
              ))}
            </div>
          </div>
        </div>

        <Snake />
      </div>
    </PanelWrapper>
  );
};

/* ──────────────────── Projects Panel ──────────────────── */
const ProjectsPanel = () => {
  const projects = [
    {
      title: "Library Management System",
      icon: BookOpen,
      color: "purple",
      description: "A comprehensive library management system for tracking books, borrowers, and transactions with an intuitive admin dashboard.",
      tags: ["System Design", "Database", "CRUD"],
      gradient: "from-purple-500/10 to-violet-500/5",
    },
    {
      title: "ClassSchedularApp & Web",
      icon: Calendar,
      color: "purple",
      description: "Cross-platform class scheduling and timetable management application for educational institutions.",
      tags: ["Scheduling", "Cross-Platform", "UI/UX"],
      gradient: "from-violet-500/10 to-purple-500/5",
    },
    {
      title: "Shopping Cart Web",
      icon: ShoppingCart,
      color: "purple",
      description: "Full-featured e-commerce shopping cart application with product catalog, cart management, and checkout flow.",
      tags: ["E-Commerce", "Web App", "Frontend"],
      gradient: "from-purple-500/10 to-fuchsia-500/5",
    },
  ];

  return (
    <PanelWrapper borderColor="#a855f7" glowColor="#a855f7">
      <div className="max-w-5xl">
        <div className="flex items-center gap-3 mb-2">
          <div className="p-2 rounded-xl bg-purple-500/10 border border-purple-500/20">
            <Code2 size={28} className="text-purple-400" />
          </div>
          <h1 className="text-4xl font-bold text-gradient-purple">PROJECTS</h1>
        </div>
        <div className="h-px bg-gradient-to-r from-purple-500/50 via-purple-500/20 to-transparent mb-6" />

        <div className="grid md:grid-cols-3 gap-5">
          {projects.map((project, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.15 + i * 0.1 }}
              className={`group relative p-6 rounded-2xl border border-purple-500/15 bg-gradient-to-br ${project.gradient} hover:border-purple-500/30 transition-all duration-300 hover:shadow-glow-purple`}
            >
              <div className="p-3 rounded-xl bg-purple-500/10 border border-purple-500/20 w-fit mb-4 group-hover:scale-110 transition-transform">
                <project.icon size={24} className="text-purple-400" />
              </div>
              <h2 className="text-lg font-bold text-purple-200 mb-2">
                {project.title}
              </h2>
              <p className="text-sm text-slate-400 leading-relaxed mb-4">
                {project.description}
              </p>
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
            </motion.div>
          ))}
        </div>
      </div>
    </PanelWrapper>
  );
};

/* ──────────────────── Experience Panel ──────────────────── */
const ExperiencePanel = () => {
  const responsibilities = [
    "Technical support and troubleshooting for hardware and software issues",
    "Hardware and software installation and configuration",
    "User account management and access control",
    "System maintenance and performance optimization",
    "Data backup, recovery, and integrity management",
    "Network configuration and connectivity troubleshooting",
    "IT documentation and standard operating procedures",
  ];

  return (
    <PanelWrapper borderColor="#fb923c" glowColor="#fb923c">
      <div className="max-w-4xl">
        <div className="flex items-center gap-3 mb-2">
          <div className="p-2 rounded-xl bg-orange-500/10 border border-orange-500/20">
            <Briefcase size={28} className="text-orange-400" />
          </div>
          <h1 className="text-4xl font-bold text-gradient-orange">EXPERIENCE</h1>
        </div>
        <div className="h-px bg-gradient-to-r from-orange-500/50 via-orange-500/20 to-transparent mb-6" />

        <div className="relative pl-8">
          {/* Timeline line */}
          <div className="absolute left-3 top-0 bottom-0 w-px bg-gradient-to-b from-orange-500/50 via-orange-500/20 to-transparent" />

          <div className="relative mb-6">
            {/* Timeline dot */}
            <div className="absolute -left-8 top-1 w-6 h-6 rounded-full border-2 border-orange-500/50 bg-[#0a0f1e] flex items-center justify-center">
              <div className="w-2 h-2 rounded-full bg-orange-400 animate-pulse-glow" />
            </div>

            <div className="p-6 rounded-2xl border border-orange-500/15 bg-gradient-to-br from-orange-500/5 to-transparent">
              <div className="flex flex-wrap items-baseline gap-3 mb-1">
                <h2 className="text-2xl font-bold text-white">IT Specialist</h2>
                <span className="px-3 py-0.5 text-xs font-mono text-orange-300 bg-orange-500/10 rounded-full border border-orange-500/20">
                  REMOTE
                </span>
              </div>
              <p className="text-orange-300/80 font-mono text-sm mb-5">Philippines</p>

              <ul className="space-y-3">
                {responsibilities.map((item, i) => (
                  <motion.li
                    key={i}
                    initial={{ opacity: 0, x: -15 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.2 + i * 0.05 }}
                    className="flex gap-3 text-slate-300 text-sm"
                  >
                    <span className="mt-1.5 h-1.5 w-1.5 rounded-full bg-orange-400 shrink-0" />
                    {item}
                  </motion.li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </PanelWrapper>
  );
};

/* ──────────────────── Education Panel ──────────────────── */
const EducationPanel = () => (
  <PanelWrapper borderColor="#facc15" glowColor="#facc15">
    <div className="max-w-4xl">
      <div className="flex items-center gap-3 mb-2">
        <div className="p-2 rounded-xl bg-yellow-500/10 border border-yellow-500/20">
          <GraduationCap size={28} className="text-yellow-400" />
        </div>
        <h1 className="text-4xl font-bold text-gradient-yellow">EDUCATION</h1>
      </div>
      <div className="h-px bg-gradient-to-r from-yellow-500/50 via-yellow-500/20 to-transparent mb-6" />

      <div className="p-6 rounded-2xl border border-yellow-500/15 bg-gradient-to-br from-yellow-500/5 to-transparent">
        <div className="flex items-start gap-4">
          <div className="p-3 rounded-xl bg-yellow-500/10 border border-yellow-500/20 shrink-0">
            <GraduationCap size={32} className="text-yellow-400" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-white mb-1">
              Bachelor of Science in Information Technology
            </h2>
            <div className="flex items-center gap-3 mb-4">
              <span className="font-mono text-sm text-yellow-300/80">2022 — 2026</span>
              <span className="px-2.5 py-0.5 text-[11px] font-mono text-yellow-300 bg-yellow-500/10 rounded-full border border-yellow-500/20">
                IN PROGRESS
              </span>
            </div>
            <p className="text-slate-400 leading-relaxed">
              Currently pursuing my degree with a focus on web development, software engineering, and IT systems management. Actively building projects and gaining hands-on experience through coursework and personal initiatives.
            </p>

            <div className="grid grid-cols-3 gap-4 mt-6">
              {[
                { label: "Year", value: "4th" },
                { label: "Focus", value: "IT Systems" },
                { label: "Status", value: "Active" },
              ].map((item, i) => (
                <div key={i} className="p-3 rounded-xl bg-yellow-500/5 border border-yellow-500/10 text-center">
                  <p className="text-lg font-bold text-yellow-400">{item.value}</p>
                  <p className="text-[11px] text-slate-500 uppercase tracking-wider">{item.label}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  </PanelWrapper>
);

/* ──────────────────── Contact Panel ──────────────────── */
const ContactPanel = () => {
  const [formState, setFormState] = useState({ name: "", email: "", message: "" });
  const [focused, setFocused] = useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormState((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  return (
    <PanelWrapper borderColor="#f472b6" glowColor="#f472b6">
      <div className="max-w-4xl">
        <div className="flex items-center gap-3 mb-2">
          <div className="p-2 rounded-xl bg-pink-500/10 border border-pink-500/20">
            <MessageSquare size={28} className="text-pink-400" />
          </div>
          <h1 className="text-4xl font-bold text-gradient-pink">CONTACT</h1>
        </div>
        <div className="h-px bg-gradient-to-r from-pink-500/50 via-pink-500/20 to-transparent mb-6" />

        <div className="grid md:grid-cols-2 gap-8">
          {/* Contact info */}
          <div className="space-y-4">
            <p className="text-slate-400 leading-relaxed mb-6">
              Got a project in mind or want to collaborate? Feel free to reach out through any of these channels.
            </p>

            {[
              { icon: Phone, label: "Phone", value: "+63 965 064 9357", href: "tel:+639650649357" },
              { icon: Mail, label: "Email", value: "ganaswenrick90@gmail.com", href: "mailto:ganaswenrick90@gmail.com" },
              { icon: MapPin, label: "Location", value: "Philippines", href: null },
            ].map((item, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.1 + i * 0.1 }}
                className="flex items-center gap-4 p-4 rounded-xl border border-pink-500/15 bg-pink-500/5 hover:bg-pink-500/10 transition-all group"
              >
                <div className="p-2.5 rounded-lg bg-pink-500/10 border border-pink-500/15 group-hover:scale-110 transition-transform">
                  <item.icon size={20} className="text-pink-400" />
                </div>
                <div>
                  <p className="text-xs text-slate-500 uppercase tracking-wider mb-0.5">
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
              </motion.div>
            ))}
          </div>

          {/* Contact form */}
          <div className="space-y-4">
            {[
              { name: "name", label: "Your Name", type: "text", placeholder: "John Doe" },
              { name: "email", label: "Your Email", type: "email", placeholder: "john@example.com" },
            ].map((field) => (
              <div key={field.name} className="relative">
                <label
                  className={`absolute left-4 transition-all duration-200 pointer-events-none font-mono text-xs uppercase tracking-wider ${
                    focused === field.name || formState[field.name as keyof typeof formState]
                      ? "-top-5 text-pink-400/70"
                      : "top-3.5 text-slate-600"
                  }`}
                >
                  {field.label}
                </label>
                <input
                  type={field.type}
                  name={field.name}
                  value={formState[field.name as keyof typeof formState]}
                  onChange={handleChange}
                  onFocus={() => setFocused(field.name)}
                  onBlur={() => setFocused(null)}
                  placeholder={field.placeholder}
                  className="w-full p-3.5 bg-slate-900/50 border border-pink-500/20 rounded-xl text-white text-sm font-mono placeholder:text-slate-700 focus:outline-none focus:border-pink-500/50 focus:bg-pink-500/5 transition-all"
                />
              </div>
            ))}

            <div className="relative">
              <label
                className={`absolute left-4 transition-all duration-200 pointer-events-none font-mono text-xs uppercase tracking-wider ${
                  focused === "message" || formState.message
                    ? "-top-5 text-pink-400/70"
                    : "top-3.5 text-slate-600"
                }`}
              >
                Message
              </label>
              <textarea
                name="message"
                value={formState.message}
                onChange={handleChange}
                onFocus={() => setFocused("message")}
                onBlur={() => setFocused(null)}
                placeholder="Tell me about your project..."
                rows={4}
                className="w-full p-3.5 bg-slate-900/50 border border-pink-500/20 rounded-xl text-white text-sm font-mono placeholder:text-slate-700 focus:outline-none focus:border-pink-500/50 focus:bg-pink-500/5 transition-all resize-none"
              />
            </div>

            <button
              type="submit"
              className="w-full py-3.5 bg-gradient-to-r from-pink-500/20 to-purple-500/20 border border-pink-500/30 rounded-xl text-pink-300 font-mono text-sm font-semibold hover:from-pink-500/30 hover:to-purple-500/30 hover:shadow-glow-pink transition-all duration-300 flex items-center justify-center gap-2"
            >
              <Send size={16} />
              SEND MESSAGE
            </button>
          </div>
        </div>
      </div>
    </PanelWrapper>
  );
};

/* ──────────────────── Main Export ──────────────────── */
export default function SectionPanels() {
  const { activePlanet, setActivePlanet } = usePortfolioStore();
  const panelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (activePlanet && panelRef.current) {
      gsap.fromTo(
        panelRef.current,
        { opacity: 0, y: 40, scale: 0.95 },
        { opacity: 1, y: 0, scale: 1, duration: 0.6, ease: "back.out(1.2)" }
      );
    }
  }, [activePlanet]);

  const renderPanel = () => {
    switch (activePlanet) {
      case "about":
        return <AboutPanel />;
      case "skills":
        return <SkillsPanel />;
      case "projects":
        return <ProjectsPanel />;
      case "experience":
        return <ExperiencePanel />;
      case "education":
        return <EducationPanel />;
      case "contact":
        return <ContactPanel />;
      default:
        return null;
    }
  };

  if (!activePlanet) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-20 flex items-center justify-center p-4 overflow-y-auto"
        style={{
          background:
            "radial-gradient(ellipse at center, rgba(2,6,23,0.7) 0%, rgba(2,6,23,0.9) 100%)",
          backdropFilter: "blur(4px)",
        }}
      >
        <div ref={panelRef} className="relative w-full max-w-5xl py-8">
          {/* Close button */}
          <button
            onClick={() => setActivePlanet(null)}
            className="fixed top-6 left-6 z-30 flex items-center gap-2 px-4 py-2.5 bg-[#0a0f1e]/90 backdrop-blur-sm border border-white/10 rounded-full text-white/70 hover:text-white hover:border-white/20 hover:bg-[#0a0f1e] transition-all group"
          >
            <ArrowLeft
              size={18}
              className="group-hover:-translate-x-1 transition-transform"
            />
            <span className="text-sm font-mono">BACK</span>
          </button>

          {/* Panel content */}
          {renderPanel()}
        </div>
      </motion.div>
    </AnimatePresence>
  );
}

/* Wrench icon inline (lucide-react doesn't export it, using Cpu as fallback) */
function Wrench({ size, className }: { size: number; className?: string }) {
  return <Cpu size={size} className={className} />;
}

function Calendar({ size, className }: { size: number; className?: string }) {
  return <Briefcase size={size} className={className} />;
}
