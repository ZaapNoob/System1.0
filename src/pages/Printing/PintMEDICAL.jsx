import React, { useState, useEffect } from "react";
import "./PrintMedical.css";
import LGULogo from "./logo/LGU LOGO.png";
import MHOLogo from "./logo/MHO - LOGO.jpg";
import { getCertificateDetails } from "../../api/patients";
import { useFormatAddress } from "../../hooks/useFormatAddress";

export default function MedicalCertificate({ patient, mc, onClose }) {
  const [certificateData, setCertificateData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { formatAddress } = useFormatAddress();

  useEffect(() => {
    document.title = "Medical Certificate";

    // Check if certificate ID is in sessionStorage (opened from new tab)
    const certId = sessionStorage.getItem('printCertificateId');

    if (certId && !patient && !mc) {
      // Fetch certificate data from API
      const fetchCertificate = async () => {
        try {
          setLoading(true);
          const response = await getCertificateDetails(certId);
          if (response?.success && response?.data) {
            setCertificateData(response.data);
            setError(null);
            // Clear sessionStorage after loading
            sessionStorage.removeItem('printCertificateId');
          } else {
            setError('Failed to load certificate data');
          }
        } catch (err) {
          console.error('Error fetching certificate:', err);
          setError('Error loading certificate');
        } finally {
          setLoading(false);
        }
      };

      fetchCertificate();
    } else {
      setLoading(false);
    }
  }, [patient, mc]);

  const calculateAge = (dob) => {
    if (!dob) return "";
    const birth = new Date(dob);
    const today = new Date();
    let age = today.getFullYear() - birth.getFullYear();
    const m = today.getMonth() - birth.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birth.getDate())) {
      age--;
    }
    return age;
  };

  const formatLongDate = (date) => {
    return new Date(date).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric"
    });
  };

  return (
    <div>
      {/* Print Toolbar */}
      <div className="print-buttons no-print">
        <button type="button" className="btn btn-secondary" onClick={() => onClose ? onClose() : window.close()}>
          ✕ Close
        </button>
        <button type="button" className="btn" onClick={() => window.print()}>
          🖨️ Print
        </button>
      </div>

      {loading && <div style={{ padding: "20px", textAlign: "center" }}>Loading certificate...</div>}
      {error && <div style={{ padding: "20px", textAlign: "center", color: "red" }}>Error: {error}</div>}

      {(patient || certificateData) && (
        <div className="med-form" style={{ maxWidth: "8.5in", margin: "0 auto", padding: "0.5in" }}>
          {/* Use fetched data if available, otherwise use props */}
          {(() => {
            const patientData = certificateData || patient;
            const mcData = certificateData || mc;

            return (
              <>
                {/* HEADER */}
                <div className="header">
                  <div className="header-inner">
<img src={LGULogo} alt="LGU Logo" className="seal seal-left1" />

                    <div className="header-center">
                      <div className="hospital-name">Rural Health Unit - Gubat</div>
                      <div className="doh-line">MUNICIPAL HEALTH OFFICE</div>

                      <div className="license-line" style={{ fontStyle: "italic" }}>
                        Municipal Compound, Manook St, Pinontingan, Gubat, Sorsogon
                      </div>

                      <div className="license-line" style={{ fontStyle: "italic" }}>
                        <span style={{ color: "#007bff", textDecoration: "underline" }}>
                          health@gubat.gov.ph
                        </span>
                        ; CP Nos: 09496432073; 09455087495
                      </div>

                      <div className="license-line" style={{ fontStyle: "italic" }}>
                        LTO No.: 05-014-2527-PCF-1; PCF - P05032656; MCP - M05003089; TB-DOTS - T05005774
                      </div>
                    </div>

<img src={MHOLogo} alt="MHO Logo" className="seal seal-right1" />                  </div>
                  <div className="header-divider"></div>
                </div>

                {/* BODY */}
                <div className="mc-body" style={{ padding: "20px", lineHeight: 1.8, fontSize: "13px" }}>

                  <h2 style={{
                    textAlign: "center",
                    fontSize: "20px",
                    fontWeight: "bold",
                    marginBottom: "30px",
                    textTransform: "uppercase",
                    letterSpacing: "2px"
                  }}>
                    MEDICAL CERTIFICATE
                  </h2>

                  <p style={{ textAlign: "justify", marginBottom: "20px", lineHeight: 1.6 }}>
                    This is to certify that{" "}
                    <strong>
                      {`${patientData.first_name} ${patientData.middle_name ?? ""} ${patientData.last_name}`.toUpperCase()}
                    </strong>{" "}
                    a <strong>{calculateAge(patientData.date_of_birth)}</strong> year old{" "}
                    <strong>{patientData.gender?.toUpperCase()}</strong>{" "}
                    from <strong>{formatAddress(patientData).toUpperCase()}</strong>{" "}
                    was seen and examined by the undersigned on{" "}
                    <strong>{formatLongDate(mcData.issued_at || new Date())}</strong>.
                  </p>

                  {/* Impression */}
                  <div style={{ marginBottom: "18px" }}>
                    <div style={{ fontWeight: "bold", marginBottom: "6px" }}>Impression:</div>
                    <div style={{ marginLeft: "80px" }}>
                      ➤ {mcData.impression}
                    </div>
                  </div>

                  {/* Remark */}
                  <div style={{ marginBottom: "28px" }}>
                    <div style={{ fontWeight: "bold", marginBottom: "6px" }}>Remark:</div>
                    <div style={{ marginLeft: "80px" }}>
                      ➤ {mcData.remarks}
                    </div>
                  </div>

                  <p style={{ textAlign: "justify", marginBottom: "30px" }}>
                    This certificate is issued on{" "}
                    {formatLongDate(mcData.issued_at || new Date())} upon the interested
                    party's request for whatever purposes it may serve.
                  </p>

                  <div style={{ marginTop: "40px", textAlign: "center" }}>
                    <p style={{ fontWeight: "bold", fontSize: "14px", margin: 0 }}>
                      {patientData.doctor_name}{mcData.doctor_title ? `, ${mcData.doctor_title}` : ""}
                    </p>
                    <p style={{ fontSize: "13px", color: "#333", margin: "2px 0" }}>
                      {mcData.doctor_license && (
                        <>
                          License No. <strong>{mcData.doctor_license}</strong><br />
                        </>
                      )}
                      Rural Health Physician
                    </p>
                  </div>

                </div>
              </>
            );
          })()}
        </div>
      )}
    </div>
  );
}