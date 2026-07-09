/**
 * Valid Unsplash aspect ratios with auto-complete support
 */
export type UnsplashAspectRatio =
  | "1:1" // Square
  | "4:3" // Traditional photo
  | "3:2" // Classic photo
  | "16:9" // Widescreen
  | "3:4" // Portrait
  | "2:3"; // Portrait

/**
 * Responsive configuration for the Image component
 */
export interface ResponsiveConfig {
  aspectRatio: UnsplashAspectRatio;
  quality?: number;
  sizes: readonly number[] | number[];
}
