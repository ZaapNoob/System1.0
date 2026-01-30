import { useState } from "react";

export default function GenerateHouseholdModal({
  barangays,
  puroks,
  selectedBarangay,
  setSelectedBarangay,
  selectedPurok,
  setSelectedPurok,
  onClose,
  onGenerate,
  loading,
}) {
  const [error, setError] = useState("");

  const handleGenerate = () => {
    if (!selectedBarangay) {
      setError("Please select a barangay");
      return;
    }
    if (!selectedPurok) {
      setError("Please select a purok");
      return;
    }

    setError("");
    onGenerate();
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h3>Generate Household Number</h3>

        {error && <div className="error-message">{error}</div>}

        <div className="form-row">
          <label>Barangay:</label>
          <select
            value={selectedBarangay}
            onChange={(e) => setSelectedBarangay(e.target.value)}
          >
            <option value="">-- Select Barangay --</option>
            {barangays.map((b) => (
              <option key={b.id} value={b.id}>
                {b.name}
              </option>
            ))}
          </select>
        </div>

        <div className="form-row">
          <label>Purok:</label>
          <select
            value={selectedPurok}
            onChange={(e) => setSelectedPurok(e.target.value)}
            disabled={!selectedBarangay}
          >
            <option value="">-- Select Purok --</option>
            {puroks
              .filter((p) => p.barangay_id == selectedBarangay)
              .map((p) => (
                <option key={p.id} value={p.id}>
                  {p.name}
                </option>
              ))}
          </select>
        </div>

        <div className="modal-actions">
          <button onClick={onClose} disabled={loading}>
            Cancel
          </button>
          <button onClick={handleGenerate} disabled={loading}>
            {loading ? "Generating..." : "Generate"}
          </button>
        </div>
      </div>
    </div>
  );
}
s