"use client";

import { useEffect, useRef, useState } from "react";

import type { ValueTransition } from "motion";
import { AnimatePresence, motion, useMotionValue, useSpring } from "motion/react";

import { ImagePlayer } from "@/components/systaliko-ui/blocks/image-player";

interface CursorFollowImageProps {
  images: string[]; // An array of image URLs to display in the image player.
  targetRef: React.RefObject<HTMLElement | null>; // A React ref to the element that the cursor will track for hover events.
  imageWidth?: number; // The width of the image container in pixels.
  imageHeight?: number; // The height of the image container in pixels.
  offsetX?: number; // The horizontal offset of the image from the cursor position.
  offsetY?: number; // The vertical offset of the image from the cursor position.
  tiltMaxDeg?: number; // The maximum degrees the image will tilt left or right.
  scaleMax?: number; // The maximum the image will scale up when the cursor is far from the center of the target element.
  enableSkew?: boolean; // If true, a skew transformation will be applied in addition to rotation.
  skewMaxDeg?: number; // The maximum skew angle in degrees.
  cycleInterval?: number; // The time in milliseconds between cycling to the next image.
  resetDelayMs?: number; // The delay in milliseconds before the image returns to its neutral state after cursor inactivity.
  returnToNeutral?: boolean; // If true, the image will automatically reset to a neutral position (no tilt, skew, or scale).
  anchorBelow?: boolean; // If true, the image is anchored below the target element instead of following the cursor.
  anchorMarginY?: number; // The vertical margin in pixels when the image is anchored below.
  transitionConfig?: {
    scale?: ValueTransition; // Transition configuration for the scale animation.
    opacity?: ValueTransition; // Transition configuration for the opacity animation.
  };
  movementThresholdPx?: number; // The number of pixels the cursor must move horizontally before tilt, skew, and scale effects are activated.
}

