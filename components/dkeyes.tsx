"use client";
import React, { useEffect, useRef, useState } from "react";

interface MousePos {
  x: number;
  y: number;
}

interface EyeProps {
  mouse: MousePos;
  isBlinking?: boolean;
  pupilSize?: number; // pupil diameter in px
  width?: number;
  height?: number;
  borderRadius?: string; // CSS border-radius value (e.g., "50%", "10px")
  borderColor?: string;
  backgroundColor?: string;
}

const Eye: React.FC<EyeProps> = ({
  mouse,
  isBlinking = false,
  pupilSize = 8,
  width = 15,
  height = 25,
  borderRadius = "50%",
  borderColor = "black",
  backgroundColor = "white",
}) => {
  const ref = useRef<HTMLDivElement | null>(null);

  const current = useRef({ x: 0, y: 0 });
  const target = useRef({ x: 0, y: 0 });
  const [renderOffset, setRenderOffset] = useState({ x: 0, y: 0 });
  const rafRef = useRef<number | null>(null);
  const lastTime = useRef<number | null>(null);

  // Compute target on the ellipse edge (always on border)
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const cx = rect.left + rect.width / 2;
    const cy = rect.top + rect.height / 2;
    const dx = mouse.x - cx;
    const dy = mouse.y - cy;
    const mag = Math.hypot(dx, dy);

    // If mouse is exactly at center, keep last target
    if (mag < 0.0001) return;
    const ux = dx / mag;
    const uy = dy / mag;

    // Ellipse radii
    const rx = width / 2;
    const ry = height / 2;
    // Distance to ellipse boundary in direction (ux,uy)
    const t0 = 1 / Math.sqrt((ux * ux) / (rx * rx) + (uy * uy) / (ry * ry));
    // Move inward along the ray to keep pupil fully inside
    const inward = pupilSize / 2 + 0.75; // padding
    const d = Math.max(0, t0 - inward);
    target.current = { x: ux * d, y: uy * d };
  }, [mouse, width, height, pupilSize]);

  // Smoothly animate using time-based exponential smoothing (ease-out)
  useEffect(() => {
    const animate = (time: number) => {
      const now = time || performance.now();
      const prev = lastTime.current ?? now;
      const dt = Math.min(0.05, Math.max(0.001, (now - prev) / 1000)); // clamp 1ms-50ms
      lastTime.current = now;

      // smoothing factor per second: larger => quicker catch-up (but still eased)
      const smoothingPerSec = 16; // tune for realistic lag
      const alpha = 1 - Math.exp(-smoothingPerSec * dt);
      current.current.x += (target.current.x - current.current.x) * alpha;
      current.current.y += (target.current.y - current.current.y) * alpha;
      setRenderOffset({ x: current.current.x, y: current.current.y });
      rafRef.current = window.requestAnimationFrame(animate);
    };
    rafRef.current = window.requestAnimationFrame(animate);
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, []);

  return (
    <div
      ref={ref}
      style={{
        width,
        height,
        borderRadius,
        backgroundColor,
        borderColor,
        transform: `scaleY(${isBlinking ? 0.15 : 1})`,
        transformOrigin: "center",
      }}
      className="relative flex items-center justify-center overflow-hidden border pointer-events-auto transition-transform duration-250 ease-[cubic-bezier(0.22,1,0.36,1)]"
    >
      <div
        style={{
          width: pupilSize,
          height: pupilSize,
          transform: `translate(${renderOffset.x}px, ${renderOffset.y}px)`,
        }}
        className="absolute rounded-full bg-black"
      />
    </div>
  );
};

export const DKEyes: React.FC<{ count?: number }> = ({ count = 2 }) => {
  const [mouse, setMouse] = useState<MousePos>({ x: 0, y: 0 });
  const [isBlinking, setIsBlinking] = useState(false);

  useEffect(() => {
    const handle = (e: MouseEvent) => {
      setMouse({ x: e.clientX, y: e.clientY });
    };
    window.addEventListener("mousemove", handle, { passive: true });
    return () => window.removeEventListener("mousemove", handle);
  }, []);

  // Group blink for both eyes: subtle and not frequent
  useEffect(() => {
    let mounted = true;
    let timeoutId: number | null = null;
    const schedule = () => {
      if (!mounted) return;
      const delay = 6000 + Math.random() * 6000; // 6s - 12s
      timeoutId = window.setTimeout(() => {
        setIsBlinking(true);
        const total = 320; // close+open total
        window.setTimeout(() => {
          setIsBlinking(false);
          schedule();
        }, total);
      }, delay);
    };
    schedule();
    return () => {
      mounted = false;
      if (timeoutId) window.clearTimeout(timeoutId);
    };
  }, []);

  return (
    <div className="fixed top-2 right-2 z-0 flex gap-0.5 pointer-events-none select-none">
      {Array.from({ length: count }).map((_, i) => (
        <Eye
          key={i}
          mouse={mouse}
          isBlinking={isBlinking}
          width={13}
          height={22}
        />
      ))}
    </div>
  );
};

export default DKEyes;
