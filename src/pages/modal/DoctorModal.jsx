import { useModal } from "../../components/modal/ModalProvider";
import { useState, useEffect } from "react";
import HistoryCard from "../../hooks/DoctorModal/useHistoryCard.jsx";
import { getImageUrl, getGenderBasedAvatar } from "../../utils/image.js";
import { formatDate, formatTime } from "../../utils/dateFormatter";
import { useSaveConsultationWithEncoder } from "../../hooks/useSaveConsultationWithEncoder";
import ReferralModal from "./ReferralModal";
import "./DoctorModal.css";

export default function DoctorModal({ patient, onDone }) {
  const { closeModal } = useModal();

  const [vitals, setVitals] = useState(patient || {});
  const [chiefComplaint, setChiefComplaint] = useState(
    patient?.chief_complaint || ""
  );
  const [chiefComplaintHistory, setChiefComplaintHistory] = useState([]);
  const [diagnosisHistory, setDiagnosisHistory] = useState([]);
  const [treatmentHistory, setTreatmentHistory] = useState([]);
  const [patientIllnessHistory, setPatientIllnessHistory] = useState([]);
  const [referralHistory, setReferralHistory] = useState([]);
  const [allConsults, setAllConsults] = useState([]);
  const [showHistory, setShowHistory] = useState(false);

  // Form inputs for updating consultation
  const [formDiagnosis, setFormDiagnosis] = useState("");
  const [formTreatment, setFormTreatment] = useState("");
  const [formPatientIllness, setFormPatientIllness] = useState("");
  const [currentUser, setCurrentUser] = useState(null);
  const [isSaving, setIsSaving] = useState(false);
  const [saveMessage, setSaveMessage] = useState(null);
  const [showReferralModal, setShowReferralModal] = useState(false);
  const [referralData, setReferralData] = useState(null);

  // Use the proper encoder hook for saving
  const { saveConsultation: saveConsultationWithEncoder, loading: encoderLoading } = useSaveConsultationWithEncoder(patient?.patient_id);

  // Fetch latest consultation details if missing in queue record
  useEffect(() => {
    if (!patient?.patient_id) return;

    const fetchVitalsFromConsultation = async () => {
      try {
        const res = await fetch(
          `/api/consultation/get-latest-consultation.php?patient_id=${patient.patient_id}`
        );
        const data = await res.json();

        if (data.success && data.data && data.data.length > 0) {
          const latestConsult = data.data[0];
          const allConsults = data.data;

          // Store all consultations in state
          setAllConsults(allConsults);

          setVitals((prev) => {
            const updated = { ...prev };

            if (!updated.systolic_bp && latestConsult.systolic_bp) {
              updated.systolic_bp = latestConsult.systolic_bp;
            }
            if (!updated.diastolic_bp && latestConsult.diastolic_bp) {
              updated.diastolic_bp = latestConsult.diastolic_bp;
            }
            if (!updated.heart_rate && latestConsult.pulse_rate) {
              updated.heart_rate = latestConsult.pulse_rate;
            }
            if (!updated.respiratory_rate && latestConsult.respiratory_rate) {
              updated.respiratory_rate = latestConsult.respiratory_rate;
            }
            if (!updated.temperature && latestConsult.temperature) {
              updated.temperature = latestConsult.temperature;
            }
            if (!updated.oxygen_saturation && latestConsult.oxygen_saturation) {
              updated.oxygen_saturation = latestConsult.oxygen_saturation;
            }
            if (!updated.weight && latestConsult.weight) {
              updated.weight = latestConsult.weight;
            }
            if (!updated.height && latestConsult.height) {
              updated.height = latestConsult.height;
            }

            return updated;
          });

          // Set chief complaint (latest only) with highlight
          if (!chiefComplaint && latestConsult.chief_complaint) {
            setChiefComplaint(latestConsult.chief_complaint);
          }

          // Set form defaults from latest consultation
          setFormDiagnosis(latestConsult.diagnosis || "");
          setFormTreatment(latestConsult.treatment || "");
          setFormPatientIllness(latestConsult.patient_illness || "");

          // Extract history: all unique chief complaint records
          const complaintHistory = allConsults
            .map((c) => c.chief_complaint)
            .filter((cc) => cc && cc.trim())
            .filter((value, index, self) => self.indexOf(value) === index); // unique
          if (complaintHistory.length > 0) {
            setChiefComplaintHistory(complaintHistory);
          }

          // Extract history: all unique diagnosis records
          const diagHistory = allConsults
            .map((c) => c.diagnosis)
            .filter((d) => d && d.trim())
            .filter((value, index, self) => self.indexOf(value) === index); // unique
          if (diagHistory.length > 0) {
            setDiagnosisHistory(diagHistory);
          }

          // Extract history: all unique treatment records
          const treatHistory = allConsults
            .map((c) => c.treatment)
            .filter((t) => t && t.trim())
            .filter((value, index, self) => self.indexOf(value) === index); // unique
          if (treatHistory.length > 0) {
            setTreatmentHistory(treatHistory);
          }

          // Extract history: all unique patient_illness records
          const illnessHistory = allConsults
            .map((c) => c.patient_illness)
            .filter((i) => i && i.trim())
            .filter((value, index, self) => self.indexOf(value) === index); // unique
          if (illnessHistory.length > 0) {
            setPatientIllnessHistory(illnessHistory);
          }

          // Extract history: all unique referral records with all details
          const refHistory = allConsults
            .map((c) => ({
              referral: c.referral,
              reason_for_referral: c.reason_for_referral,
              referred_to: c.referred_to,
              referred_by: c.referred_by,
              consultation_date: c.consultation_date,
              encoded_by: c.encoded_by,
              encoded_by_role: c.encoded_by_role
            }))
            .filter((r) => r.referral || r.reason_for_referral || r.referred_to || r.referred_by) // Keep if any field has data
            .filter((value, index, self) => 
              index === self.findIndex((t) => 
                t.referral === value.referral && 
                t.reason_for_referral === value.reason_for_referral &&
                t.referred_to === value.referred_to &&
                t.referred_by === value.referred_by
              )
            ); // unique
          if (refHistory.length > 0) {
            setReferralHistory(refHistory);
          }
        }
      } catch (err) {
        console.error("Failed to fetch consultation vitals:", err);
      }
    };

    fetchVitalsFromConsultation();
  }, [patient?.patient_id]);

  // Fetch current user information
  useEffect(() => {
    const fetchCurrentUser = async () => {
      try {
        const token = localStorage.getItem("token");
        
        if (!token) {
          console.warn("⚠️ No token found in localStorage");
          return;
        }
        
        const response = await fetch("/api/me.php", {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': token
          }
        });
        
        if (!response.ok) {
          console.error(`❌ ME.PHP Error: ${response.status} ${response.statusText}`);
          const text = await response.text();
          console.error("Response body:", text);
          return;
        }
        
        const data = await response.json();
        console.log("👤 ME.PHP Response:", data);
        
        if (data.user) {
          console.log("👤 Current User set to:", data.user);
          setCurrentUser(data.user);
        } else {
          console.warn("⚠️ No user data in /api/me.php response");
        }
      } catch (err) {
        console.error("Failed to fetch current user:", err);
      }
    };

    fetchCurrentUser();
  }, []);

  if (!patient) return null;

  const displayVitals = vitals;

  // Save consultation updates - preserve all fields from latest consultation
  const handleSaveConsultationUpdates = async () => {
    if (!allConsults || allConsults.length === 0) {
      setSaveMessage({ type: "error", text: "No consultation found to update" });
      return;
    }

    const latestConsultation = allConsults[0];
    
    try {
      setIsSaving(true);
      setSaveMessage(null);

      // CRITICAL: Ensure we have current user info
      let doctorUserId = currentUser?.id;
      if (!doctorUserId) {
        console.log("⚠️ currentUser?.id is null, fetching fresh from /api/me.php...");
        try {
          const meResponse = await fetch("/api/me.php");
          console.log("🔄 /api/me.php Response status:", meResponse.status);
          
          // Check if response is OK before trying to parse JSON
          if (!meResponse.ok) {
            console.warn("⚠️ /api/me.php returned status:", meResponse.status, "- Skipping user fetch");
            // Continue with other sources for doctor_id (patient.doctor_id or latestConsultation.doctor_id)
          } else {
            const meData = await meResponse.json();
            console.log("🔄 Fresh /api/me.php Response:", meData);
            if (meData.user?.id) {
              doctorUserId = meData.user.id;
              console.log("✅ Got doctor user ID from fresh fetch:", doctorUserId);
              setCurrentUser(meData.user);
            } else {
              console.warn("⚠️ Still no ID from /api/me.php. Response:", meData);
            }
          }
        } catch (err) {
          console.error("❌ Failed to fetch fresh user data:", err);
          console.error("Error details:", err.message);
        }
      } else {
        console.log("✅ Using cached currentUser.id:", doctorUserId);
      }

      // Merge all existing consultation data with new form inputs
      // Get doctor_id from sources in priority order
      const getDoctorId = () => {
        if (doctorUserId) return doctorUserId;
        if (patient?.doctor_id) return patient.doctor_id;
        if (latestConsultation?.doctor_id) return latestConsultation.doctor_id;
        console.warn("⚠️ No doctor_id found from any source!");
        return null;
      };

      const updateData = {
        consultation_id: latestConsultation.id,
        patient_id: patient.patient_id,
        // Preserve all existing consultation fields
        chief_complaint: latestConsultation.chief_complaint || null,
        purpose_visit: latestConsultation.purpose_visit || null,
        nature_visit: latestConsultation.nature_visit || null,
        visit_date: latestConsultation.visit_date || null,
        systolic_bp: latestConsultation.systolic_bp || null,
        diastolic_bp: latestConsultation.diastolic_bp || null,
        temperature: latestConsultation.temperature || null,
        pulse_rate: latestConsultation.pulse_rate || null,
        respiratory_rate: latestConsultation.respiratory_rate || null,
        oxygen_saturation: latestConsultation.oxygen_saturation || null,
        weight: latestConsultation.weight || null,
        height: latestConsultation.height || null,
        remarks: latestConsultation.remarks || null,
        referral: latestConsultation.referral || null,
        reason_for_referral: latestConsultation.reason_for_referral || null,
        referred_to: latestConsultation.referred_to || null,
        referred_by: latestConsultation.referred_by || null,
        // Override with new form values
        diagnosis: formDiagnosis || null,
        treatment: formTreatment || null,
        patient_illness: formPatientIllness || null,
        // Save doctor information from current user
        doctor_id: getDoctorId()
      };

      console.log("💾 Saving consultation with doctor_id:", getDoctorId(), "from:", currentUser?.id ? "currentUser" : patient?.doctor_id ? "patient" : "latestConsultation");

      // Pass both the full data and the encoder ID, plus referral data if available
      const response = await saveConsultationWithEncoder(updateData, currentUser?.id, referralData);
      
      console.log("📡 Save response:", response);
      
      if (response) {
        setSaveMessage({ type: "success", text: "✓ Consultation updated successfully" });
        
        // Prepare and open PrintReferral if referral data exists
        if (referralData) {
          console.log("💾 Referral data found, preparing to print:", referralData);
          console.log("📍 Receiving facility from referral:", referralData.receiving_facility);
          console.log("👤 Receiving personnel from referral:", referralData.receiving_personnel);
          
          const referralInfo = {
            patient: {
              id: patient?.patient_id,
              name: `${patient?.first_name || ''} ${patient?.last_name || ''}`,
              address: patient?.address || '',
              barangay_name: patient?.barangay_name || '',
              purok_name: patient?.purok_name || '',
              street: patient?.street || '',
              city_municipality: patient?.city_municipality || '',
              province: patient?.province || '',
              region: patient?.region || '',
              is_special: patient?.is_special || 0,
              date_of_birth: patient?.date_of_birth,
              gender: patient?.gender
            },
            referral: {
              date_referred: new Date().toLocaleDateString(),
              time_called: new Date().toLocaleTimeString(),
              receiving_facility: referralData.receiving_facility,
              receiving_personnel: referralData.receiving_personnel,
              referral_category: referralData.referral_category,
              referral_reasons: referralData.referral_reasons,
              diagnosis: formDiagnosis,
              chief_complaint: chiefComplaint,
              patient_illness: formPatientIllness,
              findings: `BP: ${displayVitals?.systolic_bp}/${displayVitals?.diastolic_bp}, HR: ${displayVitals?.heart_rate}, O2: ${displayVitals?.oxygen_saturation}%`,
              treatment_given: formTreatment,
              identity_number_manual: referralData.identity_number_manual,
              doctor_id: getDoctorId()
            }
          };
          
          console.log("📋 Setting localStorage with referralInfo:", referralInfo);
          console.log("🆔 Doctor ID being saved to localStorage:", referralInfo.referral.doctor_id);
          console.log("👤 Current User at save time:", currentUser);
          console.log("👤 Doctor User ID used:", doctorUserId);
          localStorage.setItem('printReferralData', JSON.stringify(referralInfo));
          
          // Open print referral window immediately (localStorage persists across tabs/windows)
          console.log("🖨️ Opening PrintReferral window...");
          openPrintReferral();
        } else {
          console.warn("⚠️ No referral data to print");
        }
        
        // Trigger done and close modal after successful save
        setTimeout(() => {
          onDone();
          closeModal();
        }, 800);
      } else {
        setSaveMessage({ type: "error", text: "Failed to update consultation" });
      }
    } catch (err) {
      setSaveMessage({ type: "error", text: err.message || "Failed to save consultation" });
      console.error("Save consultation error:", err);
    } finally {
      setIsSaving(false);
    }
  };

  // Debug: Log patient profile image
  useEffect(() => {
    console.log("Patient Profile Image:", patient?.profile_image);
    console.log("Image URL:", getImageUrl(patient?.profile_image));
  }, [patient?.profile_image]);

  // Handle Add Referral button click
  const handleAddReferral = () => {
    if (!allConsults || allConsults.length === 0) {
      setSaveMessage({ type: "error", text: "Please save the consultation first before adding referral" });
      return;
    }
    setShowReferralModal(true);
  };

  // Handle when referral is saved
  const handleReferralSaved = (newReferralData) => {
    // Store referral data to be saved with consultation
    setReferralData(newReferralData);
    setShowReferralModal(false);
    // Show confirmation message
    setSaveMessage({ type: "success", text: "✓ Referral form filled. Click 'Save Updates' to save both consultation and referral." });
  };

  // Open print referral window
  const openPrintReferral = () => {
    window.open('/print-referral', 'PrintReferral', 'width=900,height=1000');
  };

  return (
    <div className="doctor-modal-container">
      {/* Header */}
      <div className="doctor-modal-header">
        <div>
          <h2>Patient Information</h2>
          <p className="doctor-modal-subtitle">
            Review patient profile, vitals, and consultation details
          </p>
        </div>
        <button className="modal-close-btn" onClick={closeModal}>
          ✕
        </button>
      </div>

      <div className="doctor-modal-body">
        {/* LEFT: Patient Profile */}
        <div className="doctor-card doctor-patient-container">
          <div className="doctor-patient-image">
            <img
              src={patient?.profile_image ? getImageUrl(patient?.profile_image) : getGenderBasedAvatar(patient?.gender)}
              alt="Patient Profile"
              onError={(e) => {
                console.error("Image load failed:", {
                  src: e.target.src,
                  profile_image: patient?.profile_image,
                  patient_id: patient?.patient_id
                });
                // Set fallback to gender-based avatar on error
                e.target.src = getGenderBasedAvatar(patient?.gender);
              }}
              onLoad={() => {
                console.log("Image loaded successfully:", patient?.profile_image);
              }}
            />
          </div>

          <div className="doctor-patient-info">
            <h3>Patient Profile</h3>

            <div className="info-row">
              <span className="label">Name</span>
              <span className="value">
                {patient?.first_name || "—"} {patient?.middle_name || ""}{" "}
                {patient?.last_name || "—"} {patient?.suffix || ""}
              </span>
            </div>

            <div className="info-row">
              <span className="label">Queue Code</span>
              <span className="value badge-blue">
                {patient?.queue_code || "—"}
              </span>
            </div>

            <div className="info-row">
              <span className="label">Gender</span>
              <span className="value">{patient?.gender || "—"}</span>
            </div>

            <div className="info-row">
              <span className="label">Date of Birth</span>
              <span className="value">{patient?.date_of_birth || "—"}</span>
            </div>

            <div className="info-row">
              <span className="label">Age</span>
              <span className="value">{patient?.age || "—"}</span>
            </div>

            <div className="info-row">
              <span className="label">Blood Type</span>
              <span className="value badge-red">
                {patient?.blood_type || "—"}
              </span>
            </div>

            <div className="info-row">
              <span className="label">Contact Number</span>
              <span className="value">{patient?.contact_number || "—"}</span>
            </div>
          </div>
        </div>

        {/* RIGHT: Vital Signs */}
        <div className="doctor-card doctor-vitals-container">
          <h3>Vital Signs</h3>

          <div className="vitals-grid">
            <div className="vital-box">
              <span className="vital-title">Blood Pressure</span>
              <span className="vital-value">
                {displayVitals?.systolic_bp || "—"}/
                {displayVitals?.diastolic_bp || "—"}
              </span>
              <small>mmHg</small>
            </div>

            <div className="vital-box">
              <span className="vital-title">Heart Rate</span>
              <span className="vital-value">
                {displayVitals?.heart_rate || "—"}
              </span>
              <small>bpm</small>
            </div>

            <div className="vital-box">
              <span className="vital-title">Respiratory Rate</span>
              <span className="vital-value">
                {displayVitals?.respiratory_rate || "—"}
              </span>
              <small>breaths/min</small>
            </div>

            <div className="vital-box">
              <span className="vital-title">Temperature</span>
              <span className="vital-value">
                {displayVitals?.temperature || "—"}
              </span>
              <small>°C</small>
            </div>

            <div className="vital-box">
              <span className="vital-title">Oxygen Saturation</span>
              <span className="vital-value">
                {displayVitals?.oxygen_saturation || "—"}
              </span>
              <small>%</small>
            </div>

            <div className="vital-box">
              <span className="vital-title">Weight</span>
              <span className="vital-value">
                {displayVitals?.weight || "—"}
              </span>
              <small>kg</small>
            </div>

            <div className="vital-box">
              <span className="vital-title">Height</span>
              <span className="vital-value">
                {displayVitals?.height || "—"}
              </span>
              <small>cm</small>
            </div>
          </div>

          <div className="vitals-divider"></div>

          {allConsults && allConsults.length > 0 && allConsults[0]?.nature_visit !== "Follow-up" && (
            <div className="consultation-info">
              <div className="info-container">
                <span className="info-label">Complaint:</span>
                <span className="info-value">{chiefComplaintHistory[0] || "—"}</span>
              </div>

              {(allConsults[0]?.referral || allConsults[0]?.reason_for_referral || allConsults[0]?.referred_to || allConsults[0]?.referred_by) && (
                <div className="info-container">
                  <span className="info-label">Referral:</span>
                  <span className="info-value">
                    {allConsults[0]?.referred_by || "—"}
                  </span>
                  {allConsults[0]?.reason_for_referral && (
                    <div className="info-value referral-reason-box">
                      Reason: {allConsults[0]?.reason_for_referral}
                    </div>
                  )}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Bottom Full Width - Consultation History */}
        <div className="doctor-card doctor-details-table">
          <div className="history-header">
            <h3>Consultation History</h3>
            <button 
              className="toggle-history-btn"
              onClick={() => setShowHistory(!showHistory)}
            >
              {showHistory ? "Hide History ▲" : "Show History ▼"}
            </button>
          </div>

          {showHistory && (
            <table className="history-table">
              <thead>
                <tr>
                  <th>Date</th>
                  <th>Chief Complaint</th>
                  <th>Diagnosis</th>
                  <th>Treatment</th>
                  <th>Illness History</th>
                  <th>Referral Details</th>
                </tr>
              </thead>
              <tbody>
                {allConsults && allConsults.length > 1 ? (
                  allConsults.slice(1).map((consult, idx) => (
                    <tr key={idx}>
                      <td>
                        {consult?.encoded_at || consult?.created_at ? (
                          <>
                            <div>{formatDate(consult?.encoded_at || consult?.created_at)}</div>
                            <small>{formatTime(consult?.encoded_at || consult?.created_at)}</small>
                          </>
                        ) : (
                          "—"
                        )}
                      </td>
                      <td>{consult?.chief_complaint || "—"}</td>
                      <td>{consult?.diagnosis || "—"}</td>
                      <td>{consult?.treatment || "—"}</td>
                      <td>{consult?.patient_illness || "—"}</td>
                      <td>
                        {consult?.referred_by ? (
                          <div>
                            <div>{consult.referred_by}</div>
                            {consult?.reason_for_referral && (
                              <div className="referral-reason">{consult.reason_for_referral}</div>
                            )}
                          </div>
                        ) : (
                          "—"
                        )}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="6" style={{textAlign: "center"}}>No consultation history</td>
                  </tr>
                )}
              </tbody>
            </table>
          )}
        </div>

        {/* Input Form - Update Consultation Details */}
        <div className="doctor-card doctor-update-form">
          <div className="form-header">
            <h3>Update Consultation Details</h3>
           
          </div>

          <div className="form-group">
            <label htmlFor="diagnosis">Diagnosis</label>
            <textarea
              id="diagnosis"
              className="form-textarea"
              placeholder="Enter or update diagnosis..."
              value={formDiagnosis}
              onChange={(e) => setFormDiagnosis(e.target.value)}
              rows="3"
            />
          </div>

          <div className="form-group">
            <label htmlFor="treatment">Treatment</label>
            <textarea
              id="treatment"
              className="form-textarea"
              placeholder="Enter or update treatment..."
              value={formTreatment}
              onChange={(e) => setFormTreatment(e.target.value)}
              rows="3"
            />
          </div>

          <div className="form-group">
            <label htmlFor="patientIllness">Patient Illness History</label>
            <textarea
              id="patientIllness"
              className="form-textarea"
              placeholder="Enter or update patient illness history..."
              value={formPatientIllness}
              onChange={(e) => setFormPatientIllness(e.target.value)}
              rows="3"
            />
          </div>

          {saveMessage && (
            <div className={`save-message ${saveMessage.type}`}>
              {saveMessage.text}
            </div>
          )}
        </div>
      </div>

      {/* Footer */}
      <div className="doctor-modal-actions">
        <button
          className="btn btn-save"
          onClick={handleSaveConsultationUpdates}
          disabled={isSaving || encoderLoading}
        >
          {isSaving || encoderLoading ? "Saving..." : "💾 Save Updates"}
        </button>
        <button
          className="btn btn-referral"
          onClick={handleAddReferral}
          disabled={!allConsults || allConsults.length === 0}
          title="Add referral form for this patient"
        >
          📋 Add Referral
        </button>
        <button className="btn btn-success" onClick={onDone}>
          ✔ Done
        </button>
        <button className="btn btn-cancel" onClick={closeModal}>
          Close
        </button>
      </div>

      {/* Referral Modal */}
      {showReferralModal && (
        <ReferralModal
          patient={patient}
          consultation={allConsults && allConsults.length > 0 ? allConsults[0] : null}
          onSave={handleReferralSaved}
          onCancel={() => setShowReferralModal(false)}
          currentUser={currentUser}
        />
      )}
    </div>
  );
}