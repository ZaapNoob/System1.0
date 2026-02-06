import API from "../config/api";
import { apiFetch } from "../utils/api";

/* =========================
   LIST DOCTORS
========================= */
export const fetchDoctors = async () => {
  const result = await apiFetch(`${API}/Doctor/list.php`);
  return result.data || [];
};


/* =========================
   ASSIGN DOCTOR
========================= */
export const assignDoctor = async ({ queue_id, patient_id, doctor_id }) => {
  return apiFetch(`${API}/Queue/assign-doctor.php`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ queue_id, patient_id, doctor_id })
  });
};

/* =========================
   GET DOCTOR ASSIGNMENTS
========================= */
export const fetchDoctorAssignments = async ({
  doctor_id,
  status
} = {}) => {
  const params = new URLSearchParams();

  if (doctor_id) params.append("doctor_id", doctor_id);
  if (status) params.append("status", status);

  return apiFetch(
    `${API}/Queue/get-doctor-assignments.php?${params.toString()}`
  );
};

/* =========================
   SET ACTIVE PATIENT
========================= */
export const setActivePatient = async (id) => {
  return apiFetch(`${API}/Doctor/set-active.php`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ id })
  });
};

/* =========================
   UPDATE DOCTOR QUEUE STATUS
========================= */
export const markConsultationDone = async (id) => {
  return apiFetch(`${API}/Queue/mark-done.php`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ id })
  });
};

