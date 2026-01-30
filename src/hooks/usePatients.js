import { useState, useEffect } from "react";
import API from "../config/api";

export default function usePatients() {
  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(false);

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [barangayFilter, setBarangayFilter] = useState("");

  const fetchPatients = async () => {
    setLoading(true);

    try {
      const params = new URLSearchParams();
      if (search) params.append("search", search);
      if (statusFilter) params.append("status", statusFilter);
      if (barangayFilter) params.append("barangay_id", barangayFilter);

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
  }, [search, statusFilter, barangayFilter]);

  return {
    patients,
    loading,
    search,
    setSearch,
    statusFilter,
    setStatusFilter,
    barangayFilter,
    setBarangayFilter,
    refetchPatients: fetchPatients,
  };
}
