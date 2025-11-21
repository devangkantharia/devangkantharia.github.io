"use client";

import { useEffect, useMemo, useRef } from "react";

import { usePointer } from "@/components/utility/usePointer";
import { useRaf } from "@/components/utility/useRaf";

export type CursorBlocksCanvasProps = {
  tileSize?: number; // CSS px per tile
  radius?: number;   // tiles around cursor
  color?: string;    // fill style
  blendMode?: GlobalCompositeOperation;
  halfLifeMs?: number; // trail fade half-life
  lerp?: number;       // smoothing factor per frame (0..1)
  maxActive?: number;  // safety cap
  disabledOnTouch?: boolean;
  reducedMotionRespect?: boolean;
  zIndex?: number;
};

type Tile = { gx: number; gy: number; alpha: number; }; // grid cell with opacity

function keyOf(gx: number, gy: number) {
  return gx + ":" + gy;
}

export default function CursorBlocksCanvas({
  tileSize = 10,
  radius = 2,
  color = "#ffffff",
  blendMode = "source-over",
  halfLifeMs = 450,
  lerp = 0.18,
  maxActive = 900,
  disabledOnTouch = true,
  reducedMotionRespect = true,
  zIndex = 60,
}: CursorBlocksCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const ctxRef = useRef<CanvasRenderingContext2D | null>(null);
  const dprRef = useRef<number>(1);
  const sizeRef = useRef<{ w: number; h: number }>({ w: 0, h: 0 });

  const { targetRef } = usePointer({ disabledOnTouch });

  // Smoothed cursor leader
  const posRef = useRef<{ x: number; y: number }>({ x: 0, y: 0 });

  // Active tiles keyed by gx:gy
  const activeRef = useRef<Map<string, Tile>>(new Map());

  const prefersReduced = useMemo(() =>
    typeof window !== "undefined" && "matchMedia" in window
      ? window.matchMedia("(prefers-reduced-motion: reduce)").matches
      : false
    , []);

  // Setup canvas & resize
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d", { alpha: true });
    if (!ctx) return;
    ctxRef.current = ctx;

    const resize = () => {
      const dpr = Math.max(1, Math.min(3, window.devicePixelRatio || 1));
      dprRef.current = dpr;
      const w = Math.floor(window.innerWidth);
      const h = Math.floor(window.innerHeight);
      sizeRef.current = { w, h };
      canvas.width = Math.floor(w * dpr);
      canvas.height = Math.floor(h * dpr);
      canvas.style.width = w + "px";
      canvas.style.height = h + "px";
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0); // draw in CSS pixels
    };

    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(document.documentElement);
    window.addEventListener("resize", resize);

    return () => {
      ro.disconnect();
      window.removeEventListener("resize", resize);
    };
  }, []);

  // Animation loop
  useRaf((dt) => {
    const canvas = canvasRef.current;
    const ctx = ctxRef.current;
    if (!canvas || !ctx) return;

    if (reducedMotionRespect && prefersReduced) {
      ctx.clearRect(0, 0, sizeRef.current.w, sizeRef.current.h);
      return;
    }

    // Smooth cursor toward target
    const t = targetRef.current;
    const p = posRef.current;
    p.x += (t.x - p.x) * lerp;
    p.y += (t.y - p.y) * lerp;

    // Grid math
    const step = tileSize; // drawing in CSS px due to setTransform
    const gx = Math.floor(p.x / step);
    const gy = Math.floor(p.y / step);

    // Activate neighborhood tiles
    for (let iy = -radius; iy <= radius; iy++) {
      for (let ix = -radius; ix <= radius; ix++) {
        const agx = gx + ix;
        const agy = gy + iy;
        if (agx < 0 || agy < 0) continue;
        const key = keyOf(agx, agy);
        let tile = activeRef.current.get(key);
        if (!tile) {
          if (activeRef.current.size >= maxActive) {
            // prune oldest (FIFO by iteration order)
            const firstKey = activeRef.current.keys().next().value as string | undefined;
            if (firstKey) activeRef.current.delete(firstKey);
          }
          tile = { gx: agx, gy: agy, alpha: 1 };
          activeRef.current.set(key, tile);
        } else {
          tile.alpha = 1; // boost when re-activated
        }
      }
    }

    // Fade logic: exponential decay using half-life
    const halfLifeSec = halfLifeMs / 1000;
    const decay = Math.pow(0.5, dt / halfLifeSec);

    // Draw
    ctx.globalCompositeOperation = blendMode;
    ctx.clearRect(0, 0, sizeRef.current.w, sizeRef.current.h);
    ctx.fillStyle = color;

    const toDelete: string[] = [];
    activeRef.current.forEach((tile, key) => {
      tile.alpha *= decay;
      if (tile.alpha < 0.03) {
        toDelete.push(key);
        return;
      }
      ctx.globalAlpha = tile.alpha;
      const x = tile.gx * step;
      const y = tile.gy * step;
      ctx.fillRect(x, y, step, step);
    });
    ctx.globalAlpha = 1;

    for (const k of toDelete) activeRef.current.delete(k);
  });

  return (
    <canvas
      ref={canvasRef}
      aria-hidden
      style={{
        position: "fixed",
        inset: 0,
        pointerEvents: "none",
        zIndex,
        // Ensures the canvas blends nicely over content without capturing focus
        mixBlendMode: undefined,
      }}
    />
  );
}
