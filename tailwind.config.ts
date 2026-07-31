import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
        neon: {
          cyan: "#22d3ee",
          green: "#4ade80",
          purple: "#a855f7",
          orange: "#fb923c",
          yellow: "#facc15",
          pink: "#f472b6",
        },
      },
      animation: {
        "glitch": "glitch 0.3s ease-in-out infinite",
        "glitch-skew": "glitch-skew 0.5s ease-in-out infinite",
        "scanline": "scanline 3s linear infinite",
        "pulse-glow": "pulse-glow 2s ease-in-out infinite",
        "float": "float 3s ease-in-out infinite",
        "typing-cursor": "typing-cursor 1s step-end infinite",
        "neon-flicker": "neon-flicker 2s linear infinite",
        "border-flow": "border-flow 3s ease infinite",
        "fade-in-up": "fade-in-up 0.6s ease-out forwards",
        "slide-in-left": "slide-in-left 0.5s ease-out forwards",
        "rotate-slow": "rotate-slow 20s linear infinite",
      },
      boxShadow: {
        "glow-cyan": "0 0 20px rgba(34, 211, 238, 0.3), 0 0 60px rgba(34, 211, 238, 0.1)",
        "glow-green": "0 0 20px rgba(74, 222, 128, 0.3), 0 0 60px rgba(74, 222, 128, 0.1)",
        "glow-purple": "0 0 20px rgba(168, 85, 247, 0.3), 0 0 60px rgba(168, 85, 247, 0.1)",
        "glow-orange": "0 0 20px rgba(251, 146, 60, 0.3), 0 0 60px rgba(251, 146, 60, 0.1)",
        "glow-yellow": "0 0 20px rgba(250, 204, 21, 0.3), 0 0 60px rgba(250, 204, 21, 0.1)",
        "glow-pink": "0 0 20px rgba(244, 114, 182, 0.3), 0 0 60px rgba(244, 114, 182, 0.1)",
        "glow-sm-cyan": "0 0 10px rgba(34, 211, 238, 0.2)",
        "glow-sm-green": "0 0 10px rgba(74, 222, 128, 0.2)",
        "glow-sm-purple": "0 0 10px rgba(168, 85, 247, 0.2)",
        "glow-sm-orange": "0 0 10px rgba(251, 146, 60, 0.2)",
        "glow-sm-yellow": "0 0 10px rgba(250, 204, 21, 0.2)",
        "glow-sm-pink": "0 0 10px rgba(244, 114, 182, 0.2)",
      },
      backdropBlur: {
        xs: "2px",
      },
    },
  },
  plugins: [],
};
export default config;