export default function CursorFollowImage({
  images, // Array of image URLs for the slideshow.
  targetRef,
  imageWidth = 280,
  imageHeight = 192,
  offsetX = 20,
  offsetY = 20,
  tiltMaxDeg = 2,
  scaleMax = 1.04,
  enableSkew = true,
  skewMaxDeg = 8,
  cycleInterval = 450,
  resetDelayMs = 140,
  returnToNeutral = true,
  anchorBelow = false,
  anchorMarginY = 8,
  transitionConfig,
  movementThresholdPx = 2,
}: CursorFollowImageProps) {
  // State to track whether the target element is currently being hovered.
  const [isHovered, setIsHovered] = useState(false);
  // State to store the initial x/y coordinates for the image when it first appears.
  const [initialPosition, setInitialPosition] = useState<{ x: number; y: number } | null>(null);

  // Motion values that will be updated on mouse move and used by springs for smooth animations.
  const rotate = useMotionValue(0); // Holds the target rotation value.
  const scale = useMotionValue(1); // Holds the target scale value.
  const skewX = useMotionValue(0); // Holds the target skewX value.
  const inactivityTimer = useRef<number | null>(null); // Ref to hold the timer ID for resetting the image to neutral.
  const lastMoveTsRef = useRef<number>(0); // Ref to store the timestamp of the last mouse movement.
  const startClientXRef = useRef<number | null>(null); // Ref to store the initial cursor X position on mouse enter to check against the movement threshold.
  const hasActivatedMotionRef = useRef<boolean>(false); // Ref to track if the motion effects (tilt/skew) have been activated after passing the movement threshold.
  const appearanceCompleteRef = useRef<boolean>(false); // Ref to track if the initial appearance animation has finished.
  const appearanceTimerRef = useRef<number | null>(null); // Ref to hold the timer ID for the appearance animation completion.

  // Spring physics for smooth follow with wobble
  const springConfig = {
    damping: 20,
    stiffness: 300,
    mass: 0.5,
  };

  // Create spring animations for position, rotation, scale, and skew.
  // These will smoothly animate to the target values set in the motion values.
  const x = useSpring(initialPosition ? initialPosition.x : 0, springConfig);
  const y = useSpring(initialPosition ? initialPosition.y : 0, springConfig);
  const springRotate = useSpring(rotate, { ...springConfig, stiffness: 260 });
  const springScale = useSpring(scale, { ...springConfig, stiffness: 180 });
  const springSkewX = useSpring(skewX, { ...springConfig, stiffness: 220 });

  // Main effect for handling all mouse events.
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!isHovered) return;

      const parent = targetRef.current?.parentElement; // Get the parent of the target element for coordinate calculations.
      if (parent) {
        const parentRect = parent.getBoundingClientRect();
        const localX = e.clientX - parentRect.left; // position inside li
        if (anchorBelow) {
          // lock Y just below li, move X following cursor
          const newX = localX - imageWidth / 2; // center image under cursor within li
          x.set(newX);
          y.set(parentRect.height + anchorMarginY);
        } else {
          x.set(localX + offsetX);
          y.set(e.clientY - parentRect.top + offsetY);
        }
      } else {
        // fallback to viewport coordinates
        if (anchorBelow) {
          x.set(e.clientX - imageWidth / 2);
          y.set(e.clientY + anchorMarginY);
        } else {
          x.set(e.clientX + offsetX);
          y.set(e.clientY + offsetY);
        }
      }

      const container = targetRef.current; // The element being hovered.
      if (container) {
        const rect = container.getBoundingClientRect();
        const localX = e.clientX - rect.left; // Cursor's horizontal position within the container (0 to width).
        const ratio = (localX / rect.width) * 2 - 1; // -1 .. 1

        // Only activate skew after appearance animation AND movement threshold
        if (!appearanceCompleteRef.current) {
          // Keep neutral during appearance
          rotate.set(0);
          scale.set(1);
          skewX.set(0);
        } else {
          // Appearance complete, now check for movement threshold
          if (!hasActivatedMotionRef.current && startClientXRef.current !== null) {
            // Calculate how much the cursor has moved horizontally since entering the element.
            const delta = Math.abs(e.clientX - startClientXRef.current);
            if (delta >= movementThresholdPx) {
              hasActivatedMotionRef.current = true;
            }
          }

          if (hasActivatedMotionRef.current) {
            // If motion is activated, calculate and apply tilt, scale, and skew based on cursor position.
            const rot = ratio * tiltMaxDeg;
            rotate.set(rot);
            const distFromCenter = Math.abs(ratio);
            const targetScale = 1 + (scaleMax - 1) * distFromCenter;
            scale.set(targetScale);
            if (enableSkew) {
              skewX.set(-ratio * skewMaxDeg); // Skew in the opposite direction of the cursor for a natural feel.
            }
          } else {
            rotate.set(0);
            scale.set(1);
            skewX.set(0);
          }
        }
      }

      // Inactivity timer logic.
      lastMoveTsRef.current = performance.now();
      if (inactivityTimer.current) {
        clearTimeout(inactivityTimer.current);
      }
      if (returnToNeutral) {
        // If the cursor is idle for `resetDelayMs`, reset the transformations.
        inactivityTimer.current = window.setTimeout(() => {
          const elapsed = performance.now() - lastMoveTsRef.current;
          if (elapsed >= resetDelayMs) {
            rotate.set(0);
            scale.set(1);
            skewX.set(0);
          }
        }, resetDelayMs);
      }
    };

    const handleMouseEnter = (e: MouseEvent) => {
      // When the cursor enters the target element, set up the initial state.
      setIsHovered(true);
      startClientXRef.current = e.clientX;
      hasActivatedMotionRef.current = false;
      appearanceCompleteRef.current = false;

      // Force neutral state before appearance
      rotate.set(0);
      scale.set(1);
      skewX.set(0);

      // Clear previous appearance timer if any
      if (appearanceTimerRef.current) {
        clearTimeout(appearanceTimerRef.current);
        appearanceTimerRef.current = null;
      }

      // Derive appearance delay dynamically from transitionConfig to know when the entry animation is complete.
      const scaleTransition = transitionConfig?.scale;
      let appearanceDelay = 420; // default approximate spring settle
      if (scaleTransition) {
        if (typeof scaleTransition.duration === 'number') {
          appearanceDelay = Math.max(50, scaleTransition.duration * 1000 + 60); // duration based + buffer
        } else if (scaleTransition.type === 'spring') {
          const damping = scaleTransition.damping ?? 15;
          const stiffness = scaleTransition.stiffness ?? 300;
          // Heuristic: settle time roughly proportional to damping/stiffness ratio
          appearanceDelay = Math.min(900, Math.max(220, (damping / stiffness) * 2200));
        }
      }

      // Set a timer to mark the end of the appearance animation.
      appearanceTimerRef.current = window.setTimeout(() => {
        appearanceCompleteRef.current = true;
      }, appearanceDelay);

      const container = targetRef.current?.parentElement;
      // Set the initial position of the image.
      if (container) {
        const rect = container.getBoundingClientRect();
        if (anchorBelow) {
          const startX = rect.width / 2 - imageWidth / 2;
          const startY = rect.height + anchorMarginY;
          setInitialPosition({ x: startX, y: startY });
          x.set(startX);
          y.set(startY);
        } else {
          // start from center top
          setInitialPosition({ x: rect.width / 2 - imageWidth / 2, y: 0 });
          x.set(rect.width / 2 - imageWidth / 2);
          y.set(0);
        }
      }
    };

    const handleMouseLeave = () => {
      // When the cursor leaves, reset all states and clear timers.
      setIsHovered(false);
      rotate.set(0);
      setInitialPosition(null);
      scale.set(1);
      skewX.set(0);
      startClientXRef.current = null;
      hasActivatedMotionRef.current = false;
      appearanceCompleteRef.current = false;
      if (inactivityTimer.current) {
        clearTimeout(inactivityTimer.current);
        inactivityTimer.current = null;
      }
      if (appearanceTimerRef.current) {
        clearTimeout(appearanceTimerRef.current);
        appearanceTimerRef.current = null;
      }
    };

    const node = targetRef.current;
    // Add event listeners when the component mounts.
    if (node) {
      node.addEventListener("mouseenter", handleMouseEnter);
      node.addEventListener("mouseleave", handleMouseLeave);
      window.addEventListener("mousemove", handleMouseMove);
    }

    return () => {
      // Cleanup: remove event listeners and clear timers when the component unmounts.
      if (node) {
        node.removeEventListener("mouseenter", handleMouseEnter);
        node.removeEventListener("mouseleave", handleMouseLeave);
      }
      window.removeEventListener("mousemove", handleMouseMove);
      if (inactivityTimer.current) {
        clearTimeout(inactivityTimer.current);
        inactivityTimer.current = null;
      }
      if (appearanceTimerRef.current) {
        clearTimeout(appearanceTimerRef.current);
        appearanceTimerRef.current = null;
      }
    };
  }, [anchorBelow, targetRef, isHovered, offsetX, offsetY, tiltMaxDeg, scaleMax, enableSkew, skewMaxDeg, rotate, scale, skewX, resetDelayMs, returnToNeutral, x, y, imageWidth, movementThresholdPx, anchorMarginY, transitionConfig]);

  return (
    // AnimatePresence handles the mounting and unmounting animations.
    <AnimatePresence>
      <AnimatePresence>
        {isHovered && images.length > 0 && (
          // The main motion div that follows the cursor and animates.
          <motion.div
            className="pointer-events-none z-50 absolute left-0 top-5" // `pointer-events-none` prevents the image from interfering with mouse events.
            style={{
              x,
              y,
              width: imageWidth,
              height: imageHeight,
              rotate: springRotate,
              scale: springScale,
              skewX: enableSkew ? springSkewX : undefined,
            }}
            // Initial and exit animations for appearing and disappearing.
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            // Transition configurations for the animations, with fallbacks.
            transition={{
              scale: transitionConfig?.scale ?? { type: "spring", damping: 15, stiffness: 300 },
              opacity: transitionConfig?.opacity ?? { duration: 0.2 },
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
    </AnimatePresence>
  );
}
