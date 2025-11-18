"use client";

import React, { useRef, useEffect, useState, useCallback } from 'react';

import { Happy_Monkey } from 'next/font/google';

import { gsap } from 'gsap';
import { motion } from 'motion/react';

import { ANIMATION_VARIANTS } from '@/registry/utils/animation-variants';

const happy_monkey = Happy_Monkey({
  subsets: ['latin'],
  variable: '--font-happy_monkey',
  weight: ['400'],
});

// Note: The helper functions below are for reference if you need runtime CSS color resolution
// Currently using HEX colors that approximate the theme colors from globals.css

// Theme Configuration - Customize colors here
// EXAMPLES:
// Option 1: Use HEX colors directly
//   glowColor: '#19adfd'
// 
// Option 2: Use CSS custom properties from globals.css (recommended)
//   In light mode, use colors from :root in globals.css:
//   - 'var(--foreground)' = oklch(0.25 0.02 296.57) - dark text
//   - 'var(--primary)' = oklch(0.92 0.04 86.47) - yellow/cream
//   - 'var(--accent)' = oklch(0.97 0 0) - light gray
//
//   In dark mode, use colors from .dark in globals.css:
//   - 'var(--foreground)' = oklch(0.91 0.18 98.11) - light yellow text  
//   - 'var(--primary)' = oklch(0.922 0 0) - white
//   - 'var(--accent)' = oklch(0.269 0 0) - dark gray
//
// The component will automatically adapt to light/dark theme switches
const THEME_COLORS = {
  light: {
    glowColor: '#19adfd',             // HEX: Direct blue color
    borderColor: '#19adfd',           // HEX: Direct blue color
    accentLineColor: '#19adfd',       // HEX: Direct blue color
  },
  dark: {
    glowColor: '#e8b923',             // HEX: Yellow color for dark mode
    borderColor: '#e8b923',           // HEX: Yellow color for dark mode 
    accentLineColor: '#e8b923',       // HEX: Yellow color for dark mode
  },
  border: {
    enabled: false,                   // Set to true to enable card borders
    thickness: '1px',                 // Border thickness (e.g., '1px', '2px', '0px')
  },
  shadow: {
    opacity: 0.3,                     // Shadow opacity for light mode (0-1)
    opacityDark: 0.4,                 // Shadow opacity for dark mode (0-1)
  }
};

const DEFAULT_PARTICLE_COUNT = 8;
const DEFAULT_SPOTLIGHT_RADIUS = 300;
const DEFAULT_GLOW_COLOR_LIGHT = THEME_COLORS.light.glowColor;  // Use light theme color
const DEFAULT_GLOW_COLOR_DARK = THEME_COLORS.dark.glowColor;    // Use dark theme color
const MOBILE_BREAKPOINT = 768;

interface ToolCardProps {
  title: string;
  content: string;
  category: 'development' | 'design' | 'hardware';
}

const toolsData: ToolCardProps[] = [
  {
    title: 'AI Tools',
    content: 'n8n, ComfyUI, Stable Diffusion, VScode',
    category: 'development'
  },
  {
    title: 'Web Development',
    content: 'React.js, Next.js, React-Three-Fiber, Three.js, HTML, CSS, SCSS',
    category: 'development'
  },
  {
    title: 'Programming Languages',
    content: 'JavaScript, TypeScript, C#, Python',
    category: 'development'
  },
  {
    title: 'Team / Project Management',
    content: 'Jira, Confluence, GitHub',
    category: 'development'
  },
  {
    title: 'Creative Tools',
    content: 'TouchDesigner, MadMapper',
    category: 'development'
  },
  {
    title: 'Game / App Programming',
    content: 'Unity, Three.js, WebXR, OpenXR',
    category: 'development'
  },
  {
    title: 'UI / Wireframing / Prototyping',
    content: 'Figma, Adobe XD',
    category: 'design'
  },
  {
    title: '3D Designing',
    content: 'Blender, SketchUp',
    category: 'design'
  },
  {
    title: '2D Designing',
    content: 'Photoshop, Illustrator, After Effects',
    category: 'design'
  },
  {
    title: 'Electronics / Physical Computing',
    content: 'Arduino, Raspberry Pi, NodeMCU',
    category: 'hardware'
  },
  {
    title: 'Hardware',
    content: 'Kinect, Leap Motion, Intel RealSense, HTC Vive, Oculus Quest 2, Looking Glass, DMXcontroller',
    category: 'hardware'
  }
];

