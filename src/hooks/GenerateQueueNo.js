import { useState, useEffect } from "react";
import { previewQueueNumber, generateQueueNumber } from "../api/queue";
import { printQueueTicket } from "../utils/printTicket";

export default function useGenerateQueue({
  selectedPatient,
  setSelectedPatient,
  setSearchTerm,
  setSearchResults,
  setVitals,
  usePrinter,
}) {
  const [queueType, setQueueType] = useState("REGULAR");
  const [queuePreview, setQueuePreview] = useState("--");

  const [isManual, setIsManual] = useState(false);
  const [manualNumber, setManualNumber] = useState("");

  /* ================= PREVIEW QUEUE ================= */
  useEffect(() => {
    if (isManual) return;

    const loadPreview = async () => {
      try {
        const res = await previewQueueNumber(queueType);
        setQueuePreview(res.success ? res.queue_code : "--");
      } catch {
        setQueuePreview("--");
      }
    };

    loadPreview();
  }, [queueType, isManual]);

  /* ================= QUEUE TYPE CHANGE ================= */
  const handleQueueTypeChange = (type) => setQueueType(type);

  /* ================= RESET FORM ================= */
  const resetForm = () => {
    setSearchTerm("");
    setSearchResults([]);
    setSelectedPatient(null);
    setQueueType("REGULAR");
    setQueuePreview("--");
    setIsManual(false);
    setManualNumber("");
    // Clear vitals
    setVitals({
      systolic_bp: "",
      diastolic_bp: "",
      heart_rate: "",
      respiratory_rate: "",
      temperature: "",
      oxygen_saturation: "",
      weight: "",
      height: ""
    });
  };

  /* ================= GENERATE QUEUE ================= */
  /**
   * @param {Object} vitalsData Optional object with patient vitals:
   *  {
   *    systolic_bp,
   *    diastolic_bp,
   *    heart_rate,
   *    respiratory_rate,
   *    temperature,
   *    oxygen_saturation,
   *    weight,
   *    height
   *  }
   */
  const handleGenerateQueue = async (vitalsData = {}) => {
    if (!selectedPatient) return;

    if (isManual && !manualNumber) {
      alert("Please enter manual queue number");
      return;
    }

    try {
      // Helper to convert empty strings to null and numbers to proper types
      const toNumber = (val) => {
        if (val === "" || val === null || val === undefined) return null;
        const num = Number(val);
        return isNaN(num) ? null : num;
      };

      const toFloat = (val) => {
        if (val === "" || val === null || val === undefined) return null;
        const num = parseFloat(val);
        return isNaN(num) ? null : num;
      };

      // Merge optional vitals into payload
      const payload = {
        patient_id: selectedPatient.id,
        queue_type: queueType,
        manual_number: isManual ? Number(manualNumber) : null,
        systolic_bp: toNumber(vitalsData.systolic_bp),
        diastolic_bp: toNumber(vitalsData.diastolic_bp),
        heart_rate: toNumber(vitalsData.heart_rate),
        respiratory_rate: toNumber(vitalsData.respiratory_rate),
        temperature: toFloat(vitalsData.temperature),
        oxygen_saturation: toNumber(vitalsData.oxygen_saturation),
        weight: toFloat(vitalsData.weight),
        height: toFloat(vitalsData.height),
      };

      const res = await generateQueueNumber(payload);

      if (!res.success) {
        alert(res.message || "Failed to generate queue");
        return;
      }

      alert(`Queue ${res.queue.queue_code} assigned to ${selectedPatient.name}`);

      // 🖨️ PRINT ONLY IF ENABLED
      if (usePrinter) {
        try {
          printQueueTicket({
            queueCode: res.queue.queue_code,
            queueType: res.queue.queue_type,
            patientName: selectedPatient.name,
          });
        } catch (e) {
          console.error("Print error:", e);
        }
      } else {
        console.log("Printer disabled. Queue saved only.");
      }

      resetForm();
    } catch (err) {
      console.error(err);
      alert("Server error");
    }
  };

  return {
    queueType,
    queuePreview,
    isManual,
    manualNumber,
    setIsManual,
    setManualNumber,
    handleQueueTypeChange,
    handleGenerateQueue,
  };
}
