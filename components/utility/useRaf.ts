import { useEffect, useRef } from "react";

export type RafCallback = (dt: number, now: number) => void;

export function useRaf(callback: RafCallback) {
  const cbRef = useRef(callback);
  cbRef.current = callback;

  const rafRef = useRef<number | null>(null);
  const runningRef = useRef<boolean>(true);

  useEffect(() => {
    let prev = performance.now();

    const tick = (now: number) => {
      const dt = (now - prev) / 1000;
      prev = now;
      cbRef.current(dt, now);
      if (runningRef.current) {
        rafRef.current = requestAnimationFrame(tick);
      }
    };

    const handleVisibility = () => {
      if (document.visibilityState === "hidden") {
        runningRef.current = false;
        if (rafRef.current !== null) cancelAnimationFrame(rafRef.current);
        rafRef.current = null;
      } else {
        runningRef.current = true;
        prev = performance.now();
        rafRef.current = requestAnimationFrame(tick);
      }
    };

    rafRef.current = requestAnimationFrame(tick);
    document.addEventListener("visibilitychange", handleVisibility);
    return () => {
      runningRef.current = false;
      if (rafRef.current !== null) cancelAnimationFrame(rafRef.current);
      document.removeEventListener("visibilitychange", handleVisibility);
    };
  }, []);
}
