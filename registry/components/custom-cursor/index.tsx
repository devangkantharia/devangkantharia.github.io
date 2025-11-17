'use client';
import * as React from 'react';

import {
  AnimatePresence,
  HTMLMotionProps,
  motion,
  MotionStyle,
  MotionValue,
} from 'motion/react';

import { cn } from '@/lib/utils';
import { useFollowMouse } from '@/registry/utils/use-follow-mouse';

const springConfig = {
  damping: 25,
  stiffness: 250,
  mass: 1,
  restSpeed: 0.01,
  restDelta: 0.01,
  duration: 0.3,
};

interface CustomCursorContextType {
  cursorRef: React.RefObject<HTMLDivElement | null>;
  containerRef: React.RefObject<HTMLDivElement | null>;
  cursorXSpring: MotionValue<number>;
  cursorYSpring: MotionValue<number>;
  cursorStyle?: MotionStyle;
  setCursorStyle: React.Dispatch<React.SetStateAction<MotionStyle | undefined>>;
  cursorChildren?: React.ReactNode;
  setCursorChildren: React.Dispatch<React.SetStateAction<React.ReactNode>>;
}

const CustomCursorContext = React.createContext<CustomCursorContextType | null>(
  null,
);

const Provider = ({
  children,
}: {
  children:
  | React.ReactNode
  | ((context: CustomCursorContextType) => React.ReactNode);
}) => {
  const { cursorRef, containerRef, cursorXSpring, cursorYSpring } =
    useFollowMouse({
      springConfig,
    });
  const [cursorStyle, setCursorStyle] = React.useState<MotionStyle>();
  const [cursorChildren, setCursorChildren] = React.useState<React.ReactNode>();
  const value = {
    cursorRef,
    containerRef,
    cursorXSpring,
    cursorYSpring,
    cursorStyle,
    setCursorStyle,
    cursorChildren,
    setCursorChildren,
  };
  return (
    <CustomCursorContext.Provider value={value}>
      {typeof children === 'function' ? children(value) : children}
    </CustomCursorContext.Provider>
  );
};

export const useCustomCursor = () => {
  const context = React.useContext(CustomCursorContext);
  if (!context) {
    throw new Error(
      'useCustomCursor must be used within a CustomCursorProvider',
    );
  }
  return context;
};

export function CustomCursor({
  className,
  style,
  ...props
}: HTMLMotionProps<'div'>) {
  const {
    cursorRef,
    cursorXSpring,
    cursorYSpring,
    cursorChildren,
    cursorStyle,
  } = useCustomCursor();
  const [isVisible, setIsVisible] = React.useState(false);
  const lastMousePos = React.useRef({ x: 0, y: 0 });

  React.useEffect(() => {
    const container = cursorRef.current?.parentElement;
    if (!container) return;

    const checkMouseInBounds = (clientX: number, clientY: number) => {
      const rect = container.getBoundingClientRect();
      const isInside =
        clientX >= rect.left &&
        clientX <= rect.right &&
        clientY >= rect.top &&
        clientY <= rect.bottom;

      setIsVisible(isInside);
    };

    const handleMouseMove = (e: MouseEvent) => {
      lastMousePos.current = { x: e.clientX, y: e.clientY };
      checkMouseInBounds(e.clientX, e.clientY);
    };

    const handleScroll = () => {
      checkMouseInBounds(lastMousePos.current.x, lastMousePos.current.y);
    };

    const handleMouseEnter = () => setIsVisible(true);
    const handleMouseLeave = () => setIsVisible(false);

    container.addEventListener('mouseenter', handleMouseEnter);
    container.addEventListener('mouseleave', handleMouseLeave);
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('scroll', handleScroll, true);

    return () => {
      container.removeEventListener('mouseenter', handleMouseEnter);
      container.removeEventListener('mouseleave', handleMouseLeave);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('scroll', handleScroll, true);
    };
  }, [cursorRef]);

  return (
    <motion.div
      className={cn(
        'absolute pointer-events-none left-0 top-0 flex items-center justify-center',
        className,
      )}
      ref={cursorRef}
      layout
      style={{
        y: cursorYSpring,
        x: cursorXSpring,
        opacity: isVisible ? 1 : 0,
        zIndex: 9999,
        ...style,
        ...cursorStyle,
      }}
      exit={{ transition: { duration: 0.3 } }}
      {...props}
    >
      <AnimatePresence mode="sync">
        {cursorChildren && (
          <motion.div
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0 }}
            className="flex items-center justify-center"
          >
            {cursorChildren}
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
CustomCursor.Provider = Provider;
