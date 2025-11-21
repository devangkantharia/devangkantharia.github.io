import { useEffect, useRef } from "react";

export type Vec2 = { x: number; y: number };

export function usePointer(options?: { disabledOnTouch?: boolean }) {
  const targetRef = useRef<Vec2>({ x: 0, y: 0 });
  const activeRef = useRef<boolean>(false);

  useEffect(() => {
    const isTouch = navigator.maxTouchPoints > 0;
    if (options?.disabledOnTouch && isTouch) return;

    const onMove = (e: Event) => {
      const pointerEvent = e as PointerEvent;
      targetRef.current.x = pointerEvent.clientX;
      targetRef.current.y = pointerEvent.clientY;
      activeRef.current = true;
    };
    const onLeave = () => {
      activeRef.current = false;
    };

    // Prefer pointerrawupdate if supported for smoother sampling
    const type = (
      "onpointerrawupdate" in window ? "pointerrawupdate" : "pointermove"
    ) as keyof WindowEventMap;
    window.addEventListener(type, onMove, { passive: true });
    window.addEventListener("pointerleave", onLeave, { passive: true });

    return () => {
      window.removeEventListener(type, onMove);
      window.removeEventListener("pointerleave", onLeave);
    };
  }, [options?.disabledOnTouch]);

  return { targetRef, activeRef } as const;
}
