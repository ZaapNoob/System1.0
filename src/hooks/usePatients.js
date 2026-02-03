import { useState, useEffect } from "react";
import API from "../config/api";

export default function usePatients() {
  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(false);

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [barangayFilter, setBarangayFilter] = useState("");

  // ✅ New filters
  const [genderFilter, setGenderFilter] = useState("");
  const [dobFilter, setDobFilter] = useState("");

  const fetchPatients = async () => {
    setLoading(true);

    try {
      const params = new URLSearchParams();

      if (search) params.append("search", search);
      if (statusFilter) params.append("status", statusFilter);
      if (barangayFilter) params.append("barangay_id", barangayFilter);
      if (genderFilter) params.append("gender", genderFilter);      // ✅
      if (dobFilter) params.append("dob", dobFilter);              // ✅

      const res = await fetch(
        `${API}/patients/get_patients.php?${params.toString()}`
      );

      const data = await res.json();

      if (data.success) {
        setPatients(data.data);
      } else {
        console.error("API Error:", data.message || data.error);
      }
    } catch (err) {
      console.error("Fetch Error:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPatients();
  }, [search, statusFilter, barangayFilter, genderFilter, dobFilter]); // ✅ added dependencies

  return {
    patients,
    loading,

    search,
    setSearch,

    statusFilter,
    setStatusFilter,

    barangayFilter,
    setBarangayFilter,

    genderFilter,       // ✅ export
    setGenderFilter,    // ✅ export

    dobFilter,          // ✅ export
    setDobFilter,       // ✅ export

    refetchPatients: fetchPatients
  };
}
