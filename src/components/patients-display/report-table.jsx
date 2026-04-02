import React, { useState, useMemo } from "react";
import "./report-table.css";
import { useModal } from "../modal/ModalProvider";
import PatientDetailsModal from "./PatientDetailsModal";

export default function ReportTable({ data = [], reportType = "consultations" }) {
  const { openModal } = useModal();
  const [selectedBarangay, setSelectedBarangay] = useState(null);

  // Helper function to get consistent count value from item
  const getItemCount = (item) => {
    const count = item.value || item.total || 0;
    return Number(count) || 0;
  };

  // Memoized total count calculation
  const totalCount = useMemo(() => {
    return data.reduce((sum, item) => sum + getItemCount(item), 0);
  }, [data]);

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

  // Handle View Details click
  const handleViewDetails = (item) => {
    const barangayId = item.barangay_id;
    const barangayName = item.label || item.barangay;
    setSelectedBarangay(barangayName);
    openModal(
      <PatientDetailsModal 
        barangayId={barangayId}
        barangayName={barangayName}
        reportType={reportType}
      />
    );
  };

  return (
    <>
      <header>
        <h1>Health Center Reports</h1>
      </header>

      <article>
        <h2>{getTitleFromReportType()}</h2>

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
                  <td>{getItemCount(item)}</td>
                  <td>
                    <button 
                      className="report-btn"
                      onClick={() => handleViewDetails(item)}
                    >
                      View Details
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
          <tfoot>
            <tr>
              <td colSpan="2"><strong>Total</strong></td>
              <td>
                <strong>{totalCount}</strong>
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
      </article>
    </>
  );
}