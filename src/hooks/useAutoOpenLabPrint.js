import { useEffect } from "react";
import { usePrintLaboratory } from "./usePrintLaboratory";

/**
 * Custom hook to automatically open lab print preview when lab request is saved
 * @param {number} savedLabRequestId - The saved lab request ID
 * @param {function} onPrintOpened - Callback to clear the ID after opening
 */
export const useAutoOpenLabPrint = (savedLabRequestId, onPrintOpened) => {
  const { openLabPrintPreview } = usePrintLaboratory();

  useEffect(() => {
    if (savedLabRequestId) {
      setTimeout(() => {
        openLabPrintPreview(savedLabRequestId);
        // Clear the ID immediately after opening to prevent re-opening
        if (onPrintOpened) {
          onPrintOpened();
        }
      }, 500);
    }
  }, [savedLabRequestId, openLabPrintPreview, onPrintOpened]);
};
