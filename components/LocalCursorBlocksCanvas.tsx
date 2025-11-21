"use client";

import { useEffect, useMemo, useRef } from "react";

import { useRaf } from "@/components/utility/useRaf";

export type LocalCursorBlocksCanvasProps = {
  className?: string;

  // Canvas dimensions
  height?: number; // Canvas height in CSS px (default: 420)

  // Tile appearance
  tileSize?: number;       // Size of each tile in CSS px (range: 8-200, default: 10)
  blobSize?: number;       // Total number of tiles in cluster (range: 8-50, default: 20)
  tileBg?: string;         // Background color of tiles (default: "#0c0c0d")
  glyphColor?: string;     // Color of symbols inside tiles (default: "#ffffff")
  blendMode?: GlobalCompositeOperation; // Canvas composite mode (default: "source-over")

  // Timing - Disappearance
  shrinkDuration?: number;     // Duration of tile shrink animation in ms (range: 100-500, default: 320)
  tileLinger?: number;         // How long tiles stay visible before removal starts in ms (range: 100-1000, default: 600)
  iconMorphIntervalMs?: number; // How fast icons morph during disappearance in ms (range: 1-100, default: 60)
  removalJitterMs?: number;    // Random stagger range for removal timing in ms (range: 100-800, default: 450)
  earlyRemovalMs?: number;     // Allow some tiles to start removing early by up to this in ms (range: 50-300, default: 150)

  // Timing - Appearance
  appearScale?: boolean;   // If true, tiles scale up from center on appear (default: false)
  appearDuration?: number; // Duration of tile scale-up animation in ms (range: 100-400, default: 180)

  // Motion and interaction
  followLerp?: number;     // Cursor smoothing factor (range: 0.1-0.5, default: 0.28, higher = snappier)

  // Shape generation
  plusBias?: number;       // Weight toward plus-shaped cluster (range: 0.5-0.9, default: 0.65, higher = more plus-like)
  bigBlockChance?: number; // Probability per blob to include one 2×2 block (range: 0-0.3, default: 0.1)

  // Accessibility
  disabledOnTouch?: boolean;      // Disable effect on touch devices (default: true)
  reducedMotionRespect?: boolean; // Respect prefers-reduced-motion (default: true)
};

type Tile = {
  gx: number;
  gy: number;
  w: number;  // width in tiles (1 or 2)
  h: number;  // height in tiles (1 or 2)
  icon: string;
  iconIndex: number;  // current icon in rotation
  scale: number;    // 0..1 for shrink animation
  removing: boolean;
  bornAt: number;
  removalDelay: number; // random offset for staggered removal
  lastIconChange: number; // timestamp of last icon rotation
  appearing: boolean;
  appearAt: number;
  originGx?: number; // seed center for distance bias if needed
  originGy?: number;
};

function keyOf(gx: number, gy: number) {
  return gx + ":" + gy;
}

function easeOutQuad(t: number): number {
  return 1 - (1 - t) * (1 - t);
}

