import { useState } from "react";
import useEditPatient from "../../hooks/useEditPatient";
import "./EditPatientModal.css";

export default function EditPatientModal({ patient, onClose, onSave }) {
  const [showBasicInfo, setShowBasicInfo] = useState(false);

  const {
    // data
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

    // setters
    setShowHouseholdSection,

    // handlers
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
        {successMessage && (
          <div className="alert alert-success">{successMessage}</div>
        )}

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
      onChange={(e) =>
        searchExistingHouseholdsHandler(e.target.value)
      }
      placeholder="Search patient name"
    />

    {searchLoading && <small>Searching...</small>}

    {searchResults.map((h, i) => (
      <div
        key={i}
        className={`household-search-item ${
          householdNo === h.household_no ? "active" : ""
        }`}
        onClick={() => selectExistingHousehold(h)}
      >
        HH: {h.household_no} | FAC: {h.facility_household_no}
      </div>
    ))}

    {/* ✅ SHOW SELECTED HOUSEHOLD */}
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

            {/* ===== TOGGLE BASIC INFO ===== */}
            <button
              type="button"
              onClick={() => setShowBasicInfo(!showBasicInfo)}
            >
              {showBasicInfo ? "− Hide Additional Info" : "+ Additional Info"}
            </button>

            {showBasicInfo && (
              <div className="form-grid">
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
                <select
                  name="education_level"
                  value={formData.education_level}
                  onChange={handleInputChange}
                >
                  <option value="Unknown">Education Level</option>
                  <option value="No Formal Education">No Formal Education</option>
                  <option value="Elementary">Elementary</option>
                  <option value="High School">High School</option>
                  <option value="Vocational">Vocational</option>
                  <option value="College">College</option>
                  <option value="Post Graduate">Post Graduate</option>
                </select>
                <select
                  name="employment_status"
                  value={formData.employment_status}
                  onChange={handleInputChange}
                >
                  <option value="">Employment Status</option>
                  <option value="Employed">Employed</option>
                  <option value="Unemployed">Unemployed</option>
                  <option value="Retired">Retired</option>
                  <option value="Others">Others</option>
                </select>
              </div>
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
