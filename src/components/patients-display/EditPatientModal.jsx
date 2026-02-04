import { useState } from "react";
import useEditPatient from "../../hooks/useEditPatient";
import "./EditPatientModal.css";

export default function EditPatientModal({ patient, onClose, onSave }) {
  const [showBasicInfo, setShowBasicInfo] = useState(false);

  const {
    formData,
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

    setShowHouseholdSection,

    handleInputChange,
    handleHouseholdTypeChange,
    handleBarangayChange,
    searchExistingHouseholdsHandler,
    generateNewHouseholdHandler,
    moveHouseholdHandler,
    submitHandler,
    selectExistingHousehold,
  } = useEditPatient(patient, onSave, onClose);

  return (
    <div className="edit-patient-modal">
      <div className="modal-header">
        <h3>
          Edit Patient:{" "}
          {`${formData.first_name} ${formData.middle_name ?? ""} ${formData.last_name}`.trim()}
        </h3>
        <small>
          Patient Code: <strong>{patient.patient_code}</strong> (unchanged)
        </small>
      </div>

      <form onSubmit={submitHandler}>
        {error && <div className="alert alert-error">{error}</div>}
        {successMessage && <div className="alert alert-success">{successMessage}</div>}

        {initialLoading ? (
          <div style={{ padding: "20px", textAlign: "center" }}>
            <p>Loading patient details...</p>
          </div>
        ) : (
          <>
            {/* ===== HOUSEHOLD MANAGEMENT ===== */}
            <button
              type="button"
              onClick={() => setShowHouseholdSection(!showHouseholdSection)}
            >
              {showHouseholdSection ? "− Hide Household" : "+ Manage Household"}
            </button>

            {showHouseholdSection && (
              <div className="household-section">
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

                {householdType === "existing" && (
                  <>
                    <input
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
                  <>
                    <input value={householdNo} readOnly />
                    <input value={facilityHouseholdNo} readOnly />
                    <button
                      type="button"
                      onClick={generateNewHouseholdHandler}
                      disabled={householdLoading}
                    >
                      {householdLoading ? "Generating..." : "Generate"}
                    </button>
                  </>
                )}

                <button
                  type="button"
                  onClick={moveHouseholdHandler}
                  disabled={loading}
                >
                  {loading ? "Moving..." : "Confirm Move"}
                </button>
              </div>
            )}

            {/* ===== ADDITIONAL INFO ===== */}
            <button
              type="button"
              onClick={() => setShowBasicInfo(!showBasicInfo)}
            >
              {showBasicInfo ? "− Hide Additional Info" : "+ Additional Info"}
            </button>

            {showBasicInfo && (
              <>
                <div className="form-grid">
                  {/* Personal Info */}
                  <input
                    name="first_name"
                    value={formData.first_name}
                    onChange={handleInputChange}
                    placeholder="First Name"
                    required
                  />
                  <input
                    name="middle_name"
                    value={formData.middle_name}
                    onChange={handleInputChange}
                    placeholder="Middle Name"
                  />
                  <input
                    name="last_name"
                    value={formData.last_name}
                    onChange={handleInputChange}
                    placeholder="Last Name"
                    required
                  />
                  <input
                    name="suffix"
                    value={formData.suffix}
                    onChange={handleInputChange}
                    placeholder="Suffix (Jr., Sr., III)"
                  />
                  <input
                    type="date"
                    name="date_of_birth"
                    value={formData.date_of_birth}
                    onChange={handleInputChange}
                    required
                  />
                  <input
                    name="birthplace"
                    value={formData.birthplace}
                    onChange={handleInputChange}
                    placeholder="Birthplace"
                  />
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
                  <select
                    name="marital_status"
                    value={formData.marital_status}
                    onChange={handleInputChange}
                  >
                    <option value="">Marital Status</option>
                    <option value="Single">Single</option>
                    <option value="Married">Married</option>
                    <option value="Widowed">Widowed</option>
                    <option value="Separated">Separated</option>
                  </select>
                  <select
                    name="blood_type"
                    value={formData.blood_type}
                    onChange={handleInputChange}
                  >
                    <option value="">Blood Type</option>
                    <option value="A+">A+</option>
                    <option value="A-">A-</option>
                    <option value="B+">B+</option>
                    <option value="B-">B-</option>
                    <option value="AB+">AB+</option>
                    <option value="AB-">AB-</option>
                    <option value="O+">O+</option>
                    <option value="O-">O-</option>
                  </select>

                  <input
                    name="mother_name"
                    value={formData.mother_name}
                    onChange={handleInputChange}
                    placeholder="Mother's Name"
                  />
                  <input
                    name="spouse_name"
                    value={formData.spouse_name}
                    onChange={handleInputChange}
                    placeholder="Spouse Name"
                  />
                  <input
                    name="contact_number"
                    value={formData.contact_number}
                    onChange={handleInputChange}
                    placeholder="Contact Number"
                  />

                  {/* Social & Education Info */}
                  <select
                    name="education_level"
                    value={formData.education_level}
                    onChange={handleInputChange}
                  >
                    <option value="">Education Level</option>
                    <option>No Formal Education</option>
                    <option>Elementary</option>
                    <option>High School</option>
                    <option>Vocational</option>
                    <option>College</option>
                    <option>Post Graduate</option>
                    <option>Unknown</option>
                  </select>

                  <select
                    name="employment_status"
                    value={formData.employment_status}
                    onChange={handleInputChange}
                  >
                    <option value="">Employment Status</option>
                    <option>Employed</option>
                    <option>Unemployed</option>
                    <option>Retired</option>
                    <option>Others</option>
                  </select>

                  <select
                    name="family_member_type"
                    value={formData.family_member_type}
                    onChange={handleInputChange}
                  >
                    <option value="">Family Member</option>
                    <option>Father</option>
                    <option>Mother</option>
                    <option>Daughter</option>
                    <option>Son</option>
                    <option>Others</option>
                  </select>

                  <select
                    name="dswd_nhts"
                    value={formData.dswd_nhts}
                    onChange={handleInputChange}
                  >
                    <option value="">DSWD NHTS?</option>
                    <option>Yes</option>
                    <option>No</option>
                  </select>

                  <select
                    name="member_4ps"
                    value={formData.member_4ps}
                    onChange={handleInputChange}
                  >
                    <option value="">4Ps Member?</option>
                    <option>Yes</option>
                    <option>No</option>
                  </select>

                  <select
                    name="pcb_member"
                    value={formData.pcb_member}
                    onChange={handleInputChange}
                  >
                    <option value="">PCB Member?</option>
                    <option>Yes</option>
                    <option>No</option>
                  </select>

                  <select
                    name="philhealth_member"
                    value={formData.philhealth_member}
                    onChange={handleInputChange}
                  >
                    <option value="">PhilHealth Member?</option>
                    <option value="Yes">Yes</option>
                    <option value="No">No</option>
                  </select>

                  {/* Conditional PhilHealth Fields */}
                  {formData.philhealth_member === "Yes" && (
                    <>
                      <select
                        name="philhealth_status_type"
                        value={formData.philhealth_status_type}
                        onChange={handleInputChange}
                        required
                      >
                        <option value="">PhilHealth Status Type</option>
                        <option value="Member">Member</option>
                        <option value="Dependent">Dependent</option>
                      </select>
                      <input
                        name="philhealth_no"
                        value={formData.philhealth_no}
                        onChange={handleInputChange}
                        placeholder="PhilHealth No."
                      />
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
                    </>
                  )}
                </div>
              </>
            )}

            <div className="modal-actions">
              <button
                type="button"
                onClick={onClose}
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
    </div>
  );
}
