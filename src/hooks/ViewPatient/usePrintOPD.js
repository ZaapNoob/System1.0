import { useCallback } from "react";

/**
 * Hook for handling OPD record printing with name parsing
 */
export function usePrintOPD() {
  // Parse full name into components
  const parseName = useCallback((fullName) => {
    if (!fullName) return { first_name: "", middle_name: "", last_name: "", suffix: "" };
    
    const parts = fullName.trim().split(/\s+/).filter(p => p.length > 0);
    
    if (parts.length === 0) return { first_name: "", middle_name: "", last_name: "", suffix: "" };
    if (parts.length === 1) return { first_name: parts[0], middle_name: "", last_name: "", suffix: "" };
    if (parts.length === 2) return { first_name: parts[0], middle_name: "", last_name: parts[1], suffix: "" };
    
    // Assume format: FirstName MiddleName LastName [Suffix]
    // For 3 parts: first, middle, last
    // For 4+ parts: first, middle..., last, suffix...
    const first_name = parts[0];
    const last_name = parts[parts.length - 2];
    const middle_name = parts.slice(1, -2).join(" ");
    const suffix = parts.length > 3 ? parts[parts.length - 1] : "";
    
    return { first_name, middle_name, last_name: last_name || parts[1], suffix };
  }, []);

  const handlePrintOPD = useCallback((patient, consult) => {
    const nameParts = parseName(patient?.name);
    
    // Prepare print data from consultation
    const printData = {
      ...patient,
      // Use parsed name parts
      first_name: nameParts.first_name,
      last_name: nameParts.last_name,
      middle_name: nameParts.middle_name,
      suffix: nameParts.suffix,
      id: patient?.id || "",
      patient_code: patient?.patient_code || "",
      old_health_record_no: patient?.old_health_record_no || "",
      age: patient?.age || "",
      gender: patient?.gender || "",
      marital_status: patient?.marital_status || "",
      date_of_birth: patient?.date_of_birth || "",
      religion: patient?.religion || "",
      nationality: patient?.nationality || "Filipino",
      contact_number: patient?.contact_number || "",
      occupation: patient?.occupation || "",
      company: patient?.company || "",
      informant: patient?.informant || "",
      informant_contact: patient?.informant_contact || "",
      referral: patient?.referral || "",
      // Address fields
      street: patient?.street || "",
      barangay_name: patient?.barangay_name || "",
      barangay_name_db: patient?.barangay_name_db || "",
      city_municipality: patient?.city_municipality || "",
      province: patient?.province || "",
      purok_name: patient?.purok_name || "",
      is_special: patient?.is_special || 0,
      // From consultation record
      queue_date: consult.queue_date || consult.visit_date,
      created_at: consult.consultation_date || consult.visit_date,
      height: consult.height || "",
      weight: consult.weight || "",
      temperature: consult.temperature || "",
      heart_rate: consult.pulse_rate || "",
      systolic_bp: consult.systolic_bp || "",
      diastolic_bp: consult.diastolic_bp || "",
      respiratory_rate: consult.respiratory_rate || "",
      oxygen_saturation: consult.oxygen_saturation || "",
      complaint: consult.chief_complaint || "",
      history: consult.patient_illness || "",
      diagnosis: consult.diagnosis || "",
      treatment: consult.treatment || "",
      doctor_name: consult.doctor_name || "",
      attending_physician_name: consult.doctor_name || "",
      autoprint: true
    };

    // Store in sessionStorage and open print page
    sessionStorage.setItem("printPatient", JSON.stringify(printData));
    window.open("/print-opd", "_blank");
  }, [parseName]);

  return { handlePrintOPD };
}
