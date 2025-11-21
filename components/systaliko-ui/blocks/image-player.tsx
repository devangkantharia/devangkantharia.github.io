'use client';
import * as React from 'react';

import Image, { ImageProps } from 'next/image';

interface ImagePlayerProps
  extends Omit<ImageProps, 'src' | 'alt'>,
  Omit<
    React.ImgHTMLAttributes<HTMLImageElement>,
    'src' | 'alt' | 'width' | 'height'
  > {
  images: string[];
  interval?: number;
  loop?: boolean;
  onComplete?: () => void;
  renderImage?: (src: string, index: number) => React.ReactNode;

  renderLoading?: () => React.ReactNode;
  alt?: string;
}

export const ImagePlayer: React.FC<ImagePlayerProps> = ({
  images,
  interval = 500,
  loop = true,
  onComplete,
  renderImage,
  renderLoading,
  ...props
}) => {
  const [currentIndex, setCurrentIndex] = React.useState<number>(0);
  const [imagesLoaded, setImagesLoaded] = React.useState(false);
  const intervalRef = React.useRef<NodeJS.Timeout | null>(null);

  const currentImage = React.useMemo(
    () => images[currentIndex],
    [images, currentIndex],
  );

  React.useEffect(() => {
    const loadImage = (src: string): Promise<void> => {
      return new Promise((resolve) => {
        const img = document.createElement('img');
        img.src = src;
        img.onload = () => resolve();
      });
    };

    Promise.all(images.map(loadImage))
      .then(() => {
        setImagesLoaded(true);
      })
      .catch(() => {
        setImagesLoaded(true);
      });
  }, [images]);

  React.useEffect(() => {
    if (images.length <= 1 || !imagesLoaded) return;

    intervalRef.current = setInterval(() => {
      setCurrentIndex((prevIndex) => {
        const nextIndex = prevIndex + 1;

        if (nextIndex >= images.length) {
          if (loop) {
            return 0;
          } else {
            onComplete?.();
            return prevIndex;
          }
        }

        return nextIndex;
      });
    }, interval);

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [images.length, interval, loop, onComplete, imagesLoaded]);

  React.useEffect(() => {
    setCurrentIndex(0);
  }, [images]);

  if (!images || images.length === 0) {
    return <div className="text-destructive">No images !!</div>;
  }

  if (!imagesLoaded) {
    return renderLoading ? (
      renderLoading()
    ) : (
      <div className="w-full h-full rounded-xl bg-linear-to-r from-gray-200 to-gray-300 animate-pulse" />
    );
  }

  return (
    <>
      {renderImage ? (
        renderImage(currentImage, currentIndex)
      ) : (
        <Image
          src={currentImage}
          alt={props.alt || 'Slideshow image'}
          loading={props.loading ?? 'lazy'}
          fetchPriority={props.fetchPriority ?? 'low'}
          decoding={props.decoding ?? 'async'}
          priority={props.priority ?? false}
          {...props}
        />
      )}
    </>
  );
};
