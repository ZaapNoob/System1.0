import { useState } from "react";
import API from "../../config/api";
import "./householdmodal.css";

function GenerateHouseholdModal({
  barangayId,
  onConfirm,
  onCancel,
  error,
  setError,
}) {
  const [householdType, setHouseholdType] = useState("new");
  const [householdLookupMethod, setHouseholdLookupMethod] =
    useState("by_facility");

  const [existingHouseholds, setExistingHouseholds] = useState([]);

  const [generatedData, setGeneratedData] = useState({
    facility_household_no: "",
    household_no: "",
  });

  const [generating, setGenerating] = useState(false);

  // =======================
  // Helpers
  // =======================
  const resetState = () => {
    setGeneratedData({ facility_household_no: "", household_no: "" });
    setExistingHouseholds([]);
    setError("");
  };

  const apiFetch = async (url) => {
    const response = await fetch(url);
    const result = await response.json();

    if (!response.ok || result.success === false) {
      throw new Error(result.error || "API error");
    }
    return result;
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

      const householdRes = await apiFetch(
        `${API}/generate-household.php`
      );

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

      if (!res.facility_household_no) {
        setError("No facility household found for this household number");
        return;
      }

      setGeneratedData((prev) => ({
        ...prev,
        facility_household_no: res.facility_household_no,
      }));
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
        <div className="modal-header">
          <h4>Household Setup</h4>
          <button className="modal-close" onClick={onCancel}>
            ✕
          </button>
        </div>

        <div className="modal-body">
          {error && <InfoBox>{error}</InfoBox>}

          <div className="form-group">
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
          </div>

          {/* NEW HOUSEHOLD */}
          {householdType === "new" && (
            <button
              className="save-btn"
              onClick={handleGenerateNew}
              disabled={generating}
              style={{ width: "100%" }}
            >
              {generating ? "Generating..." : "Auto Generate Household"}
            </button>
          )}

          {/* EXISTING HOUSEHOLD */}
          {householdType === "existing" && (
            <>
              <div className="form-group">
                <label>Lookup Method</label>
                <label>
                  <input
                    type="radio"
                    checked={householdLookupMethod === "by_facility"}
                    onChange={() => {
                      setHouseholdLookupMethod("by_facility");
                      resetState();
                    }}
                  />
                  By Facility No.
                </label>
                <label>
                  <input
                    type="radio"
                    checked={householdLookupMethod === "by_household"}
                    onChange={() => {
                      setHouseholdLookupMethod("by_household");
                      resetState();
                    }}
                  />
                  By Household No.
                </label>
              </div>

              {householdLookupMethod === "by_facility" && (
                <>
                  <input
                    placeholder="Facility Household No."
                    value={generatedData.facility_household_no}
                    onChange={(e) =>
                      setGeneratedData({
                        facility_household_no: e.target.value,
                        household_no: "",
                      })
                    }
                  />

                  <button
                    className="save-btn"
                    onClick={handleFetchHouseholdByFacility}
                    disabled={generating}
                    style={{ width: "100%" }}
                  >
                    Search
                  </button>

                  {existingHouseholds.length > 0 && (
                    <div className="form-group">
                      <label>Select Household</label>
                      <select
                        value={generatedData.household_no}
                        onChange={(e) =>
                          setGeneratedData((p) => ({
                            ...p,
                            household_no: e.target.value,
                          }))
                        }
                      >
                        <option value="">-- Select --</option>
                        {existingHouseholds.map((hh) => (
                          <option key={hh} value={hh}>
                            {hh}
                          </option>
                        ))}
                      </select>
                    </div>
                  )}
                </>
              )}

              {householdLookupMethod === "by_household" && (
                <>
                  <input
                    placeholder="Household No."
                    value={generatedData.household_no}
                    onChange={(e) =>
                      setGeneratedData((p) => ({
                        ...p,
                        household_no: e.target.value,
                      }))
                    }
                  />

                  <button
                    className="save-btn"
                    onClick={handleFetchHouseholdByNumber}
                    disabled={generating}
                    style={{ width: "100%" }}
                  >
                    Search
                  </button>
                </>
              )}
            </>
          )}
        </div>

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
