import { useState } from "react";
import { useModal } from "../../modal/ModalProvider";
import ViewPatientModal from "../ViewPatientModal";

export default function FamilyMembers({ patient, familyMembers, loading }) {
  const { openModal } = useModal();
  const [expanded, setExpanded] = useState(true);

  if (!familyMembers || familyMembers.length === 0) {
    return (
      <div className="section-container">
        <button 
          className="section-toggle"
          onClick={() => setExpanded(!expanded)}
        >
          <span className={`toggle-icon ${expanded ? 'open' : 'closed'}`}>▼</span>
          <h4>Household / Family Members</h4>
          <span className="member-count">{familyMembers?.length || 0}</span>
        </button>
        {expanded && (
          <p className="muted">No other family members found.</p>
        )}
      </div>
    );
  }

  return (
    <div className="section-container">
      <button 
        className="section-toggle"
        onClick={() => setExpanded(!expanded)}
      >
        <span className={`toggle-icon ${expanded ? 'open' : 'closed'}`}>▼</span>
        <h4>Household / Family Members</h4>
        <span className="member-count">{familyMembers.length}</span>
      </button>

      {expanded && (
        <div className="section-content">
          {loading ? (
            <p>Loading family members...</p>
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
        </div>
      )}
    </div>
  );
}
