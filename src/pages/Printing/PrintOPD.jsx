import { useEffect, useState } from "react";
import "./PrintOPD.css";
import LGULogo from "./logo/LGU LOGO.png";
import MHOLogo from "./logo/MHO - LOGO.jpg";
import { usePrintAndClose } from "../../hooks/usePrintAndClose";
import { useDoctors } from "../../hooks/useDoctors";
import { useDoctorSelection } from "../../hooks/useDoctorSelection";
import { formatDate, formatTime } from "../../utils/dateFormatter";

export default function PrintOPD() {
  const [isOpen, setIsOpen] = useState(false);
  const [patient, setPatient] = useState(null);
  const [record, setRecord] = useState(null);
  const { doctors } = useDoctors();
  const { selectedDoctor, handleDoctorSelect } = useDoctorSelection(doctors);

  useEffect(() => {
    document.title = "OPD Record";

    const stored = sessionStorage.getItem("printPatient");

    if (stored) {
      const data = JSON.parse(stored);
      setPatient(data);

      // Build record object (same structure as your PHP)
      setRecord({
        visitDate: data.queue_date || "",
        createdAt: data.created_at || "",
        height: data.height || "",
        weight: data.weight || "",
        temperature: data.temperature || "",
        pulse: data.heart_rate || "",
        bpSystolic: data.systolic_bp || "",
        bpDiastolic: data.diastolic_bp || "",
        respiratoryRate: data.respiratory_rate || "",
        oxygenSaturation: data.oxygen_saturation || "",
        complaint: data.complaint || "",
        history: data.history || "",
        diagnosis: data.diagnosis || "",
        treatment: data.treatment || "",
        // ✅ Load consulting doctor from multiple possible field names
        attending_physician: data.attending_physician || data.attending_physician_name || data.doctor_name || "",
        license_no: data.license_no || "",
        title: data.title || ""
      });
    }
  }, []);

  // ✅ Auto-print when patient data loads (only if autoprint flag is true)
  useEffect(() => {
    if (patient && patient.autoprint !== false) {
      setTimeout(() => {
        window.print();
      }, 500);
    }
  }, [patient]);

  if (!patient) return <p>Loading...</p>;

  const { handlePrintAndClose } = usePrintAndClose();

  return (
    <>
    <div className={`top-control-card ${isOpen ? "open" : "closed"}`}>
  
  {/* Arrow Toggle Button */}
  <button
    className="toggle-button"
    onClick={() => setIsOpen(!isOpen)}
  >
    {isOpen ? "▲" : "▼"}
  </button>

  {/* Collapsible Content */}
  <div className="top-control-content">
    <button
      onClick={handlePrintAndClose}
      className="print-close-button"
    >
      Print & Close
    </button>

    {!record?.attending_physician ? (
      <div className="doctor-selector">
        <label htmlFor="doctor-select">
          Select Doctor
        </label>
        <select
          id="doctor-select"
          value={selectedDoctor}
          onChange={(e) => handleDoctorSelect(e, setRecord)}
          className="doctor-dropdown"
        >
          <option value="">-- Select a Doctor --</option>
          {doctors.map((doctor) => (
            <option key={doctor.id} value={doctor.id}>
              {doctor.name || doctor.full_name || "N/A"}
            </option>
          ))}
        </select>
      </div>
    ) : (
      <div className="doctor-info" style={{ color: "#27ae60", fontWeight: "bold" }}>
        ✅ Consulting Doctor: {record?.attending_physician}
      </div>
    )}
  </div>
</div>
      
      <div className="print-page1">
      <div className="opd-form">

        {/* ================= HEADER ================= */}
        <div className="header1">
          <div className="header-inner1">
            <img src={LGULogo} alt="LGU" className="seal1" />

            <div className="header-center">
              <div className="republic-line">MUNICIPALITY OF GUBAT</div>
              <div className="doh-line">PROVINCE OF SORSOGON</div>
              <div className="hospital-name">GUBAT HEALTH OFFICE</div>
              <div className="license-line">
                LTO No.: 05-014-2527-PCF-1; PCF - P05032656; MCP - M05003089; TB-DOTS - T05005774
              </div>
            </div>

            <img src={MHOLogo} alt="MHO" className="seal1" />
          </div>
        </div>

      <div className="top-grid">
  {/* LEFT - DATE & TIME */}
  <div className="info-box date-box">
    <strong>DATE AND TIME OF VISIT:</strong>
    <div><strong>Date:</strong> {formatDate(record?.createdAt) || "________"}</div>
    <div><strong>Time:</strong> {formatTime(record?.createdAt) || "________"}</div>
  </div>

  {/* MIDDLE - RECORD NUMBERS */}
  <div className="info-box">

    <div className="record-field">
      <strong>OLD HEALTH RECORD NO.:</strong>
      <span className="record-underline">
        {patient?.old_health_record_no || ""}
      </span>
    </div>

    <div className="record-field" style={{ marginTop: "8px" }}>
      <strong>HEALTH RECORDS NUMBER:</strong>
      <span className="record-underline">
        {patient?.id || ""}
      </span>
    </div>

  </div>

  {/* RIGHT - SERVICE */}
  <div className="info-box">

    <div className="record-field">
      <strong>TYPE OF SERVICE:</strong>
      <span style={{ marginLeft: "5px" }}>Primary</span>
    </div>

    <div className="record-field" style={{ marginTop: "8px" }}>
      <strong>FOLDER NO:</strong>
      <span className="record-underline">
        {patient?.patient_code || ""}
      </span>
    </div>

  </div>
</div>
        {/* ================= TITLE ================= */}
        <div className="opd-title">OPD RECORD</div>

        {/* ================= PATIENT INFO ================= */}
<div className="patient-section">
  
  {/* NAME ROW */}
  <div className="row name-row">
    <div className="label">PATIENT'S NAME:</div>

    <div className="name-group">
      <div className="name-field">
        <div className="line">{patient?.last_name || "IIU"}</div>
        <div className="sub-label">LAST</div>
      </div>

      <div className="name-field">
        <div className="line">{patient?.first_name || "HK"}</div>
        <div className="sub-label">FIRST</div>
      </div>

      <div className="name-field">
                <div className="line">{patient?.middle_name || ""}</div>

        <div className="sub-label">MIDDLE</div>
      </div>

      <div className="name-field">
        <div className="line">{patient?.suffix || ""}</div>
        <div className="sub-label">SUFFIX</div>
      </div>
    </div>
  </div>

  {/* ADDRESS */}
  <div className="row">
    <div className="label">ADDRESS:</div>
    <div className="line full address-field">
      {patient?.is_special === 1 ? (
        // Outside Gubat format: street, barangay_name, city_municipality, province, Philippines
        `${patient?.street || ""}, ${patient?.barangay_name || ""}, ${patient?.city_municipality || ""}, ${patient?.province || ""}, Philippines`.trim().replace(/^,+|,+$/g, '')
      ) : (
        // Gubat format: purok, barangay, municipality, province, province
        `${patient?.purok_name ? patient.purok_name + ', ' : ''}${patient?.barangay_name_db || 'Gubat'}, Gubat, Sorsogon, Sorsogon`
      )}
    </div>
  </div>

  {/* AGE | SEX | STATUS | BIRTHDATE */}
  <div className="row four-cols">
    <div className="field">
    <div><span className="label-inline">AGE:</span> <span className="line small">{patient?.age || "24 Yrs 0 Mths 6d"}</span></div>
    <div><span className="label-inline">SEX:</span> <span className="line small">{patient?.gender || "Female"}</span></div>
    <div><span className="label-inline">STATUS:</span> <span className="line small">{patient?.marital_status || "Single"}</span></div>
<span className="label-inline">BIRTHDATE:</span> 
      <span className="line small">
        {patient?.date_of_birth 
          ? new Date(patient.date_of_birth).toLocaleDateString("en-US", {
              month: "long",
              day: "numeric",
              year: "numeric",
            })
          : "February 22, 2002"
        }
      </span> </div>
  </div>

  {/* RELIGION | NATIONALITY | CONTACT */}
  <div className="row three-cols">
    <div><span className="label-inline">RELIGION:</span> <span className="line small">{patient?.religion || ""}</span></div>
    <div><span className="label-inline">NATIONALITY:</span> <span className="line small">{patient?.nationality || "Filipino"}</span></div>
    <div><span className="label-inline">CONTACT NO.:</span> <span className="line small">{patient?.contact_number || ""}</span></div>
  </div>

  {/* OCCUPATION | COMPANY */}
  <div className="row two-cols">
    <div><span className="label-inline">OCCUPATION:</span> <span className="line medium">{patient?.occupation || ""}</span></div>
    <div><span className="label-inline">COMPANY:</span> <span className="line medium">{patient?.company || ""}</span></div>
  </div>

  {/* INFORMANT */}
  <div className="row two-cols">
    <div><span className="label-inline">INFORMANT:</span> <span className="line medium">{patient?.informant || ""}</span></div>
    <div><span className="label-inline">CONTACT NO.:</span> <span className="line medium">{patient?.informant_contact || ""}</span></div>
  </div>

  {/* REFERRAL */}
  <div className="row">
    <div className="label">REFERRAL:</div>
    <div className="line full">{patient?.referral || ""}</div>
  </div>

</div>
{/* ================= DOCTOR CONSULTATION ================= */}

    {/* Consulting Doctor Section */}
    <div className="doctor-section">

        <div className="signature-area">
            <div className="signature-line"></div>

            <div className="doctor-name">
                {record?.attending_physician
                    ? record.attending_physician.toUpperCase()
                    : ""}
                    
            </div>

            <div className="doctor-title">
                (Consulting Doctor)
            </div>

         
        </div>

    </div>


        {/* ================= VITAL SIGNS ================= */}

<div className="case-summary">

  <div className="case-summary-title">
    PATIENT'S CASE SUMMARY
  </div>

  {/* ================= VITAL SIGNS ================= */}
  <div className="vitals-rows">

    {/* Row 1 */}
    <div className="vitals-row">
      <div className="vitals-section-title">VITAL SIGNS</div>

      <div className="vital-field">
        <span className="vital-label">HEIGHT (cm):</span>
        <span className="vital-underline">
          {record?.height}
        </span>
      </div>

      <div className="vital-field">
        <span className="vital-label">WEIGHT:</span>
        <span className="vital-underline">
          {record?.weight}
        </span>
      </div>

      <div className="vital-field">
        <span className="vital-label">TEMPERATURE:</span>
        <span className="vital-underline">
          {record?.temperature}
        </span>
      </div>
    </div>

    {/* Row 2 */}
    <div className="vitals-row">
      <div></div>

      <div className="vital-field">
        <span className="vital-label">PULSE (bpm):</span>
        <span className="vital-underline">
          {record?.pulse}
        </span>
      </div>

      <div className="vital-field">
        <span className="vital-label">BP SYS/DIA:</span>
        <span className="vital-underline">
          {record?.bpSystolic}/{record?.bpDiastolic}
        </span>
      </div>

      <div className="vital-field">
        <span className="vital-label">RR (cpm):</span>
        <span className="vital-underline">
          {record?.respiratoryRate}
        </span>
      </div>
    </div>

    {/* Row 3 */}
    <div className="vitals-row">
      <div></div>

      <div className="vital-field">
        <span className="vital-label">OXYGEN SATURATION (%):</span>
        <span className="vital-underline">
          {record?.oxygenSaturation}
        </span>
      </div>

    </div>

  </div>

  {/* ================= CHIEF COMPLAINT ================= */}
  <div className="chief-complaint-wrapper">

  <div className="chief-complaint-row">
    <strong>CHIEF COMPLAINT:</strong>

    <div className="chief-complaint-value">
      {record?.complaint}
    </div>
  </div>

</div>

</div>

        {/* ================= CLINICAL ================= */}


      <div className="clinical-section">

  <div className="clinical-content-grid">

    {/* PRESENT ILLNESS */}
    <div className="clinical-subsection">
      <div className="clinical-title">PRESENT ILLNESS:</div>

      <div className="clinical-content">
        {record?.history}
      </div>
    </div>

    {/* DIAGNOSIS */}
    <div className="clinical-subsection">
      <div className="clinical-title">DIAGNOSIS:</div>

      <div className="clinical-content">
        {record?.diagnosis}
      </div>
    </div>

    {/* TREATMENT */}
    <div className="clinical-subsection">
      <div className="clinical-title">TREATMENT:</div>

      <div className="clinical-content">
        {record?.treatment}
      </div>
    </div>

  </div>

</div>




<div className="disposition-grid">
{/* ================= LEFT COLUMN ================= */}
<div className="disposition-section">

  {/* DISCHARGED BOX */}
  <div className="disposition-info-box">

    <div className="disposition-info-title">
      DATE AND TIME DISCHARGED IN OPD
    </div>

    <div className="inline-row">
      <strong>Date:</strong>
      <span className="inline-underline">
        {record?.dischargeDate}
      </span>
    </div>

    <div className="inline-row">
      <strong>Time:</strong>
      <span className="inline-underline">
        {record?.dischargeTime}
      </span>
    </div>

  </div>

  {/* DIED BOX */}
  <div className="disposition-info-box">

    <div className="disposition-info-title">
      DATE AND TIME DIED IN OPD
    </div>

    <div className="inline-row">
      <strong>Date:</strong>
      <span className="inline-underline">
        {record?.deathDate}
      </span>
    </div>

    <div className="inline-row">
      <strong>Time:</strong>
      <span className="inline-underline">
        {record?.deathTime}
      </span>
    </div>

  </div>

</div>

  {/* ================= RIGHT COLUMN ================= */}
  <div className="disposition-section">

    <div className="section-title">
      DISPOSITION
    </div>

    <div className="disposition-options">

      <div className="disp-row">
        <label>
          <span className="checkbox"></span>
          Treated and Sent Home
        </label>

        <label>
          <span className="checkbox"></span>
          Referred Admission
        </label>
      </div>

      <div className="disp-row">
        <label>
          <span className="checkbox"></span>
          For Admission
        </label>

        <label>
          <span className="checkbox"></span>
          Referred
        </label>
      </div>

    </div>

  </div>

</div>

      </div>
    </div>
    </>
  );
}