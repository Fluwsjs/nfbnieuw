import { useState, useEffect } from 'react';
import Image, { ImageProps } from 'next/image';
import { cn } from '@/lib/utils';

interface OptimizedImageProps extends Omit<ImageProps, 'onLoad' | 'onError'> {
  fallbackSrc?: string;
  lowQualitySrc?: string;
  loadingIndicator?: React.ReactNode;
  blurhash?: string;
  aspectRatio?: string;
  containerClassName?: string;
  priority?: boolean;
}

/**
 * OptimizedImage Component
 * 
 * Enhanced Next.js Image component with:
 * - Lazy loading for off-screen images
 * - Loading animation with blur-up technique
 * - Optional fallback image
 * - Improved alt text for SEO
 * - Proper aspect ratio enforcement
 * - Priority loading for LCP images
 */
export function OptimizedImage({
  src,
  alt,
  fallbackSrc = '/images/nfblogo2.png',
  lowQualitySrc,
  width,
  height,
  priority = false,
  className,
  containerClassName,
  aspectRatio = 'aspect-[4/3]',
  loadingIndicator,
  ...props
}: OptimizedImageProps) {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(false);
  const [currentSrc, setCurrentSrc] = useState(lowQualitySrc || src);
  
  // Reset loading and error states when src changes
  useEffect(() => {
    setIsLoading(true);
    setError(false);
    setCurrentSrc(lowQualitySrc || src);
  }, [src, lowQualitySrc]);

  // Handle good load
  const handleLoad = () => {
    setIsLoading(false);
    if (currentSrc !== src && !error) {
      setCurrentSrc(src);
    }
  };

  // Handle error
  const handleError = () => {
    setError(true);
    setIsLoading(false);
    if (fallbackSrc) {
      setCurrentSrc(fallbackSrc);
    }
  };

  // Create a more descriptive alt tag for SEO if none is provided
  const enhancedAlt = alt || 
    (typeof src === 'string' ? 
      `NFB Salon Aerdt - ${src.split('/').pop()?.split('.')[0].replace(/-/g, ' ') || 'Afbeelding'}` 
      : 'NFB Salon Aerdt - Afbeelding');

  return (
    <div 
      className={cn(
        'relative overflow-hidden', 
        aspectRatio, 
        containerClassName,
        isLoading ? 'bg-gray-100 animate-pulse' : ''
      )}
    >
      <Image
        src={currentSrc}
        alt={enhancedAlt}
        width={width}
        height={height}
        className={cn(
          'transition-opacity duration-300',
          isLoading ? 'opacity-0' : 'opacity-100',
          className
        )}
        priority={priority}
        loading={priority ? 'eager' : 'lazy'}
        onLoadStart={() => setIsLoading(true)}
        onLoad={handleLoad}
        onError={handleError}
        sizes={props.sizes || "(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"}
        {...props}
      />
      
      {isLoading && loadingIndicator}
    </div>
  );
} 