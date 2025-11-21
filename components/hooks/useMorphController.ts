import { useRef, useCallback } from "react";

// Manages morph progression between shape indices.
export function useMorphController(
  onUpdate: (current: number, next: number, progress: number) => void,
) {
  const currentRef = useRef(0);
  const nextRef = useRef(0);
  const progressRef = useRef(1); // start completed
  const speedRef = useRef(0.9); // progress per second base (eased in shader)

  const setShape = useCallback((target: number) => {
    if (target === nextRef.current || target === currentRef.current) return;
    currentRef.current = nextRef.current; // previous target becomes current
    nextRef.current = target;
    progressRef.current = 0; // restart morph
  }, []);

  const tick = useCallback(
    (dt: number) => {
      if (progressRef.current < 1) {
        const inc = dt * speedRef.current;
        progressRef.current = Math.min(1, progressRef.current + inc);
      }
      onUpdate(currentRef.current, nextRef.current, progressRef.current);
    },
    [onUpdate],
  );

  return { setShape, tick };
}
