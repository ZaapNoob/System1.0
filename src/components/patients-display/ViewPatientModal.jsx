import { useEffect, useState } from "react";
import { useModal } from "../modal/ModalProvider";
import API from "../../config/api";
import { apiFetch } from "../../utils/api";
import { usePrintOPD } from "../../hooks/ViewPatient/usePrintOPD";
import { useDeleteConsultationRequest } from "../../hooks/useDeleteConsultationRequest";
import { getGenderBasedAvatar } from "../../utils/image";
import { usePatientImage } from "../../hooks/image display/usePatientImage";
import { getFullPatientDetails } from "../../api/patients";
import { useLabHistory } from "../../hooks/useLabHistory";
import { useMedicalHistory } from "../../hooks/useMedicalHistory";
import EditConsultationModal from "./EditConsultationModal";
import PatientHeader from "./ViewPatientModal/PatientHeader";
import PatientInfo from "./ViewPatientModal/PatientInfo";
import FamilyMembers from "./ViewPatientModal/FamilyMembers";
import ConsultationHistory from "./ViewPatientModal/ConsultationHistory";
import LabHistory from "./ViewPatientModal/LabHistory";
import MedicalCertificates from "./ViewPatientModal/MedicalCertificates";
import "./ViewPatientmodal.css";

export default function ViewPatientModal({ patient, showFamily = true }) {
  const { closeModal, openModal } = useModal();
  const { handlePrintOPD } = usePrintOPD();
  const { handleDeleteConsultationRequest, deleting: deletingConsultation } = useDeleteConsultationRequest();

  // Get patient image using custom hook
  const { imageUrl, isLoading: imageLoading, fullPatient: fetchedPatient } = usePatientImage(patient);

  // Determine image source - use gender-based avatar if no profile image
  const displayImageUrl = (!patient?.profile_image && !fetchedPatient?.profile_image) 
    ? getGenderBasedAvatar(patient.gender) 
    : imageUrl;

  const [familyMembers, setFamilyMembers] = useState([]);
  const [consultationHistory, setConsultationHistory] = useState([]);
  const [loading, setLoading] = useState(false);
  const [consultLoading, setConsultLoading] = useState(false);
  const [fullPatient, setFullPatient] = useState(null);

  // Fetch lab and medical histories using custom hooks
  const { labHistory, loadingHistory: labLoading } = useLabHistory(patient?.id);
  const { medicalHistory, loadingHistory: medicalLoading } = useMedicalHistory(patient?.id);

  // STEP 2 TOGGLE
  const [showMore, setShowMore] = useState(false);
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  // ================= FETCH FULL PATIENT DETAILS =================
  useEffect(() => {
    if (!patient?.id) return;

    const fetchFullDetails = async () => {
      try {
        const res = await getFullPatientDetails(patient.id);
        if (res.success) {
          setFullPatient(res.data);
        }
      } catch (err) {
        console.error("Failed to fetch full patient details", err);
      }
    };

    fetchFullDetails();
  }, [patient?.id]);

  // ================= FETCH FAMILY =================
  useEffect(() => {
    if (
      !showFamily ||
      !patient?.barangay_id ||
      !patient?.facility_household_no ||
      !patient?.household_no
    ) {
      return;
    }

    const fetchFamily = async () => {
      try {
        setLoading(true);

        const res = await apiFetch(
          `${API}/patients/get-family-members.php` +
            `?barangay_id=${patient.barangay_id}` +
            `&facility_household_no=${patient.facility_household_no}` +
            `&household_no=${patient.household_no}` +
            `&exclude_id=${patient.id}`
        );

        setFamilyMembers(res.members || []);
      } catch (err) {
        console.error("Failed to fetch family members", err);
      } finally {
        setLoading(false);
      }
    };

    fetchFamily();
  }, [patient, showFamily]);

  // ================= FETCH CONSULTATION HISTORY =================
  useEffect(() => {
    if (!patient?.id) return;

    const fetchConsultationHistory = async () => {
      try {
        setConsultLoading(true);
        const res = await apiFetch(
          `${API}/consultation/get-consultation-history.php?patient_id=${patient.id}`
        );

        if (res.success) {
          console.log("📊 Consultation history API response:", res.data);
          if (res.data && res.data.length > 0) {
            console.log("📋 First consultation - referral fields:");
            console.log("  - referral_category:", res.data[0]?.referral_category);
            console.log("  - receiving_personnel:", res.data[0]?.receiving_personnel);
            console.log("  - reason_for_referral_2:", res.data[0]?.reason_for_referral_2);
            console.log("📋 All consultation keys:", Object.keys(res.data[0] || {}));
          }
          setConsultationHistory(res.data || []);
        }
      } catch (err) {
        console.error("Failed to fetch consultation history", err);
      } finally {
        setConsultLoading(false);
      }
    };

    fetchConsultationHistory();
  }, [patient?.id, refreshTrigger]);

  // ================= EDIT CONSULTATION =================
  const handleEditConsultation = (consult) => {
    // Get current user from localStorage
    let currentUser = null;
    const userStr = localStorage.getItem("user");
    if (userStr) {
      try {
        currentUser = JSON.parse(userStr);
      } catch (e) {
        console.error("Failed to parse user from localStorage");
      }
    }
    
    openModal(
      <EditConsultationModal
        consultation={consult}
        patient={patient}
        user={currentUser}
        onUpdate={() => setRefreshTrigger(prev => prev + 1)}
      />
    );
  };

  // ================= DELETE CONSULTATION =================
  const handleDeleteConsult = (consultation_id) => {
    // Pass callback to refresh consultation history after successful deletion
    handleDeleteConsultationRequest(consultation_id, () => {
      setRefreshTrigger(prev => prev + 1);
    });
  };

  if (!patient) return null;

  return (
    <div className="patient-view-modal two-column">

      {/* LEFT SIDE */}
      <div className="patient-left">

        <h3>
          {showFamily ? "Patient Information" : "Family Member Information"}
        </h3>

        {/* PROFILE HEADER */}
        <PatientHeader patient={patient} displayImageUrl={displayImageUrl} />

        {/* BASIC INFO SECTION */}
        <PatientInfo patient={patient} fullPatient={fullPatient} />

        {/* FAMILY MEMBERS SECTION */}
        {showFamily && (
          <FamilyMembers 
            patient={patient}
            familyMembers={familyMembers}
            loading={loading}
          />
        )}

      </div>

      {/* RIGHT SIDE - HISTORY RECORDS */}
      <div className="consultation-right">
        <ConsultationHistory
          patient={patient}
          consultationHistory={consultationHistory}
          consultLoading={consultLoading}
          onDeleteConsult={handleDeleteConsult}
          onEditConsult={handleEditConsultation}
          onPrintOPD={handlePrintOPD}
          deletingConsultation={deletingConsultation}
        />

        <LabHistory
          patient={patient}
          labHistory={labHistory}
          labLoading={labLoading}
        />

        <MedicalCertificates
          patient={patient}
          medicalHistory={medicalHistory}
          medicalLoading={medicalLoading}
        />
      </div>

      {/* ACTIONS */}
      <div className="modal-actions full-width">
        <button className="cancel-btn" onClick={closeModal}>
          Close
        </button>
      </div>

    </div>
  );
}