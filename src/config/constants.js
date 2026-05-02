import { SERVER_HOST } from './app-config';

// Image base URL to access patient photos from upload folder
// Reads from app-config.js which gets VITE_SERVER_HOST from .env
export const IMAGE_BASE = `http://${SERVER_HOST}/System1.0/upload/`;
