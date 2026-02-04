import { useEffect, useState } from "react";
import {
  fetchBarangays,
  searchHouseholds,
  generateHousehold,
  generateFacilityHousehold,
  movePatientHousehold,
  updatePatient,
  getFullPatientDetails,
} from "../api/patients";

export default function useEditPatient(patient, onSave, onClose) {
  /* =========================
     FORM DATA (single source)
  ========================= */
  const [formData, setFormData] = useState({
    first_name: "",
    middle_name: "",
    last_name: "",
    suffix: "",
    date_of_birth: "",
    gender: "",
    marital_status: "",
    birthplace: "",
    blood_type: "",
    mother_name: "",
    spouse_name: "",
    contact_number: "",
    education_level: "",
    employment_status: "",
  });

  /* =========================
     HOUSEHOLD STATES
  ========================= */
  const [showHouseholdSection, setShowHouseholdSection] = useState(false);
  const [householdType, setHouseholdType] = useState("existing");

  const [barangays, setBarangays] = useState([]);
  const [selectedBarangayId, setSelectedBarangayId] = useState("");

  const [householdNo, setHouseholdNo] = useState("");
  const [facilityHouseholdNo, setFacilityHouseholdNo] = useState("");

  const moveReason = "Patient transfer";

  /* =========================
     UI / FEEDBACK
  ========================= */
  const [loading, setLoading] = useState(false);
  const [householdLoading, setHouseholdLoading] = useState(false);
  const [searchLoading, setSearchLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(false);

  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  /* =========================
     SEARCH (EXISTING HOUSEHOLD)
  ========================= */
  const [searchTerm, setSearchTerm] = useState("");
  const [searchResults, setSearchResults] = useState([]);

  /* =========================
     🔑 SYNC PATIENT → STATE
  ========================= */
  useEffect(() => {
    if (!patient || !patient.id) return;

    const loadPatientDetails = async () => {
      setInitialLoading(true);
      try {
        const response = await getFullPatientDetails(patient.id);
        
        if (!response || !response.data) {
          throw new Error("Invalid response from server");
        }

        const data = response.data;

        setFormData({
          first_name: data.first_name || "",
          middle_name: data.middle_name || "",
          last_name: data.last_name || "",
          suffix: data.suffix || "",
          date_of_birth: data.date_of_birth || "",
          gender: data.gender || "",
          marital_status: data.marital_status || "",
          birthplace: data.birthplace || "",
          blood_type: data.blood_type || "",
          mother_name: data.mother_name || "",
          spouse_name: data.spouse_name || "",
          contact_number: data.contact_number || "",
          education_level: data.education_level || "Unknown",
          employment_status: data.employment_status || "",
        });

        setSelectedBarangayId(data.barangay_id ? String(data.barangay_id) : "");
        setHouseholdNo(data.household_no || "");
        setFacilityHouseholdNo(data.facility_household_no || "");
      } catch (err) {
        console.error("Failed to load patient details:", err);
        setError("Failed to load patient details");
      } finally {
        setInitialLoading(false);
      }
    };

    loadPatientDetails();
  }, [patient]);

  /* =========================
     FETCH BARANGAYS
  ========================= */
  useEffect(() => {
    const loadBarangays = async () => {
      try {
        const res = await fetchBarangays();
        setBarangays(res?.data || []);
      } catch (err) {
        console.error("Failed to fetch barangays", err);
        setBarangays([]);
      }
    };

    loadBarangays();
  }, []);

  /* =========================
     HANDLERS
  ========================= */
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleHouseholdTypeChange = (type) => {
    setHouseholdType(type);
    setHouseholdNo("");
    setFacilityHouseholdNo("");
    setSearchTerm("");
    setSearchResults([]);
    setSuccessMessage("");
  };

  const handleBarangayChange = (barangayId) => {
    setSelectedBarangayId(barangayId);
    setHouseholdNo("");
    setFacilityHouseholdNo("");
    setSearchTerm("");
    setSearchResults([]);
  };

  /* =========================
     SELECT EXISTING HOUSEHOLD
  ========================= */
  const selectExistingHousehold = (household) => {
    setHouseholdNo(household.household_no);
    setFacilityHouseholdNo(household.facility_household_no);
    setSearchTerm("");
    setSearchResults([]);
  };

  /* =========================
     SEARCH HOUSEHOLDS
  ========================= */
  const searchExistingHouseholdsHandler = async (value) => {
    setSearchTerm(value);

    if (value.length < 2 || !selectedBarangayId) {
      setSearchResults([]);
      return;
    }

    setSearchLoading(true);
    try {
      const res = await searchHouseholds(selectedBarangayId, value);
      setSearchResults(res?.households || []);
    } catch (err) {
      console.error(err);
      setSearchResults([]);
    } finally {
      setSearchLoading(false);
    }
  };

  /* =========================
     GENERATE NEW HOUSEHOLD
  ========================= */
  const generateNewHouseholdHandler = async () => {
    if (!selectedBarangayId) {
      setError("Please select a barangay first");
      return;
    }

    setHouseholdLoading(true);
    setError("");

    try {
      const hh = await generateHousehold(selectedBarangayId);
      if (!hh?.success) throw new Error("Failed to generate household");

      const fac = await generateFacilityHousehold(selectedBarangayId);
      if (!fac?.success)
        throw new Error("Failed to generate facility household");

      setHouseholdNo(hh.household_no);
      setFacilityHouseholdNo(fac.facility_household_no);

      setSuccessMessage("New household generated successfully");
      setTimeout(() => setSuccessMessage(""), 3000);
    } catch (err) {
      setError(err.message);
    } finally {
      setHouseholdLoading(false);
    }
  };

  /* =========================
     MOVE HOUSEHOLD
  ========================= */
  const moveHouseholdHandler = async () => {
    if (!selectedBarangayId || !householdNo || !facilityHouseholdNo) {
      setError("Please complete household information");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const res = await movePatientHousehold({
        patient_id: patient.id,
        new_barangay_id: selectedBarangayId,
        household_type: householdType,
        new_household_no: householdNo,
        new_facility_household_no: facilityHouseholdNo,
        move_reason: moveReason,
        moved_by: 1, // TODO: from auth
      });

      if (!res?.success) throw new Error(res?.error || "Move failed");

      setSuccessMessage(
        "Patient moved successfully! Patient code remains unchanged."
      );
      setTimeout(() => setSuccessMessage(""), 3000);
      setShowHouseholdSection(false);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  /* =========================
     SAVE PATIENT
  ========================= */
  const submitHandler = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await updatePatient({
        id: patient.id,
        ...formData,
          barangay_id: selectedBarangayId,
      });

      onSave?.(res);
      onClose();
    } catch (err) {
      setError(err.message || "Failed to update patient");
    } finally {
      setLoading(false);
    }
  };

  /* =========================
     EXPOSE TO COMPONENT
  ========================= */
  return {
    formData,
    barangays,
    selectedBarangayId,
    householdNo,
    facilityHouseholdNo,
    householdType,
    showHouseholdSection,
    searchTerm,
    searchResults,
    loading,
    householdLoading,
    searchLoading,
    initialLoading,
    error,
    successMessage,

    setShowHouseholdSection,

    handleInputChange,
    handleHouseholdTypeChange,
    handleBarangayChange,
    searchExistingHouseholdsHandler,
    generateNewHouseholdHandler,
    moveHouseholdHandler,
    submitHandler,
    selectExistingHousehold,
  };
}
