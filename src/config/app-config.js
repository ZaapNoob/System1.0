/**
 * CENTRAL APPLICATION CONFIGURATION
 * This is the SINGLE SOURCE OF TRUTH for the server IP address
 * 
 * WHEN YOU CHANGE WIFI:
 * 1. Edit .env file
 * 2. Change VITE_SERVER_HOST=YOUR_NEW_IP
 * 3. Restart Vite dev server (npm run dev)
 * 4. All files automatically use the new IP
 * 
 * Files that use this config:
 * - vite.config.js (development server)
 * - src/config/constants.js (IMAGE_BASE URL)
 * - Any component that imports SERVER_HOST
 */

// Get server host from Vite environment variable (set from .env at build time)
export const SERVER_HOST = import.meta.env.VITE_SERVER_HOST || window?.location?.hostname || 'localhost';

console.log('🖥️ Configuration - Server Host:', SERVER_HOST);

export default {
  SERVER_HOST,
};
