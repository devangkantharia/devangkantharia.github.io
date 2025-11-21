"use client";

import { useEffect, useRef, useState } from "react";

import { motion, useMotionValue, useSpring } from "motion/react";

interface MagneticBorderBottomWithWobbleProps {
  children: React.ReactNode;
  className?: string;
  borderColor?: string;
  borderColorDark?: string;
  borderClassName?: string;
  borderHeight?: number;
  magneticStrength?: number;
  transitionDuration?: number;
  wobbleRotateStrength?: number; // multiplier for rotation based on X delta
  wobbleScaleStrength?: number; // multiplier for scale based on distance from center
}

export default function MagneticBorderBottomWithWobble({
  children,
  className = "",
  borderColor,
  borderColorDark,
  borderClassName = "bg-[#19adfd] dark:bg-blue-400",
  borderHeight = 2,
  magneticStrength = 0.3,
  transitionDuration = 300,
  wobbleRotateStrength = 0.08,
  wobbleScaleStrength = 0.015,
}: MagneticBorderBottomWithWobbleProps) {
  const elementRef = useRef<HTMLSpanElement>(null);
  const borderRef = useRef<HTMLSpanElement>(null);
  const [isDark, setIsDark] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  // Motion values for wobble effect
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const rotate = useMotionValue(0);
  const scale = useMotionValue(1);

  // Spring physics for smooth wobble
  const springConfig = {
    damping: 15,
    stiffness: 200,
    mass: 0.3,
  };

  const springX = useSpring(x, springConfig);
  const springY = useSpring(y, springConfig);
  const springRotate = useSpring(rotate, { ...springConfig, stiffness: 260 });
  const springScale = useSpring(scale, { ...springConfig, stiffness: 180 });

  useEffect(() => {
    const checkDarkMode = () => {
      setIsDark(document.documentElement.classList.contains("dark"));
    };

    checkDarkMode();

    const observer = new MutationObserver(checkDarkMode);
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["class"],
    });

    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const element = elementRef.current;
    const border = borderRef.current;
    if (!element || !border) return;

    const handleMouseMove = (e: MouseEvent) => {
      if (!isHovered) return;

      const rect = element.getBoundingClientRect();
      const mouseX = e.clientX - rect.left;
      const mouseY = e.clientY - rect.top;

      const centerX = rect.width / 2;
      const centerY = rect.height / 2;
      const deltaX = (mouseX - centerX) * magneticStrength;
      const deltaY = (mouseY - centerY) * magneticStrength;

      x.set(deltaX);
      y.set(deltaY);

      // Rotation based on horizontal delta (subtle wobble)
      rotate.set(deltaX * wobbleRotateStrength);
      // Scale up a bit based on distance from center for a breathing wobble
      const dist = Math.sqrt(deltaX * deltaX + deltaY * deltaY);
      const targetScale = 1 + Math.min(dist / (rect.width * 0.5), 1) * wobbleScaleStrength;
      scale.set(targetScale);
    };

    const handleMouseEnter = () => {
      setIsHovered(true);
      border.style.transition = `width ${transitionDuration}ms ease-out`;
      border.style.width = "100%";
    };

    const handleMouseLeave = () => {
      setIsHovered(false);
      border.style.transition = `width ${transitionDuration}ms ease-out`;
      border.style.width = "0%";
      x.set(0);
      y.set(0);
      rotate.set(0);
      scale.set(1);
    };

    element.addEventListener("mouseenter", handleMouseEnter);
    element.addEventListener("mouseleave", handleMouseLeave);
    element.addEventListener("mousemove", handleMouseMove);

    return () => {
      element.removeEventListener("mouseenter", handleMouseEnter);
      element.removeEventListener("mouseleave", handleMouseLeave);
      element.removeEventListener("mousemove", handleMouseMove);
    };
  }, [
    isHovered,
    magneticStrength,
    transitionDuration,
    wobbleRotateStrength,
    wobbleScaleStrength,
    x,
    y,
    rotate,
    scale,
  ]);

  const useTailwindClasses = !borderColor && !borderColorDark;
  const currentBorderColor = useTailwindClasses
    ? undefined
    : isDark
      ? borderColorDark
      : borderColor;

  return (
    <span
      ref={elementRef}
      className={`relative inline-block ${className}`}
      style={{ paddingBottom: `${borderHeight + 4}px` }}
    >
      <motion.span
        style={{ x: springX, y: springY, display: "inline-block" }}
      >
        <motion.span style={{ rotate: springRotate, scale: springScale, display: "inline-block" }}>
          {children}
        </motion.span>
      </motion.span>
      <span
        ref={borderRef}
        className={useTailwindClasses ? borderClassName : ""}
        style={{
          position: "absolute",
          bottom: "0",
          left: "0",
          width: "0%",
          height: `${borderHeight}px`,
          backgroundColor: currentBorderColor,
          pointerEvents: "none",
        }}
      />
    </span>
  );
}
