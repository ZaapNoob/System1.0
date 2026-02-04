import { useModal } from "../../components/modal/ModalProvider";
import useAddPatient from "../../hooks/useAddPatient";
import "./QueueAddPatientModal.css";


export default function QueueAddPatientModal({ onPatientAdded }) {
  const {
    newPatient,
    setNewPatient,
    handleInputChange,
    handleSavePatient,
    barangays,
    puroks,
    showAdditionalInfo,
    setShowAdditionalInfo,
    showCreatePurok,
    setShowCreatePurok,
    newPurokName,
    setNewPurokName,
    handleCreatePurok,
    handleGenerateHouseholdClick,
    loading,
    purokLoading,
    successMessage,
    error,
    isFamilyMember,
    setIsFamilyMember,
    initialPatientState,
    formatPurokInput,
  } = useAddPatient();

  const { closeModal } = useModal();

  const handleCancel = () => {
    setShowAdditionalInfo(false);
    setShowCreatePurok(false);
    setIsFamilyMember(false);
    setNewPatient(initialPatientState);
    closeModal();
  };

  return (

    <div className="queue-add-patient-modal">
      <div className="patient-basic-card">
        {/* HEADER */}
        <div className="patient-modal-header">
    <h2>Add Patient</h2>
    <p>Fill in the patient’s basic information</p>
          <button className="cancel-btn" onClick={handleCancel}>
            Cancel
          </button>
        </div>

        {/* BASIC INFO */}
        <div className="form-grid">
          <div className="form-group">
            <label>First Name</label>
            <input
              type="text"
              name="first_name"
              value={newPatient.first_name}
              onChange={handleInputChange}
              required
            />
          </div>
          <div className="form-group">
            <label>Middle Name</label>
            <input
              type="text"
              name="middle_name"
              value={newPatient.middle_name}
              onChange={handleInputChange}
            />
          </div>
          <div className="form-group">
            <label>Last Name</label>
            <input
              type="text"
              name="last_name"
              value={newPatient.last_name}
              onChange={handleInputChange}
              required
            />
          </div>
          <div className="form-group">
            <label>Suffix</label>
            <select
              name="suffix"
              value={newPatient.suffix}
              onChange={handleInputChange}
            >
              <option value="">None</option>
              <option value="Jr">Jr.</option>
              <option value="Sr">Sr.</option>
              <option value="II">II</option>
              <option value="III">III</option>
              <option value="IV">IV</option>
              <option value="V">V</option>
            </select>
          </div>
        </div>

        {/* DOB */}
        <div className="form-row">
          <div className="form-group">
            <label>Date of Birth</label>
            <input
              type="date"
              name="date_of_birth"
              value={newPatient.date_of_birth}
              onChange={handleInputChange}
              required
            />
          </div>
        </div>

        {/* GENDER */}
        <div className="form-row">
          <label className="section-label">Gender</label>
          <div className="radio-group">
            <label>
              <input
                type="radio"
                name="gender"
                value="Male"
                checked={newPatient.gender === "Male"}
                onChange={handleInputChange}
              />
              Male
            </label>
            <label>
              <input
                type="radio"
                name="gender"
                value="Female"
                checked={newPatient.gender === "Female"}
                onChange={handleInputChange}
              />
              Female
            </label>
          </div>
        </div>

        {/* MARITAL STATUS */}
        <div className="form-row">
          <label className="section-label">Marital Status</label>
          <div className="radio-group">
            {["Single", "Married", "Widowed", "Separated"].map((status) => (
              <label key={status}>
                <input
                  type="radio"
                  name="marital_status"
                  value={status}
                  checked={newPatient.marital_status === status}
                  onChange={handleInputChange}
                />
                {status}
              </label>
            ))}
          </div>
        </div>

        {/* BARANGAY & PUROK */}
          <div className="section-divider">Address Information</div>
        <div className="form-grid">
          <div className="form-group">
            <label>Barangay</label>
            <select
              name="barangay_id"
              value={newPatient.barangay_id}
              onChange={handleInputChange}
              required
            >
              <option value="">Select Barangay</option>
              {barangays.map((b) => (
                <option key={b.id} value={b.id}>
                  {b.name}
                </option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label>Purok</label>
            <div style={{ display: "flex", gap: "10px", alignItems: "flex-end" }}>
              <select
                name="purok_id"
                value={newPatient.purok_id}
                onChange={handleInputChange}
                disabled={!newPatient.barangay_id}
                style={{ flex: 1 }}
              >
                <option value="">Select Purok</option>
                {puroks.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.purok_name}
                  </option>
                ))}
              </select>
              <button
                type="button"
                className="create-purok-btn"
                onClick={() => setShowCreatePurok(true)}
                disabled={!newPatient.barangay_id}
                title="Create new purok for this barangay"
              >
                + Add
              </button>
            </div>
          </div>
        </div>

        {/* CREATE PUROK MODAL */}
        {showCreatePurok && (
          <div className="modal-overlay" onClick={() => setShowCreatePurok(false)}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
              <div className="modal-header">
                <h4>Create New Purok</h4>
                <button type="button" className="modal-close" onClick={() => setShowCreatePurok(false)}>
                  ✕
                </button>
              </div>
              <div className="modal-body">
                <input
                  type="text"
                  value={newPurokName}
                  onChange={(e) => setNewPurokName(formatPurokInput(e.target.value))}
                  placeholder="e.g. Purok 1, Subdivision A, Sitio Riverside"
                  onKeyPress={(e) => e.key === "Enter" && handleCreatePurok()}
                />
              </div>
              <div className="modal-actions">
                <button className="cancel-btn" onClick={() => setShowCreatePurok(false)}>Cancel</button>
                <button className="save-btn" onClick={handleCreatePurok} disabled={purokLoading}>
                  {purokLoading ? "Creating..." : "Create Purok"}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* ERROR & SUCCESS */}
        {error && <div className="alert alert-error">{error}</div>}
        {successMessage && <div className="alert alert-success">{successMessage}</div>}

        {/* ADDITIONAL INFO TOGGLE */}
        <div className="additional-toggle">
          <button
            type="button"
            className="additional-btn"
            onClick={() => setShowAdditionalInfo(!showAdditionalInfo)}
          >
            {showAdditionalInfo ? "− Hide Additional Information" : "+ Additional Information"}
          </button>
        </div>

        {/* ADDITIONAL INFO */}
        {showAdditionalInfo && (
          <div className="additional-section">
            <h4>Additional Information</h4>

            <div className="form-row">
              <div className="form-group">
                <label>Birthplace</label>
                <input
                  type="text"
                  name="birthplace"
                  value={newPatient.birthplace}
                  onChange={handleInputChange}
                />
              </div>
              <div className="form-group">
                <label>Blood Type</label>
                <select
                  name="blood_type"
                  value={newPatient.blood_type}
                  onChange={handleInputChange}
                >
                  <option value="">Select</option>
                  {["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"].map((b) => (
                    <option key={b} value={b}>{b}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>Mother’s Name</label>
                <input
                  type="text"
                  name="mother_name"
                  value={newPatient.mother_name}
                  onChange={handleInputChange}
                />
              </div>
              {newPatient.marital_status === "Married" && (
                <div className="form-group">
                  <label>Spouse Name</label>
                  <input
                    type="text"
                    name="spouse_name"
                    value={newPatient.spouse_name}
                    onChange={handleInputChange}
                  />
                </div>
              )}
              <div className="form-group">
                <label>Contact Number</label>
                <input
                  type="text"
                  name="contact_number"
                  value={newPatient.contact_number}
                  onChange={handleInputChange}
                />
              </div>
            </div>

            {/* Household Generator */}
            <div className="form-group">
              <label>Household Setup</label>
              {!isFamilyMember && (
                <button
                  type="button"
                  className="save-btn"
                  disabled={!newPatient.barangay_id || loading}
                  onClick={handleGenerateHouseholdClick}
                >
                  {loading
                    ? "Generating..."
                    : newPatient.facility_household_no
                      ? "✓ Regenerate Household"
                      : "⚙️ Generate Household"}
                </button>
              )}
              {!newPatient.barangay_id && !isFamilyMember && (
                <small style={{ color: "#999", display: "block", marginTop: "5px" }}>
                  Please select a barangay first
                </small>
              )}
              {newPatient.facility_household_no && (
                <div style={{
                  marginTop: "10px",
                  padding: "12px",
                  backgroundColor: "#e8f5e9",
                  borderRadius: "6px",
                  color: "#2e7d32",
                  borderLeft: "4px solid #4caf50"
                }}>
                  <div style={{ fontSize: "13px", fontWeight: 600, marginBottom: "6px" }}>
                    Household Information
                  </div>
                  <div style={{ fontSize: "13px" }}>
                    <div>Facility No: <strong>{newPatient.facility_household_no}</strong></div>
                    {newPatient.household_no && (
                      <div>Household No: <strong>{newPatient.household_no}</strong></div>
                    )}
                  </div>
                </div>
              )}
            </div>



            <div className="form-container">

  {/* ---------------- Educational, Employment, Family ---------------- */}
  <div className="form-row">
    <div className="form-group">
      <label>Educational Attainment</label>
      <select
        name="education_level"
        value={newPatient.education_level}
        onChange={handleInputChange}
      >
        <option value="">Select</option>
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
        value={newPatient.employment_status}
        onChange={handleInputChange}
      >
        <option value="">Select</option>
        <option>Employed</option>
        <option>Unemployed</option>
        <option>Retired</option>
        <option>Others</option>
      </select>
    </div>

    <div className="form-group">
      <label>Family Member</label>
      <select
        name="family_member_type"
        value={newPatient.family_member_type}
        onChange={handleInputChange}
      >
        <option value="">Select</option>
        <option>Father</option>
        <option>Mother</option>
        <option>Daughter</option>
        <option>Son</option>
        <option>Others</option>
      </select>
    </div>
  </div>

  {/* ---------------- Social Programs ---------------- */}
  <div className="form-row">
    <div className="form-group">
      <label>DSWD NHTS?</label>
      <select
        name="dswd_nhts"
        value={newPatient.dswd_nhts}
        onChange={handleInputChange}
      >
        <option value="">Select</option>
        <option>Yes</option>
        <option>No</option>
      </select>
    </div>

    <div className="form-group">
      <label>4Ps Member?</label>
      <select
        name="member_4ps"
        value={newPatient.member_4ps}
        onChange={handleInputChange}
      >
        <option value="">Select</option>
        <option>Yes</option>
        <option>No</option>
      </select>
    </div>

    <div className="form-group">
      <label>PCB Member?</label>
      <select
        name="pcb_member"
        value={newPatient.pcb_member}
        onChange={handleInputChange}
      >
        <option value="">Select</option>
        <option>Yes</option>
        <option>No</option>
      </select>
    </div>

    <div className="form-group">
      <label>PhilHealth Member?</label>
      <select
        name="philhealth_member"
        value={newPatient.philhealth_member}
        onChange={handleInputChange}
      >
        <option value="">Select</option>
        <option value="Yes">Yes</option>
        <option value="No">No</option>
      </select>
    </div>
  </div>

  {/* ---------------- Conditional PhilHealth Fields ---------------- */}
  {newPatient.philhealth_member === 'Yes' && (
    <div className="form-row">
      <div className="form-group">
        <label>PhilHealth Status Type</label>
        <select
          name="philhealth_status_type"
          value={newPatient.philhealth_status_type}
          onChange={handleInputChange}
          required
        >
          <option value="">Select</option>
          <option value="Member">Member</option>
          <option value="Dependent">Dependent</option>
        </select>
      </div>

      <div className="form-group">
        <label>PhilHealth No.</label>
        <input
          type="text"
          name="philhealth_no"
          value={newPatient.philhealth_no}
          onChange={handleInputChange}
          placeholder="Enter PhilHealth number"
        />
      </div>

      <div className="form-group">
        <label>PhilHealth Category</label>
        <select
          name="philhealth_category"
          value={newPatient.philhealth_category}
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
          <option value="IE - CITIZEN OF OTHER COUNTRIES WORKING/RESIDING/STUDYING IN THE PHILIPPINES">IE - Citizen of Other Countries Working/Residing/Studying in the Philippines</option>
          <option value="IE - FILIPINO WITH DUAL CITIZENSHIP">IE - Filipino with Dual Citizenship</option>
          <option value="IE - INFORMAL SECTOR">IE - Informal Sector</option>
          <option value="IE - MIGRANT WORKER - LAND BASED">IE - Migrant Worker - Land Based</option>
          <option value="IE - MIGRANT WORKER - SEA BASED">IE - Migrant Worker - Sea Based</option>
          <option value="IE - NATURALIZED FILIPINO CITIZEN">IE - Naturalized Filipino Citizen</option>
          <option value="IE - ORGANIZED GROUP">IE - Organized Group</option>
          <option value="IE - SELF EARNING INDIVIDUAL">IE - Self Earning Individual</option>
          <option value="INDIGENT - NHTS-PR">Indigent - NHTS-PR</option>
          <option value="INDIRECT CONTRIBUTOR - 4PS/MCCT">Indirect Contributor - 4PS/MCCT</option>
          <option value="INDIRECT CONTRIBUTOR - BANGSAMORO/NORMALIZATION">Indirect Contributor - Bangsamoro/Normalization</option>
          <option value="INDIRECT CONTRIBUTOR - FINANCIALLY INCAPABLE">Indirect Contributor - Financially Incapable</option>
          <option value="INDIRECT CONTRIBUTOR - KIA/KIPO">Indirect Contributor - KIA/KIPO</option>
          <option value="INDIRECT CONTRIBUTOR - LISTAHANAN">Indirect Contributor - Listahanan</option>
          <option value="INDIRECT CONTRIBUTOR - PAMANA">Indirect Contributor - PAMANA</option>
          <option value="INDIRECT CONTRIBUTOR - PERSON WITH DISABILITY">Indirect Contributor - Person with Disability</option>
          <option value="INDIRECT CONTRIBUTOR - PRIVATE-SPONSORED">Indirect Contributor - Private-Sponsored</option>
          <option value="INDIRECT CONTRIBUTOR - SOLO PARENT">Indirect Contributor - Solo Parent</option>
          <option value="LIFETIME MEMBER - RETIREE/PENSIONER">Lifetime Member - Retiree/Pensioner</option>
          <option value="LIFETIME MEMBER - WITH 120 MONTHS CONTRIBUTION AND HAS REACHED RETIREMENT AGE">Lifetime Member - With 120 Months Contribution and Has Reached Retirement Age</option>
          <option value="SENIOR CITIZEN">Senior Citizen</option>
          <option value="SPONSORED - LGU">Sponsored - LGU</option>
          <option value="SPONSORED - NGA">Sponsored - NGA</option>
          <option value="SPONSORED - OTHERS">Sponsored - Others</option>
          <option value="SPONSORED - POS - FINANCIALLY INCAPABLE">Sponsored - POS - Financially Incapable</option>
        </select>
      </div>
    </div>
  )}

</div>

          </div>
        )}

        {/* SAVE BUTTON */}
        <div className="form-actions">
          <button
            type="button"
            className="save-btn"
            onClick={handleSavePatient}
            disabled={loading}
          >
            {loading ? "Saving..." : "Save Patient"}
          </button>
        </div>
      </div>
    </div>
  );
}
