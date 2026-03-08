import React, { useState, useEffect } from "react";
import "./PrintLaboratory.css";
import LGULogo from "./logo/LGU LOGO.png";
import MHOLogo from "./logo/MHO - LOGO.jpg";
import { getLabRequestDetails } from "../../api/laboratory";
import { usePrintLabUtilities } from "../../hooks/usePrintLabUtilities";
import { useFormatAddress } from "../../hooks/useFormatAddress";

/* =========================
   HEADER COMPONENT
========================= */
const Header = () => {
  return (
    <div className="header">
      <div className="header-inner">
        <img src={LGULogo} alt="LGU Logo" className="seal seal-left" />

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
            LTO No.: 05-014-2527-PCF-1; PCF - P05032656; MCP - M05003089;
            TB-DOTS - T05005774
          </div>
        </div>

        <img src={MHOLogo} alt="MHO Logo" className="seal seal-right" />
      </div>

      <div className="header-divider"></div>
    </div>
  );
};

const PrintLaboratory = () => {
  const [labRequestData, setLabRequestData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const { calculateAge, formatLongDate, onClose } =
    usePrintLabUtilities();

  const { formatAddress } = useFormatAddress();

  useEffect(() => {
    document.title = "Laboratory Request";

    const fetchData = async () => {
      try {
        setLoading(true);

        const labRequestId = sessionStorage.getItem(
          "printLabRequestId"
        );

        if (labRequestId) {
          const response = await getLabRequestDetails(
            labRequestId
          );
          setLabRequestData(response);
          sessionStorage.removeItem("printLabRequestId");
        } else {
          setError("No lab request ID found");
        }
      } catch (err) {
        setError(err.message || "Error loading lab request");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  /* =========================
     CHECKBOX LOGIC
  ========================= */
  const renderCheck = (category, test) => {
    const isChecked = labRequestData?.tests?.some(
      (t) => t.category === category && t.test_name === test
    );
    return (
      <div>
        {isChecked ? "☑" : "☐"} {test}
      </div>
    );
  };

  // Get other value for a specific category
  const getOtherValue = (category) => {
    const otherTest = labRequestData?.tests?.find(
      (t) => t.category === category && t.test_name === "Others"
    );
    return otherTest?.other_value || "";
  };

  /* =========================
     FORM CONTENT (REUSABLE)
  ========================= */
  const renderFormContent = () => (
    <>
      <h2 className="form-title">
        LABORATORY REQUEST FORM
      </h2>

      {/* PATIENT INFO */}
      <div className="lab-3col-fixed patient-header">
        <div className="lab-col">
          <div>
            <strong>Name:</strong>{" "}
            {`${labRequestData?.first_name || ""} 
              ${labRequestData?.middle_name || ""} 
              ${labRequestData?.last_name || ""}`.toUpperCase()}
          </div>

          <div>
            <strong>Birthday:</strong>{" "}
            {formatLongDate(
              labRequestData?.date_of_birth
            )}
          </div>
        </div>

        <div className="lab-col">
          <div>
            <strong>Address:</strong>{" "}
            {formatAddress(labRequestData)}
          </div>

          <div>
            <strong>Sex:</strong>{" "}
            {labRequestData?.gender?.toUpperCase()}
          </div>
        </div>

        <div className="lab-col">
          <div>
            <strong>Age:</strong>{" "}
            {calculateAge(
              labRequestData?.date_of_birth
            )}
          </div>

          <div>
            <strong>Date:</strong>{" "}
            {formatLongDate(new Date())}
          </div>
        </div>
      </div>

      {/* LAB TESTS */}
      <div className="section">
        <div className="lab-3col-fixed">
          {/* CHEMISTRY */}
          <div className="lab-col">
            <strong>Chemistry:</strong>
            {renderCheck("Chemistry", "BUN")}
            {renderCheck("Chemistry", "Crea")}
            {renderCheck("Chemistry", "FBS")}
            {renderCheck("Chemistry", "Lipid Profile")}
            {renderCheck("Chemistry", "HbA1c")}
            {renderCheck("Chemistry", "BUA")}
            {renderCheck("Chemistry", "Na")}
            {renderCheck("Chemistry", "K")}
            {renderCheck("Chemistry", "Cl")}
            {renderCheck("Chemistry", "AST/ALT")}
            {renderCheck("Chemistry", "Others")}
            {getOtherValue("Chemistry") && (
              <div style={{ marginLeft: "20px", fontSize: "11px" }}>
                {getOtherValue("Chemistry")}
              </div>
            )}

            <br />
            <strong>Diagnosis:</strong>{" "}
            {labRequestData?.diagnosis || "N/A"}
          </div>

          {/* CARDIOLOGY + BACTERIOLOGY */}
          <div className="lab-col">
            <strong>Cardiology:</strong>
            {renderCheck("Cardiology", "2D Echo")}
            {renderCheck("Cardiology", "ECG")}
            {renderCheck("Cardiology", "Others")}
            {getOtherValue("Cardiology") && (
              <div style={{ marginLeft: "20px", fontSize: "11px" }}>
                {getOtherValue("Cardiology")}
              </div>
            )}

            <br />
            <strong>Bacteriology:</strong>
            {renderCheck("Bacteriology", "Gen Expert")}
            {renderCheck("Bacteriology", "AFB Stain")}
            {renderCheck("Bacteriology", "Others")}
            {getOtherValue("Bacteriology") && (
              <div style={{ marginLeft: "20px", fontSize: "11px" }}>
                {getOtherValue("Bacteriology")}
              </div>
            )}
          </div>

          {/* HEMATOLOGY */}
          <div className="lab-col">
            <strong>Hematology:</strong>
            {renderCheck("Hematology", "CBC")}
            {renderCheck("Hematology", "PC")}
            {renderCheck("Hematology", "Blood Typing")}
            {renderCheck("Hematology", "Others")}
            {getOtherValue("Hematology") && (
              <div style={{ marginLeft: "20px", fontSize: "11px" }}>
                {getOtherValue("Hematology")}
              </div>
            )}

            <br />
            <strong>Urinalysis & Others:</strong>
            {renderCheck("Urinalysis & Others", "Fecalysis")}
            {renderCheck("Urinalysis & Others", "Urinalysis")}
            {renderCheck("Urinalysis & Others", "Covid 19 Test")}
            {renderCheck("Urinalysis & Others", "Others")}
            {getOtherValue("Urinalysis & Others") && (
              <div style={{ marginLeft: "20px", fontSize: "11px" }}>
                {getOtherValue("Urinalysis & Others")}
              </div>
            )}

            <br />
            <strong>X-Ray:</strong>{" "}
            {labRequestData?.xray_findings || ""}

            <br />
            <strong>Ultrasound (UTZ):</strong>{" "}
            {labRequestData?.utz_findings || ""}
          </div>
        </div>
      </div>

      {/* DOCTOR */}
      <div className="doctor">
        <p className="doctor-name">
          {labRequestData?.doctor_name ||
            "Rural Health Physician"}
        </p>
        {labRequestData?.license_no && (
          <p className="doctor-license">Lic. No.: {labRequestData.license_no}</p>
        )}
        <p>
          {labRequestData?.title || "Rural Health Physician"}
        </p>
        <p>Rural Health Unit - Gubat</p>
      </div>
    </>
  );

  /* =========================
     MAIN RETURN
  ========================= */
  return (
    <div>
      {/* Toolbar */}
      <div className="print-buttons no-print">
        <button
          className="btn btn-secondary"
          onClick={onClose}
        >
          ✕ Close
        </button>

        <button
          className="btn"
          onClick={() => window.print()}
        >
          🖨️ Print
        </button>
      </div>

      {loading && (
        <div className="center">
          Loading laboratory request...
        </div>
      )}

      {error && (
        <div className="center error">
          Error: {error}
        </div>
      )}

      {!loading && !error && labRequestData && (
        <div className="print-page">

          {/* COPY 1 */}
          <div className="half-form">
            <div className="med-form">
              <Header />
              <div className="lab-body">
                {renderFormContent()}
              </div>
            </div>
          </div>

          {/* COPY 2 */}
          <div className="half-form">
            <div className="med-form">
              <Header />
              <div className="lab-body">
                {renderFormContent()}
              </div>
            </div>
          </div>

        </div>
      )}
    </div>
  );
};

export default PrintLaboratory;