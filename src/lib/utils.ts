import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

declare const __BUILD_TIMESTAMP__: string;

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// Cache-busting helper for assets in the public folder
export function getAssetUrl(path: string) {
  if (!path) return "";
  
  // Only apply to local assets (e.g., starts with /assets/ or assets/)
  if (path.startsWith("/assets/") || path.startsWith("assets/")) {
    const timestamp = typeof __BUILD_TIMESTAMP__ !== "undefined" ? __BUILD_TIMESTAMP__ : Date.now().toString();
    const separator = path.includes("?") ? "&" : "?";
    return `${path}${separator}v=${timestamp}`;
  }
  
  return path;
}

// Additional utility for consistent spacing
export function sectionId(id: string) {
  return `section-${id}`
}

// Format price consistently
export function formatPrice(price: number) {
  return `RM ${price.toFixed(2)}`
}
