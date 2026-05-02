import { getGenderBasedAvatar } from "../../../utils/image";

export default function PatientHeader({ patient, displayImageUrl }) {
  return (
    <div className="patient-header">
      <div className="patient-avatar">
        <img
          src={displayImageUrl}
          alt="Patient"
          onLoad={() => console.log("✅ Image loaded successfully")}
          onError={(e) => {
            console.error("❌ Image failed to load from:", e.target.src);
            e.target.src = getGenderBasedAvatar(patient.gender);
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
  );
}
