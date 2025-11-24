"use client";

import { useEffect, useMemo, useRef, useState } from "react";

import Link from "next/link";

import { motion, useMotionValue, useSpring, useTransform, MotionValue } from "framer-motion";

// SECTION LABEL POSITIONS (edit positions to move labels among lines)
// Lines are numbered 1..totalLines from top to bottom
const navItems = [
  { position: 3, title: "HOME", href: "#home" },
  { position: 11, title: "PROJECTS", href: "#projectWork" },
  { position: 20, title: "TOOLS", href: "#tools" },
  // Ensure this matches the actual DOM id of the contact section (#socialcontact)
  { position: 26, title: "CONTACT", href: "#socialcontact" },
];

// THEME ACCENT HELPERS
// Detect current theme and return project accent colors
function useThemeAccent() {
  const [isDark, setIsDark] = useState(false);
  useEffect(() => {
    const root = document.documentElement;
    const check = () => setIsDark(root.classList.contains("dark"));
    check();
    const mo = new MutationObserver(check);
    mo.observe(root, { attributes: true, attributeFilter: ["class"] });
    return () => mo.disconnect();
  }, []);
  // Project accents: light -> #19adfd, dark -> text-yellow-300 (#fde047)
  const accentHex = isDark ? "#fde047" : "#19adfd";
  return { accentHex, isDark };
}

// Color utilities
function hexToRgb(hex: string) {
  const m = hex.replace("#", "");
  const v = m.length === 3 ? m.split("").map((c) => c + c).join("") : m;
  const num = parseInt(v, 16);
  return { r: (num >> 16) & 255, g: (num >> 8) & 255, b: num & 255 };
}
function rgbToStr({ r, g, b }: { r: number; g: number; b: number }) {
  return `rgb(${r}, ${g}, ${b})`;
}
function lighten({ r, g, b }: { r: number; g: number; b: number }, amt: number) {
  return {
    r: Math.min(255, Math.round(r + (255 - r) * amt)),
    g: Math.min(255, Math.round(g + (255 - g) * amt)),
    b: Math.min(255, Math.round(b + (255 - b) * amt)),
  };
}

export default function DKNavbar() {
  const [isHovered, setIsHovered] = useState(false);
  const [activeSection, setActiveSection] = useState<string | null>(null);
  const mouseY = useMotionValue(Infinity);
  const { accentHex, isDark } = useThemeAccent();
  const accentRGB = useMemo(() => hexToRgb(accentHex), [accentHex]);
  const accentSoft = useMemo(() => lighten(accentRGB, 0.25), [accentRGB]);
  const neutralRGB = useMemo(() => hexToRgb("#6b7280"), []); // Tailwind gray-500

  // Detect active section using IntersectionObserver for more reliability
  useEffect(() => {
    const sectionIds = ["home", "projectWork", "tools", "socialcontact"];
    const options: IntersectionObserverInit = {
      root: null,
      rootMargin: "0px 0px -50% 0px", // trigger when section enters upper half
      threshold: 0.2,
    };
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          setActiveSection(entry.target.id);
        }
      });
    }, options);
    sectionIds.forEach((id) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });

    // Fallback: if near bottom of page, force active to contact even if IntersectionObserver hasn't triggered
    const handleScrollFallback = () => {
      const contactEl = document.getElementById("socialcontact");
      if (!contactEl) return; // if missing, skip
      const scrollBottom = window.scrollY + window.innerHeight;
      const docHeight = document.documentElement.scrollHeight;
      if (docHeight - scrollBottom < 32) {
        setActiveSection("socialcontact");
      }
    };
    window.addEventListener("scroll", handleScrollFallback, { passive: true });
    return () => {
      observer.disconnect();
      window.removeEventListener("scroll", handleScrollFallback);
    };
  }, []);

  // TOTAL LINES (edit to increase/decrease density)
  const totalLines = 30;

  return (
    <motion.nav
      onMouseMove={(e) => {
        mouseY.set(e.clientY);
        setIsHovered(true);
      }}
      onMouseLeave={() => {
        mouseY.set(Infinity);
        setIsHovered(false);
      }}
      className="fixed left-0 top-0 hidden h-screen flex-col items-start justify-between py-4 md:flex z-10"
    >
      {Array.from(Array(totalLines).keys()).map((i) => {
        const navItem = navItems.find((item) => item.position === i + 1);
        // Determine if this line belongs to the active section
        const lineIndex = i + 1;
        let isActiveRange = false;
        if (activeSection) {
          const sectionItem = navItems.find(n => n.href.slice(1) === activeSection);
          if (sectionItem) {
            const idx = navItems.indexOf(sectionItem);
            // For the first section extend start to the very top (line 1)
            const start = idx === 0 ? 1 : sectionItem.position;
            const end = idx < navItems.length - 1 ? navItems[idx + 1].position - 1 : totalLines;
            isActiveRange = lineIndex >= start && lineIndex <= end;
          }
        }
        return (
          <NavLine
            key={i}
            title={navItem?.title}
            href={navItem?.href}
            isHovered={isHovered}
            mouseY={mouseY}
            activeRange={isActiveRange}
            accentHex={accentHex}
            accentSoft={accentSoft}
            neutralRGB={neutralRGB}
            isDark={isDark}
          />
        );
      })}

      {/* CLICKABLE ZONES WIDTH (edit w-[170px] for larger/smaller hit area) */}
      <div className="pointer-events-none absolute left-0 top-0 h-full w-[170px]">
        {navItems.map((item, idx) => {
          // Make first section clickable from very top (include lines before label)
          const start = idx === 0 ? 0 : (item.position - 1) / totalLines; // start as fraction
          const end = idx < navItems.length - 1
            ? (navItems[idx + 1].position - 1) / totalLines
            : 1; // until bottom
          const topPct = `${start * 100}%`;
          const heightPct = `${(end - start) * 100}%`;

          return (
            <Link
              key={item.title}
              href={item.href}
              className="absolute left-0 w-full pointer-events-auto"
              style={{ top: topPct, height: heightPct }}
              aria-label={`Go to ${item.title}`}
              onClick={(e) => {
                e.preventDefault();
                const el = document.getElementById(item.href.slice(1));
                if (el) {
                  el.scrollIntoView({ behavior: "smooth" });
                }
              }}
            />
          );
        })}
      </div>
    </motion.nav>
  );
}

