import { useState, useEffect } from 'react';
import { fetchDoctorAssignments, fetchDoctors, assignDoctor } from '../api/doctor';
import { getLatestConsultations } from '../api/consultation';

/**
 * Custom hook to manage patient reassignment
 * Fetches all assigned patients and available doctors
 */
export default function useReassignPatients() {
  const [assignedPatients, setAssignedPatients] = useState([]);
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [selectedPatientId, setSelectedPatientId] = useState(null);
  const [selectedDoctorId, setSelectedDoctorId] = useState(null);
  const [reassigningPatientId, setReassigningPatientId] = useState(null);
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  const [consultationCache, setConsultationCache] = useState({});

  // -----------------------
  // FETCH ALL ASSIGNED PATIENTS
  // -----------------------
  useEffect(() => {
    loadAssignedPatients();
    loadDoctors();
  }, [refreshTrigger]);

  const loadAssignedPatients = async () => {
    try {
      setLoading(true);
      setError('');

      const response = await fetchDoctorAssignments();

      if (response?.success && Array.isArray(response.data)) {
        console.log('Assigned Patients (Full):', response.data);
        
        // Log first patient's properties for inspection
        if (response.data.length > 0) {
          console.log('First Patient Object Keys:', Object.keys(response.data[0]));
          console.log('First Patient Full Data:', response.data[0]);
          console.log('Doctor ID in first patient:', response.data[0].doctor_id);
        }
        
        // Fetch consultation history for each patient to get doctor info
        const enrichedPatients = await Promise.all(
          response.data.map(async (patient) => {
            try {
              const consultations = await getLatestConsultations(patient.patient_id);
              const latestConsult = consultations && consultations.length > 0 ? consultations[0] : null;
              
              return {
                ...patient,
                doctor_id: latestConsult?.doctor_id,
                doctor_name: latestConsult?.doctor_name,
              };
            } catch (err) {
              console.warn(`Failed to fetch consultations for patient ${patient.patient_id}:`, err);
              return patient;
            }
          })
        );
        
        setAssignedPatients(enrichedPatients);
      } else {
        setAssignedPatients([]);
        setError('No assigned patients found');
      }
    } catch (err) {
      console.error('Error loading assigned patients:', err);
      setError(err.message || 'Failed to load assigned patients');
      setAssignedPatients([]);
    } finally {
      setLoading(false);
    }
  };

  // -----------------------
  // FETCH ALL DOCTORS
  // -----------------------
  const loadDoctors = async () => {
    try {
      const doctorList = await fetchDoctors();

      // Debug: Log the doctors to verify structure
      console.log('Doctors List:', doctorList);

      if (Array.isArray(doctorList)) {
        setDoctors(doctorList);
      } else if (doctorList?.data && Array.isArray(doctorList.data)) {
        // Handle nested response
        setDoctors(doctorList.data);
      } else {
        console.warn('Invalid doctors response format:', doctorList);
        setDoctors([]);
      }
    } catch (err) {
      console.error('Error loading doctors:', err);
      setDoctors([]);
    }
  };

  // -----------------------
  // HANDLE REASSIGN PATIENT
  // -----------------------
  const handleReassignDoctor = async (patientRecord, newDoctorId) => {
    if (!newDoctorId) {
      alert('Please select a doctor');
      return;
    }

    if (patientRecord.doctor_id === newDoctorId) {
      alert('Patient is already assigned to this doctor');
      return;
    }

    try {
      setReassigningPatientId(patientRecord.id);
      setError('');

      const response = await assignDoctor({
        queue_id: patientRecord.patient_queue_id,
        patient_id: patientRecord.patient_id,
        doctor_id: newDoctorId
      });

      if (response?.success) {
        alert('Patient reassigned successfully!');
        setSelectedPatientId(null);
        setSelectedDoctorId(null);
        // Refresh the patient list
        setRefreshTrigger(prev => prev + 1);
      } else {
        setError(response?.message || 'Failed to reassign patient');
      }
    } catch (err) {
      console.error('Error reassigning patient:', err);
      setError(err.message || 'Failed to reassign patient');
    } finally {
      setReassigningPatientId(null);
    }
  };

  // -----------------------
  // GET DOCTOR NAME
  // -----------------------
  const getDoctorName = (doctorId, doctorName) => {
    // First try to use the doctor_name from consultation history
    if (doctorName) {
      console.log(`Using doctor name from consultation: ${doctorName}`);
      return doctorName;
    }

    if (!doctorId) {
      return '⚠️ No Doctor Assigned';
    }

    // Debug logging
    console.log(`Looking for doctor with ID: ${doctorId}`, `Available doctors: ${doctors.length}`);
    
    // Try multiple comparison methods
    let matchingDoctor = doctors.find(d => 
      String(d.id) === String(doctorId) || 
      Number(d.id) === Number(doctorId) ||
      d.id == doctorId  // Loose comparison as fallback
    );

    if (!matchingDoctor) {
      // More detailed logging for debugging
      console.warn(`Doctor not found in list. ID: ${doctorId}, Doctors:`, doctors);
      return `Unknown Doctor (ID: ${doctorId})`;
    }

    // Try different name field possibilities
    const name = matchingDoctor.name || 
                 matchingDoctor.full_name || 
                 matchingDoctor.doctor_name ||
                 `Dr. ${matchingDoctor.first_name || ''} ${matchingDoctor.last_name || ''}`.trim() ||
                 'Unknown';
    
    console.log(`Found doctor: ${name}`);
    return name;
  };

  // -----------------------
  // GET STATUS BADGE COLOR
  // -----------------------
  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case 'waiting':
        return '#ff9800';
      case 'serving':
        return '#4caf50';
      case 'done':
        return '#2196f3';
      default:
        return '#999';
    }
  };

  return {
    // State
    assignedPatients,
    doctors,
    loading,
    error,
    selectedPatientId,
    setSelectedPatientId,
    selectedDoctorId,
    setSelectedDoctorId,
    reassigningPatientId,

    // Methods
    handleReassignDoctor,
    getDoctorName,
    getStatusColor,
    loadAssignedPatients,
  };
}