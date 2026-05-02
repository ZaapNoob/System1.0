import { useState } from "react";

/**
 * Hook to save/update consultation with encoder tracking
 * @param {number} patientId - Patient ID
 * @returns {Object} - { saveConsultation, loading, error, success }
 */
export const useSaveConsultationWithEncoder = (patientId) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  const saveConsultation = async (consultationData, encoderId, referralData = null) => {
    if (!patientId) {
      setError("Patient ID is required");
      return null;
    }

    setLoading(true);
    setError(null);
    setSuccess(false);

    try {
      // Prepare the consultation data
      const payload = {
        ...consultationData,
        patient_id: patientId,
        // Add encoder info if provided (when encoding happens)
        ...(encoderId && { encoded_by: encoderId })
      };

      // Add referral data if provided
      if (referralData) {
        payload.receiving_facility = referralData.receiving_facility || null;
        payload.receiving_personnel = referralData.receiving_personnel || null;
        payload.referral_category = referralData.referral_category || null;
        payload.reason_for_referral_2 = Array.isArray(referralData.referral_reasons)
          ? JSON.stringify(referralData.referral_reasons)
          : referralData.reason_for_referral_2 || null;
        payload.identity_number_manual = referralData.identity_number_manual || null;
      }

      // Determine if it's a new consultation or an update
      const endpoint = payload.consultation_id
        ? `/api/consultation/update-consultation.php`
        : `/api/consultation/save-consultation.php`;

      // Always use POST for both create and update - API accepts POST
      const response = await fetch(endpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(payload)
      });

      console.log("📡 API Response status:", response.status);
      
      // Check if response is OK before trying to parse JSON
      if (!response.ok) {
        console.error("❌ API returned status:", response.status);
        // Try to get error message from response
        const responseText = await response.text();
        console.error("Response body:", responseText);
        
        if (response.status === 401) {
          throw new Error("Unauthorized - Please login again");
        } else if (response.status === 500) {
          throw new Error("Server error - Check browser console logs");
        } else {
          throw new Error(`API Error: ${response.status}`);
        }
      }

      const result = await response.json();

      if (result.success) {
        setSuccess(true);
        console.log("✅ Consultation saved successfully", result);
        return result;
      } else {
        setError(result.message || "Failed to save consultation");
        return null;
      }
    } catch (err) {
      const errorMsg = err.message || "Error saving consultation";
      setError(errorMsg);
      console.error("❌ Error:", errorMsg);
      return null;
    } finally {
      setLoading(false);
    }
  };

  return { saveConsultation, loading, error, success };
};
