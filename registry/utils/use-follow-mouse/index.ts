import { useEffect, useRef } from "react";

import { frame, SpringOptions, useMotionValue, useSpring } from "motion/react";

interface UseFollowMouseProps {
  springConfig?: SpringOptions;
}
export function useFollowMouse(props: UseFollowMouseProps) {
  const { springConfig } = props;
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const cursorRef = useRef<HTMLDivElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const lastMousePos = useRef({ x: 0, y: 0 });

  useEffect(() => {
    const containerNode = containerRef.current;

    const updateCursorPosition = (clientX: number, clientY: number) => {
      const cursor = cursorRef.current;
      const container = containerRef.current;
      if (!cursor || !container) return;

      frame.read(() => {
        const containerRect = container.getBoundingClientRect();
        const relativeX = clientX - containerRect.left - cursor.offsetWidth / 2;
        const relativeY = clientY - containerRect.top - cursor.offsetHeight / 2;

        x.set(relativeX);
        y.set(relativeY);
      });
    };

    const followMouse = (e: MouseEvent) => {
      lastMousePos.current = { x: e.clientX, y: e.clientY };
      updateCursorPosition(e.clientX, e.clientY);
    };

    const handleMouseEnter = (e: MouseEvent) => {
      lastMousePos.current = { x: e.clientX, y: e.clientY };
      updateCursorPosition(e.clientX, e.clientY);
    };

    const handleScroll = () => {
      // Update cursor position on scroll using last known mouse position
      updateCursorPosition(lastMousePos.current.x, lastMousePos.current.y);
    };

    // Track global mouse movement to always have the latest position
    const trackGlobalMouse = (e: MouseEvent) => {
      lastMousePos.current = { x: e.clientX, y: e.clientY };
    };

    containerNode?.addEventListener("mousemove", followMouse);
    containerNode?.addEventListener("mouseenter", handleMouseEnter);
    window.addEventListener("mousemove", trackGlobalMouse);
    window.addEventListener("scroll", handleScroll, true);

    return () => {
      containerNode?.removeEventListener("mousemove", followMouse);
      containerNode?.removeEventListener("mouseenter", handleMouseEnter);
      window.removeEventListener("mousemove", trackGlobalMouse);
      window.removeEventListener("scroll", handleScroll, true);
    };
  }, [x, y]);

  const cursorXSpring = useSpring(x, springConfig);
  const cursorYSpring = useSpring(y, springConfig);

  return {
    containerRef,
    cursorRef,
    cursorXSpring,
    cursorYSpring,
  };
}
