import { HTMLAttributes } from "react";

interface OptimizedImageProps
  extends Omit<HTMLAttributes<HTMLImageElement>, "src"> {
  /**
   * The base filename without extension (e.g., "screenshot-photos" for "screenshot-photos.png")
   */
  src: string;
  alt: string;
  /**
   * Defines how the image should be sized relative to the viewport.
   * Examples:
   * - "(max-width: 768px) 100vw, 50vw" - full width on mobile, 50% on larger screens
   * - "1200px" - fixed width
   * - "(max-width: 640px) 100vw, (max-width: 1024px) 80vw, 1200px"
   *
   * This helps the browser pick the right image size from srcset.
   */
  sizes?: string;
  className?: string;
  loading?: "lazy" | "eager";
  /**
   * Relative path within /public/optimized/ (e.g., "" for root, "screenshots/" for subdirectory)
   */
  path?: string;
}

export const OptimizedImage = ({
  src,
  alt,
  sizes = "100vw",
  className,
  loading = "lazy",
  path = "",
  ...props
}: OptimizedImageProps) => {
  const DEFAULT_SIZES = [256, 384, 640, 750, 828, 1080, 1200, 1920, 2048, 3840];
  const basePath = path ? `/optimized/${path}` : "/optimized";

  // Generate srcset for WebP
  const webpSrcSet = DEFAULT_SIZES.map(
    (size) => `${basePath}/${src}-${size}.webp ${size}w`,
  ).join(", ");

  // Generate srcset for PNG fallback
  const pngSrcSet = DEFAULT_SIZES.map(
    (size) => `${basePath}/${src}-${size}.png ${size}w`,
  ).join(", ");

  return (
    <picture>
      {/* Modern browsers: WebP */}
      <source type="image/webp" srcSet={webpSrcSet} sizes={sizes} />

      {/* Fallback: PNG */}
      <source type="image/png" srcSet={pngSrcSet} sizes={sizes} />

      {/* Fallback img tag - uses largest PNG */}
      <img
        src={`${basePath}/${src}-${DEFAULT_SIZES[DEFAULT_SIZES.length - 1]}.png`}
        alt={alt}
        loading={loading}
        className={className}
        {...props}
      />
    </picture>
  );
};
