import { useEffect, useState } from "react";
import { useModal } from "../modal/ModalProvider";
import API from "../../config/api";
import { apiFetch } from "../../utils/api";
import "./ViewPatientmodal.css";

export default function ViewPatientModal({ patient, showFamily = true }) {
  const { closeModal, openModal } = useModal();
  const [familyMembers, setFamilyMembers] = useState([]);
  const [loading, setLoading] = useState(false);

  // ================= FETCH FAMILY (ONLY IF ALLOWED) =================
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

  if (!patient) return null;

  return (
    <div className="patient-view-modal">
      <h3>
        {showFamily ? "Patient Information" : "Family Member Information"}
      </h3>

      {/* ================= PATIENT INFO ================= */}
      <div className="view-grid">
        <div><strong>Name:</strong><p>{patient.name}</p></div>
        <div><strong>Gender:</strong><p>{patient.gender}</p></div>
        <div><strong>Age:</strong><p>{patient.age}</p></div>
        <div><strong>Barangay:</strong><p>{patient.barangay_name || "—"}</p></div>
        <div><strong>Status:</strong><p>{patient.status}</p></div>
        <div><strong>Patient Code:</strong><p>{patient.patient_code}</p></div>
        <div><strong>Facility No:</strong><p>{patient.facility_household_no}</p></div>
        <div><strong>Household No:</strong><p>{patient.household_no}</p></div>
      </div>

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

      {/* ================= ACTIONS ================= */}
      <div className="modal-actions">
        <button className="cancel-btn" onClick={closeModal}>
          Close
        </button>
      </div>
    </div>
  );
}
