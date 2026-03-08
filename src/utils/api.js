export const apiFetch = async (url, options = {}) => {
  const fetchOptions = { ...options };
  
  // Don't set Content-Type if sending FormData (browser will set multipart/form-data automatically)
  if (!(options.body instanceof FormData)) {
    fetchOptions.headers = { "Content-Type": "application/json", ...options.headers };
  }
  
  const response = await fetch(url, fetchOptions);

  const result = await response.json();

  if (!response.ok || result.success === false) {
    throw new Error(result.error || "API error");
  }

  return result;
};
