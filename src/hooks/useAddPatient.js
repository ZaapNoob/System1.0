import { useState, useEffect } from "react";
import API from "../config/api";
import { apiFetch } from "../utils/api";

export default function useAddPatient() {

  // =======================
  // UI STATES
  // =======================
  const [showAddForm, setShowAddForm] = useState(false);
  const [showAdditionalInfo, setShowAdditionalInfo] = useState(false);
  const [isFamilyMember, setIsFamilyMember] = useState(false);
  const [showCreatePurok, setShowCreatePurok] = useState(false);

  const [barangays, setBarangays] = useState([]);
  const [puroks, setPuroks] = useState([]);

  const [purokLoading, setPurokLoading] = useState(false);
  const [loading, setLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [error, setError] = useState("");
  const [newPurokName, setNewPurokName] = useState("");

  // =======================
  // INITIAL PATIENT STATE
  // =======================
  const initialPatientState = {
    date_of_birth: "",
    first_name: "",
    middle_name: "",
    last_name: "",
    suffix: "",
    gender: "",
    marital_status: "",
    barangay_id: "",
    purok_id: "",
    birthplace: "",
    blood_type: "",
    mother_name: "",
    spouse_name: "",
    contact_number: "",
    household_no: "",
    facility_household_no: "",
    education_level: "",
    employment_status: "",
    family_member_type: "",
    dswd_nhts: "No",
    member_4ps: "No",
    pcb_member: "No",
    philhealth_member: "No",
    philhealth_status_type: "",
    philhealth_no: "",
    philhealth_category: "None",
  };

  const [newPatient, setNewPatient] = useState(initialPatientState);

  // =======================
  // HELPERS
  // =======================
  const cleanPayload = (obj) =>
    Object.fromEntries(
      Object.entries(obj).filter(
        ([, v]) => v !== "" && v !== null && v !== undefined
      )
    );

  const formatPurokInput = (value) =>
    value
      .replace(/\s+/g, " ")
      .replace(/\bprk\.?\b/gi, "Purok")
      .replace(/\bsit\.?\b/gi, "Sitio")
      .replace(/\bsubd\.?\b/gi, "Subdivision");

  const normalizePurokName = (value) =>
    value
      .trim()
      .replace(/\s+/g, " ")
      .split(" ")
      .map(w => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase())
      .join(" ");

  // =======================
  // FETCH BARANGAYS
  // =======================
  useEffect(() => {
    apiFetch(`${API}/patients/list.php`)
      .then(res => setBarangays(res.data))
      .catch(console.error);
  }, []);

  // =======================
  // FETCH PUROKS
  // =======================
  useEffect(() => {
    if (!newPatient.barangay_id) {
      setPuroks([]);
      return;
    }

    apiFetch(
      `${API}/patients/puroks/by_barangay.php?barangay_id=${newPatient.barangay_id}`
    )
      .then(res => setPuroks(res.data))
      .catch(console.error);
  }, [newPatient.barangay_id]);

  useEffect(() => {
    if (!newPatient.barangay_id || isFamilyMember) return;

    setNewPatient(prev => ({
      ...prev,
      household_no: "",
      facility_household_no: "",
    }));
  }, [newPatient.barangay_id, isFamilyMember]);

  // =======================
  // HANDLERS
  // =======================
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewPatient(prev => ({ ...prev, [name]: value }));
  };

  const handleCreatePurok = async () => {
    if (!newPurokName.trim()) return setError("Purok name is required");
    if (!newPatient.barangay_id)
      return setError("Please select a barangay first");

    try {
      setPurokLoading(true);
      setError("");

      await apiFetch(`${API}/patients/puroks/create.php`, {
        method: "POST",
        body: JSON.stringify({
          barangay_id: Number(newPatient.barangay_id),
          purok_name: normalizePurokName(newPurokName),
        }),
      });

      const res = await apiFetch(
        `${API}/patients/puroks/by_barangay.php?barangay_id=${newPatient.barangay_id}`
      );

      setPuroks(res.data);
      setNewPurokName("");
      setShowCreatePurok(false);
      setSuccessMessage("Purok created successfully");
      setTimeout(() => setSuccessMessage(""), 5000);
    } catch (err) {
      setError(err.message);
    } finally {
      setPurokLoading(false);
    }
  };

  const handleGenerateHouseholdClick = async () => {
    if (!newPatient.barangay_id) {
      setError("Please select a barangay first");
      return;
    }

    try {
      setLoading(true);
      setError("");

      const facilityRes = await apiFetch(
        `${API}/patients/generate-facility-household.php?barangay_id=${newPatient.barangay_id}`
      );
      const householdRes = await apiFetch(`${API}/generate-household.php`);

      setNewPatient(prev => ({
        ...prev,
        facility_household_no: facilityRes.facility_household_no,
        household_no: householdRes.household_no,
      }));
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSavePatient = async () => {
    setError("");
    setSuccessMessage("");

    const requiredFields = [
      "first_name",
      "last_name",
      "gender",
      "date_of_birth",
      "barangay_id",
    ];

    for (const field of requiredFields) {
      if (!newPatient[field]) {
        setError(`${field.replace("_", " ")} is required`);
        return;
      }
    }

    try {
      setLoading(true);

      let payload = cleanPayload({
        ...newPatient,
        barangay_id: Number(newPatient.barangay_id),
        purok_id: newPatient.purok_id
          ? Number(newPatient.purok_id)
          : null,
      });

      if (payload.philhealth_member !== "Yes") {
        delete payload.philhealth_status_type;
        delete payload.philhealth_no;
        delete payload.philhealth_category;
      }

      const res = await apiFetch(`${API}/patients/create.php`, {
        method: "POST",
        body: JSON.stringify(payload),
      });

      if (isFamilyMember) {
        setNewPatient(prev => ({
          ...initialPatientState,
          barangay_id: prev.barangay_id,
          purok_id: prev.purok_id,
          household_no: prev.household_no,
          facility_household_no: prev.facility_household_no,
        }));
      } else {
        setNewPatient(initialPatientState);
      }

      setSuccessMessage(
        `Patient created successfully! Code: ${res.data.patient_code}`
      );
      setTimeout(() => setSuccessMessage(""), 5000);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // =======================
  // EXPOSE EVERYTHING
  // =======================
  return {
    showAddForm, setShowAddForm,
    showAdditionalInfo, setShowAdditionalInfo,
    isFamilyMember, setIsFamilyMember,
    showCreatePurok, setShowCreatePurok,

    barangays, puroks,
    newPatient, setNewPatient,
    newPurokName, setNewPurokName,

    loading, purokLoading,
    successMessage, error,
    setSuccessMessage, setError,

    handleInputChange,
    handleCreatePurok,
    handleGenerateHouseholdClick,
    handleSavePatient,
    formatPurokInput,
    initialPatientState,
  };
}
