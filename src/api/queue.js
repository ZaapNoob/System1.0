import API from "../config/api";
import { apiFetch } from "../utils/api";




/* =========================
   PREVIEW QUEUE NUMBER
========================= */
export const previewQueueNumber = async (queueType) => {
  return apiFetch(
    `${API}/Queue/preview-queue.php?queue_type=${queueType}`
  );
};

/* =========================
   GENERATE QUEUE NUMBER
========================= */
export const generateQueueNumber = async (payload) => {
  return apiFetch(`${API}/Queue/generate-queue.php`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });
};

/* =========================
   ACCEPT / SERVE PATIENT
========================= */
// src/api/queue.js
export const acceptQueuePatient = async (queueId, userId) => {
  return apiFetch(`${API}/Queue/accept-queue.php`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ 
      queue_id: queueId,
      administered_by: userId
    }),
  });
};

/* =========================
   FETCH QUEUE STATISTICS
========================= */
export const fetchQueueStats = async (userId) => {
  return apiFetch(
    `${API}/Queue/queue-stats.php?user_id=${userId}`
  );
};

/* =========================
   FETCH DOCTOR STATISTICS
========================= */
export const fetchDoctorStats = async (doctorId) => {
  return apiFetch(
    `${API}/Queue/doctor-stats.php?doctor_id=${doctorId}`
  );
};
