import API from "../config/api";

/*
====================================
FETCH BARANGAYS
====================================
*/
export const fetchBarangays = async () => {
  try {
    const response = await fetch(`${API}/patients/list.php`, {
      method: "GET",
      credentials: "include",
    });
    if (!response.ok) throw new Error(`HTTP error ${response.status}`);
    const data = await response.json();
    return data.success ? data.data : [];
  } catch (error) {
    console.error("Error fetching barangays:", error);
    return [];
  }
};

/*
====================================
FETCH DOCTORS
====================================
*/
export const fetchDoctors = async () => {
  try {
    const response = await fetch(`${API}/Doctor/list.php`, {
      method: "GET",
      credentials: "include",
    });
    if (!response.ok) throw new Error(`HTTP error ${response.status}`);
    const data = await response.json();
    return data.success ? data.data : [];
  } catch (error) {
    console.error("Error fetching doctors:", error);
    return [];
  }
};

/*
====================================
HELPER FUNCTION TO BUILD QUERY STRING
====================================
*/
const buildParams = (filters = {}) => {
  const params = new URLSearchParams();

  Object.entries(filters).forEach(([key, value]) => {
    if (value && value !== "all") params.append(key, value);
  });

  return params.toString();
};

/*
====================================
FETCH BARANGAY STATISTICS (CONSULTATIONS)
====================================
*/
export const fetchBarangayStats = async (filters = {}) => {
  try {
    const response = await fetch(
      `${API}/Generate Reports/reports-api.php?action=barangayStats&${buildParams(filters)}`,
      { method: "GET", credentials: "include" }
    );
    if (!response.ok) throw new Error(`HTTP error ${response.status}`);
    const data = await response.json();
    return data.success ? data.data : [];
  } catch (error) {
    console.error("Error fetching barangay stats:", error);
    return [];
  }
};

/*
====================================
FETCH PATIENTS PER BARANGAY (CHART)
====================================
*/
export const fetchPatientsPerBarangay = async (filters = {}) => {
  try {
    const response = await fetch(
      `${API}/Generate Reports/reports-api.php?action=patientsPerBarangay&${buildParams(filters)}`,
      { method: "GET", credentials: "include" }
    );
    const data = await response.json();
    return data.success ? data.data : [];
  } catch (error) {
    console.error("Error fetching patients per barangay:", error);
    return [];
  }
};

/*
====================================
FETCH LAB REQUESTS PER BARANGAY
====================================
*/
export const fetchLabRequestsPerBarangay = async (filters = {}) => {
  try {
    const response = await fetch(
      `${API}/Generate Reports/reports-api.php?action=labRequestsPerBarangay&${buildParams(filters)}`,
      { method: "GET", credentials: "include" }
    );
    if (!response.ok) throw new Error(`HTTP error ${response.status}`);
    const data = await response.json();
    return data.success ? data.data : [];
  } catch (error) {
    console.error("Error fetching lab requests per barangay:", error);
    return [];
  }
};

/*
====================================
FETCH MEDICAL CERTIFICATES PER BARANGAY
====================================
*/
export const fetchMedicalCertificatesPerBarangay = async (filters = {}) => {
  try {
    const response = await fetch(
      `${API}/Generate Reports/reports-api.php?action=medicalCertificatesPerBarangay&${buildParams(filters)}`,
      { method: "GET", credentials: "include" }
    );
    if (!response.ok) throw new Error(`HTTP error ${response.status}`);
    const data = await response.json();
    return data.success ? data.data : [];
  } catch (error) {
    console.error("Error fetching medical certificates per barangay:", error);
    return [];
  }
};

/*
====================================
FETCH FULL PATIENT LIST
====================================
*/
export const fetchPatientsList = async (filters = {}) => {
  try {
    const response = await fetch(
      `${API}/Generate Reports/reports-api.php?action=patientsList&${buildParams(filters)}`,
      { method: "GET", credentials: "include" }
    );
    if (!response.ok) throw new Error(`HTTP error ${response.status}`);
    const data = await response.json();
    return data.success ? data.data : [];
  } catch (error) {
    console.error("Error fetching patients list:", error);
    return [];
  }
};

/*
====================================
FETCH PATIENTS WITH CONSULTATIONS
====================================
*/
export const fetchPatientsWithConsultations = async (filters = {}) => {
  try {
    const response = await fetch(
      `${API}/Generate Reports/reports-api.php?action=patientsWithConsultations&${buildParams(filters)}`,
      { method: "GET", credentials: "include" }
    );
    if (!response.ok) throw new Error(`HTTP error ${response.status}`);
    const data = await response.json();
    return data.success ? data.data : [];
  } catch (error) {
    console.error("Error fetching patients with consultations:", error);
    return [];
  }
};

/*
====================================
FETCH PATIENTS WITH LAB REQUESTS
====================================
*/
export const fetchPatientsWithLabRequests = async (filters = {}) => {
  try {
    const response = await fetch(
      `${API}/Generate Reports/reports-api.php?action=patientsWithLabRequests&${buildParams(filters)}`,
      { method: "GET", credentials: "include" }
    );
    if (!response.ok) throw new Error(`HTTP error ${response.status}`);
    const data = await response.json();
    return data.success ? data.data : [];
  } catch (error) {
    console.error("Error fetching patients with lab requests:", error);
    return [];
  }
};

/*
====================================
FETCH PATIENTS WITH MEDICAL CERTIFICATES
====================================
*/
export const fetchPatientsWithMedicalCertificates = async (filters = {}) => {
  try {
    const response = await fetch(
      `${API}/Generate Reports/reports-api.php?action=patientsWithMedicalCertificates&${buildParams(filters)}`,
      { method: "GET", credentials: "include" }
    );
    if (!response.ok) throw new Error(`HTTP error ${response.status}`);
    const data = await response.json();
    return data.success ? data.data : [];
  } catch (error) {
    console.error("Error fetching patients with medical certificates:", error);
    return [];
  }
};