const hexToRgb = (hex: string): string => {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result ? `${parseInt(result[1], 16)}, ${parseInt(result[2], 16)}, ${parseInt(result[3], 16)}` : '132, 0, 255';
};

const createParticleElement = (x: number, y: number): HTMLDivElement => {
  const el = document.createElement('div');
  el.className = 'particle';
  el.style.cssText = `
    position: absolute;
    width: 4px;
    height: 4px;
    border-radius: 50%;
    pointer-events: none;
    z-index: 100;
    left: ${x}px;
    top: ${y}px;
  `;
  return el;
};

const calculateSpotlightValues = (radius: number) => ({
  proximity: radius * 0.5,
  fadeDistance: radius * 0.75
});

const updateCardGlowProperties = (card: HTMLElement, mouseX: number, mouseY: number, glow: number, radius: number) => {
  const rect = card.getBoundingClientRect();
  const relativeX = ((mouseX - rect.left) / rect.width) * 100;
  const relativeY = ((mouseY - rect.top) / rect.height) * 100;

  card.style.setProperty('--glow-x', `${relativeX}%`);
  card.style.setProperty('--glow-y', `${relativeY}%`);
  card.style.setProperty('--glow-intensity', glow.toString());
  card.style.setProperty('--glow-radius', `${radius}px`);
};

