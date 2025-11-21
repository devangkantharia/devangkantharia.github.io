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
    <>
      <style>
        {`
          /* Section header border gradient - Light mode */
          .section-header-txtS {
            border-image: linear-gradient(to right, #19adfd73, transparent) 1;
            border-image-slice: 1;
          }

          /* Section header border gradient - Dark mode */
          .dark .section-header-txtS {
            border-image: linear-gradient(to right, #e8b92345, transparent) 1;
            border-image-slice: 1;
          }
        `}
      </style>
      <TextStaggerHover
        as={'h2'}
        className="tracking-wide font-normal leading-6 top-[5.6px] lg:leading-7 border-b-2 section-header-txtS"
      >
        <TextStaggerHoverActive
          className="opacity-50 dark:opacity-30"
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
    </>
  );
}
