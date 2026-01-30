import { useState, useMemo } from "react";
import API from "../../config/api";
import { apiFetch } from "../../utils/api";
import BaseTable from "../BaseTable";

import "./householdmodal.css";

function GenerateHouseholdModal({
  barangayId,
  barangayName,
  onConfirm,
  onCancel,
}) {
  const [error, setError] = useState("");
  const [householdType, setHouseholdType] = useState("new");
  const [householdLookupMethod, setHouseholdLookupMethod] =
    useState("by_facility");

  const [existingHouseholds, setExistingHouseholds] = useState([]);

  const [generatedData, setGeneratedData] = useState({
    facility_household_no: "",
    household_no: "",
  });

  const [patientSearchData, setPatientSearchData] = useState({
    first_name: "",
    last_name: "",
    middle_name: "",
    suffix: "",
    date_of_birth: "",
    gender: "",
    philhealth_no: "",
  });

  const [generating, setGenerating] = useState(false);

  // =======================
  // TABLE COLUMNS (GLOBAL-SAFE)
  // =======================
 const tableColumns = [
  {
    key: "facility_household_no",
    header: "Facility No.",
  },
  {
    key: "household_no",
    header: "Household No.",
  },
  {
    key: "members",
    header: "Members",
  },
];


  // =======================
  // TABLE DATA (DERIVED)
  // =======================
const existingHouseholdTableData = useMemo(() => {
  // For NEW household, show the generated data
  if (householdType === "new") {
    if (!generatedData.facility_household_no || !generatedData.household_no) {
      return [];
    }
    return [
      {
        facility_household_no: generatedData.facility_household_no,
        household_no: generatedData.household_no,
        members: "-",
      },
    ];
  }

  // For EXISTING household, show search results
  if (householdType !== "existing") return [];

  return existingHouseholds.map((hh) => {
    const householdNo = hh.household_no || hh;

    return {
      facility_household_no: hh.facility_household_no || generatedData.facility_household_no || "-",
      household_no: householdNo,
      members: hh.members ?? "-",

      // 👇 used for row selection
      __raw: hh,
    };
  });
}, [existingHouseholds, householdType, generatedData.facility_household_no, generatedData.household_no]);

  // =======================
  // Helpers
  // =======================
  const resetState = () => {
    setGeneratedData({ facility_household_no: "", household_no: "" });
    setPatientSearchData({
      first_name: "",
      last_name: "",
      middle_name: "",
      suffix: "",
      date_of_birth: "",
      gender: "",
      philhealth_no: "",
    });
    setExistingHouseholds([]);
    setError("");
  };

  const withLoading = async (fn) => {
    setGenerating(true);
    setError("");
    try {
      await fn();
    } catch (err) {
      setError(err.message);
    } finally {
      setGenerating(false);
    }
  };

  // =======================
  // Actions
  // =======================
  const handleGenerateNew = () =>
    withLoading(async () => {
      const facilityRes = await apiFetch(
        `${API}/patients/generate-facility-household.php?barangay_id=${barangayId}`
      );

      const householdRes = await apiFetch(`${API}/generate-household.php`);

      setGeneratedData({
        facility_household_no: facilityRes.facility_household_no,
        household_no: householdRes.household_no,
      });
    });

  const handleFetchHouseholdByFacility = () => {
    if (!generatedData.facility_household_no.trim()) {
      setError("Please enter a facility household number");
      return;
    }

    withLoading(async () => {
      const res = await apiFetch(
        `${API}/patients/find-households-by-facility.php?barangay_id=${barangayId}&facility_household_no=${encodeURIComponent(
          generatedData.facility_household_no
        )}`
      );

      setExistingHouseholds(res.households || []);

      if (!res.households || res.households.length === 0) {
        setError("No households found for this facility number");
      }
    });
  };

 const handleFetchHouseholdByNumber = () => {
  if (!generatedData.household_no.trim()) {
    setError("Please enter a household number");
    return;
  }

  withLoading(async () => {
    const res = await apiFetch(
      `${API}/patients/find-household.php?barangay_id=${barangayId}&household_no=${encodeURIComponent(
        generatedData.household_no
      )}`
    );

    // API returns facility_household_no, use the searched household_no from input
    const facilityNo = res?.facility_household_no;
    const householdNo = generatedData.household_no; // Use the value that was searched
    const members = res?.members ?? "-";

    if (!facilityNo) {
      setError("No household found for this household number");
      setExistingHouseholds([]);
      return;
    }

    // ✅ Set both facility and household numbers
    setGeneratedData((prev) => ({
      ...prev,
      facility_household_no: facilityNo,
      household_no: householdNo,
    }));

    // ✅ Populate table with the found household
    setExistingHouseholds([
      {
        household_no: householdNo,
        facility_household_no: facilityNo,
        members: members,
      },
    ]);

    setError(""); // Clear any previous errors
  });
};

const handleFetchHouseholdByPatientName = () => {
  const hasSearchParams = Object.values(patientSearchData).some(val => val.trim() !== "");
  
  if (!hasSearchParams) {
    setError("Please enter at least one search parameter");
    return;
  }

  withLoading(async () => {
    // Build query string with non-empty parameters
    const params = new URLSearchParams();
    params.append("barangay_id", barangayId);
    
    Object.entries(patientSearchData).forEach(([key, value]) => {
      if (value.trim() !== "") {
        params.append(key, value);
      }
    });

    const res = await apiFetch(
      `${API}/patients/find-patients-via-name.php?${params.toString()}`
    );

    const patients = res?.patients || [];

    if (!patients || patients.length === 0) {
      setError("No patients found with these search criteria");
      setExistingHouseholds([]);
      return;
    }

    // ✅ Populate table with found patients
    setExistingHouseholds(
      patients.map((p) => ({
        household_no: p.household_no || "-",
        facility_household_no: p.facility_household_no || "-",
        members: `${p.first_name} ${p.last_name}`,
      }))
    );

    setError(""); // Clear any previous errors
  });
};


  const handleConfirm = () => {
    if (
      (householdType === "new" && !generatedData.facility_household_no) ||
      (householdType === "existing" &&
        (!generatedData.facility_household_no ||
          !generatedData.household_no))
    ) {
      setError("Please complete household selection");
      return;
    }

    onConfirm(
      generatedData.facility_household_no,
      generatedData.household_no
    );
  };

  // =======================
  // UI Helper
  // =======================
  const InfoBox = ({ type = "error", children }) => {
    const styles = {
      error: { background: "#fdecea", color: "#b71c1c" },
      success: { background: "#e8f5e9", color: "#2e7d32" },
    };

    return (
      <div
        style={{
          padding: "10px",
          borderRadius: "4px",
          marginBottom: "10px",
          textAlign: "center",
          ...styles[type],
        }}
      >
        {children}
      </div>
    );
  };

  // =======================
  // Render
  // =======================
  return (
    <div className="modal-overlay" onClick={onCancel}>
      <div
        className="modal-content"
        onClick={(e) => e.stopPropagation()}
      >
        {/* HEADER */}
        <div className="modal-header">
          <div>
            <h4>Household Setup</h4>
            <div style={{ fontSize: 13 }}>
              Barangay: <strong>{barangayName || "Not Selected"}</strong>
            </div>
          </div>
          <button className="modal-close" onClick={onCancel}>✕</button>
        </div>

        {error && <InfoBox>{error}</InfoBox>}

        {/* FILTERS */}
        <div className="filter-row">
          <label>Household Type</label>
          <select
            value={householdType}
            onChange={(e) => {
              setHouseholdType(e.target.value);
              resetState();
            }}
          >
            <option value="new">New Household</option>
            <option value="existing">Existing Household</option>
          </select>

          {householdType === "new" && (
            <button
              className="save-btn primary-btn"
              onClick={handleGenerateNew}
              disabled={generating}
            >
              {generating ? "Generating..." : "Auto Generate"}
            </button>
          )}
        </div>

        {/* EXISTING SEARCH */}
     {householdType === "existing" && (
  <div className="filter-row secondary">
    {/* LOOKUP METHOD */}
    <div className="filter-group">
      <label>Lookup Method</label>
      <div className="button-group">
        <button
          className={householdLookupMethod === "by_facility" ? "active" : ""}
          onClick={() => {
            setHouseholdLookupMethod("by_facility");
            resetState();
          }}
          type="button"
        >
          By Facility No.
        </button>

        <button
          className={householdLookupMethod === "by_household" ? "active" : ""}
          onClick={() => {
            setHouseholdLookupMethod("by_household");
            resetState();
          }}
          type="button"
        >
          By Household No.
        </button>

        <button
          className={householdLookupMethod === "by_patient" ? "active" : ""}
          onClick={() => {
            setHouseholdLookupMethod("by_patient");
            resetState();
          }}
          type="button"
        >
          By Patient Name
        </button>
      </div>
    </div>

    {/* INPUT */}
    {householdLookupMethod === "by_facility" && (
      <div className="filter-group">
        <label>Facility Household No.</label>
        <input
          placeholder="FAC-001"
          value={generatedData.facility_household_no}
          onChange={(e) =>
            setGeneratedData({
              facility_household_no: e.target.value,
              household_no: "",
            })
          }
        />
      </div>
    )}

    {householdLookupMethod === "by_household" && (
      <div className="filter-group">
        <label>Household No.</label>
        <input
          placeholder="HH-001"
          value={generatedData.household_no}
          onChange={(e) =>
            setGeneratedData((prev) => ({
              ...prev,
              household_no: e.target.value,
            }))
          }
        />
      </div>
    )}

    {householdLookupMethod === "by_patient" && (
      <>
        <div className="filter-group">
          <label>First Name</label>
          <input
            placeholder="First Name"
            value={patientSearchData.first_name}
            onChange={(e) =>
              setPatientSearchData((prev) => ({
                ...prev,
                first_name: e.target.value,
              }))
            }
          />
        </div>

        <div className="filter-group">
          <label>Last Name</label>
          <input
            placeholder="Last Name"
            value={patientSearchData.last_name}
            onChange={(e) =>
              setPatientSearchData((prev) => ({
                ...prev,
                last_name: e.target.value,
              }))
            }
          />
        </div>

        <div className="filter-group">
          <label>Gender</label>
          <select
            value={patientSearchData.gender}
            onChange={(e) =>
              setPatientSearchData((prev) => ({
                ...prev,
                gender: e.target.value,
              }))
            }
          >
            <option value="">-- Select --</option>
            <option value="Male">Male</option>
            <option value="Female">Female</option>
          </select>
        </div>

        <div className="filter-group">
          <label>Date of Birth</label>
          <input
            type="date"
            value={patientSearchData.date_of_birth}
            onChange={(e) =>
              setPatientSearchData((prev) => ({
                ...prev,
                date_of_birth: e.target.value,
              }))
            }
          />
        </div>
      </>
    )}

    {/* SEARCH BUTTON */}
    <button
      className="save-btn"
      onClick={
        householdLookupMethod === "by_facility"
          ? handleFetchHouseholdByFacility
          : householdLookupMethod === "by_household"
          ? handleFetchHouseholdByNumber
          : handleFetchHouseholdByPatientName
      }
      disabled={generating}
    >
      Search
    </button>
  </div>
)}


        {/* TABLE */}
     <div className="household-table-wrapper">
 <BaseTable
  columns={tableColumns}
  data={existingHouseholdTableData}
  loading={generating}
  selectedRowKey={generatedData.household_no}
  onRowClick={(row) => {
    setGeneratedData((prev) => ({
      ...prev,
      household_no: row.household_no,
      facility_household_no: row.facility_household_no,
    }));
  }}
  emptyMessage={
    householdType === "existing"
      ? "No households found"
      : "Search households to display"
  }
/>

</div>


        {/* ACTIONS */}
        <div className="modal-actions">
          <button className="cancel-btn" onClick={onCancel}>
            Cancel
          </button>
          <button className="save-btn" onClick={handleConfirm}>
            Confirm & Use
          </button>
        </div>
      </div>
    </div>
  );
}

export default GenerateHouseholdModal;
