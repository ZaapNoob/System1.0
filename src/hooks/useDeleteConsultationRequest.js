import { useState } from "react";
import { deleteConsultation } from "../api/consultation";

/**
 * Hook for deleting consultations with confirmation and refresh logic
 * @returns {object} - { handleDeleteConsultationRequest, deleting }
 */
export const useDeleteConsultationRequest = () => {
  const [deleting, setDeleting] = useState(false);

  const handleDeleteConsultationRequest = async (consultation_id, onSuccess) => {
    // Confirm deletion
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this consultation? This action cannot be undone."
    );

    if (!confirmDelete) return;

    setDeleting(true);
    try {
      await deleteConsultation(consultation_id);
      console.log("✅ Consultation deleted successfully:", consultation_id);
      alert("Consultation deleted successfully");
      
      // Call the success callback to refresh consultation history
      if (onSuccess && typeof onSuccess === "function") {
        onSuccess();
      }
    } catch (err) {
      const errorMessage = err.message || "Failed to delete consultation";
      console.error("❌ Delete consultation error:", errorMessage);
      alert("Error deleting consultation: " + errorMessage);
    } finally {
      setDeleting(false);
    }
  };

  return {
    handleDeleteConsultationRequest,
    deleting,
  };
};