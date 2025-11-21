"use client";

import { useEffect, useRef, useState } from "react";

import { AnimatePresence, motion, useMotionValue, useSpring } from "motion/react";

import { ImagePlayer } from "@/components/systaliko-ui/blocks/image-player";

interface CursorFollowImageProps {
  images: string[];
  children: React.ReactNode;
  imageWidth?: number;
  imageHeight?: number;
  offsetX?: number;
  offsetY?: number;
  tiltMaxDeg?: number; // max lean rotation left/right
  scaleMax?: number; // maximum scale when far from center
  enableSkew?: boolean; // apply skewX in addition to rotation
  skewMaxDeg?: number; // maximum skewX degrees
  cycleInterval?: number; // interval for image slider
  resetDelayMs?: number; // inactivity delay before returning to neutral
  returnToNeutral?: boolean; // whether to auto settle back to rectangle
}

export default function CursorFollowImage({
  images,
  children,
  imageWidth = 256,
  imageHeight = 192,
  offsetX = 20,
  offsetY = 20,
  tiltMaxDeg = 12,
  scaleMax = 1.04,
  enableSkew = true,
  skewMaxDeg = 8,
  cycleInterval = 450,
  resetDelayMs = 140,
  returnToNeutral = true,
}: CursorFollowImageProps) {
  const [isHovered, setIsHovered] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // Motion values for cursor position
  const cursorX = useMotionValue(0);
  const cursorY = useMotionValue(0);
  const rotate = useMotionValue(0);
  const scale = useMotionValue(1);
  const skewX = useMotionValue(0);
  const inactivityTimer = useRef<number | null>(null);
  const lastMoveTsRef = useRef<number>(0);

  // Spring physics for smooth follow with wobble
  const springConfig = {
    damping: 20,
    stiffness: 300,
    mass: 0.5,
  };

  const x = useSpring(cursorX, springConfig);
  const y = useSpring(cursorY, springConfig);
  const springRotate = useSpring(rotate, { ...springConfig, stiffness: 260 });
  const springScale = useSpring(scale, { ...springConfig, stiffness: 180 });
  const springSkewX = useSpring(skewX, { ...springConfig, stiffness: 220 });

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!isHovered) return;

      // Update cursor position relative to viewport
      cursorX.set(e.clientX + offsetX);
      cursorY.set(e.clientY + offsetY);

      // Derive rotation / skew based on position relative to hovered container
      const container = containerRef.current;
      if (container) {
        const rect = container.getBoundingClientRect();
        const localX = e.clientX - rect.left; // 0 .. width
        const ratio = (localX / rect.width) * 2 - 1; // -1 .. 1
        const rot = ratio * tiltMaxDeg; // lean
        rotate.set(rot);
        // scale grows slightly further from center
        const distFromCenter = Math.abs(ratio); // 0 .. 1
        const targetScale = 1 + (scaleMax - 1) * distFromCenter;
        scale.set(targetScale);
        if (enableSkew) {
          skewX.set(ratio * skewMaxDeg);
        }
      }

      // Inactivity handling: clear previous timer, set new one
      lastMoveTsRef.current = performance.now();
      if (inactivityTimer.current) {
        clearTimeout(inactivityTimer.current);
      }
      if (returnToNeutral) {
        inactivityTimer.current = window.setTimeout(() => {
          // Only reset if no newer movement occurred
          const elapsed = performance.now() - lastMoveTsRef.current;
          if (elapsed >= resetDelayMs) {
            rotate.set(0);
            scale.set(1);
            skewX.set(0);
          }
        }, resetDelayMs);
      }
    };

    if (isHovered) {
      window.addEventListener("mousemove", handleMouseMove);
    }

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      if (inactivityTimer.current) {
        clearTimeout(inactivityTimer.current);
        inactivityTimer.current = null;
      }
    };
  }, [isHovered, cursorX, cursorY, offsetX, offsetY, tiltMaxDeg, scaleMax, enableSkew, skewMaxDeg, rotate, scale, skewX, resetDelayMs, returnToNeutral]);

  const handleMouseEnter = (e: React.MouseEvent) => {
    setIsHovered(true);
    // Set initial position immediately
    cursorX.set(e.clientX + offsetX);
    cursorY.set(e.clientY + offsetY);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    rotate.set(0);
    scale.set(1);
    skewX.set(0);
    if (inactivityTimer.current) {
      clearTimeout(inactivityTimer.current);
      inactivityTimer.current = null;
    }
  };

  return (
    <>
      <div
        ref={containerRef}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        className="relative inline-block"
      >
        {children}
      </div>

      {/* Cursor-following image player */}
      <AnimatePresence>
        {isHovered && images.length > 0 && (
          <motion.div
            className="fixed pointer-events-none z-9999"
            style={{
              x,
              y,
              width: imageWidth,
              height: imageHeight,
              left: 0,
              top: 0,
              rotate: springRotate,
              scale: springScale,
              skewX: enableSkew ? springSkewX : undefined,
            }}
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            transition={{
              scale: { type: "spring", damping: 15, stiffness: 300 },
              opacity: { duration: 0.2 },
            }}
          >
            <ImagePlayer
              images={images}
              interval={cycleInterval}
              fill
              className="rounded-lg object-cover shadow-2xl"
              alt="Project preview"
            />
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
