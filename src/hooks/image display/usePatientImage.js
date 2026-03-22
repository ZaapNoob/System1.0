import { useEffect, useState } from "react";
import { getFullPatientDetails } from "../../api/patients";
import { getImageUrl, DEFAULT_AVATAR } from "../../utils/image";

/**
 * Hook to fetch and display patient image
 * Automatically fetches full patient details if profile_image is missing
 * 
 * @param {Object} patient - Patient object (can be partial from search results)
 * @returns {Object} { imageUrl, isLoading, error }
 */
export const usePatientImage = (patient) => {
  const [fullPatient, setFullPatient] = useState(patient);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!patient?.id) return;

    // If profile_image already exists, no need to fetch
    if (patient.profile_image !== undefined) {
      setFullPatient(patient);
      return;
    }

    // Fetch full patient details to get profile_image
    const fetchFullPatient = async () => {
      try {
        setIsLoading(true);
        const res = await getFullPatientDetails(patient.id);
        if (res.success && res.data) {
          setFullPatient(res.data);
          console.log("✅ [usePatientImage] Full patient details fetched:", res.data.profile_image);
        }
      } catch (err) {
        console.error("❌ [usePatientImage] Failed to fetch full patient details:", err);
        setError(err.message);
        setFullPatient(patient);
      } finally {
        setIsLoading(false);
      }
    };

    fetchFullPatient();
  }, [patient?.id, patient?.profile_image]);

  // Generate image URL
  const imageUrl = fullPatient?.profile_image
    ? getImageUrl(fullPatient.profile_image)
    : DEFAULT_AVATAR;

  return {
    imageUrl,
    isLoading,
    error,
    fullPatient
  };
};
