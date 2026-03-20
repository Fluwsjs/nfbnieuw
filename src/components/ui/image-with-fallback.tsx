"use client";

import { useState, useEffect } from "react";
import Image, { ImageProps } from "next/image";

type ImageWithFallbackProps = ImageProps & {
  fallbackSrc: string;
};

export function ImageWithFallback({
  src,
  fallbackSrc,
  alt,
  ...rest
}: ImageWithFallbackProps) {
  const [imgSrc, setImgSrc] = useState<string>(src as string);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setImgSrc(src as string);
  }, [src]);

  return (
    <Image
      {...rest}
      src={imgSrc}
      alt={alt}
      onLoadingComplete={() => setIsLoading(false)}
      onError={() => {
        setImgSrc(fallbackSrc);
      }}
      className={`${rest.className || ""} ${isLoading ? "animate-pulse bg-primary/10" : ""}`}
    />
  );
} 