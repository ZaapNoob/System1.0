import { useState, useEffect } from "react";
import {
  fetchBarangays,
  fetchDoctors,
  fetchBarangayStats,
  fetchPatientsPerBarangay,
  fetchPatientsList,
  fetchPatientsWithConsultations,
  fetchPatientsWithLabRequests,
  fetchPatientsWithMedicalCertificates,
  fetchLabRequestsPerBarangay,
  fetchMedicalCertificatesPerBarangay
} from "../../api/reports";

/**
 * useReports Hook - Manages all report generation logic
 * Handles filters, API calls, loading states, and data formatting
 */
export const useReports = () => {

  const [filters, setFilters] = useState({
    startDate: "",
    endDate: "",
    barangay: "all",
    doctor: "all",
    consultationType: "all",
    gender: "all",
    ageGroup: "all",
    visitType: "all",
    referral: "all",
    labRequest: "all",
    certificate: "all",
    patientStatus: "all",
    reportType: "consultations"
  });

  // Chart data (for BarGraph)
  const [reportData, setReportData] = useState([]);

  // Detailed patients list (for ReportTable)
  const [patientList, setPatientList] = useState([]);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Dropdown states
  const [barangays, setBarangays] = useState([]);
  const [doctors, setDoctors] = useState([]);
  const [loadingDropdowns, setLoadingDropdowns] = useState(false);

  /**
   * Load dropdown data (barangays + doctors)
   */
  useEffect(() => {
    const loadDropdownData = async () => {
      setLoadingDropdowns(true);
      try {
        const [barangayData, doctorData] = await Promise.all([
          fetchBarangays(),
          fetchDoctors()
        ]);
        setBarangays(barangayData);
        setDoctors(doctorData);
      } catch (err) {
        console.error("Error loading dropdown data:", err);
      } finally {
        setLoadingDropdowns(false);
      }
    };
    loadDropdownData();
  }, []);

  /**
   * Update filter values
   */
  const handleChange = (field, value) => {
    setFilters(prev => ({
      ...prev,
      [field]: value
    }));
  };

  /**
   * Generate report based on selected report type
   */
  const handleGenerate = async () => {
    setLoading(true);
    setError(null);
    setReportData([]);
    setPatientList([]);

    try {
      let response;

      switch (filters.reportType) {
        /**
         * PATIENT REPORT
         */
        case "patients":
          let patientResponse;

          // Prioritize specific patient filters
          if (filters.labRequest !== "all") {
            patientResponse = await fetchPatientsWithLabRequests(filters);
          } else if (filters.certificate !== "all") {
            patientResponse = await fetchPatientsWithMedicalCertificates(filters);
          } else if (filters.consultationType !== "all" || filters.visitType !== "all") {
            patientResponse = await fetchPatientsWithConsultations(filters);
          } else {
            patientResponse = await fetchPatientsList(filters);
          }

          // Optionally fetch chart data if relevant
          const chartResponse = await fetchPatientsPerBarangay(filters);

          if (chartResponse?.length) {
            const formattedData = chartResponse.map(item => ({
              label: item.barangay,
              value: item.total
            }));
            setReportData(formattedData);
          }

          if (patientResponse?.length) {
            setPatientList(patientResponse);
          }

          if (!chartResponse?.length && !patientResponse?.length) {
            setError("No patient data found for selected filters");
          }
          break;

        /**
         * LAB REQUESTS REPORT
         */
        case "labRequests":
          response = await fetchLabRequestsPerBarangay(filters);
          if (response?.length) {
            const formattedData = response.map(item => ({
              label: item.barangay,
              value: item.total
            }));
            setReportData(formattedData);
          } else {
            setError("No lab request data available for selected filters");
          }
          break;

        /**
         * MEDICAL CERTIFICATES REPORT
         */
        case "medicalCertificates":
          response = await fetchMedicalCertificatesPerBarangay(filters);
          if (response?.length) {
            const formattedData = response.map(item => ({
              label: item.barangay,
              value: item.total
            }));
            setReportData(formattedData);
          } else {
            setError("No medical certificate data available for selected filters");
          }
          break;

        /**
         * CONSULTATION REPORT (DEFAULT)
         */
        case "consultations":
        default:
          response = await fetchBarangayStats(filters);
          if (response?.length) {
            const formattedData = response.map(item => ({
              label: item.barangay,
              value: item.total
            }));
            setReportData(formattedData);
          } else {
            setError("No consultation data available for selected filters");
          }
          break;
      }

    } catch (err) {
      console.error(err);
      setError("Error generating report: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  return {
    // Filters
    filters,
    handleChange,

    // Chart & Table Data
    reportData,
    patientList,

    // Status
    loading,
    error,

    // Dropdowns
    barangays,
    doctors,
    loadingDropdowns,

    // Functions
    handleGenerate,
    setError,
    setReportData,
    setPatientList
  };
};