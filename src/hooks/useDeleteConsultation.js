import { useState } from "react";
import { deleteConsultation } from "../api/consultation";

/**
 * Hook for deleting consultations with error handling and loading states
 * @returns {object} - { handleDeleteConsultation, deleting, error }
 */
export const useDeleteConsultation = () => {
  const [deleting, setDeleting] = useState(false);
  const [error, setError] = useState(null);

  const handleDeleteConsultation = async (consultation_id) => {
    setDeleting(true);
    setError(null);

    try {
      await deleteConsultation(consultation_id);
      console.log("✅ Consultation deleted successfully:", consultation_id);
      return true;
    } catch (err) {
      const errorMessage = err.message || "Failed to delete consultation";
      setError(errorMessage);
      console.error("❌ Delete consultation error:", errorMessage);
      return false;
    } finally {
      setDeleting(false);
    }
  };

  return {
    handleDeleteConsultation,
    deleting,
    error,
  };
};