'use client';

import * as React from 'react';

import {
  TextStaggerHover,
  TextStaggerHoverActive,
  TextStaggerHoverHidden,
} from '@/registry/text/text-stagger-hover';

interface TextStaggerProps {
  children: React.ReactNode;
}

export function TextStagger({ children }: TextStaggerProps) {
  return (
    <TextStaggerHover
      as={'h2'}
      className="tracking-wide font-normal leading-6 top-[5.6px] lg:leading-7"
    >
      <TextStaggerHoverActive
        className="opacity-40 dark:opacity-30"
        animation={'top'}
        // animate={isActive ? 'hidden' : 'visible'}
        transition={{ duration: 0.3, ease: 'easeOut' }}
      >
        {String(children)}
      </TextStaggerHoverActive>
      <TextStaggerHoverHidden
        animation={'bottom'}
        // animate={isActive ? 'visible' : 'hidden'}
        transition={{ duration: 0.3, ease: 'easeOut' }}
      >
        {String(children)}
      </TextStaggerHoverHidden>
    </TextStaggerHover>
  );
}