export default function LocalCursorBlocksCanvas({
  className,
  height = 420,
  tileSize = 10,
  blobSize = 20,
  tileBg = "#0c0c0d",
  glyphColor = "#ffffff",
  blendMode = "source-over",
  shrinkDuration = 320,
  tileLinger = 600,
  iconMorphIntervalMs = 60,
  appearScale = false,
  appearDuration = 180,
  followLerp = 0.28,
  plusBias = 0.65,
  bigBlockChance = 0.1,
  removalJitterMs = 450,
  earlyRemovalMs = 150,
  disabledOnTouch = true,
  reducedMotionRespect = true,
}: LocalCursorBlocksCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const ctxRef = useRef<CanvasRenderingContext2D | null>(null);
  const dprRef = useRef<number>(1);
  const sizeRef = useRef<{ w: number; h: number }>({ w: 0, h: 0 });

  const hoverRef = useRef<boolean>(false);
  const targetRef = useRef<{ x: number; y: number }>({ x: 0, y: 0 });
  const posRef = useRef<{ x: number; y: number }>({ x: 0, y: 0 });
  const lastGridRef = useRef<{ gx: number; gy: number } | null>(null);

  const activeRef = useRef<Map<string, Tile>>(new Map());
  const icons = useRef<string[]>([
    "+", "*", "W", "X", "8", ">", "O", "×", "✕"
  ]);

  const prefersReduced = useMemo(() =>
    typeof window !== "undefined" && "matchMedia" in window
      ? window.matchMedia("(prefers-reduced-motion: reduce)").matches
      : false
    , []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d", { alpha: true });
    if (!ctx) return;
    ctxRef.current = ctx;

    // Handle pointer only on canvas
    const isTouch = navigator.maxTouchPoints > 0;
    if (!(disabledOnTouch && isTouch)) {
      const move = (e: PointerEvent) => {
        const rect = canvas.getBoundingClientRect();
        targetRef.current.x = e.clientX - rect.left;
        targetRef.current.y = e.clientY - rect.top;
      };
      const enter = () => { hoverRef.current = true; };
      const leave = () => { hoverRef.current = false; };

      if ("onpointerrawupdate" in window) {
        (canvas as unknown as EventTarget).addEventListener(
          "pointerrawupdate",
          move as unknown as EventListener,
          { passive: true } as AddEventListenerOptions
        );
      } else {
        canvas.addEventListener("pointermove", move, { passive: true });
      }
      canvas.addEventListener("pointerenter", enter, { passive: true });
      canvas.addEventListener("pointerleave", leave, { passive: true });

      return () => {
        if ("onpointerrawupdate" in window) {
          (canvas as unknown as EventTarget).removeEventListener(
            "pointerrawupdate",
            move as unknown as EventListener
          );
        } else {
          canvas.removeEventListener("pointermove", move);
        }
        canvas.removeEventListener("pointerenter", enter);
        canvas.removeEventListener("pointerleave", leave);
      };
    }
  }, [disabledOnTouch]);

  // Resize to element size
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = ctxRef.current;
    if (!ctx) return;

    const resizeToRect = () => {
      const dpr = Math.max(1, Math.min(3, window.devicePixelRatio || 1));
      dprRef.current = dpr;
      const rect = canvas.getBoundingClientRect();
      const w = Math.max(1, Math.floor(rect.width));
      const h = Math.max(1, Math.floor(rect.height));
      sizeRef.current = { w, h };
      canvas.width = Math.floor(w * dpr);
      canvas.height = Math.floor(h * dpr);
      canvas.style.width = w + "px";
      canvas.style.height = h + "px";
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    resizeToRect();
    const ro = new ResizeObserver(resizeToRect);
    ro.observe(canvas);
    window.addEventListener("resize", resizeToRect);
    return () => {
      ro.disconnect();
      window.removeEventListener("resize", resizeToRect);
    };
  }, []);

  useRaf((dt, now) => {
    const canvas = canvasRef.current; const ctx = ctxRef.current;
    if (!canvas || !ctx) return;

    if (reducedMotionRespect && prefersReduced) {
      ctx.clearRect(0, 0, sizeRef.current.w, sizeRef.current.h);
      return;
    }

    const step = tileSize;
    // Smooth cursor position with lerp for fluid motion
    const t = targetRef.current;
    const p = posRef.current;
    p.x += (t.x - p.x) * followLerp;
    p.y += (t.y - p.y) * followLerp;
    const gx = Math.floor(p.x / step);
    const gy = Math.floor(p.y / step);

    // If cursor moved to a new grid cell and we're hovering, regenerate blob
    const currentGrid = lastGridRef.current;
    if (hoverRef.current && (!currentGrid || currentGrid.gx !== gx || currentGrid.gy !== gy)) {
      // Mark all existing tiles for removal
      activeRef.current.forEach((tile) => {
        if (!tile.removing) {
          tile.removing = true;
          tile.bornAt = now;
        }
      });

      // Generate blob with priority placement: center + NSEW mandatory, rest organic and diagonals
      lastGridRef.current = { gx, gy };
      const newTiles: Array<{ gx: number; gy: number; w: number; h: number }> = [];
      const occupied = new Set<string>();

      // Helper to try placing a tile
      const tryPlace = (x: number, y: number, w: number, h: number): boolean => {
        for (let dy = 0; dy < h; dy++) {
          for (let dx = 0; dx < w; dx++) {
            if (occupied.has(keyOf(x + dx, y + dy))) return false;
          }
        }
        newTiles.push({ gx: x, gy: y, w, h });
        for (let dy = 0; dy < h; dy++) {
          for (let dx = 0; dx < w; dx++) {
            occupied.add(keyOf(x + dx, y + dy));
          }
        }
        return true;
      };

      // Priority 1: CENTER (always place)
      tryPlace(gx, gy, 1, 1);

      // Priority 2: NSEW (always place core cross)
      tryPlace(gx, gy - 1, 1, 1); // North
      tryPlace(gx, gy + 1, 1, 1); // South
      tryPlace(gx + 1, gy, 1, 1); // East
      tryPlace(gx - 1, gy, 1, 1); // West

      // Optionally place a single big 2x2 block near the center (1 out of 10)
      if (Math.random() < bigBlockChance) {
        // try place 2x2 at/near center
        const candidates = [
          { x: gx, y: gy }, { x: gx - 1, y: gy }, { x: gx, y: gy - 1 }, { x: gx - 1, y: gy - 1 },
        ];
        for (const c of candidates) { if (tryPlace(c.x, c.y, 2, 2)) break; }
      }

      // Extend plus arms according to plusBias budget
      const targetPlusCount = Math.max(5, Math.min(blobSize, Math.floor(blobSize * plusBias)));
      const armDirs = [
        { dx: 0, dy: -1 }, // N
        { dx: 1, dy: 0 },  // E
        { dx: 0, dy: 1 },  // S
        { dx: -1, dy: 0 }, // W
      ];
      let placedPlus = newTiles.length;
      let stepLen = 1;
      while (placedPlus < targetPlusCount) {
        for (const dir of armDirs) {
          if (placedPlus >= targetPlusCount) break;
          const x = gx + dir.dx * (stepLen + 0);
          const y = gy + dir.dy * (stepLen + 0);
          // Occasionally place a 2-length rectangle along the arm
          let w = 1, h = 1;
          if (Math.random() < 0.2) {
            if (dir.dx !== 0) w = 2; else h = 2;
          }
          if (tryPlace(x, y, w, h)) {
            placedPlus = newTiles.length;
            // Diagonal fillers near arms
            if (Math.random() < 0.35) tryPlace(x + (dir.dy !== 0 ? 1 : 0), y + (dir.dx !== 0 ? 1 : 0), 1, 1);
            if (Math.random() < 0.35) tryPlace(x - (dir.dy !== 0 ? 1 : 0), y - (dir.dx !== 0 ? 1 : 0), 1, 1);
          }
        }
        stepLen++;
        if (stepLen > 6) break; // avoid runaway arms
      }

      // Priority 3: Organic cluster around center with random walk (biased)
      const queue: Array<{ x: number; y: number }> = [
        { x: gx - 1, y: gy - 1 }, { x: gx + 1, y: gy - 1 },
        { x: gx - 1, y: gy + 1 }, { x: gx + 1, y: gy + 1 },
      ];
      const visited = new Set<string>(occupied);

      while (queue.length > 0 && newTiles.length < blobSize) {
        const cell = queue.shift();
        if (!cell) break;

        const k = keyOf(cell.x, cell.y);
        if (visited.has(k)) continue;
        visited.add(k);

        // Decide tile size: mostly 1×1, occasionally merged
        let w = 1; let h = 1;
        if (Math.random() < 0.08) {
          if (Math.random() < 0.5) w = 2; else h = 2;
        }
        // Bias: prefer diagonals and cells with manhattan distance <= 3
        const md = Math.abs(cell.x - gx) + Math.abs(cell.y - gy);
        const accept = md <= 3 || Math.random() < 0.35;
        if (accept && tryPlace(cell.x, cell.y, w, h)) {
          // Add neighbors with randomness
          const neighbors = [
            { x: cell.x - 1, y: cell.y }, { x: cell.x + 1, y: cell.y },
            { x: cell.x, y: cell.y - 1 }, { x: cell.x, y: cell.y + 1 },
          ];
          for (const n of neighbors) {
            if (Math.random() < 0.45) queue.push(n);
          }
        }
      }

      // Create tile objects with random removal delays for stagger
      for (const spec of newTiles) {
        const key = keyOf(spec.gx, spec.gy);
        const iconIdx = (Math.random() * icons.current.length) | 0;
        const tile: Tile = {
          gx: spec.gx,
          gy: spec.gy,
          w: spec.w,
          h: spec.h,
          icon: icons.current[iconIdx],
          iconIndex: iconIdx,
          scale: appearScale ? 0 : 1,
          removing: false,
          bornAt: now,
          removalDelay: (Math.random() * removalJitterMs) - Math.random() * earlyRemovalMs,
          lastIconChange: now,
          appearing: appearScale,
          appearAt: now,
          originGx: gx,
          originGy: gy,
        };
        activeRef.current.set(key, tile);
      }
    }

    // Update animations: appearance, shrink, and auto-remove after linger time
    const toDelete: string[] = [];
    activeRef.current.forEach((tile, key) => {
      if (tile.appearing) {
        const elapsed = now - tile.appearAt;
        const progress = Math.min(1, elapsed / appearDuration);
        tile.scale = easeOutQuad(progress);
        if (progress >= 1) {
          tile.appearing = false;
          tile.scale = 1;
        }
      }
      if (tile.removing) {
        const elapsed = now - tile.bornAt;
        const progress = Math.min(1, elapsed / shrinkDuration);
        tile.scale = 1 - easeOutQuad(progress);

        // Morph icon rapidly during removal
        if (now - tile.lastIconChange > iconMorphIntervalMs) {
          tile.iconIndex = (tile.iconIndex + 1) % icons.current.length;
          tile.icon = icons.current[tile.iconIndex];
          tile.lastIconChange = now;
        }

        if (progress >= 1) toDelete.push(key);
      } else {
        // Auto-remove tiles after linger duration + random delay for stagger
        const age = now - tile.bornAt;
        // Add slight distance-based drift so not all center tiles remove together
        const distBias = tile.originGx != null ? (Math.abs(tile.gx - (tile.originGx as number)) + Math.abs(tile.gy - (tile.originGy as number))) * 20 : 0;
        if (age > tileLinger + tile.removalDelay + distBias) {
          tile.removing = true;
          tile.bornAt = now; // reset for shrink animation
        }
      }
    });

    for (const k of toDelete) activeRef.current.delete(k);

    // Draw
    ctx.globalCompositeOperation = blendMode;
    ctx.clearRect(0, 0, sizeRef.current.w, sizeRef.current.h);

    activeRef.current.forEach((tile) => {
      const x = tile.gx * step;
      const y = tile.gy * step;
      const w = tile.w * step;
      const h = tile.h * step;

      if (tile.scale < 0.01) return;

      ctx.save();
      const cx = x + w / 2;
      const cy = y + h / 2;
      ctx.translate(cx, cy);
      ctx.scale(tile.scale, tile.scale);
      ctx.translate(-cx, -cy);

      ctx.fillStyle = tileBg;
      ctx.fillRect(x, y, w, h);

      ctx.fillStyle = glyphColor;
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      const fontPx = Math.floor(step * 0.68 * Math.max(tile.w, tile.h));
      ctx.font = `${fontPx}px system-ui, ui-sans-serif, Segoe UI, Helvetica, Arial`;
      ctx.fillText(tile.icon, cx, cy);

      ctx.restore();
    });
  });

  return (
    <div className={className} style={{ position: "relative", width: "100%" }}>
      <canvas
        ref={canvasRef}
        aria-label="cursor-blocks-canvas"
        style={{ display: "block", width: "100%", height }}
      />
    </div>
  );
}
