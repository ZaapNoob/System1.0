/**
 * Hook for formatting patient addresses
 * Uses is_special to determine if patient is local (barangay) or outside Gubat
 */
export const useFormatAddress = () => {
  const formatAddress = (patientData) => {
    if (!patientData) return "";
    
    // If patient is from outside Gubat (is_special = 1)
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
      // Local barangay patient - use purok + barangay + city (from patient's data or default Gubat)
      const purokPart = patientData.purok_name ? `${patientData.purok_name}, ` : "";
      const barangayName = patientData.barangay_name || "";
      const city = patientData.city_municipality || "Gubat";
      const province = patientData.province || "Sorsogon";
      const region = patientData.region || "Sorsogon";
      
      return `${purokPart}${barangayName}, ${city}, ${province}, ${region}`;
    }
  };

  return { formatAddress };
};
