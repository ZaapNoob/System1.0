export default function PatientsTable({
  patients,
  loading,
  getStatusColor,
  formatStatusDisplay,
}) {
  return (
    <table className="patient-table">
      <thead>
        <tr>
          <th>Name</th>
          <th>Age</th>
          <th>Gender</th>
          <th>Status</th>
          <th>Action</th>
        </tr>
      </thead>

      <tbody>
        {loading ? (
          <tr>
            <td colSpan="5">Loading patients...</td>
          </tr>
        ) : patients.length === 0 ? (
          <tr>
            <td colSpan="5">No patients found</td>
          </tr>
        ) : (
          patients.map((patient) => (
            <tr key={patient.id}>
              <td>{patient.name}</td>
              <td>{patient.age}</td>
              <td>{patient.gender}</td>
              <td>
                <span
                  className={`status-badge ${getStatusColor(
                    patient.status
                  )}`}
                >
                  {formatStatusDisplay(patient.status)}
                </span>
              </td>
              <td>
                <button className="view-btn">View</button>
                <button className="view-btn">Edit</button>
              </td>
            </tr>
          ))
        )}
      </tbody>
    </table>
  );
}
