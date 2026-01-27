// API Configuration
// Determines the base URL for API calls based on the environment

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost/System1.0/api";

export default API_BASE_URL;
