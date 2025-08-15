import { useState, useEffect, useRef } from "react";
import { cn } from "@/lib/utils";

interface LazyImageProps {
  src: string;
  alt: string;
  className?: string;
  width?: number;
  height?: number;
  webpSrc?: string; // Optional WebP version for better compression
  blurDataURL?: string; // Optional blur placeholder
  priority?: boolean; // Skip lazy loading for above-the-fold images
}

export default function LazyImage({
  src,
  alt,
  className,
  width,
  height,
  webpSrc,
  blurDataURL,
  priority = false
}: LazyImageProps) {
  const [isLoaded, setIsLoaded] = useState(false);
  const [isInView, setIsInView] = useState(priority);
  const [hasError, setHasError] = useState(false);
  const imgRef = useRef<HTMLImageElement>(null);

  useEffect(() => {
    if (priority || isInView) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsInView(true);
          observer.disconnect();
        }
      },
      { 
        rootMargin: "50px", // Start loading 50px before entering viewport
        threshold: 0.1 
      }
    );

    if (imgRef.current) {
      observer.observe(imgRef.current);
    }

    return () => observer.disconnect();
  }, [priority, isInView]);

  const handleLoad = () => {
    setIsLoaded(true);
  };

  const handleError = () => {
    setHasError(true);
    setIsLoaded(true); // Show broken image or fallback
  };

  // Determine which source to use
  const imageSrc = isInView ? (webpSrc || src) : (blurDataURL || '');
  const fallbackSrc = isInView ? src : '';

  return (
    <div className={cn("overflow-hidden", className)} ref={imgRef}>
      {/* WebP support with fallback */}
      {isInView && (
        <picture>
          {webpSrc && (
            <source srcSet={webpSrc} type="image/webp" />
          )}
          <img
            src={imageSrc || fallbackSrc}
            alt={alt}
            width={width}
            height={height}
            loading={priority ? "eager" : "lazy"}
            decoding="async"
            onLoad={handleLoad}
            onError={handleError}
            className={cn(
              "transition-opacity duration-300",
              {
                "opacity-0": !isLoaded && !blurDataURL,
                "opacity-100": isLoaded,
                "blur-sm": !isLoaded && blurDataURL,
                "blur-none": isLoaded
              }
            )}
            style={{
              aspectRatio: width && height ? `${width} / ${height}` : undefined
            }}
          />
        </picture>
      )}
      
      {/* Placeholder for not-in-view images */}
      {!isInView && (
        <div 
          className={cn(
            "bg-gray-200 animate-pulse",
            width && height ? "" : "aspect-video"
          )}
          style={{
            width: width ? `${width}px` : "100%",
            height: height ? `${height}px` : "auto",
            aspectRatio: width && height ? `${width} / ${height}` : undefined
          }}
        />
      )}
    </div>
  );
}
