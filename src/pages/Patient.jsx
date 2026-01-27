// Import useState and useEffect from React
// useState → local UI state
// useEffect → lifecycle (fetching later if needed)
import { useState, useEffect } from "react";

// Import Sidebar component for navigation
import Sidebar from "../components/Sidebar";

// Import patient page styles
import "./patient.css";

// Export Patient component
// Receives authenticated user (doctor/admin), navigation callback, and allowed pages
export default function Patient({ user, onNavigateToProfile, allowedPages = [], onNavigate }) {

  // -----------------------------------
  // STATE MANAGEMENT
  // -----------------------------------

  // Mock patient list (temporary UI data)
  const [patients, setPatients] = useState([
    {
      id: 1,
      name: "Juan Dela Cruz",
      age: 34,
      gender: "Male",
      status: "Admitted"
    },
    {
      id: 2,
      name: "Maria Santos",
      age: 28,
      gender: "Female",
      status: "Discharged"
    },
    {
      id: 3,
      name: "Pedro Ramos",
      age: 45,
      gender: "Male",
      status: "Under Observation"
    }
  ]);

  // -----------------------------------
  // LOGOUT HANDLER
  // -----------------------------------

  const handleLogout = async (e) => {
    e.stopPropagation();

    const token = localStorage.getItem("token");

    try {
      await fetch("http://localhost/System1.0/api/auth/logout.php", {
        method: "POST",
        headers: {
          Authorization: token
        }
      });
    } catch (error) {
      console.error("Logout error:", error);
    } finally {
      localStorage.removeItem("token");
      window.location.reload();
    }
  };

  // -----------------------------------
  // UI HELPERS
  // -----------------------------------

  // Returns CSS class based on patient status
  const getStatusColor = (status) => {
    switch (status) {
      case "Admitted":
        return "status-admitted";
      case "Discharged":
        return "status-discharged";
      case "Under Observation":
        return "status-observation";
      default:
        return "";
    }
  };

  // -----------------------------------
  // RENDER UI
  // -----------------------------------

  return (
    <div className="patient-container">

      {/* Sidebar Navigation */}
      <Sidebar allowedPages={allowedPages} onNavigate={onNavigate} />

      {/* Right content wrapper */}
      <div className="patient-content">
        {/* ================= HEADER ================= */}
        <header className="patient-header">
          <div className="header-content">
            <h1>Patient Management</h1>

            {/* Logged-in user info */}
            <div className="user-info" onClick={onNavigateToProfile}>
              <span className="user-name">{user?.name}</span>
              <span className="user-role">{user?.role}</span>

              <button className="logout-btn" onClick={handleLogout}>
                Logout
              </button>
            </div>
          </div>
        </header>

        {/* ================= MAIN CONTENT ================= */}
        <main className="patient-main">

        {/* Page description */}
        <section className="intro-section">
          <h2>Patients List</h2>
          <p>View and manage registered patients.</p>
        </section>

        {/* Patient table */}
        <section className="patient-section">

          <div className="section-header">
            <h3>Active Patients</h3>
            <button className="add-patient-btn">+ Add Patient</button>
          </div>

          <table className="patient-table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Age</th>
                <th>Gender</th>
                <th>Status</th>
                <th>Action</th>
              </tr>
            </thead>

            <tbody>
              {patients.map((patient) => (
                <tr key={patient.id}>
                  <td>{patient.name}</td>
                  <td>{patient.age}</td>
                  <td>{patient.gender}</td>
                  <td>
                    <span className={`status-badge ${getStatusColor(patient.status)}`}>
                      {patient.status}
                    </span>
                  </td>
                  <td>
                    <button className="view-btn">View</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

        </section>

      </main>
      </div>
    </div>
  );
}
