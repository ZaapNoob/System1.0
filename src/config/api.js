/**
 * API Configuration Module
 * Centralized API base URL from Vite environment variables
 * 
 * Usage:
 *   import API from './config/api';
 *   fetch(`${API}/auth/logout.php`, {...})
 */

const API = import.meta.env.VITE_API_BASE_URL || "http://localhost/System1.0/api";

console.log("=== API Configuration ===");
console.log("VITE_API_BASE_URL env:", import.meta.env.VITE_API_BASE_URL);
console.log("Resolved API:", API);

export default API;
