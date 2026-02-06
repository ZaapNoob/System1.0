import { useEffect, useRef, useState } from "react";

export default function useAutoFetchStable(url, interval = 3000) {
  // Generate cache key from URL for localStorage
  // Include query parameters in the hash to avoid cache collisions between different doctor_ids, filters, etc.
  const cacheKey = url ? `cache_${btoa(url)}` : null;
  
  // Initialize data from localStorage if available
  const [data, setData] = useState(() => {
    if (!cacheKey) return [];
    try {
      const cached = localStorage.getItem(cacheKey);
      return cached ? JSON.parse(cached) : [];
    } catch (err) {
      console.warn("Failed to load from cache:", err);
      return [];
    }
  });

  const lastHashRef = useRef("");
  const timerRef = useRef(null);

  useEffect(() => {
    let mounted = true;

    // Skip fetch if URL is not valid (null, undefined, or contains 'undefined')
    if (!url || url.includes('undefined')) {
      // Clear any existing intervals if URL becomes invalid
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
      return;
    }

    const fetchData = async () => {
      if (!mounted) return;
      
      try {
        const res = await fetch(url);
        const json = await res.json();

        if (!json?.success) return;

        const newData = json.data || [];
        const newHash = JSON.stringify(newData);

        if (newHash !== lastHashRef.current) {
          lastHashRef.current = newHash;
          if (mounted) {
            setData(newData);
            
            // Save to localStorage for persistence across page refreshes
            if (cacheKey) {
              try {
                localStorage.setItem(cacheKey, JSON.stringify(newData));
              } catch (err) {
                console.warn("Failed to save to cache:", err);
              }
            }
            
            console.log(`✅ Data updated from ${url.split('/').pop()}`);
          }
        }
      } catch (err) {
        console.error("Auto refresh error:", err);
      }
    };

    // Fetch immediately when URL becomes valid or changes
    fetchData();
    
    // Set up interval for continuous polling
    if (timerRef.current) clearInterval(timerRef.current);
    timerRef.current = setInterval(fetchData, interval);

    return () => {
      mounted = false;
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
    };
  }, [url, interval, cacheKey]);

  return data;
}
