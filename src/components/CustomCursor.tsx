"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useMotionValue, useSpring } from "framer-motion";

export default function CustomCursor() {
  const cursorX = useMotionValue(0);
  const cursorY = useMotionValue(0);
  const cursorXSpring = useSpring(cursorX, { stiffness: 600, damping: 50 });
  const cursorYSpring = useSpring(cursorY, { stiffness: 600, damping: 50 });
  const [isHovering, setIsHovering] = useState(false);
  const [isClicking, setIsClicking] = useState(false);
  const [trail, setTrail] = useState<{ x: number; y: number }[]>([]);
  const requestRef = useRef<number>();

  useEffect(() => {
    const moveCursor = (e: MouseEvent) => {
      cursorX.set(e.clientX);
      cursorY.set(e.clientY);
    };

    const handleMouseDown = () => setIsClicking(true);
    const handleMouseUp = () => setIsClicking(false);

    window.addEventListener("mousemove", moveCursor);
    window.addEventListener("mousedown", handleMouseDown);
    window.addEventListener("mouseup", handleMouseUp);

    return () => {
      window.removeEventListener("mousemove", moveCursor);
      window.removeEventListener("mousedown", handleMouseDown);
      window.removeEventListener("mouseup", handleMouseUp);
    };
  }, [cursorX, cursorY]);

  useEffect(() => {
    const handleMouseOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (
        target.tagName === "BUTTON" ||
        target.tagName === "A" ||
        target.closest("button") ||
        target.closest("a") ||
        target.closest("[role='button']")
      ) {
        setIsHovering(true);
      } else {
        setIsHovering(false);
      }
    };

    window.addEventListener("mouseover", handleMouseOver);
    return () => window.removeEventListener("mouseover", handleMouseOver);
  }, []);

  useEffect(() => {
    const animate = () => {
      setTrail((prevTrail) => [
        { x: cursorX.get(), y: cursorY.get() },
        ...prevTrail.slice(0, 12),
      ]);
      requestRef.current = requestAnimationFrame(animate);
    };

    requestRef.current = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(requestRef.current!);
  }, [cursorX, cursorY]);

  return (
    <>
      {/* Trail particles */}
      {trail.map((point, index) => (
        <div
          key={index}
          className="pointer-events-none fixed z-[9999] rounded-full"
          style={{
            left: point.x - 3,
            top: point.y - 3,
            width: 6 - index * 0.4,
            height: 6 - index * 0.4,
            opacity: (1 - index / 12) * 0.6,
            backgroundColor: `rgba(34, 211, 238, ${(1 - index / 12) * 0.5})`,
            filter: `blur(${index * 0.3}px)`,
          }}
        />
      ))}

      {/* Outer ring */}
      <motion.div
        className="pointer-events-none fixed z-[9999] rounded-full border"
        style={{
          left: cursorXSpring,
          top: cursorYSpring,
          x: "-50%",
          y: "-50%",
          width: isHovering ? 52 : isClicking ? 16 : 28,
          height: isHovering ? 52 : isClicking ? 16 : 28,
          borderColor: isHovering
            ? "rgba(34, 211, 238, 0.5)"
            : "rgba(34, 211, 238, 0.25)",
          boxShadow: isHovering
            ? "0 0 15px rgba(34, 211, 238, 0.2)"
            : "none",
          transition: "width 0.2s, height 0.2s, border-color 0.2s",
        }}
      />

      {/* Inner dot */}
      <motion.div
        className="pointer-events-none fixed z-[9999] rounded-full"
        style={{
          left: cursorXSpring,
          top: cursorYSpring,
          x: "-50%",
          y: "-50%",
          width: isHovering ? 6 : isClicking ? 3 : 4,
          height: isHovering ? 6 : isClicking ? 3 : 4,
          backgroundColor: isHovering ? "#22d3ee" : "#67e8f9",
          boxShadow: `0 0 ${isHovering ? "12" : "8"}px rgba(34, 211, 238, ${isHovering ? "0.8" : "0.5"})`,
          transition: "width 0.2s, height 0.2s",
        }}
      />
    </>
  );
}
