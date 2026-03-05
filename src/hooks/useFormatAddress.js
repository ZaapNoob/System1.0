/**
 * Hook for formatting patient addresses
 * Handles both Gubat residents (using purok + barangay) and outside patients (using street, city, province, region)
 */
export const useFormatAddress = () => {
  const formatAddress = (patientData) => {
    if (!patientData) return "";
    
    // If patient is from outside Gubat (is_special = 1 or is_special = true)
    if (patientData.is_special === 1 || patientData.is_special === true) {
      // Format: street, city_municipality, province, region
      const addressParts = [
        patientData.street,
        patientData.city_municipality,
        patientData.province,
        patientData.region
      ].filter(Boolean);
      return addressParts.join(", ");
    } else {
      // If patient is from Gubat - use purok (if available) + barangay
      const purokPart = patientData.purok_name ? `${patientData.purok_name}, ` : "";
      const barangayName = patientData.barangay_name || "Gubat";
      // Only add ", Gubat" if barangay_name is not already "Gubat"
      const cityPart = barangayName.toLowerCase() === "gubat" ? "" : ", Gubat";
      return `${purokPart}${barangayName}${cityPart}, Sorsogon, Sorsogon`;
    }
  };

  return { formatAddress };
};
