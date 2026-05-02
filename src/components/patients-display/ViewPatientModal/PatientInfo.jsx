import { useState } from "react";

export default function PatientInfo({ patient, fullPatient }) {
  const [showMore, setShowMore] = useState(false);

  return (
    <>
      <div className="section-title">
        <h4>Patient Information</h4>
      </div>

      {/* BASIC INFO */}
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

      {/* EXPANDED INFO TOGGLE */}
      <div className="more-toggle">
        <button
          className="expand-btn"
          onClick={() => setShowMore(!showMore)}
        >
          {showMore ? "Hide Additional Information" : "Show Additional Information"}
        </button>
      </div>

      {/* EXTENDED INFO */}
      {showMore && (
        <div className="extended-info">
          <h5>Additional Details</h5>

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
    </>
  );
}
