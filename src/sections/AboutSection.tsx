"use client";

import { motion } from "framer-motion";
import { useEffect, useRef, useState } from "react";

const TypingText = ({ text, speed = 50 }: { text: string; speed?: number }) => {
  const [displayText, setDisplayText] = useState("");
  const [index, setIndex] = useState(0);

  useEffect(() => {
    if (index < text.length) {
      const timer = setTimeout(() => {
        setDisplayText((prev) => prev + text[index]);
        setIndex((prev) => prev + 1);
      }, speed);
      return () => clearTimeout(timer);
    }
  }, [index, text, speed]);

  return <span>{displayText}</span>;
};

export default function AboutSection() {
  const [inputText, setInputText] = useState("");
  const [messages, setMessages] = useState<{ type: "user" | "ai"; text: string }[]>([
    { type: "ai", text: "SYSTEM READY. WELCOME TO WENRICK'S DIGITAL WORKSPACE. ASK ME ANYTHING!" }
  ]);
  const endRef = useRef<HTMLDivElement>(null);

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim()) return;

    setMessages((prev) => [...prev, { type: "user", text: inputText }]);
    const userText = inputText.toLowerCase();
    setInputText("");

    setTimeout(() => {
      let response = "I'M WENRICK JAY Z. GANAS, AN IT SPECIALIST! I CAN HELP WITH TECH SUPPORT, SYSTEM MAINTENANCE, AND MORE!";
      if (userText.includes("skills") || userText.includes("skill")) {
        response = "MY SKILLS INCLUDE TECHNICAL SUPPORT, TROUBLESHOOTING, HARDWARE/SOFTWARE INSTALLATION, NETWORK CONFIGURATION, SYSTEM MAINTENANCE, AND MORE!";
      } else if (userText.includes("experience") || userText.includes("work")) {
        response = "I WORKED AS AN IT SPECIALIST PROVIDING REMOTE TECH SUPPORT, MANAGING USER ACCOUNTS, AND MAINTAINING SMOOTH IT OPERATIONS!";
      } else if (userText.includes("contact")) {
        response = "YOU CAN REACH ME AT +639650649357 OR ganaswenrick90@gmail.com!";
      }
      setMessages((prev) => [...prev, { type: "ai", text: response }]);
    }, 500);
  };

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
    <div className="fixed inset-0 z-20 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.4 }}
        className="w-full max-w-4xl bg-slate-900/95 backdrop-blur-xl border border-cyan-500/40 rounded-xl overflow-hidden shadow-2xl shadow-cyan-500/20"
      >
        {/* Header */}
        <div className="bg-slate-900/80 px-6 py-4 border-b border-cyan-500/30 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-red-500" />
            <div className="w-3 h-3 rounded-full bg-yellow-500" />
            <div className="w-3 h-3 rounded-full bg-green-500" />
            <span className="ml-4 text-cyan-400 font-mono text-sm">about.exe</span>
          </div>
          <h1 className="text-xl font-bold font-mono text-cyan-400">WENRICK JAY Z. GANAS - IT SPECIALIST</h1>
        </div>

        {/* Profile */}
        <div className="p-6 border-b border-slate-700">
          <h2 className="text-2xl font-bold text-white mb-3 font-mono">PROFILE</h2>
          <p className="text-slate-300 leading-relaxed">
            I am a detail-oriented and solutions-driven IT Specialist with experience in technical support, system maintenance, and basic network troubleshooting, skilled in resolving hardware and software issues to ensure smooth daily operations, and proficient in using tools such as Windows OS, Google Workspace, Microsoft Office, and other technical platforms to efficiently manage systems, user accounts, and IT documentation.
          </p>
        </div>

        {/* Chat */}
        <div className="p-4 h-64 overflow-y-auto font-mono text-sm">
          {messages.map((msg, idx) => (
            <div key={idx} className={`mb-3 ${msg.type === "user" ? "text-blue-400" : "text-cyan-400"}`}>
              <span className="text-slate-500">{msg.type === "user" ? "YOU> " : "AI> "}</span>
              <TypingText text={msg.text} speed={30} />
            </div>
          ))}
          <div ref={endRef} />
        </div>

        <form onSubmit={handleSend} className="border-t border-cyan-500/30 p-4 flex gap-2">
          <input
            type="text"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder="ASK ME ANYTHING..."
            className="flex-1 bg-transparent border border-cyan-500/30 rounded px-4 py-2 text-cyan-400 font-mono outline-none focus:border-cyan-400"
          />
          <button type="submit" className="bg-cyan-500/20 border border-cyan-500/50 px-6 py-2 text-cyan-400 rounded hover:bg-cyan-500/30 transition font-mono">
            SEND
          </button>
        </form>
      </motion.div>
    </div>
  );
}