const ToolCard: React.FC<{
  title: string;
  content: string;
  particleCount?: number;
  enableTilt?: boolean;
  enableMagnetism?: boolean;
  clickEffect?: boolean;
  disableAnimations?: boolean;
}> = ({
  title,
  content,
  particleCount = DEFAULT_PARTICLE_COUNT,
  enableTilt = true,
  enableMagnetism = true,
  clickEffect = true,
  disableAnimations = false
}) => {
    const cardRef = useRef<HTMLDivElement>(null);
    const particlesRef = useRef<HTMLDivElement[]>([]);
    const timeoutsRef = useRef<NodeJS.Timeout[]>([]);
    const isHoveredRef = useRef(false);
    const memoizedParticles = useRef<HTMLDivElement[]>([]);
    const particlesInitialized = useRef(false);
    const magnetismAnimationRef = useRef<gsap.core.Tween | null>(null);
    const animationVariants = ANIMATION_VARIANTS.blur;

    const initializeParticles = useCallback(() => {
      if (particlesInitialized.current || !cardRef.current) return;

      const { width, height } = cardRef.current.getBoundingClientRect();
      memoizedParticles.current = Array.from({ length: particleCount }, () =>
        createParticleElement(Math.random() * width, Math.random() * height)
      );
      particlesInitialized.current = true;
    }, [particleCount]);

    const clearAllParticles = useCallback(() => {
      timeoutsRef.current.forEach(clearTimeout);
      timeoutsRef.current = [];
      magnetismAnimationRef.current?.kill();

      particlesRef.current.forEach(particle => {
        gsap.to(particle, {
          scale: 0,
          opacity: 0,
          duration: 0.2,
          ease: 'power2.in',
          onComplete: () => {
            particle.parentNode?.removeChild(particle);
          }
        });
      });
      particlesRef.current = [];
    }, []); const animateParticles = useCallback(() => {
      if (!cardRef.current || !isHoveredRef.current) return;

      if (!particlesInitialized.current) {
        initializeParticles();
      }

      memoizedParticles.current.forEach((particle, index) => {
        const timeoutId = setTimeout(() => {
          if (!isHoveredRef.current || !cardRef.current) return;

          const clone = particle.cloneNode(true) as HTMLDivElement;
          cardRef.current.appendChild(clone);
          particlesRef.current.push(clone);

          gsap.fromTo(clone, { scale: 0, opacity: 0 }, { scale: 1, opacity: 1, duration: 0.3, ease: 'back.out(1.7)' });

          gsap.to(clone, {
            x: (Math.random() - 0.5) * 100,
            y: (Math.random() - 0.5) * 100,
            rotation: Math.random() * 360,
            duration: 2 + Math.random() * 2,
            ease: 'none',
            repeat: -1,
            yoyo: true
          });

          gsap.to(clone, {
            opacity: 0.3,
            duration: 1.5,
            ease: 'power2.inOut',
            repeat: -1,
            yoyo: true
          });
        }, index * 100);

        timeoutsRef.current.push(timeoutId);
      });
    }, [initializeParticles]);

    useEffect(() => {
      if (disableAnimations || !cardRef.current) return;

      const element = cardRef.current;

      const handleMouseEnter = () => {
        isHoveredRef.current = true;
        animateParticles();
      };

      const handleMouseLeave = () => {
        isHoveredRef.current = false;
        clearAllParticles();

        if (enableTilt) {
          element.style.transition = 'transform 0.3s ease-out';
          element.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg)';
          setTimeout(() => {
            element.style.transition = '';
          }, 300);
        }

        if (enableMagnetism) {
          gsap.to(element, {
            x: 0,
            y: 0,
            duration: 0.3,
            ease: 'power2.out'
          });
        }
      };

      const handleMouseMove = (e: MouseEvent) => {
        if (!enableTilt && !enableMagnetism) return;

        const rect = element.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;

        if (enableTilt) {
          const rotateX = ((y - centerY) / centerY) * -10;
          const rotateY = ((x - centerX) / centerX) * 10;

          // Use direct CSS transform for instant response
          element.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
        }

        if (enableMagnetism) {
          const magnetX = (x - centerX) * 0.05;
          const magnetY = (y - centerY) * 0.05;

          magnetismAnimationRef.current = gsap.to(element, {
            x: magnetX,
            y: magnetY,
            duration: 0.3,
            ease: 'power2.out'
          });
        }
      };

      const handleClick = (e: MouseEvent) => {
        if (!clickEffect) return;

        const rect = element.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        const maxDistance = Math.max(
          Math.hypot(x, y),
          Math.hypot(x - rect.width, y),
          Math.hypot(x, y - rect.height),
          Math.hypot(x - rect.width, y - rect.height)
        );

        const ripple = document.createElement('div');
        ripple.className = 'click-ripple';
        ripple.style.cssText = `
          position: absolute;
          width: ${maxDistance * 2}px;
          height: ${maxDistance * 2}px;
          border-radius: 50%;
          left: ${x - maxDistance}px;
          top: ${y - maxDistance}px;
          pointer-events: none;
          z-index: 1000;
        `;

        element.appendChild(ripple);

        gsap.fromTo(
          ripple,
          {
            scale: 0,
            opacity: 1
          },
          {
            scale: 1,
            opacity: 0,
            duration: 0.8,
            ease: 'power2.out',
            onComplete: () => ripple.remove()
          }
        );
      };

      element.addEventListener('mouseenter', handleMouseEnter);
      element.addEventListener('mouseleave', handleMouseLeave);
      element.addEventListener('mousemove', handleMouseMove);
      element.addEventListener('click', handleClick);

      return () => {
        isHoveredRef.current = false;
        element.removeEventListener('mouseenter', handleMouseEnter);
        element.removeEventListener('mouseleave', handleMouseLeave);
        element.removeEventListener('mousemove', handleMouseMove);
        element.removeEventListener('click', handleClick);
        clearAllParticles();
      };
    }, [animateParticles, clearAllParticles, disableAnimations, enableTilt, enableMagnetism, clickEffect]);

    return (
      <motion.div
        ref={cardRef}
        variants={animationVariants}
        className="tool-card group relative overflow-hidden p-6 rounded-2xl  border-solid transition-all duration-300 ease-in-out hover:-translate-y-1 hover:shadow-lg"
        style={{
          // borderColor: 'var(--border-color)',
          // backgroundColor: 'var(--background-dark)',
          '--glow-x': '50%',
          '--glow-y': '50%',
          '--glow-intensity': '0',
          '--glow-radius': '200px'
        } as React.CSSProperties}
      >
        <div className="relative">
          <div
            className="dark:hidden absolute left-0 top-1/3 -translate-y-1/2 bottom-auto w-0.5 h-3/6 opacity-100 group-hover:opacity-0 transition-opacity duration-500 ease-in-out -ml-6"
            style={{
              background: `linear-gradient(to bottom, ${THEME_COLORS.light.accentLineColor}cc, ${THEME_COLORS.light.accentLineColor}66, transparent)`
            }}
          />
          <div
            className="hidden dark:block absolute left-0 top-1/3 -translate-y-1/2 bottom-auto w-0.5 h-3/6 opacity-100 group-hover:opacity-0 transition-opacity duration-500 ease-in-out -ml-6"
            style={{
              background: `linear-gradient(to bottom, ${THEME_COLORS.dark.accentLineColor}cc, ${THEME_COLORS.dark.accentLineColor}66, transparent)`
            }}
          />
          <h4 className="font-semibold text-lg mb-2 ">{title}:</h4>
          <p className="text-base ">{content}</p>
        </div>
      </motion.div>
    );
  };

