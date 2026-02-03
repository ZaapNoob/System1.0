import API from "../config/api";
import { apiFetch } from "../utils/api";



export const getFullPatientDetails = async (id) => {
  return apiFetch(`${API}/patients/get-patient-editmode.php?id=${id}`);
};



/* =========================
   BARANGAYS
========================= */
export const fetchBarangays = async () => {
  return apiFetch(`${API}/patients/list.php`);
};

/* =========================
   SEARCH HOUSEHOLDS
========================= */
export const searchHouseholds = async (barangayId, firstName) => {
  return apiFetch(
    `${API}/patients/search-households.php?barangay_id=${barangayId}&first_name=${encodeURIComponent(
      firstName
    )}`
  );
};

/* =========================
   GENERATE HOUSEHOLD
========================= */
export const generateHousehold = async (barangayId) => {
  return apiFetch(
    `${API}/patients/generate-household.php?barangay_id=${barangayId}`
  );
};

export const generateFacilityHousehold = async (barangayId) => {
  return apiFetch(
    `${API}/patients/generate-facility-household.php?barangay_id=${barangayId}`
  );
};

/* =========================
   MOVE HOUSEHOLD
========================= */
export const movePatientHousehold = async (payload) => {
  return apiFetch(`${API}/patients/move-household.php`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });
};

/* =========================
   UPDATE PATIENT
========================= */
export const updatePatient = async (payload) => {
  return apiFetch(`${API}/patients/update.php`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });
};
