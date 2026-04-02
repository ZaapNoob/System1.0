import { useState, useEffect } from "react";
import BaseTable from "../BaseTable";
import {
  fetchPatientsWithConsultations,
  fetchPatientsWithLabRequests,
  fetchPatientsWithMedicalCertificates,
  fetchPatientsList
} from "../../api/reports";
import { getFullPatientDetails } from "../../api/patients";
import { useModal } from "../modal/ModalProvider";
import ViewPatientModal from "./ViewPatientModal";
import "./patient-details-modal.css";

export default function PatientDetailsModal({ barangayId, barangayName, reportType, filters = {} }) {
  const { openModal } = useModal();
  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPatients = async () => {
      setLoading(true);
      setError(null);

      try {
        // Merge barangay ID with provided filters
        const mergedFilters = {
          ...filters,
          barangay: barangayId
        };

        let data;

        // Choose the correct API function based on report type
        if (reportType === "patients") {
          data = await fetchPatientsList(mergedFilters);
        } else if (reportType === "labRequests") {
          data = await fetchPatientsWithLabRequests(mergedFilters);
        } else if (reportType === "medicalCertificates") {
          data = await fetchPatientsWithMedicalCertificates(mergedFilters);
        } else {
          // consultations
          data = await fetchPatientsWithConsultations(mergedFilters);
        }

        setPatients(data || []);
      } catch (err) {
        console.error("Error fetching patient details:", err);
        setError("Failed to load patient details");
      } finally {
        setLoading(false);
      }
    };

    if (barangayId) {
      fetchPatients();
    }
  }, [barangayId, reportType, filters]);

  // Handle View Profile
  const handleViewProfile = async (row) => {
    try {
      if (!row.patient_id) {
        console.error("Patient ID not found");
        return;
      }

      const res = await getFullPatientDetails(row.patient_id);

      if (res?.success) {
        openModal(
          <ViewPatientModal
            patient={res.data}
            showFamily={true}
          />
        );
      } else {
        console.error("Failed to fetch patient details");
      }
    } catch (err) {
      console.error("Error viewing patient profile:", err);
    }
  };

  const columns = [
    {
      key: "index",
      header: "#",
      render: (_, index) => index + 1,
    },
    {
      key: "patient_name",
      header: "Patient Name",
    },
    {
      key: "gender",
      header: "Gender",
    },
    {
      key: "age",
      header: "Age",
    },
    {
      key: "status",
      header: "Status",
    },
    {
      key: "action",
      header: "Action",
      render: (row) => (
        <button
          className="detail-btn"
          onClick={() => handleViewProfile(row)}
        >
          View Profile
        </button>
      ),
    },
  ];

  return (
    <div className="patient-details-modal">

      <h3>Patients in {barangayName}</h3>

      {error && (
        <div className="error-message">
          {error}
        </div>
      )}

      <BaseTable
        columns={columns}
        data={patients}
        loading={loading}
        emptyMessage={`No patients found in ${barangayName}`}
      />

      <div className="modal-footer">
        <p>
          <strong>Total Patients:</strong> {patients.length}
        </p>
      </div>

    </div>
  );
}