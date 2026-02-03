import { useModal } from "../modal/ModalProvider";
import ViewPatientModal from "./ViewPatientModal";
import EditPatientModal from "./EditPatientModal";


export default function PatientsTable({
  patients,
  loading,
  getStatusColor,
  formatStatusDisplay,
  onAddFamilyMember,
  onRefresh,
}) {
  const { openModal, closeModal } = useModal();

  return (
    <table className="patient-table">
      <thead>
        <tr>
          <th>Name</th>
          <th>Age</th>
          <th>Gender</th>
          <th>Barangay</th>
          <th>Status</th>
          <th>Action</th>
        </tr>
      </thead>

      <tbody>
        {loading ? (
          <tr>
            <td colSpan="6">Loading patients...</td>
          </tr>
        ) : patients.length === 0 ? (
          <tr>
            <td colSpan="6">No patients found</td>
          </tr>
        ) : (
          patients.map((patient) => (
            <tr key={patient.id}>
              <td>{patient.name}</td>
              <td>{patient.age}</td>
              <td>{patient.gender}</td>
              <td>{patient.barangay_name || "—"}</td>

              <td>
                <span className={`status-badge ${getStatusColor(patient.status)}`}>
                  {formatStatusDisplay(patient.status)}
                </span>
              </td>

              <td>
                <button
                  className="view-btn"
                  onClick={() =>
                    openModal(<ViewPatientModal patient={patient} />)
                  }
                >
                  View
                </button>
<button
  className="edit-btn"
  onClick={() =>
    openModal(
      <EditPatientModal
        patient={patient}
        onSave={() => {
          if (onRefresh) onRefresh();
          closeModal();
        }}
        onClose={closeModal}   
      />
    )
  }
>
  Edit
</button>

                <button
                  className="add-btn"
                  onClick={() => onAddFamilyMember(patient)}
                >
                  Add Family Member
                </button>
              </td>
            </tr>
          ))
        )}
      </tbody>
    </table>
  );
}