// SPRING PHYSICS (tune for bounciness/lag)
const spring = {
  mass: 1,
  stiffness: 200,
  damping: 15,
};

function NavLine({
  mouseY,
  isHovered,
  title,
  href,
  activeRange,
  accentHex,
  accentSoft,
  neutralRGB,
  isDark,
}: {
  mouseY: MotionValue<number>;
  isHovered: boolean;
  title?: string;
  href?: string;
  activeRange: boolean;
  accentHex: string;
  accentSoft: { r: number; g: number; b: number };
  neutralRGB: { r: number; g: number; b: number };
  isDark: boolean;
}) {
  const ref = useRef<HTMLDivElement>(null);

  const distance = useTransform(mouseY, (val: number) => {
    const bounds = ref.current?.getBoundingClientRect() ?? { y: 0, height: 0 };
    return val - bounds.y - bounds.height / 2;
  });

  // WIDTH PROFILE (edit numbers to change wave size)
  // Grows toward cursor (imaginary circle influence) else base width
  const widthTransform = useTransform(distance, [-120, 0, 120], [10, 100, 10]);
  const width = useSpring(widthTransform, spring);
  const hoverWidth = useSpring(30, spring);

  // IMAGINARY CIRCLE SETTINGS
  // radius: how far the hover influence extends vertically from pointer
  const radius = 110;
  const intensity = useTransform(distance, [-radius, 0, radius], [0, 1, 0]);
  const color: MotionValue<string> = useTransform(intensity, (v) => {
    // v is 0..1 where 1 is center of imaginary circle
    if (isHovered && v > 0) {
      // Hover override: within imaginary circle, force to high-contrast
      return isDark ? "#ffffff" : "#000000";
    }
    if (activeRange && !isHovered) {
      // Active section base color (lighter accent)
      return rgbToStr(accentSoft);
    }
    return rgbToStr(neutralRGB);
  });

  // LABEL COLOR: mirror line color behavior (real-time)
  const textColor: MotionValue<string> = useTransform(intensity, (v) => {
    // Active label should always stay accent (blue/yellow) regardless of hover
    if (activeRange) return accentHex;
    // Non-active labels react like lines inside hover circle
    if (isHovered && v > 0) return isDark ? "#ffffff" : "#000000";
    return "#6b7280";
  });

  useEffect(() => {
    if (isHovered) {
      hoverWidth.set(30);
    } else if (activeRange) {
      hoverWidth.set(20);
    } else {
      hoverWidth.set(10);
    }
  }, [isHovered, activeRange, hoverWidth]);

  if (title && href) {
    return (
      <div className="cursor-pointer">
        <Link href={href} className="block" onClick={(e) => {
          e.preventDefault();
          const el = document.getElementById(href.slice(1));
          if (el) { el.scrollIntoView({ behavior: "smooth" }); }
        }}>
          <motion.div
            ref={ref}
            className="group relative transition-colors"
            style={{ width: hoverWidth, height: 2, backgroundColor: color, boxShadow: activeRange ? `0 0 4px rgba(${accentSoft.r},${accentSoft.g},${accentSoft.b},0.65)` : undefined }}
          >
            <motion.span
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: isHovered ? 1 : 0, x: isHovered ? 0 : -10 }}
              transition={{ duration: 0.3, ease: "easeOut" }}
              // LABEL COLOR (reacts in real time like lines)
              className={`absolute left-full top-0 z-10 w-full pl-4 pt-0.5 text-xs uppercase whitespace-nowrap lg:text-sm`}
              style={{ color: textColor }}
            >
              {title}
            </motion.span>
          </motion.div>
        </Link>
      </div>
    );
  }

  return (
    <motion.div
      ref={ref}
      className="relative"
      // BASE LINE STYLING
      style={{
        width,
        height: 2,
        backgroundColor: color,
        boxShadow: activeRange ? `0 0 3px rgba(${accentSoft.r},${accentSoft.g},${accentSoft.b},0.5)` : undefined,
      }}
    />
  );
}
