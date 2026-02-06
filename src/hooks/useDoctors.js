import { useEffect, useState, useCallback, useRef } from "react";
import {
  fetchDoctors,
  fetchDoctorAssignments,
  markConsultationDone,
  setActivePatient
} from "../api/doctor";

/* =========================
   HOOK: Fetch all doctors
========================= */
export function useDoctors() {
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    let mounted = true;

    const loadDoctors = async () => {
      setLoading(true);
      setError(null);
      try {
        const data = await fetchDoctors();
        if (mounted) setDoctors(data || []);
      } catch (err) {
        if (mounted) setError(err);
      } finally {
        if (mounted) setLoading(false);
      }
    };

    loadDoctors();
    return () => (mounted = false);
  }, []);

  return { doctors, loading, error };
}

/* =========================
   HOOK: Doctor Assignments (NO FLICKER)
========================= */
export function useDoctorAssignments({ doctorId, status }) {
  const [assignments, setAssignments] = useState([]);
  const [activePatient, setActivePatientData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // 🔒 keep last snapshot (prevents useless state updates)
  const lastRef = useRef([]);

  /* =========================
     LOAD ASSIGNMENTS
     silent = true → no loading, no flicker
  ========================= */
  const loadAssignments = useCallback(
    async (silent = false) => {
      if (!doctorId) return;

      if (!silent) {
        setLoading(true);
        setError(null);
      }

      try {
        const res = await fetchDoctorAssignments({
          doctor_id: doctorId,
          status
        });

        const next = res.data || [];
        const prev = lastRef.current;

        // 🔥 Compare minimal fields only
        const isSame =
          prev.length === next.length &&
          prev.every(
            (p, i) =>
              p.id === next[i]?.id &&
              p.status === next[i]?.status &&
              p.is_active === next[i]?.is_active
          );

        if (!isSame) {
          lastRef.current = next;
          setAssignments(next);

          const active = next.find(a => a.is_active === 1) || null;
          setActivePatientData(active);
        }
      } catch (err) {
        if (!silent) setError(err);
      } finally {
        if (!silent) setLoading(false);
      }
    },
    [doctorId, status]
  );

  // Initial load ONLY
  useEffect(() => {
    loadAssignments(false);
  }, [loadAssignments]);

  /* =========================
     SET ACTIVE PATIENT
  ========================= */
  const setActive = async (assignmentId) => {
    if (!assignmentId) return null;

    const res = await setActivePatient(assignmentId);
    await loadAssignments(true); // silent refresh
    return res?.data || null;
  };

  /* =========================
     MARK DONE
  ========================= */
  const markDone = async (assignmentId) => {
    if (!assignmentId) return;

    await markConsultationDone(assignmentId);
    setActivePatientData(null);
    await loadAssignments(true); // silent refresh
  };

  return {
    assignments,
    activePatient,
    loading,
    error,
    refetch: loadAssignments, // call with true for silent
    setActive,
    markDone
  };
}