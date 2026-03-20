"use client";

import { useState } from 'react';
import Image, { ImageProps } from 'next/image';

interface FallbackImageProps extends Omit<ImageProps, 'onError'> {
  fallbackSrc?: string;
}

/**
 * FallbackImage component that displays a fallback image when the main image fails to load
 * 
 * @example
 * <FallbackImage 
 *   src="/images/services/gezicht.jpg" 
 *   fallbackSrc="/images/nfblogo2.png"
 *   alt="Facial treatments" 
 *   width={800} 
 *   height={600} 
 * />
 */
export default function FallbackImage({ 
  src, 
  fallbackSrc = "/images/nfblogo2.png", 
  alt, 
  ...props 
}: FallbackImageProps) {
  const [imgSrc, setImgSrc] = useState(src);
  const [hasError, setHasError] = useState(false);

  return (
    <Image
      {...props}
      src={imgSrc}
      alt={alt}
      onError={() => {
        // Only set the fallback once to avoid infinite loops
        if (!hasError) {
          setImgSrc(fallbackSrc);
          setHasError(true);
        }
      }}
    />
  );
} 