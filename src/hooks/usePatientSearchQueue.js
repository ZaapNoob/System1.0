import { useState, useEffect } from "react";
import { searchPatientsQueue } from "../api/patients";

export default function usePatientSearchQueue(barangayId = 0) {
  const [searchTerm, setSearchTerm] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [selectedPatient, setSelectedPatient] = useState(null);

  // SEARCH PATIENTS
  useEffect(() => {
    if (!searchTerm.trim()) {
      setSearchResults([]);
      return;
    }

    const timeout = setTimeout(async () => {
      try {
        const res = await searchPatientsQueue(barangayId, searchTerm);
        setSearchResults(res.success ? res.patients : []);
      } catch (err) {
        console.error("Search error:", err);
        setSearchResults([]);
      }
    }, 300);

    return () => clearTimeout(timeout);
  }, [searchTerm, barangayId]);

  // SELECT PATIENT
  const selectPatient = (patient) => {
    setSelectedPatient(patient);
    setSearchTerm(patient.name);
    setSearchResults([]);
  };

  return {
    searchTerm,
    setSearchTerm,
    searchResults,
    setSearchResults, // ✅ IMPORTANT
    selectedPatient,
    setSelectedPatient,
    selectPatient
  };
}
