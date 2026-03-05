import { useMemo } from "react";

/**
 * Custom hook for printing consultation from history
 * Enriches consultation data with doctor names and provides print handler
 * 
 * @param {object} patient - Patient object
 * @param {array} consultHistory - Consultation history array
 * @param {array} doctors - Available doctors array
 * @returns {object} - { enrichedConsultHistory, handlePrintConsultation }
 */
export const usePrintConsultation = (patient, consultHistory, doctors) => {
  // Enrich consultation history with doctor names
  const enrichedConsultHistory = useMemo(() => {
    return consultHistory.map(consult => {
      let doctorName = "";
      if (consult.doctor_id && doctors.length > 0) {
        const doctor = doctors.find(doc => doc.id === parseInt(consult.doctor_id));
        doctorName = doctor?.name || "";
      }
      if (!doctorName && consult.doctor_name) {
        doctorName = consult.doctor_name;
      }
      return {...consult, attending_physician_name: doctorName || consult.attending_physician_name || ""};
    });
  }, [consultHistory, doctors]);

  // Handle printing consultation from history
  const handlePrintConsultation = (consult) => {
    const printData = {
      ...patient,
      ...consult,
      attending_physician: consult.attending_physician_name || consult.doctor_name || "",
      autoprint: false,
    };
    sessionStorage.setItem("printPatient", JSON.stringify(printData));
    window.open(`${window.location.origin}/print-opd`, "_blank");
  };

  return { enrichedConsultHistory, handlePrintConsultation };
};
