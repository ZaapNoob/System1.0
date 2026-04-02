import { useState, useEffect, useRef } from "react";
import useEditPatient from "../../hooks/useEditPatient";
import Camera from "../Camera";
import { uploadPatientImage } from "../../api/camera";
import { updatePatient } from "../../api/patients";
import { getImageUrl } from "../../utils/image";
import "./EditPatientModal.css";

export default function EditPatientModal({ patient, onClose, onSave }) {
  const [showBasicInfo, setShowBasicInfo] = useState(false);
  const [showCamera, setShowCamera] = useState(false);
  const [capturedImageBlob, setCapturedImageBlob] = useState(null);
  const [newImagePreview, setNewImagePreview] = useState(null);
  const cameraCloseTimeoutRef = useRef(null);

  const {
    formData,
    profileImage,
    barangays,
    selectedBarangayId,
    householdNo,
    facilityHouseholdNo,
    householdType,
    showHouseholdSection,
    searchTerm,
    searchResults,
    loading,
    householdLoading,
    searchLoading,
    initialLoading,
    error,
    successMessage,
    warnings,

    setShowHouseholdSection,
    setLoading,
    setError,
    setSuccessMessage,

    handleInputChange,
    handleHouseholdTypeChange,
    handleBarangayChange,
    searchExistingHouseholdsHandler,
    generateNewHouseholdHandler,
    moveHouseholdHandler,
    submitHandler,
    selectExistingHousehold,
  } = useEditPatient(patient, onSave, onClose);

  // Reset camera and captured image when patient changes
  useEffect(() => {
    setShowCamera(false);
    setCapturedImageBlob(null);
    setNewImagePreview(null);
    
    // Clear any pending timeout to prevent stale closures
    if (cameraCloseTimeoutRef.current) {
      clearTimeout(cameraCloseTimeoutRef.current);
      cameraCloseTimeoutRef.current = null;
    }
    
    console.log("🔄 Reset camera state for new patient");
    
    // Cleanup when component unmounts
    return () => {
      if (cameraCloseTimeoutRef.current) {
        clearTimeout(cameraCloseTimeoutRef.current);
      }
    };
  }, [patient.id]);

  // Handle camera capture - store blob for upload on save
  const handleCaptureImage = (blob) => {
    console.log("📸 Captured image blob:", blob);
    
    // Clear any pending timeout
    if (cameraCloseTimeoutRef.current) {
      clearTimeout(cameraCloseTimeoutRef.current);
    }
    
    setCapturedImageBlob(blob);
    // Create preview URL
    const previewUrl = URL.createObjectURL(blob);
    setNewImagePreview(previewUrl);
    
    // Auto-close camera after brief delay to show capture confirmation
    cameraCloseTimeoutRef.current = setTimeout(() => {
      setShowCamera(false);
      console.log("📷 Camera closed automatically after capture");
    }, 500);
  };

  // Handle image upload on form submit
  const handleUploadNewImage = async () => {
    if (!capturedImageBlob) return null; // No new image

    try {
      console.log("📤 Uploading new patient image...");
      console.log("🗑️ Old image will be deleted: ", profileImage);
      const response = await uploadPatientImage({
        patient_id: patient.id,
        file: capturedImageBlob,
      });

      if (response.success) {
        console.log("✅ Image uploaded successfully");
        console.log("🗑️ Old image has been deleted from server");
        // Clean up
        setCapturedImageBlob(null);
        setNewImagePreview(null);
        return true;
      } else {
        console.error("❌ Upload failed:", response.error);
        alert("Failed to upload image: " + response.error);
        return false;
      }
    } catch (error) {
      console.error("❌ Upload error:", error);
      alert("Error uploading image");
      return false;
    }
  };

  // Wrap original submit handler to handle image upload
  const handleFormSubmit = async (e) => {
    e.preventDefault();
    
    // If new image was captured, upload it first
    if (capturedImageBlob) {
      const uploadSuccess = await handleUploadNewImage();
      if (!uploadSuccess) {
        return; // Stop if upload fails
      }
    }

    // Close camera before submission
    if (showCamera) {
      setShowCamera(false);
      // Give camera time to cleanup before calling submitHandler
      await new Promise(resolve => setTimeout(resolve, 300));
    }

    // Call original submit handler
    await submitHandler(e);
    
    console.log("📷 Camera closed and form submitted");
  };

  // Handle modal close - ensure camera closes
  const handleModalClose = () => {
    // Stop camera first before closing modal
    if (showCamera) {
      setShowCamera(false);
      // Give camera time to cleanup
      setTimeout(() => {
        onClose();
      }, 300);
    } else {
      onClose();
    }
  };

  return (
    <div className="modal-overlay" onClick={handleModalClose}>
      <div
        className="edit-patient-modal"
        onClick={(e) => e.stopPropagation()}
      >
    <div className="modal-header">
  {/* Profile Image from the Database - use fetched profileImage from hook */}
  <div className="patient-image-section">
    {console.log("🖼️ [EditPatientModal] Current profileImage:", profileImage)}
    <div style={{ position: "relative", display: "inline-block" }}>
      {newImagePreview ? (
        // Show newly captured image preview
        <img
          src={newImagePreview}
          alt={`${formData.first_name} ${formData.last_name} (new)`}
          className="patient-image"
          onLoad={() => console.log("✅ [Image] New preview loaded")}
          onError={(e) => console.error("❌ [Image] Failed to load preview:", e)}
        />
      ) : profileImage ? (
        // Show existing image
        <img
          src={getImageUrl(profileImage)}
          alt={`${formData.first_name} ${formData.last_name}`}
          className="patient-image"
          onLoad={() => console.log("✅ [Image] Loaded successfully from:", getImageUrl(profileImage))}
          onError={(e) => console.error("❌ [Image] Failed to load image:", e)}
        />
      ) : (
        <div className="patient-image-placeholder">No Image</div>
      )}
      {/* Camera button overlay */}
      <button
        type="button"
        className="camera-capture-btn"
        onClick={() => setShowCamera(true)}
        title="Capture new photo"
        style={{
          position: "absolute",
          bottom: "0",
          right: "0",
          width: "36px",
          height: "36px",
          borderRadius: "50%",
          backgroundColor: "#2563eb",
          color: "white",
          border: "2px solid white",
          cursor: "pointer",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: "18px",
          boxShadow: "0 2px 8px rgba(0,0,0,0.2)",
        }}
      >
        📷
      </button>
      {capturedImageBlob && (
        <div
          style={{
            position: "absolute",
            top: "5px",
            right: "5px",
            backgroundColor: "#10b981",
            color: "white",
            padding: "4px 8px",
            borderRadius: "4px",
            fontSize: "11px",
            fontWeight: "bold",
          }}
        >
          NEW
        </div>
      )}
    </div>
  </div>

  <div className="patient-info-section">
    <h3>
      Edit Patient:{" "}
      {`${formData.first_name} ${formData.middle_name ?? ""} ${formData.last_name}`.trim()}
    </h3>
    <small>
      Patient Code: <strong>{patient.patient_code}</strong> (unchanged)
    </small>
  </div>
</div>

      <form onSubmit={handleFormSubmit}>
        {error && <div className="alert alert-error">{error}</div>}
        {successMessage && <div className="alert alert-success">{successMessage}</div>}
        {warnings && warnings.length > 0 && (
          <div className="alert alert-warning" style={{ backgroundColor: "#fff3cd", border: "1px solid #ffc107", color: "#856404", padding: "10px", borderRadius: "4px", marginBottom: "10px" }}>
            <strong>⚠️ Warnings:</strong>
            <ul style={{ marginTop: "5px", marginBottom: "0" }}>
              {warnings.map((warning, idx) => (
                <li key={idx} style={{ fontSize: "13px" }}>{warning}</li>
              ))}
            </ul>
            <small style={{ marginTop: "5px", display: "block" }}>Invalid values were set to empty (NULL). Data was saved anyway.</small>
          </div>
        )}

        {initialLoading ? (
          <div style={{ padding: "20px", textAlign: "center" }}>
            <p>Loading patient details...</p>
          </div>
        ) : (
          <>
            {/* ===== HOUSEHOLD MANAGEMENT ===== */}
           <div className="toggle-buttons">
  <button
    type="button"
    onClick={() => setShowHouseholdSection(!showHouseholdSection)}
  >
    {showHouseholdSection ? "− Hide Household" : "+ Manage Household"}
  </button>
  </div>

                              {showHouseholdSection && (
                    <div className="household-section">
                      <div className="household-row">
                        <select
                          value={householdType}
                          onChange={(e) => handleHouseholdTypeChange(e.target.value)}
                        >
                          <option value="existing">Existing Household</option>
                          <option value="new">New Household</option>
                        </select>

                        <select
                          value={selectedBarangayId}
                          onChange={(e) => handleBarangayChange(e.target.value)}
                        >
                          <option value="">Select Barangay</option>
                          {barangays.map((b) => (
                            <option key={b.id} value={b.id}>
                              {b.name}
                            </option>
                          ))}
                        </select>
                      </div>

                      {householdType === "existing" && (
                        <>
                          <input
                            className="household-search"
                            value={searchTerm}
                            onChange={(e) => searchExistingHouseholdsHandler(e.target.value)}
                            placeholder="Search by name, code, HH-xxxx, or FAC-xxxx"
                          />
                          {searchLoading && <small>Searching...</small>}

                          {searchResults.map((h, i) => (
                            <div
                              key={i}
                              className={`household-search-item ${householdNo === h.household_no ? "active" : ""}`}
                              onClick={() => selectExistingHousehold(h)}
                            >
                              HH: {h.household_no} | FAC: {h.facility_household_no}
                            </div>
                          ))}

                          {householdNo && (
                            <div className="selected-household-box">
                              <strong>Selected Household</strong>
                              <p>Household No: {householdNo}</p>
                              <p>Facility No: {facilityHouseholdNo}</p>
                            </div>
                          )}
                        </>
                      )}

                                    {householdType === "new" && (
                    <div className="new-household-box">
                      <input value={householdNo} readOnly />
                      <input value={facilityHouseholdNo} readOnly />

                            <button
            type="button"
            className="household-action-btn"
            onClick={generateNewHouseholdHandler}
            disabled={householdLoading}
          >
            {householdLoading ? "Generating..." : "Generate"}
          </button>
                    </div>
                  )}

                                    <button
                    type="button"
                    className="household-action-btn"
                    onClick={moveHouseholdHandler}
                    disabled={loading}
                  >
                    {loading ? "Moving..." : "Confirm Move"}
                  </button>
                  <div className="section-divider"></div>

                    </div>
                  )}



            {/* ===== ADDITIONAL INFO ===== */}
            <div className="toggle-buttons">
            <button
              type="button"
              onClick={() => setShowBasicInfo(!showBasicInfo)}
            >
              {showBasicInfo ? "− Hide Additional Info" : "+ Additional Info"}
            </button>
            </div>

                                  {showBasicInfo && (
                      <>
   <div className="patient-form-layout">

  {/* ================= LEFT: PERSONAL INFORMATION ================= */}
  <div className="form-panel">
    <h4>Personal Information</h4>

    <div className="form-panel-grid">

      <div className="form-group">
        <label>First Name *</label>
        <input
          name="first_name"
          value={formData.first_name}
          onChange={handleInputChange}
          required
        />
      </div>

      <div className="form-group">
        <label>Middle Name</label>
        <input
          name="middle_name"
          value={formData.middle_name}
          onChange={handleInputChange}
        />
      </div>

      <div className="form-group">
        <label>Last Name *</label>
        <input
          name="last_name"
          value={formData.last_name}
          onChange={handleInputChange}
          required
        />
      </div>

      <div className="form-group">
        <label>Suffix</label>
        <div className="custom-combobox">
          <select
            name="suffix"
            value={formData.suffix}
            onChange={handleInputChange}
          >
            <option value="">None</option>
            <option value="Jr">Jr</option>
            <option value="Sr">Sr</option>
            <option value="I">I</option>
            <option value="II">II</option>
            <option value="III">III</option>
            <option value="IV">IV</option>
            <option value="MD">MD</option>
            <option value="DDS">DDS</option>
            <option value="RN">RN</option>
          </select>
          <span className="arrow">▼</span>
        </div>
      </div>

      <div className="form-group">
        <label>Date of Birth *</label>
        <input
          type="date"
          name="date_of_birth"
          value={formData.date_of_birth}
          onChange={handleInputChange}
          required
        />
      </div>

      <div className="form-group">
        <label>Birthplace</label>
        <input
          name="birthplace"
          value={formData.birthplace}
          onChange={handleInputChange}
        />
      </div>

      <div className="form-group">
        <label>Gender *</label>
        <select
          name="gender"
          value={formData.gender}
          onChange={handleInputChange}
          required
        >
          <option value="">Select Gender</option>
          <option value="Male">Male</option>
          <option value="Female">Female</option>
        </select>
      </div>

      <div className="form-group">
        <label>Marital Status</label>
        <select
          name="marital_status"
          value={formData.marital_status}
          onChange={handleInputChange}
        >
          <option value="">Select Status</option>
          <option value="Single">Single</option>
          <option value="Married">Married</option>
          <option value="Widowed">Widowed</option>
          <option value="Separated">Separated</option>
        </select>
      </div>

      <div className="form-group">
        <label>Blood Type</label>
        <select
          name="blood_type"
          value={formData.blood_type}
          onChange={handleInputChange}
        >
          <option value="">Select Blood Type</option>
          <option value="A+">A+</option>
          <option value="A-">A-</option>
          <option value="B+">B+</option>
          <option value="B-">B-</option>
          <option value="AB+">AB+</option>
          <option value="AB-">AB-</option>
          <option value="O+">O+</option>
          <option value="O-">O-</option>
        </select>
      </div>

      <div className="form-group">
        <label>Mother's Name</label>
        <input
          name="mother_name"
          value={formData.mother_name}
          onChange={handleInputChange}
        />
      </div>

      <div className="form-group">
        <label>Spouse Name</label>
        <input
          name="spouse_name"
          value={formData.spouse_name}
          onChange={handleInputChange}
        />
      </div>

      <div className="form-group full">
        <label>Contact Number</label>
        <input
          name="contact_number"
          value={formData.contact_number}
          onChange={handleInputChange}
        />
      </div>

    </div>
  </div>


  {/* ================= RIGHT: SOCIAL + PHILHEALTH ================= */}
  <div className="form-panel">
    <h4>Social & PhilHealth Information</h4>

    <div className="form-panel-grid">

      <div className="form-group">
        <label>Education Level</label>
        <select
          name="education_level"
          value={formData.education_level}
          onChange={handleInputChange}
        >
          <option value="">Select Education</option>
          <option>No Formal Education</option>
          <option>Elementary</option>
          <option>High School</option>
          <option>Vocational</option>
          <option>College</option>
          <option>Post Graduate</option>
          <option>Unknown</option>
        </select>
      </div>

      <div className="form-group">
        <label>Employment Status</label>
        <select
          name="employment_status"
          value={formData.employment_status}
          onChange={handleInputChange}
        >
          <option value="">Select Status</option>
          <option>Employed</option>
          <option>Unemployed</option>
          <option>Retired</option>
          <option>Others</option>
        </select>
      </div>

      <div className="form-group">
        <label>Patient Status</label>
        <select
          name="status"
          value={formData.status}
          onChange={handleInputChange}
        >
          <option value="active">Active</option>
          <option value="inactive">Inactive</option>
          <option value="deceased">Deceased</option>
        </select>
      </div>

      <div className="form-group">
        <label>Family Member Type</label>
        <select
          name="family_member_type"
          value={formData.family_member_type}
          onChange={handleInputChange}
        >
          <option value="">Select Member</option>
          <option>Father</option>
          <option>Mother</option>
          <option>Daughter</option>
          <option>Son</option>
          <option>Others</option>
        </select>
      </div>

      <div className="form-group">
        <label>DSWD NHTS</label>
        <select
          name="dswd_nhts"
          value={formData.dswd_nhts}
          onChange={handleInputChange}
        >
          <option value="">Select</option>
          <option>Yes</option>
          <option>No</option>
        </select>
      </div>

      <div className="form-group">
        <label>4Ps Member</label>
        <select
          name="member_4ps"
          value={formData.member_4ps}
          onChange={handleInputChange}
        >
          <option value="">Select</option>
          <option>Yes</option>
          <option>No</option>
        </select>
      </div>

      <div className="form-group">
        <label>PCB Member</label>
        <select
          name="pcb_member"
          value={formData.pcb_member}
          onChange={handleInputChange}
        >
          <option value="">Select</option>
          <option>Yes</option>
          <option>No</option>
        </select>
      </div>

      <div className="form-group">
        <label>PhilHealth Member</label>
        <select
          name="philhealth_member"
          value={formData.philhealth_member}
          onChange={handleInputChange}
        >
          <option value="">Select</option>
          <option value="Yes">Yes</option>
          <option value="No">No</option>
        </select>
      </div>

      {formData.philhealth_member === "Yes" && (
        <>

          <div className="form-group">
            <label>PhilHealth Status Type</label>
            <select
              name="philhealth_status_type"
              value={formData.philhealth_status_type}
              onChange={handleInputChange}
              required
            >
              <option value="">Select</option>
              <option value="Member">Member</option>
              <option value="Dependent">Dependent</option>
            </select>
          </div>

          <div className="form-group">
            <label>PhilHealth Number</label>
            <input
              name="philhealth_no"
              value={formData.philhealth_no}
              onChange={handleInputChange}
            />
          </div>

          <div className="form-group full">
            <label>PhilHealth Category</label>
            <select
              name="philhealth_category"
              value={formData.philhealth_category}
              onChange={handleInputChange}
            >
              <option value="None">None</option>
              <option value="FE - Private">FE - Private</option>
              <option value="FE - Government">FE - Government</option>
              <option value="FE - FAMILY DRIVER">FE - Family Driver</option>
              <option value="FE - GOVT - CASUAL">FE - Govt - Casual</option>
              <option value="FE - GOVT - CONTRACT/PROJECT BASED">FE - Govt - Contract/Project Based</option>
              <option value="FE - GOVT - PERMANENT REGULAR">FE - Govt - Permanent Regular</option>
              <option value="FE - HOUSEHOLD HELP/KASAMBAHAY">FE - Household Help/Kasambahay</option>
              <option value="FE - PRIVATE - CASUAL">FE - Private - Casual</option>
              <option value="FE - PRIVATE - CONTRACT/PROJECT BASED">FE - Private - Contract/Project Based</option>
              <option value="FE - PRIVATE - PERMANENT REGULAR">FE - Private - Permanent Regular</option>
              <option value="DIRECT CONTRIBUTOR - PROFESSIONAL PRACTITIONER">Direct Contributor - Professional Practitioner</option>
              <option value="DIRECT CONTRIBUTOR - SELF-EARNING INDIVIDUAL - SOLE PROPRIETOR">Direct Contributor - Self-Earning Individual - Sole Proprietor</option>
              <option value="FE - ENTERPRISE OWNER">FE - Enterprise Owner</option>
              <option value="IE - INFORMAL SECTOR">IE - Informal Sector</option>
              <option value="IE - SELF EARNING INDIVIDUAL">IE - Self Earning Individual</option>
              <option value="INDIGENT - NHTS-PR">Indigent - NHTS-PR</option>
              <option value="INDIRECT CONTRIBUTOR - 4PS/MCCT">Indirect Contributor - 4PS/MCCT</option>
              <option value="INDIRECT CONTRIBUTOR - FINANCIALLY INCAPABLE">Indirect Contributor - Financially Incapable</option>
              <option value="INDIRECT CONTRIBUTOR - PERSON WITH DISABILITY">Indirect Contributor - Person with Disability</option>
              <option value="INDIRECT CONTRIBUTOR - SOLO PARENT">Indirect Contributor - Solo Parent</option>
              <option value="LIFETIME MEMBER - RETIREE/PENSIONER">Lifetime Member - Retiree/Pensioner</option>
              <option value="SENIOR CITIZEN">Senior Citizen</option>
              <option value="SPONSORED - LGU">Sponsored - LGU</option>
              <option value="SPONSORED - NGA">Sponsored - NGA</option>
              <option value="SPONSORED - OTHERS">Sponsored - Others</option>
            </select>
          </div>

        </>
      )}

    </div>
  </div>

</div>









                      </>
                      )}

        <div className="modal-actions">
                      <button
              type="button"
              className="soft-delete-btn"
              onClick={async () => {
                if (!window.confirm("Are you sure you want to disable this patient?")) return;

                try {
                  setLoading(true);
                  setError("");
                  
                  // Convert ISO timestamp to MySQL DATETIME format (YYYY-MM-DD HH:MM:SS)
                  const dateISO = new Date().toISOString();
                  const mySQLDateTime = dateISO.slice(0, 19).replace('T', ' ');
                  
                  console.log("🗑️ [DisablePatient] Sending disable request...");
                  console.log("  - Patient ID:", patient.id);
                  console.log("  - Status: inactive");
                  console.log("  - Deleted At:", mySQLDateTime);
                  
                  const res = await updatePatient({
                    id: patient.id,
                    status: "inactive",
                    deleted_at: mySQLDateTime
                  });
                  
                  console.log("📦 [DisablePatient] Response:", res);
                  
                  if (res.success) {
                    console.log("✅ [DisablePatient] Success - Rows affected:", res.rows_affected);
                    setSuccessMessage("Patient disabled successfully.");
                    onSave?.(res);
                    onClose();
                  } else {
                    console.error("❌ [DisablePatient] API returned error:", res);
                    setError(res.error || res.message || "Failed to disable patient");
                  }
                } catch (err) {
                  console.error("❌ [DisablePatient] Exception:", err);
                  setError(err.message || "Failed to disable patient");
                } finally {
                  setLoading(false);
                }
              }}
            >
              Disable Patient
            </button>
          <button
            type="button"
            onClick={handleModalClose}
            disabled={loading || initialLoading}
          >
            Cancel
          </button>
          <button type="submit" disabled={loading || initialLoading}>
            {loading ? "Saving..." : "Save Changes"}
          </button>
        </div>
      </>
    )}
      </form>

      {/* Camera Modal */}
      {showCamera && (
        <Camera
          patientId={patient.id}
          onClose={() => setShowCamera(false)}
          onCapture={handleCaptureImage}
          onUpload={() => console.log("Image uploaded")}
        />
      )}
    </div>
  </div>
);
}
