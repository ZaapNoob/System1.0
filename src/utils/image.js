import { IMAGE_BASE } from "../config/constants";

// Default avatar SVG as data URL
const DEFAULT_AVATAR_SVG = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'%3E%3Crect fill='%23e5e7eb' width='100' height='100'/%3E%3Ccircle cx='50' cy='35' r='15' fill='%239ca3af'/%3E%3Cpath d='M 20 80 Q 20 60 50 60 Q 80 60 80 80 Z' fill='%239ca3af'/%3E%3C/svg%3E";

// Returns full URL for a patient image
export const getImageUrl = (filename) => {
  if (!filename) return DEFAULT_AVATAR_SVG;
  
  // Build full URL dynamically using current protocol to handle HTTPS redirects
  const protocol = window.location.protocol; // 'https:' or 'http:'
  const hostname = window.location.hostname;
  return `${protocol}//${hostname}/upload/${filename}`;
};

// Export default avatar for direct use
export const DEFAULT_AVATAR = DEFAULT_AVATAR_SVG;
