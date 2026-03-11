import { useState } from "react";
import "./Reports.css";
import BarGraph from "../components/patients-display/Bargraph";
import ReportTable from "../components/patients-display/report-table";
import { useReports } from "../hooks/reports";

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
    handleGenerate
  } = useReports();

  // View mode state: "chart" or "table"
  const [viewMode, setViewMode] = useState("chart");
  const showChart = () => setViewMode("chart");
  const showTable = () => setViewMode("table");

  const handleBackToDashboard = () => {
    onNavigateToDashboard();
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

      {/* MAIN */}
      <main className="reports-main">

        {/* FILTER SECTION */}
        <section className="filter-section">
          <h2>🔎 Report Filters</h2>
          <div className="filters-grid">

            {/* DATE */}
            <div className="filter-group">
              <label>Start Date</label>
              <input
                type="date"
                value={filters.startDate}
                onChange={(e) => handleChange("startDate", e.target.value)}
              />
            </div>
            <div className="filter-group">
              <label>End Date</label>
              <input
                type="date"
                value={filters.endDate}
                onChange={(e) => handleChange("endDate", e.target.value)}
              />
            </div>

            {/* LOCATION */}
            <div className="filter-group">
              <label>Barangay</label>
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
            </div>

            {/* DOCTOR */}
            <div className="filter-group">
              <label>Doctor</label>
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
            </div>

            {/* REPORT TYPE */}
            <div className="filter-group">
              <label>Report Type</label>
              <select
                value={filters.reportType}
                onChange={(e) => handleChange("reportType", e.target.value)}
              >
                <option value="consultations">Consultations per Barangay</option>
                <option value="patients">Patients per Barangay</option>
                <option value="labRequests">Lab Requests per Barangay</option>
                <option value="medicalCertificates">Medical Certificates per Barangay</option>
              </select>
            </div>

            {/* CONSULTATION TYPE */}
            <div className="filter-group">
              <label>Consultation Type</label>
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
            </div>

            {/* GENDER */}
            <div className="filter-group">
              <label>Gender</label>
              <select
                value={filters.gender}
                onChange={(e) => handleChange("gender", e.target.value)}
              >
                <option value="all">All</option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
              </select>
            </div>

            {/* AGE GROUP */}
            <div className="filter-group">
              <label>Age Group</label>
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
            </div>

            {/* VISIT TYPE */}
            <div className="filter-group">
              <label>Visit Type</label>
              <select
                value={filters.visitType}
                onChange={(e) => handleChange("visitType", e.target.value)}
              >
                <option value="all">All</option>
                <option value="New Consultation">New Consultation</option>
                <option value="Follow-up Consultation">Follow-up Consultation</option>
                <option value="Problem Consultation (New Symptoms)">Problem Consultation (New Symptoms)</option>
              </select>
            </div>

            {/* REFERRAL */}
            <div className="filter-group">
              <label>Referral Status</label>
              <select
                value={filters.referral}
                onChange={(e) => handleChange("referral", e.target.value)}
              >
                <option value="all">All</option>
                <option value="Yes">Yes</option>
                <option value="No">No</option>
              </select>
            </div>

            {/* PATIENT STATUS */}
            <div className="filter-group">
              <label>Patient Status</label>
              <select
                value={filters.patientStatus}
                onChange={(e) => handleChange("patientStatus", e.target.value)}
              >
                <option value="all">All</option>
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
                <option value="deceased">Deceased</option>
              </select>
            </div>

            {/* LAB REQUEST */}
            <div className="filter-group">
              <label>Lab Request</label>
              <select
                value={filters.labRequest}
                onChange={(e) => handleChange("labRequest", e.target.value)}
              >
                <option value="all">All</option>
                <option value="requested">Requested</option>
                <option value="completed">Completed</option>
              </select>
            </div>

            {/* MEDICAL CERTIFICATE */}
            <div className="filter-group">
              <label>Medical Certificate</label>
              <select
                value={filters.certificate}
                onChange={(e) => handleChange("certificate", e.target.value)}
              >
                <option value="all">All</option>
                <option value="issued">Issued</option>
              </select>
            </div>

          </div>

          {/* GENERATE BUTTON */}
          <div className="filter-actions">
            <button className="btn-generate" onClick={handleGenerate}>
              Generate Report
            </button>
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
    {(viewMode === "chart" && reportData.length > 0) && (
      <BarGraph data={reportData} reportType={filters.reportType} />
    )}

    {(viewMode === "table" && (
      (filters.reportType === "patients" && patientList.length > 0) ||
      (filters.reportType !== "patients" && reportData.length > 0)
    )) && (
      <ReportTable
        data={filters.reportType === "patients" ? patientList : reportData}
        reportType={filters.reportType}
      />
    )}
  </>
)}
{!loading &&
 !error &&
 reportData.length === 0 &&
 patientList.length === 0 && (
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