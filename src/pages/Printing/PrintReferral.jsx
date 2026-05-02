import React, { useState, useEffect } from "react";
import "./PrintReferral.css";
import { useFormatAddress } from "../../hooks/useFormatAddress";
import LGULogo from "./logo/LGU LOGO.png";
import MHOLogo from "./logo/MHO - LOGO.jpg";

export default function PrintReferral() {
  const { formatAddress } = useFormatAddress();
  const [referralData, setReferralData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [doctorName, setDoctorName] = useState("");
  const [doctorLicense, setDoctorLicense] = useState("");
  const [doctorTitle, setDoctorTitle] = useState("");

  useEffect(() => {
    document.title = "Referral Form";

    // Check if referral data is in localStorage (works across tabs)
    const storedData = localStorage.getItem('printReferralData');
    console.log("📦 Raw stored data:", storedData);
    
    // Also clear data after reading (prevent stale data on refresh)
    setTimeout(() => {
      localStorage.removeItem('printReferralData');
    }, 500);

    if (storedData) {
      try {
        const data = JSON.parse(storedData);
        console.log("✅ Successfully parsed referral data:", data);
        console.log("📋 Referral object:", data.referral);
        console.log("🆔 Doctor ID:", data.referral?.doctor_id);
        setReferralData(data);
        setError(null);

        // Fetch doctor info by doctor_id if available
        if (data.referral?.doctor_id) {
          console.log("🔍 Fetching doctor info for doctor_id:", data.referral.doctor_id);
          console.log("🌐 API URL:", `/api/Doctor/list.php?id=${data.referral.doctor_id}`);
          
          fetch(`/api/Doctor/list.php?id=${data.referral.doctor_id}`)
            .then(res => {
              console.log("📡 API Response status:", res.status, res.statusText);
              if (!res.ok) {
                console.warn("⚠️ API returned non-ok status:", res.status);
              }
              return res.text().then(text => {
                console.log("📨 Raw API Response text:", text);
                try {
                  return JSON.parse(text);
                } catch (e) {
                  console.error("❌ Failed to parse JSON:", e);
                  throw new Error("Invalid JSON response");
                }
              });
            })
            .then(doctorData => {
              console.log("📨 Doctor API parsed response:", doctorData);
              console.log("📨 Doctor API data array:", doctorData.data);
              console.log("📨 Doctor API success:", doctorData.success);
              
              if (!doctorData.success) {
                console.warn("⚠️ API returned success=false:", doctorData);
                return;
              }
              
              if (!doctorData.data) {
                console.warn("⚠️ No data in API response");
                return;
              }

              const doctorInfo = Array.isArray(doctorData.data) ? doctorData.data[0] : doctorData.data;
              console.log("👤 Doctor info object:", doctorInfo);
              console.log("👤 Doctor name field:", doctorInfo?.name);
              console.log("👤 All doctor fields:", Object.keys(doctorInfo || {}));
              
              if (doctorInfo?.name) {
                setDoctorName(doctorInfo.name);
                console.log("✅ DOCTOR NAME SET TO:", doctorInfo.name);
              } else {
                console.warn("⚠️ Doctor object exists but has no name. Fields:", Object.keys(doctorInfo || {}));
              }

              // Extract license number
              if (doctorInfo?.license_no) {
                setDoctorLicense(doctorInfo.license_no);
                console.log("✅ DOCTOR LICENSE SET TO:", doctorInfo.license_no);
              } else {
                console.warn("⚠️ No license_no found");
              }

              // Extract title
              if (doctorInfo?.title) {
                setDoctorTitle(doctorInfo.title);
                console.log("✅ DOCTOR TITLE SET TO:", doctorInfo.title);
              } else {
                console.warn("⚠️ No title found");
              }
            })
            .catch(err => {
              console.error("❌ Failed to fetch doctor info:", err);
              console.error("❌ Error message:", err.message);
              console.error("❌ Error stack:", err.stack);
            });
        } else {
          console.warn("⚠️ No doctor_id found in referral. Doctor ID value:", data.referral?.doctor_id);
        }
      } catch (err) {
        console.error('❌ Error parsing referral data:', err);
        setError('Error loading referral data');
      }
    } else {
      console.warn("⚠️ No referral data found in localStorage");
      setError('No referral data found');
    }

    setLoading(false);
  }, []);

  const handlePrint = () => {
    window.print();
  };

  const handleClose = () => {
    window.close();
  };

  if (loading) {
    return <div style={{ padding: "20px", textAlign: "center" }}>Loading referral form...</div>;
  }

  if (error) {
    return <div style={{ padding: "20px", textAlign: "center", color: "red" }}>Error: {error}</div>;
  }

  if (!referralData) {
    return <div style={{ padding: "20px", textAlign: "center", color: "red" }}>No referral data available</div>;
  }

  const patient = referralData.patient || {};
  const referral = referralData.referral || {};

  // Diagnostic logging for data flow
  console.log("👥 Patient object keys:", Object.keys(patient));
  console.log("� Patient FULL object:", patient);
  console.log("📋 Referral object keys:", Object.keys(referral));
  console.log("📋 Referral FULL object:", referral);
  console.log("📋 Receiving facility:", referral.receiving_facility);
  console.log("📋 Receiving personnel:", referral.receiving_personnel);
  console.log("📋 Treatment field values - treatment:", referral.treatment, "treatment_given:", referral.treatment_given);
  console.log("👥 Patient fields - date_of_birth:", patient.date_of_birth, "gender:", patient.gender, "age:", patient.age);
  console.log("👥 Patient ADDRESS fields - title case:", patient.street, patient.barangay_name, patient.city_municipality, patient.province);

  // Parse referral_reasons from reason_for_referral_2 if it's a JSON string
  let referralReasons = [];
  if (referral.reason_for_referral_2) {
    try {
      if (typeof referral.reason_for_referral_2 === 'string') {
        referralReasons = JSON.parse(referral.reason_for_referral_2);
        console.log("✅ Parsed reason_for_referral_2 as JSON:", referralReasons);
      } else if (Array.isArray(referral.reason_for_referral_2)) {
        referralReasons = referral.reason_for_referral_2;
        console.log("✅ reason_for_referral_2 is already an array:", referralReasons);
      }
    } catch (e) {
      console.warn("⚠️ Failed to parse reason_for_referral_2:", referral.reason_for_referral_2, "Error:", e);
      referralReasons = [];
    }
  } else {
    console.warn("⚠️ No reason_for_referral_2 found in referral object");
  }
  
  // Also check for referral_reasons if it already exists
  if (!referralReasons || referralReasons.length === 0) {
    if (Array.isArray(referral.referral_reasons)) {
      referralReasons = referral.referral_reasons;
      console.log("✅ Using referral_reasons array:", referralReasons);
    } else {
      console.log("⚠️ No referral reasons found anywhere");
    }
  }

  console.log("📋 Final parsed referral reasons:", referralReasons);
  console.log("📋 Full referral object keys:", Object.keys(referral));

  return (
    <div>
      {/* Print Toolbar */}
      <div className="print-buttons no-print">
        <button type="button" className="btn btn-secondary" onClick={handleClose}>
          ✕ Close
        </button>
        <button type="button" className="btn" onClick={handlePrint}>
          🖨️ Print
        </button>
      </div>

      {/* Referral Form */}
      <div className="referral-form">
        {/* HEADER */}
        <div className="ref-header">
          <div className="ref-header-content">
            <div className="ref-seal-left">
              <img src={LGULogo} alt="LGU Logo" className="ref-logo" />
            </div>

            <div className="ref-header-center">
              <h1>Uniform Referral Form</h1>
              <h2>GUBAT RURAL HEALTH UNIT</h2>
              <h3>Referral Form</h3>
            </div>

            <div className="ref-seal-right">
              <img src={MHOLogo} alt="MHO Logo" className="ref-logo" />
            </div>
          </div>
          <hr className="ref-header-divider" />
        </div>

        {/* BODY */}
        <div className="ref-body">

          {/* INITIATING FACILITY */}
          <div className="ref-section">
            <div className="ref-row">
              <div className="ref-label-bold">Name of Initiating Facility:</div>
              <div className="ref-value-bold">Gubat Rural Health Unit</div>
            </div>
            <div className="ref-row">
              <div className="ref-label-bold">Address:</div>
              <div className="ref-value-bold">Manook (pob.), Gubat, Sorsogon</div>
            </div>
            <div className="ref-row-inline">
              <div className="ref-col-half">
                <div className="ref-label-bold">Date of Referral:</div>
                <div className="ref-value-bold">{referral.date_referred || new Date().toLocaleDateString()}</div>
              </div>
              <div className="ref-col-half">
                <div className="ref-label-bold">Time Called:</div>
                <div className="ref-value-bold">{referral.time_called || ''}</div>
              </div>
            </div>
          </div>

          <hr className="ref-divider" />

          {/* RECEIVING FACILITY */}
          <div className="ref-section">
            <div className="ref-row">
              <div className="ref-label-bold">Name of Receiving Facility:</div>
              <div className="ref-value-bold">{referral.receiving_facility || referral.facility || ''}</div>
            </div>
            <div className="ref-row">
              <div className="ref-label-bold">Address:</div>
              <div className="ref-value-bold"></div>
            </div>
            <div className="ref-row-inline">
              <div className="ref-col-half">
                <div className="ref-label-bold">Receiving Personnel:</div>
                <div className="ref-value-bold">{referral.receiving_personnel || ''}</div>
              </div>
              <div className="ref-col-half">
                <div className="ref-label-bold">Response:</div>
                <div className="ref-value-bold">ACCEPTED</div>
              </div>
            </div>
          </div>

          <hr className="ref-divider" />

          {/* REFERRAL CATEGORY */}
          <div className="ref-section">
            <div className="ref-row">
              <div className="ref-label-bold">Referral Category</div>
              <div className="ref-checkboxes">
                <span className="ref-checkbox">[{referral.referral_category === 'Emergency' ? ' ✓' : '  '} ] Emergency</span>
                <span className="ref-checkbox">[{referral.referral_category === 'Outpatient' ? ' ✓' : '  '} ] Outpatient</span>
              </div>
            </div>
          </div>

          <hr className="ref-divider" />

          {/* CLINICAL INFORMATION */}
          <div className="ref-section">
            <div className="ref-row">
              <div className="ref-label-bold">Working Impression / Diagnosis</div>
              <div className="ref-value">{referral.diagnosis || referral.reason || 'Clinically Diagnosed DSTB'}</div>
            </div>

            <div className="ref-row" style={{ marginTop: "12px" }}>
              <div className="ref-label-bold">Chief Complaint</div>
              <div className="ref-value">{referral.chief_complaint || referral.reason_details || '—'}</div>
            </div>

            <div className="ref-row" style={{ marginTop: "12px" }}>
              <div className="ref-label-bold">Patient Illness History</div>
              <div className="ref-value">{referral.patient_illness || '—'}</div>
            </div>

            <div className="ref-row" style={{ marginTop: "12px" }}>
              <div className="ref-label-bold">Reason for Referral</div>
              <div className="ref-checklist">
                {referralReasons && referralReasons.length > 0 ? (
                  <>
                    {['Diagnostics', 'No Available Doctor', 'No Equipment Available', 'No Laboratory Available', 'No Treatment/Procedure Available', 'No Room Available', 'Seek Advice/Second Opinion', 'Seek Further Treatment Appropriate to the Case', 'Seek Specialized Evaluation/Consultation'].map((reason, idx) => (
                      <div key={idx} className="ref-check-item">
                        [{referralReasons.includes(reason) ? ' ✓' : '  '} ] {reason}
                      </div>
                    ))}
                  </>
                ) : (
                  <>
                    <div className="ref-check-item">[ ] Diagnostics</div>
                    <div className="ref-check-item">[ ] No available doctor</div>
                    <div className="ref-check-item">[ ] No equipment available</div>
                    <div className="ref-check-item">[ ] No laboratory available</div>
                    <div className="ref-check-item">[ ] No Treatment/Procedure available</div>
                    <div className="ref-check-item">[ ] No room available</div>
                    <div className="ref-check-item">[ ] Seek advise/second opinion</div>
                    <div className="ref-check-item">[ ] Seek further treatment appropriate to the case</div>
                    <div className="ref-check-item">[ ] Seek specialized Evaluation/Consultation</div>
                  </>
                )}
              </div>
            </div>
          </div>

          <hr className="ref-divider" />

          {/* PATIENT INFORMATION */}
          <div className="ref-section">
            <div className="ref-row">
              <div className="ref-label-bold">Name of Patient:</div>
              <div className="ref-value-bold">
                {patient.name || `${patient.first_name || ''} ${patient.last_name || ''}`}
              </div>
            </div>
            <div className="ref-row">
              <div className="ref-label-bold">Identity Number:</div>
              <div className="ref-value-bold">{referral.identity_number_manual || patient.id || patient.patient_id || ''}</div>
            </div>

            <div className="ref-row-inline">
              <div className="ref-col-third">
                <div className="ref-label-bold">Age:</div>
                <div className="ref-value-bold">
                  {(() => {
                    const age = patient.age || calculateAge(patient.date_of_birth) || 'N/A';
                    console.log("📊 Age display - patient.age:", patient.age, "calculated:", calculateAge(patient.date_of_birth), "final:", age);
                    return age;
                  })()}
                </div>
              </div>
              <div className="ref-col-third">
                <div className="ref-label-bold">Sex:</div>
                <div className="ref-value-bold">
                  {(() => {
                    const genderLower = patient.gender?.toString().toLowerCase();
                    const isMale = genderLower === 'male' || genderLower === 'm';
                    const isFemale = genderLower === 'female' || genderLower === 'f';
                    console.log("👥 Gender display - patient.gender:", patient.gender, "lowercase:", genderLower, "isMale:", isMale, "isFemale:", isFemale);
                    return (
                      <>
                        [ {isMale ? '✓' : ' '} ] M [ {isFemale ? '✓' : ' '} ] F
                      </>
                    );
                  })()}
                </div>
              </div>
            </div>

            <div className="ref-row">
              <div className="ref-label-bold">Address:</div>
              <div className="ref-value-bold">
                {formatAddress(patient)}
              </div>
            </div>

            <div className="ref-row">
              <div className="ref-label-bold">Chief Complaint:</div>
              <div className="ref-value">{referral.chief_complaint || ''}</div>
            </div>

            <div className="ref-row">
              <div className="ref-label-bold">Clinical History:</div>
              <div className="ref-value">{patient.clinical_history || ''}</div>
            </div>

            <div className="ref-row">
              <div className="ref-label-bold">Findings:</div>
              <div className="ref-value-small">{referral.findings || ''}</div>
            </div>

            <div className="ref-row">
              <div className="ref-label-bold">Treatment Given:</div>
              <div className="ref-value-small">{referral.treatment || referral.treatment_given || ''}</div>
            </div>
          </div>

          <hr className="ref-divider" />

          {/* FOOTER - SIGNATURE */}
          <div className="ref-footer">
            <div className="ref-signature-section">
              <div className="ref-signature-line"></div>
              <div className="ref-signature-label">
                {doctorName || 'Print Name & Signature of Health Professional'}
              </div>
              {doctorLicense && (
                <div className="ref-signature-detail">
                  License Number: {doctorLicense}
                </div>
              )}
              {doctorTitle && (
                <div className="ref-signature-detail">
                  {doctorTitle}
                </div>
              )}
            </div>

            <div className="ref-signature-section">
              <div className="ref-signature-date">{referral.date_referred || new Date().toLocaleDateString()}</div>
              <div className="ref-signature-label">Date and Time</div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}

// Helper function to calculate age
function calculateAge(dob) {
  if (!dob) return "";
  const birth = new Date(dob);
  const today = new Date();
  let age = today.getFullYear() - birth.getFullYear();
  const m = today.getMonth() - birth.getMonth();
  if (m < 0 || (m === 0 && today.getDate() < birth.getDate())) {
    age--;
  }
  return age;
}