const GlobalSpotlight: React.FC<{
  containerRef: React.RefObject<HTMLDivElement | null>;
  disableAnimations?: boolean;
  enabled?: boolean;
  spotlightRadius?: number;
}> = ({
  containerRef,
  disableAnimations = false,
  enabled = true,
  spotlightRadius = DEFAULT_SPOTLIGHT_RADIUS
}) => {
    const spotlightRef = useRef<HTMLDivElement | null>(null);
    const isInsideSection = useRef(false);

    useEffect(() => {
      if (disableAnimations || !containerRef?.current || !enabled) return;

      const spotlight = document.createElement('div');
      spotlight.className = 'global-spotlight';
      spotlight.style.cssText = `
        position: fixed;
        width: 800px;
        height: 800px;
        border-radius: 50%;
        pointer-events: none;
        z-index: 200;
        opacity: 0;
        transform: translate(-50%, -50%);
        mix-blend-mode: screen;
      `;
      document.body.appendChild(spotlight);
      spotlightRef.current = spotlight;

      const handleMouseMove = (e: MouseEvent) => {
        if (!spotlightRef.current || !containerRef.current) return;

        const rect = containerRef.current.getBoundingClientRect();
        const mouseInside =
          e.clientX >= rect.left && e.clientX <= rect.right && e.clientY >= rect.top && e.clientY <= rect.bottom;

        isInsideSection.current = mouseInside;
        const cards = containerRef.current.querySelectorAll('.tool-card');

        if (!mouseInside) {
          gsap.to(spotlightRef.current, {
            opacity: 0,
            duration: 0.3,
            ease: 'power2.out'
          });
          cards.forEach(card => {
            (card as HTMLElement).style.setProperty('--glow-intensity', '0');
          });
          return;
        }

        const { proximity, fadeDistance } = calculateSpotlightValues(spotlightRadius);
        let minDistance = Infinity;

        cards.forEach(card => {
          const cardElement = card as HTMLElement;
          const cardRect = cardElement.getBoundingClientRect();
          const centerX = cardRect.left + cardRect.width / 2;
          const centerY = cardRect.top + cardRect.height / 2;
          const distance =
            Math.hypot(e.clientX - centerX, e.clientY - centerY) - Math.max(cardRect.width, cardRect.height) / 2;
          const effectiveDistance = Math.max(0, distance);

          minDistance = Math.min(minDistance, effectiveDistance);

          let glowIntensity = 0;
          if (effectiveDistance <= proximity) {
            glowIntensity = 1;
          } else if (effectiveDistance <= fadeDistance) {
            glowIntensity = (fadeDistance - effectiveDistance) / (fadeDistance - proximity);
          }

          updateCardGlowProperties(cardElement, e.clientX, e.clientY, glowIntensity, spotlightRadius);
        });

        gsap.to(spotlightRef.current, {
          left: e.clientX,
          top: e.clientY,
          duration: 0.1,
          ease: 'power2.out'
        });

        const targetOpacity =
          minDistance <= proximity
            ? 0.8
            : minDistance <= fadeDistance
              ? ((fadeDistance - minDistance) / (fadeDistance - proximity)) * 0.8
              : 0;

        gsap.to(spotlightRef.current, {
          opacity: targetOpacity,
          duration: targetOpacity > 0 ? 0.2 : 0.5,
          ease: 'power2.out'
        });
      };

      const handleMouseLeave = () => {
        isInsideSection.current = false;
        containerRef.current?.querySelectorAll('.tool-card').forEach(card => {
          (card as HTMLElement).style.setProperty('--glow-intensity', '0');
        });
        if (spotlightRef.current) {
          gsap.to(spotlightRef.current, {
            opacity: 0,
            duration: 0.3,
            ease: 'power2.out'
          });
        }
      };

      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseleave', handleMouseLeave);

      return () => {
        document.removeEventListener('mousemove', handleMouseMove);
        document.removeEventListener('mouseleave', handleMouseLeave);
        spotlightRef.current?.parentNode?.removeChild(spotlightRef.current);
      };
    }, [containerRef, disableAnimations, enabled, spotlightRadius]);

    return null;
  };

