import { useEffect, useState } from "react";
import { useModal } from "../modal/ModalProvider";
import API from "../../config/api";
import { apiFetch } from "../../utils/api";
import { usePrintOPD } from "../../hooks/ViewPatient/usePrintOPD";
import { useDeleteConsultationRequest } from "../../hooks/useDeleteConsultationRequest";
import { DEFAULT_AVATAR } from "../../utils/image";
import { usePatientImage } from "../../hooks/image display/usePatientImage";
import { getFullPatientDetails } from "../../api/patients";
import EditConsultationModal from "./EditConsultationModal";
import "./ViewPatientmodal.css";

export default function ViewPatientModal({ patient, showFamily = true }) {
  const { closeModal, openModal } = useModal();
  const { handlePrintOPD } = usePrintOPD();
  const { handleDeleteConsultationRequest, deleting: deletingConsultation } = useDeleteConsultationRequest();

  // Get patient image using custom hook
  const { imageUrl, isLoading: imageLoading } = usePatientImage(patient);

  const [familyMembers, setFamilyMembers] = useState([]);
  const [consultationHistory, setConsultationHistory] = useState([]);
  const [loading, setLoading] = useState(false);
  const [consultLoading, setConsultLoading] = useState(false);
  const [fullPatient, setFullPatient] = useState(null);

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
    openModal(
      <EditConsultationModal
        consultation={consult}
        patient={patient}
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
        <div className="patient-header">

          <div className="patient-avatar">
            <img
              src={imageUrl}
              alt="Patient"
              onLoad={() => console.log("✅ Image loaded successfully")}
              onError={(e) => {
                console.error("❌ Image failed to load from:", e.target.src);
                e.target.src = DEFAULT_AVATAR;
              }}
            />
          </div>

          <div className="patient-basic">
            <h3>{patient.name}</h3>
            <p className="patient-meta">
              {patient.gender} • {patient.age} years old
            </p>
          </div>

        </div>

        {/* ================= BASIC PATIENT INFO ================= */}
        <div className="view-grid">
          <div><strong>Name:</strong><p>{(fullPatient || patient).name}</p></div>
          <div><strong>Gender:</strong><p>{(fullPatient || patient).gender}</p></div>
          <div><strong>Age:</strong><p>{(fullPatient || patient).age}</p></div>
          <div><strong>Barangay:</strong><p>{(fullPatient || patient).barangay_name || "—"}</p></div>
          <div><strong>Status:</strong><p>{(fullPatient || patient).status}</p></div>
          <div><strong>Patient Code:</strong><p>{(fullPatient || patient).patient_code}</p></div>
          <div><strong>Facility No:</strong><p>{(fullPatient || patient).facility_household_no}</p></div>
          <div><strong>Household No:</strong><p>{(fullPatient || patient).household_no}</p></div>
        </div>

        {/* SHOW MORE BUTTON */}
        <div className="more-toggle">
          <button
            className="expand-btn"
            onClick={() => setShowMore(!showMore)}
          >
            {showMore ? "Hide Additional Information" : "Show Additional Information"}
          </button>
        </div>

        {/* ================= STEP 2 EXTENDED INFO ================= */}
        {showMore && (
          <div className="extended-info">

            <h4>Additional Patient Information</h4>

            <div className="view-grid">

              <div><strong>Date of Birth:</strong><p>{(fullPatient || patient).date_of_birth || "—"}</p></div>
              <div><strong>Birthplace:</strong><p>{(fullPatient || patient).birthplace || "—"}</p></div>

              <div><strong>Marital Status:</strong><p>{(fullPatient || patient).marital_status || "—"}</p></div>
              <div><strong>Blood Type:</strong><p>{(fullPatient || patient).blood_type || "—"}</p></div>

              <div><strong>Contact Number:</strong><p>{(fullPatient || patient).contact_number || "—"}</p></div>
              <div><strong>Education Level:</strong><p>{(fullPatient || patient).education_level || "—"}</p></div>

              <div><strong>Employment Status:</strong><p>{(fullPatient || patient).employment_status || "—"}</p></div>
              <div><strong>Mother's Name:</strong><p>{(fullPatient || patient).mother_name || "—"}</p></div>

              <div><strong>Spouse Name:</strong><p>{(fullPatient || patient).spouse_name || "—"}</p></div>
              <div><strong>PhilHealth Member:</strong><p>{(fullPatient || patient).philhealth_member || "—"}</p></div>

              <div><strong>PhilHealth Number:</strong><p>{(fullPatient || patient).philhealth_no || "—"}</p></div>
              <div><strong>PhilHealth Category:</strong><p>{(fullPatient || patient).philhealth_category || "—"}</p></div>

              <div><strong>4Ps Member:</strong><p>{(fullPatient || patient).member_4ps || "—"}</p></div>
              <div><strong>DSWD NHTS:</strong><p>{(fullPatient || patient).dswd_nhts || "—"}</p></div>

              <div><strong>Region:</strong><p>{(fullPatient || patient).region || "—"}</p></div>
              <div><strong>Province:</strong><p>{(fullPatient || patient).province || "—"}</p></div>

              <div><strong>City / Municipality:</strong><p>{(fullPatient || patient).city_municipality || "—"}</p></div>
              <div><strong>Street:</strong><p>{(fullPatient || patient).street || "—"}</p></div>

            </div>

          </div>
        )}

        {/* ================= FAMILY MEMBERS ================= */}
        {showFamily && (
          <>
            <hr />
            <h4>Household / Family Members</h4>

            {loading ? (
              <p>Loading family members...</p>
            ) : familyMembers.length === 0 ? (
              <p className="muted">No other family members found.</p>
            ) : (
              <table className="family-table">
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>Relation</th>
                    <th>Age</th>
                    <th>Gender</th>
                    <th>Status</th>
                    <th>Action</th>
                  </tr>
                </thead>

                <tbody>
                  {familyMembers.map((m) => (
                    <tr key={m.id}>
                      <td>
                        {`${m.first_name} ${m.middle_name ?? ""} ${m.last_name} ${m.suffix ?? ""}`}
                      </td>
                      <td>{m.family_member_type || "—"}</td>
                      <td>{m.age}</td>
                      <td>{m.gender}</td>
                      <td>
                        <span className={`status-badge status-${m.status}`}>
                          {m.status}
                        </span>
                      </td>
                      <td>
                        <button
                          className="view-btn"
                          onClick={() =>
                            openModal(
                              <ViewPatientModal
                                patient={{
                                  ...m,
                                  name: `${m.first_name} ${m.middle_name ?? ""} ${m.last_name} ${m.suffix ?? ""}`.trim(),
                                }}
                                showFamily={false}
                              />
                            )
                          }
                        >
                          View
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>

              </table>
            )}
          </>
        )}

      </div>

      {/* RIGHT SIDE CONSULTATION HISTORY */}
      <div className="consultation-right">

        <h4>Consultation History</h4>

        {consultLoading ? (
          <p>Loading consultation history...</p>
        ) : consultationHistory.length === 0 ? (
          <p className="muted">No consultation history found.</p>
        ) : (
          <div className="consult-history">
            {consultationHistory.map((consult) => (
              <div key={consult.consultation_id} className="consult-item">
                <div className="consult-date">
                  {consult.visit_date || "—"}
                </div>
                <div className="consult-body">
                  <p>
                    <strong>Doctor:</strong> {consult.doctor_name || "—"}
                  </p>
                  {consult.queue_number && (
                    <p>
                      <strong>Queue #:</strong> {consult.queue_number}
                    </p>
                  )}
                  {consult.purpose_visit && (
                    <p>
                      <strong>Purpose:</strong> {consult.purpose_visit}
                    </p>
                  )}
                  {consult.nature_visit && (
                    <p>
                      <strong>Nature:</strong> {consult.nature_visit}
                    </p>
                  )}
                  {consult.chief_complaint && (
                    <p>
                      <strong>Chief Complaint:</strong> {consult.chief_complaint}
                    </p>
                  )}
                  {consult.diagnosis && (
                    <p>
                      <strong>Diagnosis:</strong> {consult.diagnosis}
                    </p>
                  )}
                  {consult.treatment && (
                    <p>
                      <strong>Treatment:</strong> {consult.treatment}
                    </p>
                  )}
                  {(consult.systolic_bp || consult.diastolic_bp) && (
                    <p>
                      <strong>BP:</strong> {consult.systolic_bp || "—"}/{consult.diastolic_bp || "—"} mmHg
                    </p>
                  )}
                  {consult.temperature && (
                    <p>
                      <strong>Temp:</strong> {consult.temperature}°C
                    </p>
                  )}
                  {consult.pulse_rate && (
                    <p>
                      <strong>HR:</strong> {consult.pulse_rate} bpm
                    </p>
                  )}
                  <button
                    onClick={() => handlePrintOPD(patient, consult)}
                    className="print-btn"
                    style={{
                      marginTop: "10px",
                      marginRight: "8px",
                      padding: "6px 12px",
                      backgroundColor: "#3498db",
                      color: "white",
                      border: "none",
                      borderRadius: "4px",
                      cursor: "pointer",
                      fontSize: "12px",
                      fontWeight: "600"
                    }}
                  >
                    Print OPD
                  </button>

                  <button
                    onClick={() => handleEditConsultation(consult)}
                    className="update-btn"
                    style={{
                      marginTop: "10px",
                      padding: "6px 12px",
                      backgroundColor: "#f39c12",
                      color: "white",
                      border: "none",
                      borderRadius: "4px",
                      cursor: "pointer",
                      fontSize: "12px",
                      fontWeight: "600"
                    }}
                  >
                    Update
                  </button>

                  <button
                    onClick={() => handleDeleteConsult(consult.consultation_id)}
                    className="delete-btn"
                    disabled={deletingConsultation}
                    style={{
                      marginTop: "10px",
                      marginLeft: "8px",
                      padding: "6px 12px",
                      backgroundColor: "#e74c3c",
                      color: "white",
                      border: "none",
                      borderRadius: "4px",
                      cursor: deletingConsultation ? "not-allowed" : "pointer",
                      fontSize: "12px",
                      fontWeight: "600",
                      opacity: deletingConsultation ? 0.6 : 1
                    }}
                  >
                    {deletingConsultation ? "Deleting..." : "Delete"}
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

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