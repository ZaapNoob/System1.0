import React, { useState, useMemo } from "react";
import "./report-table.css";

export default function ReportTable({ data = [], reportType = "consultations" }) {
  const [sortConfig, setSortConfig] = useState({ key: "barangay", direction: "asc" });

  const getTitleFromReportType = () => {
    switch (reportType) {
      case "patients":
        return "Patient Details per Barangay";
      case "labRequests":
        return "Lab Requests per Barangay";
      case "medicalCertificates":
        return "Medical Certificates per Barangay";
      case "consultations":
      default:
        return "Consultations per Barangay";
    }
  };

  // Check if this is patient detailed list data
  const isPatientList = reportType === "patients" && data.length > 0 && data[0].patient_id;

  // Group patients by barangay and sort
  const groupedData = useMemo(() => {
    if (!isPatientList) return [];

    const grouped = data.reduce((acc, patient) => {
      const barangay = patient.barangay || "Unknown";
      if (!acc[barangay]) acc[barangay] = [];
      acc[barangay].push(patient);
      return acc;
    }, {});

    const sortedBarangays = Object.keys(grouped).sort();
    return { grouped, sortedBarangays };
  }, [data, isPatientList]);

  const handleSort = (key) => {
    setSortConfig((prev) => ({
      key,
      direction: prev.key === key && prev.direction === "asc" ? "desc" : "asc",
    }));
  };

  // Totals
  const totalPatients = data.length;
  const totalBarangays = isPatientList ? groupedData.sortedBarangays?.length || 0 : 0;

  return (
    <>
      <header>
        <h1>Health Center Reports</h1>
      </header>

      <article>
        <h2>{getTitleFromReportType()}</h2>

        {isPatientList ? (
          <div className="patient-list-container">
            <div className="patient-list-stats">
              <span><strong>{totalPatients}</strong> Total Patients</span>
              <span><strong>{totalBarangays}</strong> Barangays</span>
            </div>

            <table className="patients-table">
              <thead>
                <tr>
                  <th>#</th>
                  <th>Patient Name</th>
                  <th>Patient ID</th>
                  <th>Age</th>
                  <th>Gender</th>
                  <th>Status</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {groupedData.sortedBarangays?.map((barangay) => {
                  const patients = groupedData.grouped[barangay];
                  return (
                    <React.Fragment key={barangay}>
                      <tr className="barangay-separator">
                        <td colSpan="7">
                          <strong>{barangay}</strong> ({patients.length})
                        </td>
                      </tr>
                      {patients.map((patient, index) => {
                        const age = patient.age || "N/A";
                        return (
                          <tr key={patient.patient_id}>
                            <td>{index + 1}</td>
                            <td className="patient-name">{patient.patient_name}</td>
                            <td>{patient.patient_id}</td>
                            <td>{age}</td>
                            <td>{patient.gender || "N/A"}</td>
                            <td>
                              <span className={`status-badge status-${patient.status || "active"}`}>
                                {patient.status || "Active"}
                              </span>
                            </td>
                            <td>
                              <button className="report-btn">View Details</button>
                            </td>
                          </tr>
                        );
                      })}
                    </React.Fragment>
                  );
                })}
              </tbody>
            </table>
          </div>
        ) : (
          <table className="patients-table">
            <thead>
              <tr>
                <th>#</th>
                <th>Barangay</th>
                <th>Count</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {data.length === 0 ? (
                <tr>
                  <td colSpan="4">No report data available</td>
                </tr>
              ) : (
                data.map((item, index) => (
                  <tr key={index}>
                    <td>{index + 1}</td>
                    <td>{item.label || item.barangay}</td>
                    <td>{item.value || item.total}</td>
                    <td>
                      <button className="report-btn">View Details</button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
            <tfoot>
              <tr>
                <td colSpan="2"><strong>Total</strong></td>
                <td>
                  <strong>{data.reduce((sum, item) => sum + (item.value || item.total || 0), 0)}</strong>
                </td>
                <td></td>
              </tr>
              <tr>
                <td colSpan="4">
                  <p><strong>Note:</strong> This table shows summarized report data per barangay.</p>
                </td>
              </tr>
            </tfoot>
          </table>
        )}
      </article>
    </>
  );
}