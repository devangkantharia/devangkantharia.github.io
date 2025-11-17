"use client";

import { useEffect, useRef, useState } from "react";

interface MagneticBorderBottomProps {
  children: React.ReactNode;
  className?: string;
  borderColor?: string;
  borderColorDark?: string;
  borderClassName?: string; // New prop for Tailwind classes
  borderHeight?: number;
  magneticStrength?: number;
  transitionDuration?: number;
}

export default function MagneticBorderBottom({
  children,
  className = "",
  borderColor,
  borderColorDark,
  borderClassName = "bg-[#19adfd] dark:bg-blue-400", // Default Tailwind classes
  borderHeight = 2,
  magneticStrength = 0.3,
  transitionDuration = 300,
}: MagneticBorderBottomProps) {
  const elementRef = useRef<HTMLSpanElement>(null);
  const borderRef = useRef<HTMLSpanElement>(null);
  const textRef = useRef<HTMLSpanElement>(null);
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    // Check if dark mode is active
    const checkDarkMode = () => {
      setIsDark(document.documentElement.classList.contains('dark'));
    };

    checkDarkMode();

    // Watch for theme changes
    const observer = new MutationObserver(checkDarkMode);
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['class'],
    });

    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const element = elementRef.current;
    const border = borderRef.current;
    const text = textRef.current;
    if (!element || !border || !text) return;

    let animationFrameId: number;

    const handleMouseMove = (e: MouseEvent) => {
      const rect = element.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      // Calculate magnetic pull
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;
      const deltaX = (x - centerX) * magneticStrength;
      const deltaY = (y - centerY) * magneticStrength;

      // Cancel any previous animation frame
      if (animationFrameId) {
        cancelAnimationFrame(animationFrameId);
      }

      // Apply transform to both the border and text
      animationFrameId = requestAnimationFrame(() => {
        if (border && text) {
          border.style.transform = `translate(${deltaX}px, ${deltaY}px)`;
          text.style.transform = `translate(${deltaX}px, ${deltaY}px)`;
        }
      });
    };

    const handleMouseEnter = () => {
      border.style.transition = `width ${transitionDuration}ms ease-out, transform 0.1s ease-out`;
      text.style.transition = `transform 0.1s ease-out`;
      border.style.width = "100%";
    };

    const handleMouseLeave = () => {
      // Cancel any pending animation frames immediately
      if (animationFrameId) {
        cancelAnimationFrame(animationFrameId);
      }

      // Force immediate reset with transition
      border.style.transition = `width ${transitionDuration}ms ease-out, transform 0.15s ease-out`;
      text.style.transition = `transform 0.15s ease-out`;
      border.style.width = "0%";

      // Use requestAnimationFrame to ensure the reset happens
      requestAnimationFrame(() => {
        border.style.transform = "translate(0px, 0px)";
        text.style.transform = "translate(0px, 0px)";
      });
    };

    element.addEventListener("mouseenter", handleMouseEnter);
    element.addEventListener("mouseleave", handleMouseLeave);
    element.addEventListener("mousemove", handleMouseMove);

    return () => {
      element.removeEventListener("mouseenter", handleMouseEnter);
      element.removeEventListener("mouseleave", handleMouseLeave);
      element.removeEventListener("mousemove", handleMouseMove);
      if (animationFrameId) {
        cancelAnimationFrame(animationFrameId);
      }
    };
  }, [magneticStrength, transitionDuration]);

  // Use hex colors if provided, otherwise use Tailwind classes
  const useTailwindClasses = !borderColor && !borderColorDark;
  const currentBorderColor = useTailwindClasses
    ? undefined
    : (isDark ? borderColorDark : borderColor);

  return (
    <span
      ref={elementRef}
      className={`relative inline-block ${className}`}
      style={{ paddingBottom: `${borderHeight + 4}px` }}
    >
      <span ref={textRef} style={{ display: "inline-block" }}>
        {children}
      </span>
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
