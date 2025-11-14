'use client';

import * as React from 'react';

import { HTMLMotionProps, motion } from 'motion/react';

interface ContainerStaggerProps extends HTMLMotionProps<'div'> {
  staggerChildren?: number;
  delayChildren?: number;
  staggerDirection?: 1 | -1;
}

export const ContainerStagger = React.forwardRef<
  HTMLDivElement,
  ContainerStaggerProps
>(
  (
    {
      staggerChildren = 0.2,
      delayChildren = 0.2,
      staggerDirection = 1,
      className,
      transition,
      ...props
    },
    ref,
  ) => {
    return (
      <motion.div
        ref={ref}
        className={className}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        transition={{
          staggerChildren,
          delayChildren,
          staggerDirection,
          ...transition,
        }}
        {...props}
      />
    );
  },
);
ContainerStagger.displayName = 'ContainerStagger';
