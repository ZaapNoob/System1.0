import { useState, useCallback } from "react";

/**
 * Custom hook for managing partial data refresh
 * Use this hook to trigger a refresh of any data source without a full page reload
 * 
 * @returns {Object} - { refreshTrigger, triggerRefresh }
 * 
 * @example
 * // In your hook or component:
 * const { refreshTrigger, triggerRefresh } = useRefresh();
 * 
 * // Pass refreshTrigger to your data-fetching hook
 * const { data, loading } = useYourDataFetchHook(id, refreshTrigger);
 * 
 * // In your callback, call triggerRefresh() to refresh data
 * const handleSave = () => {
 *   saveData();
 *   triggerRefresh(); // This will refetch the data
 * };
 */
export const useRefresh = () => {
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  const triggerRefresh = useCallback(() => {
    console.log("🔄 Triggering refresh...");
    setRefreshTrigger((prev) => prev + 1);
  }, []);

  return { refreshTrigger, triggerRefresh };
};
