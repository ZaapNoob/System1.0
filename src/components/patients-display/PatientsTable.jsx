import { useModal } from "../modal/ModalProvider";
import ViewPatientModal from "./ViewPatientModal";
import EditPatientModal from "./EditPatientModal";
import { getImageUrl, getGenderBasedAvatar } from "../../utils/image";
import "./PatientsTable.css";




export default function PatientsTable({
  patients,
  loading,
  onAddFamilyMember,
  onRefresh,
}) {
  const { openModal, closeModal } = useModal();

  return (
    <table className="patient-table">
      <thead>
        <tr>
          <th>Image</th>
          <th>Name</th>
          <th>Age</th>
          <th>Gender</th>
          <th>Barangay-Code</th>
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
              <td>
                {patient.profile_image ? (
                  <img src={getImageUrl(patient.profile_image)} alt={patient.name} className="patient-avatar" />
                ) : (
                  <img src={getGenderBasedAvatar(patient.gender)} alt="No image" className="patient-avatar" />
                )}
              </td>
              <td className="patient-name">{patient.name}</td>
              <td className="patient-age">{patient.age}</td>
              <td className="patient-gender">{patient.gender}</td>
              <td className="patient-code">{patient.patient_code || "—"}</td>

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
  className="fancy-btn-small"
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