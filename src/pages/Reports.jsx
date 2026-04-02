import { useState, useEffect } from "react";
import "./reports.css";
import "react-date-range/dist/styles.css";
import "react-date-range/dist/theme/default.css";
import BarGraph from "../components/patients-display/Bargraph";
import ReportTable from "../components/patients-display/report-table";
import { useReports } from "../hooks/reports";
import { DateRange } from "react-date-range";

export default function Reports({ user, selectedPages, onNavigateToDashboard }) {
  const {
    filters,
    reportData,
    patientList,
    loading,
    error,
    barangays,
    doctors,
    loadingDropdowns,
    handleChange,
    handleGenerate,
    handleClearFilters
  } = useReports();

  const [viewMode, setViewMode] = useState("chart");
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showAllData, setShowAllData] = useState(false);
  const [dateRange, setDateRange] = useState([
    {
      startDate: new Date(),
      endDate: new Date(),
      key: 'selection'
    }
  ]);

  // Sync filters dates to dateRange on mount
  useEffect(() => {
    if (filters.startDate && filters.endDate) {
      const startDate = new Date(filters.startDate);
      const endDate = new Date(filters.endDate);
      setDateRange([
        {
          startDate,
          endDate,
          key: 'selection'
        }
      ]);
    }
  }, []);

  const showChart = () => setViewMode("chart");
  const showTable = () => setViewMode("table");

  const handleBackToDashboard = () => {
    onNavigateToDashboard();
  };

  const isConsultationReport = filters.reportType === "consultations";

  // Handle "All Data" selection
  const handleAllData = () => {
    setShowAllData(true);
    setShowDatePicker(false);
    // Clear date filters to show all data
    handleChange("startDate", "");
    handleChange("endDate", "");
  };

  // Handle custom date range selection
  const handleCustomDateRange = () => {
    setShowAllData(false);
    setShowDatePicker(!showDatePicker);
  };

  const handleClearAllFilters = () => {
    handleClearFilters();
    setShowAllData(false);
    setShowDatePicker(false);
    const today = new Date();
    setDateRange([{ startDate: today, endDate: today, key: 'selection' }]);
  };

  // Handle date range change and update filters
  const handleDateRangeChange = (item) => {
    setDateRange([item.selection]);
    setShowAllData(false);
    
    // Convert dates to YYYY-MM-DD format for API
    const startDate = item.selection.startDate
      ? item.selection.startDate.toISOString().split('T')[0]
      : "";
    const endDate = item.selection.endDate
      ? item.selection.endDate.toISOString().split('T')[0]
      : "";

    handleChange("startDate", startDate);
    handleChange("endDate", endDate);
  };

  return (
    <div className="reports-container">

      {/* HEADER */}
      <header className="reports-header">
        <div className="header-content">
          <button className="back-btn" onClick={handleBackToDashboard}>
            ← Back to Dashboard
          </button>
          <h1>📊 Reports</h1>
          <p className="subtitle">
            Generate healthcare reports using advanced filters
          </p>
        </div>
      </header>

      

      <main className="reports-main">

        {/* FILTER SECTION */}
        <section className="filter-section">
          <h2>🔎 Report Filters</h2>

          <div className="filters-grid">

            {/* DATE RANGE PICKER - HIDDEN BY DEFAULT */}
            {showDatePicker && (
              <div className="filter-group date-range-group">
                <DateRange
                  editableDateInputs={true}
                  onChange={handleDateRangeChange}
                  moveRangeOnFirstSelection={false}
                  ranges={dateRange}
                />
              </div>
            )}
            <div className="filter-group">
              <label>Date Range</label>
              <div className="date-buttons-group" style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
                <button 
                  className={`btn-date-option ${showAllData ? "active" : ""}`}
                  onClick={handleAllData}
                  style={{
                    padding: "8px 16px",
                    borderRadius: "4px",
                    border: "1px solid #ccc",
                    backgroundColor: showAllData ? "#4CAF50" : "#fff",
                    color: showAllData ? "#fff" : "#333",
                    cursor: "pointer",
                    fontWeight: showAllData ? "600" : "400",
                    transition: "all 0.3s ease"
                  }}
                >
                  📊 All Data
                </button>
                <button 
                  className={`btn-date-option ${!showAllData && showDatePicker ? "active" : ""}`}
                  onClick={handleCustomDateRange}
                  style={{
                    padding: "8px 16px",
                    borderRadius: "4px",
                    border: "1px solid #ccc",
                    backgroundColor: !showAllData && showDatePicker ? "#2196F3" : "#fff",
                    color: !showAllData && showDatePicker ? "#fff" : "#333",
                    cursor: "pointer",
                    fontWeight: !showAllData && showDatePicker ? "600" : "400",
                    transition: "all 0.3s ease"
                  }}
                >
                  {showDatePicker ? "📅 Hide Date Range" : "📅 Custom Date Range"}
                </button>
              </div>
            </div>

            {/* BARANGAY */}
            <div className="filter-group">
              <label>Barangay</label>
              <div className="custom-combobox barangay">
                <select
                  value={filters.barangay}
                  onChange={(e) => handleChange("barangay", e.target.value)}
                  disabled={loadingDropdowns}
                >
                  <option value="all">All Barangays</option>
                  {barangays.map((b) => (
                    <option key={b.id} value={b.id}>{b.name}</option>
                  ))}
                </select>
                <span className="arrow">▼</span>
              </div>
            </div>

            {/* REPORT TYPE */}
            <div className="filter-group">
              <label>Report Type</label>
              <div className="custom-combobox reportType">
                <select
                  value={filters.reportType}
                  onChange={(e) => handleChange("reportType", e.target.value)}
                >
                  <option value="consultations">Consultations per Barangay</option>
                  <option value="patients">Patients per Barangay</option>
                  <option value="labRequests">Lab Requests per Barangay</option>
                  <option value="medicalCertificates">Medical Certificates per Barangay</option>
                </select>
                <span className="arrow">▼</span>
              </div>
            </div>

            {/* DOCTOR (ONLY FOR CONSULTATIONS REPORT) */}
            {isConsultationReport && (
              <div className="filter-group">
                <label>Doctor</label>
                <div className="custom-combobox doctor">
                  <select
                    value={filters.doctor}
                    onChange={(e) => handleChange("doctor", e.target.value)}
                    disabled={loadingDropdowns}
                  >
                    <option value="all">All Doctors</option>
                    {doctors.map((d) => (
                      <option key={d.id} value={d.id}>{d.name}</option>
                    ))}
                  </select>
                  <span className="arrow">▼</span>
                </div>
              </div>
            )}

            {/* CONSULTATION TYPE */}
            {isConsultationReport && (
              <div className="filter-group">
                <label>Consultation Type</label>
                <div className="custom-combobox consultationType">
                  <select
                    value={filters.consultationType}
                    onChange={(e) => handleChange("consultationType", e.target.value)}
                  >
                    <option value="all">All Consultations</option>
                    <option value="General">General</option>
                    <option value="Prenatal">Prenatal</option>
                    <option value="Dental Care">Dental Care</option>
                    <option value="Child Care">Child Care</option>
                    <option value="Child Nutrition">Child Nutrition</option>
                    <option value="Injury">Injury</option>
                    <option value="Adult Immunization">Adult Immunization</option>
                    <option value="Family Planning">Family Planning</option>
                    <option value="Postpartum">Postpartum</option>
                    <option value="Tuberculosis">Tuberculosis</option>
                    <option value="Child Immunization">Child Immunization</option>
                    <option value="Sick Children">Sick Children</option>
                    <option value="Firecracker Injury">Firecracker Injury</option>
                    <option value="Mental Health">Mental Health</option>
                  </select>
                  <span className="arrow">▼</span>
                </div>
              </div>
            )}

            {/* GENDER */}
            <div className="filter-group">
              <label>Gender</label>
              <div className="custom-combobox gender">
                <select
                  value={filters.gender}
                  onChange={(e) => handleChange("gender", e.target.value)}
                >
                  <option value="all">All</option>
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                </select>
                <span className="arrow">▼</span>
              </div>
            </div>

            {/* AGE GROUP */}
            <div className="filter-group">
              <label>Age Group</label>
              <div className="custom-combobox ageGroup">
                <select
                  value={filters.ageGroup}
                  onChange={(e) => handleChange("ageGroup", e.target.value)}
                >
                  <option value="all">All</option>
                  <option value="0-5">0-5 (Infant)</option>
                  <option value="6-12">6-12 (Child)</option>
                  <option value="13-17">13-17 (Teen)</option>
                  <option value="18-59">18-59 (Adult)</option>
                  <option value="60+">60+ (Senior Citizen)</option>
                </select>
                <span className="arrow">▼</span>
              </div>
            </div>

            {/* VISIT TYPE */}
            {isConsultationReport && (
              <div className="filter-group">
                <label>Visit Type</label>
                <div className="custom-combobox visitType">
                  <select
                    value={filters.visitType}
                    onChange={(e) => handleChange("visitType", e.target.value)}
                  >
                    <option value="all">All</option>
                    <option value="New Consultation">New Consultation</option>
                    <option value="Follow-up Consultation">Follow-up Consultation</option>
                    <option value="Problem Consultation (New Symptoms)">
                      Problem Consultation (New Symptoms)
                    </option>
                  </select>
                  <span className="arrow">▼</span>
                </div>
              </div>
            )}

            {/* REFERRAL STATUS */}
            {isConsultationReport && (
              <div className="filter-group">
                <label>Referral Status</label>
                <div className="custom-combobox referral">
                  <select
                    value={filters.referral}
                    onChange={(e) => handleChange("referral", e.target.value)}
                  >
                    <option value="all">All</option>
                    <option value="Yes">Yes</option>
                    <option value="No">No</option>
                  </select>
                  <span className="arrow">▼</span>
                </div>
              </div>
            )}

            {/* PATIENT STATUS */}
            <div className="filter-group">
              <label>Patient Status</label>
              <div className="custom-combobox patientStatus">
                <select
                  value={filters.patientStatus}
                  onChange={(e) => handleChange("patientStatus", e.target.value)}
                >
                  <option value="all">All</option>
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                  <option value="deceased">Deceased</option>
                </select>
                <span className="arrow">▼</span>
              </div>
            </div>
             
          </div>

      <div className="filter-actions-card">
        <div className="filter-actions">
          <button className="btn-clear" onClick={handleClearAllFilters}>
            🗑️ Clear All Filters
          </button>

          <button className="btn-generate" onClick={handleGenerate}>
            Generate Report
          </button>
        </div>
      </div>

          {/* VIEW MODE BUTTONS */}
          <div className="report-view-buttons">
            <button onClick={showChart} className={viewMode === "chart" ? "active" : ""}>
              📊 Show Chart
            </button>
            <button onClick={showTable} className={viewMode === "table" ? "active" : ""}>
              📋 Show Table
            </button>
          </div>

        </section>

        {/* REPORT DISPLAY */}
        <section className="report-display-section">
          <div className={`report-display-container ${viewMode === "table" ? "table-view" : ""}`}>

            {loading && <div className="loading-message">📊 Loading report...</div>}

            {error && <div className="error-message">⚠️ {error}</div>}

            {!loading && !error && (
              <>
                {viewMode === "chart" && reportData.length > 0 && (
                  <BarGraph data={reportData} reportType={filters.reportType} />
                )}

                {viewMode === "table" && reportData.length > 0 && (
                  <ReportTable data={reportData} reportType={filters.reportType} />
                )}
              </>
            )}

            {!loading && !error && reportData.length === 0 && patientList.length === 0 && (
              <div className="empty-report">
                <h3>📊 Report Area</h3>
                <p>Charts and tables will appear here after generating a report.</p>
              </div>
            )}

          </div>
        </section>

      </main>
    </div>
  );
}