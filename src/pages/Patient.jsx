// Import useState and useEffect from React
// useState → local UI state
// useEffect → lifecycle (fetching later if needed)
import { useState, useEffect } from "react";

// Import API configuration
import API from "../config/api";

// Import Sidebar component for navigation
import Sidebar from "../components/Sidebar";

// Import usePatients hook for fetching and filtering patients
import usePatients from "../hooks/usePatients";

import { apiFetch } from "../utils/api";



// Import patient page styles
import "./patient.css";

// Import PatientsTable component
import PatientsTable from "../components/patients-display/PatientsTable";

// Export Patient component

// Export Patient component
// Receives authenticated user (doctor/admin), navigation callback, and allowed pages
export default function Patient({ user, onNavigateToProfile, allowedPages = [], onNavigate }) {

  // -----------------------------------
  // STATE MANAGEMENT
  // -----------------------------------

  // -----------------------------------
  // LOGOUT HANDLER
  // -----------------------------------

  const handleLogout = async (e) => {
    e.stopPropagation();

    const token = localStorage.getItem("token");

    try {
      await fetch(`${API}/auth/logout.php`, {
        method: "POST",
        headers: {
          Authorization: token
        }
      });
    } catch (error) {
      console.error("Logout error:", error);
    } finally {
      localStorage.removeItem("token");
      window.location.reload();
    }
  };

  // -----------------------------------
  // UI HELPERS
  // -----------------------------------

  // Returns CSS class based on patient status
  const getStatusColor = (status) => {
    switch (status) {
      case "Admitted":
        return "status-admitted";
      case "Discharged":
        return "status-discharged";
      case "Under Observation":
        return "status-observation";
      case "active":
        return "status-active";
      case "inactive":
        return "status-inactive";
      case "deceased":
        return "status-deceased";
      default:
        return "";
    }
  };

  // Format status for display
  const formatStatusDisplay = (status) => {
    if (status === "active") return "Active";
    if (status === "inactive") return "Inactive";
    if (status === "deceased") return "Deceased";
    return status;
  };






// ======================================
// ADDING PATIENT (UPDATED / CLEAN)
// ======================================

const [showAddForm, setShowAddForm] = useState(false);
const [showAdditionalInfo, setShowAdditionalInfo] = useState(false);
const [isFamilyMember, setIsFamilyMember] = useState(false);

const [showCreatePurok, setShowCreatePurok] = useState(false);


const [barangays, setBarangays] = useState([]);
const [puroks, setPuroks] = useState([]);

const [purokLoading, setPurokLoading] = useState(false);
const [loading, setLoading] = useState(false); // ✅ ADD THIS
const [successMessage, setSuccessMessage] = useState("");
const [error, setError] = useState("");
const [newPurokName, setNewPurokName] = useState("");

// =======================
// Initial patient state
// =======================

const initialPatientState = {
  date_of_birth: "",
  first_name: "",
  middle_name: "",
  last_name: "",
  suffix: "",
  gender: "",
  marital_status: "",
  barangay_id: "",
  purok_id: "",
  birthplace: "",
  blood_type: "",
  mother_name: "",
  spouse_name: "",
  contact_number: "",
  household_no: "",
  facility_household_no: "",
  education_level: "",
  employment_status: "",
  family_member_type: "",
  dswd_nhts: "No",
  member_4ps: "No",
  pcb_member: "No",
  philhealth_member: "No",
  philhealth_status_type: "",
  philhealth_no: "",
  philhealth_category: "None",
};

const [newPatient, setNewPatient] = useState(initialPatientState);

// =======================
// API helper
// =======================


const cleanPayload = (obj) =>
  Object.fromEntries(
    Object.entries(obj).filter(
      ([, v]) => v !== "" && v !== null && v !== undefined
    )
  );

 
  // =======================
// Purok formatting helpers
// =======================

const formatPurokInput = (value) => {
  return value
    .replace(/\s+/g, " ")                // remove double spaces
    .replace(/\bprk\.?\b/gi, "Purok")
    .replace(/\bsit\.?\b/gi, "Sitio")
    .replace(/\bsubd\.?\b/gi, "Subdivision");
};

const normalizePurokName = (value) => {
  return value
    .trim()
    .replace(/\s+/g, " ")
    .split(" ")
    .map(word =>
      word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()
    )
    .join(" ");
};


// =======================
// Fetch barangays
// =======================

useEffect(() => {
  apiFetch(`${API}/patients/list.php`)
    .then((res) => setBarangays(res.data))
    .catch(console.error);
}, []);

// =======================
// Fetch puroks by barangay
// =======================

useEffect(() => {
  if (!newPatient.barangay_id) {
    setPuroks([]);
    return;
  }

  apiFetch(
    `${API}/patients/puroks/by_barangay.php?barangay_id=${newPatient.barangay_id}`
  )
    .then((res) => setPuroks(res.data))
    .catch(console.error);
}, [newPatient.barangay_id]);

useEffect(() => {
  if (!newPatient.barangay_id) return;
  if (isFamilyMember) return; // ✅ IMPORTANT

  setNewPatient(prev => ({
    ...prev,
    household_no: "",
    facility_household_no: "",
  }));
}, [newPatient.barangay_id, isFamilyMember]);

















// =======================
// WHEN BARANGAY SELECTED
// =======================

const handleInputChange = (e) => {
  const { name, value } = e.target;

  setNewPatient((prev) => ({
    ...prev,
    [name]: value,
  }));
};

// =======================
// Create purok
// =======================

const handleCreatePurok = async () => {
  if (!newPurokName.trim()) return setError("Purok name is required");
  if (!newPatient.barangay_id)
    return setError("Please select a barangay first");

  try {
    setPurokLoading(true);
    setError("");

    await apiFetch(`${API}/patients/puroks/create.php`, {
      method: "POST",
      body: JSON.stringify({
        barangay_id: Number(newPatient.barangay_id),
purok_name: normalizePurokName(newPurokName),
      }),
    });

    const res = await apiFetch(
      `${API}/patients/puroks/by_barangay.php?barangay_id=${newPatient.barangay_id}`
    );

    setPuroks(res.data);
    setNewPurokName("");
    setShowCreatePurok(false);
    setSuccessMessage("Purok created successfully");
    setTimeout(() => setSuccessMessage(""), 3000);
  } catch (err) {
    setError(err.message);
  } finally {
    setPurokLoading(false);
  }
};







// =======================
// Generate Household (AUTO-GENERATE)
// =======================

const handleGenerateHouseholdClick = async () => {
  if (!newPatient.barangay_id) {
    setError("Please select a barangay first");
    return;
  }

  try {
    setLoading(true);
    setError("");

    const facilityRes = await apiFetch(
      `${API}/patients/generate-facility-household.php?barangay_id=${newPatient.barangay_id}`
    );
    const householdRes = await apiFetch(`${API}/generate-household.php`);

    setNewPatient(prev => ({
      ...prev,
      facility_household_no: facilityRes.facility_household_no,
      household_no: householdRes.household_no,
    }));

    setSuccessMessage("Household generated successfully");
    setTimeout(() => setSuccessMessage(""), 3000);
  } catch (err) {
    setError(err.message);
  } finally {
    setLoading(false);
  }
};





// =======================
// Save patient
// =======================

const handleSavePatient = async () => {
  setError("");
  setSuccessMessage("");

  

  const requiredFields = [
    "first_name",
    "last_name",
    "gender",
    "date_of_birth",
    "barangay_id",
  ];

  for (const field of requiredFields) {
    if (!newPatient[field]) {
      setError(`${field.replace("_", " ")} is required`);
      return;
    }
  }

  try {
    setLoading(true);

    let payload = cleanPayload({
      ...newPatient,
      barangay_id: Number(newPatient.barangay_id),
      purok_id: newPatient.purok_id
        ? Number(newPatient.purok_id)
        : null,
    });

  
    if (payload.philhealth_member !== "Yes") {
      delete payload.philhealth_status_type;
      delete payload.philhealth_no;
      delete payload.philhealth_category;
    }

    const res = await apiFetch(`${API}/patients/create.php`, {
      method: "POST",
      body: JSON.stringify(payload),
    });

if (isFamilyMember) {
  // ✅ Keep household context, reset only personal fields
  setNewPatient(prev => ({
    ...initialPatientState,
    barangay_id: prev.barangay_id,
    purok_id: prev.purok_id,
    household_no: prev.household_no,
    facility_household_no: prev.facility_household_no,
  }));
} else {
  // Normal add patient
  setNewPatient(initialPatientState);
}

setSuccessMessage(
  `Patient created successfully! Code: ${res.data.patient_code}`
);


    setTimeout(() => setSuccessMessage(""), 3000);
  } catch (err) {
    setError(err.message);
  } finally {
    setLoading(false);
  }
};





// =======================
//  DISPLAYING PATIENTS//
// =======================

const {
  patients,
  loading: patientsLoading,
  search,
  setSearch,
  statusFilter,
  setStatusFilter,
  barangayFilter,
  setBarangayFilter,
  genderFilter,
  setGenderFilter,
  dobFilter,
  setDobFilter,
  refetchPatients
} = usePatients();








// =======================
// Derived active barangay (FOR MODALS / DISPLAY)
// =======================

const activeBarangay = barangays.find(
  (b) => Number(b.id) === Number(newPatient.barangay_id)
);
  // -----------------------------------
  // RENDER UI
  // -----------------------------------

  return (
    <div className="patient-container">

      {/* Sidebar Navigation */}
      <Sidebar allowedPages={allowedPages} onNavigate={onNavigate} />

      {/* Right content wrapper */}
      <div className="patient-content">
        {/* ================= HEADER ================= */}
        <header className="patient-header">
          <div className="header-content">
            <h1>Patient Management</h1>

            {/* Logged-in user info */}
            <div className="user-info" onClick={onNavigateToProfile}>
              <span className="user-name">{user?.name}</span>
              <span className="user-role">{user?.role}</span>

              <button className="logout-btn" onClick={handleLogout}>
                Logout
              </button>
            </div>
          </div>
        </header>

        {/* ================= MAIN CONTENT ================= */}
        <main className="patient-main">

     

        {/* Patient table */}
        <section className="patient-section">

        {!showAddForm ? (
        <>
          {/* ================= TABLE VIEW ================= */}
      <div className="section-header patient-toolbar">

  <h3>Active Patients</h3>

  <div className="patient-filters">

    {/* Main search */}
 <input
  type="text"
  className="filter-input"
  placeholder="Search name, patient code, facility no, household no"
  value={search}
  onChange={(e) => setSearch(e.target.value)}
/>



  {/* Barangay filter */}
  <select
    className="filter-select"
    value={barangayFilter}
    onChange={(e) => setBarangayFilter(e.target.value)}
  >
    <option value="">All Barangays</option>
    {barangays.map((b) => (
      <option key={b.id} value={b.id}>
        {b.name}
      </option>
    ))}
  </select>

  {/* Gender Filter */}
<select
  className="filter-select"
  value={genderFilter}
  onChange={(e) => setGenderFilter(e.target.value)}
>
  <option value="">All Genders</option>
  <option value="Male">Male</option>
  <option value="Female">Female</option>
</select>

  {/* Status filter */}
  <select
    className="filter-select"
    value={statusFilter}
    onChange={(e) => setStatusFilter(e.target.value)}
  >
    <option value="">All Status</option>
    <option value="active">Active</option>
    <option value="inactive">Inactive</option>
    <option value="deceased">Deceased</option>
  </select>

{/* DOB Filter */}
<input
  type="date"
  className="filter-date"
  title="Date of birth"
  value={dobFilter}
  onChange={(e) => setDobFilter(e.target.value)}
/>
  </div>

  <button
    className="add-patient-btn"
    onClick={() => setShowAddForm(true)}
  >
    + Add Patient
  </button>

</div>


       <PatientsTable
  patients={patients}
  loading={patientsLoading}
  getStatusColor={getStatusColor}
  formatStatusDisplay={formatStatusDisplay}
  onView={(patient) => console.log("View", patient)}
  onEdit={(patient) => console.log("Edit", patient)}
onAddFamilyMember={async (patient) => {
  try {
    setLoading(true);
    setError("");

    const { data } = await apiFetch(
      `${API}/patients/get-household.php?patient_id=${patient.id}`
    );

    setIsFamilyMember(true);
    setShowAddForm(true);
    setShowAdditionalInfo(true);
setNewPatient({
  ...initialPatientState,
  barangay_id: String(data.barangay_id ?? ""),
  purok_id: data.purok_id ? String(data.purok_id) : "",
  household_no: data.household_no ?? "",
  facility_household_no: data.facility_household_no ?? "",
});


  } catch (err) {
    setError(err.message);
  } finally {
    setLoading(false);
  }
}}

/>

        </>
      ) : (
        <>








        
              {/* ================= BASIC PATIENT INFO CARD ================= */}
              <div className="patient-basic-card">
                <div className="section-header">
                  <h3>Add New Patient</h3>
 <button
  className="cancel-btn"
  onClick={() => {
    setShowAddForm(false);
    setIsFamilyMember(false);
    setNewPatient(initialPatientState);
    setError("");
    setSuccessMessage("");
  }}
>
  Cancel
</button>


                </div>

                {/* NAME */}
                <div className="form-row">
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

                {/* DATE OF BIRTH */}
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
                    <label>
                      <input
                        type="radio"
                        name="marital_status"
                        value="Single"
                        checked={newPatient.marital_status === "Single"}
                        onChange={handleInputChange}
                      />
                      Single
                    </label>

                    <label>
                      <input
                        type="radio"
                        name="marital_status"
                        value="Married"
                        checked={newPatient.marital_status === "Married"}
                        onChange={handleInputChange}
                      />
                      Married
                    </label>

                    <label>
                      <input
                        type="radio"
                        name="marital_status"
                        value="Widowed"
                        checked={newPatient.marital_status === "Widowed"}
                        onChange={handleInputChange}
                      />
                      Widowed
                    </label>

                    <label>
                      <input
                        type="radio"
                        name="marital_status"
                        value="Separated"
                        checked={newPatient.marital_status === "Separated"}
                        onChange={handleInputChange}
                      />
                      Separated
                    </label>
                  </div>
                </div>

                {/* ADDRESS */}
                <div className="form-row">
                  <div className="form-group">
                    <label>Barangay</label>
                    <select
                      name="barangay_id"
                      value={newPatient.barangay_id}
                      onChange={handleInputChange}
                      required
                    >
                      <option value="">Select Barangay</option>
                      {barangays.map((barangay) => (
                        <option key={barangay.id} value={barangay.id}>
                          {barangay.name}
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
                        {puroks.map((purok) => (
                          <option key={purok.id} value={purok.id}>
                            {purok.purok_name}
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

                {/* Create Purok Modal */}
                {showCreatePurok && (
                  <div className="modal-overlay" onClick={() => setShowCreatePurok(false)}>
                    <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                      <div className="modal-header">
                        <h4>Create New Purok</h4>
                        <button
                          type="button"
                          className="modal-close"
                          onClick={() => setShowCreatePurok(false)}
                        >
                          ✕
                        </button>
                      </div>

                  <div className="modal-body">
  <div className="form-group">
    <label>Purok Name</label>

    <input
      type="text"
      value={newPurokName}
onChange={(e) =>
  setNewPurokName(formatPurokInput(e.target.value))
}
      placeholder="e.g. Purok 1, Subdivision A, Sitio Riverside"
      onKeyPress={(e) => {
        if (e.key === "Enter") {
          handleCreatePurok();
        }
      }}
    />

    <small className="hint">
      You may include subdivision or sitio name
    </small>
  </div>
</div>


                      <div className="modal-actions">
                        <button
                          type="button"
                          className="cancel-btn"
                          onClick={() => setShowCreatePurok(false)}
                        >
                          Cancel
                        </button>
                        <button
                          type="button"
                          className="save-btn"
                          onClick={handleCreatePurok}
                          disabled={purokLoading}
                        >
                          {purokLoading ? "Creating..." : "Create Purok"}
                        </button>
                      </div>
                    </div>
                  </div>
                )}


              </div>

              {/* Error and Success Messages */}
              {error && (
                <div className="alert alert-error">
                  {error}
                </div>
              )}
              {successMessage && (
                <div className="alert alert-success">
                  {successMessage}
                </div>
              )}

              <div className="additional-toggle">
                <button
                  type="button"
                  className="additional-btn"
                  onClick={() => setShowAdditionalInfo(!showAdditionalInfo)}
                >
                  {showAdditionalInfo ? "− Hide Additional Information" : "+ Additional Information"}
                </button>
              </div>
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
          <option>A+</option>
          <option>A-</option>
          <option>B+</option>
          <option>B-</option>
          <option>AB+</option>
          <option>AB-</option>
          <option>O+</option>
          <option>O-</option>
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
      {newPatient.marital_status === 'Married' && (
        <div className="form-group">
          <label>Spouse Name</label>
          <input
            type="text"
            name="spouse_name"
            value={newPatient.spouse_name}
            onChange={handleInputChange}
            placeholder="Enter spouse's name"
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
<div className="form-group">
  <label>Household Setup</label>

  {/* Show button only if not a family member */}
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
    <small style={{ color: "#999", marginTop: "5px", display: "block" }}>
      Please select a barangay first
    </small>
  )}

  {/* Display generated household info for everyone */}
  {newPatient.facility_household_no && (
    <div
      style={{
        marginTop: "10px",
        padding: "12px",
        backgroundColor: "#e8f5e9",
        borderRadius: "6px",
        color: "#2e7d32",
        borderLeft: "4px solid #4caf50",
      }}
    >
      <div style={{ fontSize: "13px", fontWeight: "600", marginBottom: "6px" }}>
        Household Information
      </div>
      <div style={{ fontSize: "13px" }}>
        <div>
          Facility No: <strong>{newPatient.facility_household_no}</strong>
        </div>
        {newPatient.household_no && (
          <div>
            Household No: <strong>{newPatient.household_no}</strong>
          </div>
        )}
      </div>
    </div>
  )}
</div>

    
    </div>

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

    <div className="form-row">
      <div className="form-group">
        <label>DSWD NHTS?</label>
        <select name="dswd_nhts" value={newPatient.dswd_nhts} onChange={handleInputChange}>
          <option value="">Select</option>
          <option>Yes</option>
          <option>No</option>
        </select>
      </div>

      <div className="form-group">
        <label>4Ps Member?</label>
        <select name="member_4ps" value={newPatient.member_4ps} onChange={handleInputChange}>
          <option value="">Select</option>
          <option>Yes</option>
          <option>No</option>
        </select>
      </div>

      <div className="form-group">
        <label>PCB Member?</label>
        <select name="pcb_member" value={newPatient.pcb_member} onChange={handleInputChange}>
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

    {/* Conditional PhilHealth Fields */}
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
)}

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
            </>
          )}

        </section>

      </main>
      </div>
    </div>
  );
}