const useMobileDetection = () => {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth <= MOBILE_BREAKPOINT);

    checkMobile();
    window.addEventListener('resize', checkMobile);

    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  return isMobile;
};

interface MyTools2Props {
  enableSpotlight?: boolean;
  enableBorderGlow?: boolean;
  disableAnimations?: boolean;
  spotlightRadius?: number;
  particleCount?: number;
  enableTilt?: boolean;
  clickEffect?: boolean;
  enableMagnetism?: boolean;
}

export default function MyTools2({
  enableSpotlight = true,
  enableBorderGlow = true,
  disableAnimations = false,
  spotlightRadius = DEFAULT_SPOTLIGHT_RADIUS,
  particleCount = DEFAULT_PARTICLE_COUNT,
  enableTilt = true,
  clickEffect = true,
  enableMagnetism = true
}: MyTools2Props = {}) {
  const containerRef = useRef<HTMLDivElement>(null);
  const isMobile = useMobileDetection();
  const shouldDisableAnimations = disableAnimations || isMobile;

  const developmentTools = toolsData.filter(tool => tool.category === 'development');
  const designTools = toolsData.filter(tool => tool.category === 'design');
  const hardwareTools = toolsData.filter(tool => tool.category === 'hardware');

  // Get RGB values for both themes
  const lightGlowRgb = hexToRgb(DEFAULT_GLOW_COLOR_LIGHT);
  const darkGlowRgb = hexToRgb(DEFAULT_GLOW_COLOR_DARK);

  // Calculate shadows for both themes
  const hexToRgbaForShadow = (hex: string, opacity: number): string => {
    const rgb = hexToRgb(hex);
    return `rgba(${rgb}, ${opacity})`;
  };
  const lightShadow = `0 4px 20px ${hexToRgbaForShadow(DEFAULT_GLOW_COLOR_LIGHT, THEME_COLORS.shadow.opacity)}`;
  const darkShadow = `0 4px 20px ${hexToRgbaForShadow(DEFAULT_GLOW_COLOR_DARK, THEME_COLORS.shadow.opacityDark)}`;

  return (
    <>
      <style>
        {`
          .tools-container {
            --glow-x: 50%;
            --glow-y: 50%;
            --glow-intensity: 0;
            --glow-radius: 200px;
            --glow-color-light: ${lightGlowRgb};
            --glow-color-dark: ${darkGlowRgb};
            --border-color-light: ${THEME_COLORS.light.borderColor};
            --border-color-dark: ${THEME_COLORS.dark.borderColor};
            --accent-line-color-light: ${THEME_COLORS.light.accentLineColor};
            --accent-line-color-dark: ${THEME_COLORS.dark.accentLineColor};
            --hover-shadow-light: ${lightShadow};
            --hover-shadow-dark: ${darkShadow};
            --background-dark: #060010;
            --white: hsl(0, 0%, 100%);
          }

          ${THEME_COLORS.border.enabled ? `
          .tool-card {
            border: ${THEME_COLORS.border.thickness} solid ${THEME_COLORS.light.borderColor};
          }

          @media (prefers-color-scheme: dark) {
            .tool-card {
              border: ${THEME_COLORS.border.thickness} solid ${THEME_COLORS.dark.borderColor};
            }
          }

          .dark .tool-card {
            border: ${THEME_COLORS.border.thickness} solid ${THEME_COLORS.dark.borderColor};
          }` : ''}

          ${enableBorderGlow ? `
          /* Light mode border glow */
          .tool-card::after {
            content: '';
            position: absolute;
            inset: 0;
            padding: 2px;
            background: radial-gradient(var(--glow-radius) circle at var(--glow-x) var(--glow-y),
                rgba(var(--glow-color-light), calc(var(--glow-intensity) * 0.8)) 0%,
                rgba(var(--glow-color-light), calc(var(--glow-intensity) * 0.4)) 30%,
                transparent 60%);
            border-radius: inherit;
            mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
            mask-composite: subtract;
            -webkit-mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
            -webkit-mask-composite: xor;
            pointer-events: none;
            transition: opacity 0.3s ease;
            z-index: 1;
          }

          /* Dark mode border glow */
          .dark .tool-card::after {
            background: radial-gradient(var(--glow-radius) circle at var(--glow-x) var(--glow-y),
                rgba(var(--glow-color-dark), calc(var(--glow-intensity) * 0.8)) 0%,
                rgba(var(--glow-color-dark), calc(var(--glow-intensity) * 0.4)) 30%,
                transparent 60%);
          }

          .tool-card:hover::after {
            opacity: 1;
          }

          .tool-card:hover {
            box-shadow: var(--hover-shadow-light);
          }

          .dark .tool-card:hover {
            box-shadow: var(--hover-shadow-dark);
          }` : ''}

          /* Light mode particles */
          .particle {
            background: #19adfd;
            box-shadow: 0 0 6px rgba(25, 173, 253, 0.6);
          }

          .particle::before {
            content: '';
            position: absolute;
            top: -2px;
            left: -2px;
            right: -2px;
            bottom: -2px;
            background: rgba(25, 173, 253, 0.2);
            border-radius: 50%;
            z-index: -1;
          }

          /* Dark mode particles */
          .dark .particle {
            background: #e8b923;
            box-shadow: 0 0 6px rgba(232, 185, 35, 0.6);
          }

          .dark .particle::before {
            background: rgba(232, 185, 35, 0.2);
          }

          /* Light mode spotlight */
          .global-spotlight {
            display: none !important;
          }

          /* Dark mode spotlight */
          .dark .global-spotlight {
            display: none !important;
          }

          /* Light mode click ripple */
          .click-ripple {
            background: radial-gradient(circle, rgba(25, 173, 253, 0.4) 0%, rgba(25, 173, 253, 0.2) 30%, transparent 70%);
          }

          /* Dark mode click ripple */
          .dark .click-ripple {
            background: radial-gradient(circle, rgba(232, 185, 35, 0.4) 0%, rgba(232, 185, 35, 0.2) 30%, transparent 70%);
          }

          /* Section header border gradient - Light mode */
          .section-header {
            border-image: linear-gradient(to right, #19adfd, transparent) 1;
            border-image-slice: 1;
          }

          /* Section header border gradient - Dark mode */
          .dark .section-header {
            border-image: linear-gradient(to right, #e8b923, transparent) 1;
            border-image-slice: 1;
          }
        `}
      </style>

      {enableSpotlight && (
        <GlobalSpotlight
          containerRef={containerRef}
          disableAnimations={shouldDisableAnimations}
          enabled={enableSpotlight}
          spotlightRadius={spotlightRadius}
        />
      )}

      <div ref={containerRef} className="tools-container grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12 lg:gap-16 dark:text-gray-300 max-w-7xl mx-auto">
        <div className="leftCol">
          <motion.h3
            className={`${happy_monkey.className} antialiased text-2xl mb-6 inline-block border-b-2 section-header`}
            variants={ANIMATION_VARIANTS.blur}
          >
            Development:
          </motion.h3>
          <div className="space-y-4">
            {developmentTools.map((tool, index) => (
              <ToolCard
                key={index}
                title={tool.title}
                content={tool.content}
                particleCount={particleCount}
                enableTilt={enableTilt}
                enableMagnetism={enableMagnetism}
                clickEffect={clickEffect}
                disableAnimations={shouldDisableAnimations}
              />
            ))}
          </div>
        </div>

        <div className="rightCol">
          <motion.h3
            className={`${happy_monkey.className} antialiased text-2xl mb-6 inline-block border-b-2 section-header`}
            variants={ANIMATION_VARIANTS.blur}
          >
            Design:
          </motion.h3>
          <div className="space-y-4 mb-12">
            {designTools.map((tool, index) => (
              <ToolCard
                key={index}
                title={tool.title}
                content={tool.content}
                particleCount={particleCount}
                enableTilt={enableTilt}
                enableMagnetism={enableMagnetism}
                clickEffect={clickEffect}
                disableAnimations={shouldDisableAnimations}
              />
            ))}
          </div>

          <motion.h3
            className={`${happy_monkey.className} antialiased text-2xl mb-6 mt-8 inline-block border-b-2 section-header`}
            variants={ANIMATION_VARIANTS.blur}
          >
            Hardware and Electronics:
          </motion.h3>
          <div className="space-y-4">
            {hardwareTools.map((tool, index) => (
              <ToolCard
                key={index}
                title={tool.title}
                content={tool.content}
                particleCount={particleCount}
                enableTilt={enableTilt}
                enableMagnetism={enableMagnetism}
                clickEffect={clickEffect}
                disableAnimations={shouldDisableAnimations}
              />
            ))}
          </div>
        </div>
      </div>
    </>
  );
}
