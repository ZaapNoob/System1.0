import { useState } from "react";

export function useDoctorSelection(doctors) {
  const [selectedDoctor, setSelectedDoctor] = useState("");

  const handleDoctorSelect = (e, setRecord) => {
    const doctorId = e.target.value;
    const doctor = doctors.find(d => d.id == doctorId);
    
    setSelectedDoctor(doctorId);
    
    if (doctor) {
      setRecord(prev => ({
        ...prev,
        attending_physician: doctor.name || doctor.full_name || ""
      }));
    }
  };

  return {
    selectedDoctor,
    setSelectedDoctor,
    handleDoctorSelect
  };
}
