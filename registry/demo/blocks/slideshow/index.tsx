'use client';

import React from 'react';

import Image from 'next/image';

import {
  Slideshow,
  SlideshowImageContainer,
  SlideshowImageWrap,
  SlideshowIndicator,
} from '@/registry/blocks/slideshow';

const slides = [
  {
    id: 'slide-1',
    title: 'AI / ML Projects design',
    imageUrl:
      './images/photo-1688733720228-4f7a18681c4f.jpg',
  },
  {
    id: 'slide-2',
    title: 'AR / VR / MR Projects',
    imageUrl:
      './images/photo-1654618977232-a6c6dea9d1e8.jpg',
  },
  {
    id: 'slide-3',
    title: 'Experience Centers',
    imageUrl:
      './images/photo-1624996752380-8ec242e0f85d.jpg',
  },
  {
    id: 'slide-4',
    title: 'Freelance Projects',
    imageUrl:
      './images/photo-1574717025058-2f8737d2e2b7.jpg',
  },
  {
    id: 'slide-5',
    title: 'Phygital Simulations',
    imageUrl:
      './images/photo-1726066012698-bb7a3abce786.jpg',
  },
  {
    id: 'slide-6',
    title: 'TouchScreen Solutions',
    imageUrl:
      './images/photo-1726066012698-bb7a3abce786.jpg',
  },
];

export function SlideshowDemo() {
  const imageUrls = React.useMemo(() => slides.map((s) => s.imageUrl), []);

  function usePreloadImages(urls: string[]) {
    const imagesRef = React.useRef<HTMLImageElement[]>([]);
    const [loaded, setLoaded] = React.useState(false);
    const [progress, setProgress] = React.useState(0);

    React.useEffect(() => {
      if (!urls || urls.length === 0) {
        setLoaded(true);
        return;
      }

      let mounted = true;
      let completed = 0;
      const created: HTMLImageElement[] = [];

      const settle = () => {
        completed += 1;
        if (!mounted) return;
        setProgress((completed / urls.length) * 100);
        if (completed >= urls.length) {
          imagesRef.current = created.filter(Boolean) as HTMLImageElement[];
          setLoaded(true);
        }
      };

      urls.forEach((url) => {
        try {
          const img = new window.Image();
          created.push(img);
          img.onload = () => settle();
          img.onerror = () => settle();
          img.src = url;
        } catch {
          settle();
        }
      });

      return () => {
        mounted = false;
        // cleanup event handlers
        created.forEach((i) => {
          i.onload = null;
          i.onerror = null;
        });
      };
    }, [urls]);

    return { loaded, progress, imagesRef } as const;
  }

  usePreloadImages(imageUrls);
  return (
    <Slideshow className="place-content-center p-6 md:px-12">
      <h3 className="mb-6 text-primary text-xs font-medium capitalize tracking-wide">
        / our services
      </h3>
      <div className="flex flex-wrap items-center justify-evenly gap-6 md:gap-12">
        <div className="flex  flex-col space-y-2 md:space-y-4   ">
          {slides.map((slide, index) => (
            <SlideshowIndicator
              key={slide.title}
              index={index}
              className="cursor-pointer text-4xl font-bold uppercase tracking-tighter"
            >
              {slide.title}
            </SlideshowIndicator>
          ))}
        </div>
        <SlideshowImageContainer>
          {slides.map((slide, index) => (
            <div key={slide.id} className="  ">
              <SlideshowImageWrap
                index={index}
                className="size-full max-h-96 object-cover"
              >
                <Image
                  src={slide.imageUrl}
                  alt={slide.title}
                  loading="eager"
                  className="size-full object-cover"
                  width={100}
                  height={100}
                />
              </SlideshowImageWrap>
            </div>
          ))}
        </SlideshowImageContainer>
      </div>
    </Slideshow>
  );
}
