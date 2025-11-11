"use client";

import { Link, MousePointerClick, Pointer } from "lucide-react";
import { FaHandPointer } from "react-icons/fa";

import { useState, useEffect } from "react";
import {
  Cursor,
  CursorFollow,
  useCursor,
} from "@/components/ui/shadcn-io/animated-cursor";

export function HoverCursor() {
  const DEFAULT_TEXT_CLASS = "text-stone-600";
  const DEFAULT_BG_CLASS = "bg-stone-600";

  const [hoveredElementType, setHoveredElementType] = useState<string | null>(
    null,
  );
  const [textClass, setTextClass] = useState(DEFAULT_TEXT_CLASS);
  const [bgClass, setBgClass] = useState(DEFAULT_BG_CLASS);
  const [isPointer, setIsPointer] = useState(false);

  const { cursorPos } = useCursor();

  useEffect(() => {
    let scrollTimeout: NodeJS.Timeout;

    const updateHoverState = (el: Element | null) => {
      // Set default state first
      setIsPointer(false);
      setHoveredElementType(null);
      setTextClass(DEFAULT_TEXT_CLASS);
      setBgClass(DEFAULT_BG_CLASS);

      if (el) {
        const hoverTarget = el.closest("[data-cursor-hover-text]") as HTMLElement;
        const pointerTarget = el.closest("button, a");

        if (pointerTarget && !hoverTarget) {
          setIsPointer(true);
        } else if (hoverTarget) {
          setHoveredElementType(hoverTarget.dataset.cursorHoverText || null);
          setTextClass(hoverTarget.dataset.cursorTextClass || DEFAULT_TEXT_CLASS);
          setBgClass(hoverTarget.dataset.cursorBgClass || DEFAULT_BG_CLASS);
        }
      }
    };

    const handleScroll = () => {
      setHoveredElementType(null);
      clearTimeout(scrollTimeout);
      scrollTimeout = setTimeout(() => {
        const el = document.elementFromPoint(cursorPos.x, cursorPos.y);
        updateHoverState(el);
      }, 100);
    };

    const handleMouseMove = (e: MouseEvent) => {
      updateHoverState(e.target as Element);
    };

    window.addEventListener("scroll", handleScroll);
    window.addEventListener("mousemove", handleMouseMove);

    return () => {
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("mousemove", handleMouseMove);
    };
  }, [cursorPos.x, cursorPos.y]);

  return (
    <>
      <Cursor>
        {isPointer ? (
          <FaHandPointer
            className={`size-7 ${textClass} drop-shadow-lg drop-shadow-gray-400`}
          />
        ) : (
          <svg
            className={`size-6 ${textClass} drop-shadow-lg drop-shadow-gray-400`}
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 40 40"
          >
            <path fill="currentColor" d="M1.8 4.4 7 36.2c.3 1.8 2.6 2.3 3.6.8l3.9-5.7c1.7-2.5 4.5-4.1 7.5-4.3l6.9-.5c1.8-.1 2.5-2.4 1.1-3.5L5 2.5c-1.4-1.1-3.5 0-3.3 1.9Z" />
          </svg>
        )}
      </Cursor>
      {hoveredElementType && (
        <CursorFollow style={{ top: cursorPos.y + 20, left: cursorPos.x + 20 }}>
          <div
            className={`text-white px-2 py-1 rounded-lg text-sm shadow-lg capitalize ${bgClass}`}
          >
            {hoveredElementType}
          </div>
        </CursorFollow>
      )}
    </>
  );
}