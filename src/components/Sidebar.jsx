import React from "react";
import "./Sidebar.css";
import MHO from "../assets/MHO.jpg";

const Sidebar = ({ allowedPages = [], currentPage, onNavigate }) => {

  return (
    <div className="sidebar">
      <div className="sidebar-brand">
    <div className="sidebar-logo">
      <img src={MHO} alt="Logo" />
    </div>

    <div className="sidebar-title">
      <h2>Health System</h2>
      <p>Admin Panel</p>
    </div>
    </div>

      <nav>
        <ul>
          {/* Dashboard always visible */}
          <li className={currentPage === "dashboard" ? "active" : ""}>
            <button onClick={() => onNavigate("dashboard")}>
              🏠 Dashboard
            </button>
          </li>

          {allowedPages.includes("patient") && (
            <li className={currentPage === "patient" ? "active" : ""}>
              <button onClick={() => onNavigate("patient")}>
                👥 Patients
              </button>
            </li>
          )}

          {allowedPages.includes("queuegen") && (
            <li className={currentPage === "queuegen" ? "active" : ""}>
              <button onClick={() => onNavigate("queuegen")}>
                📋 Queue Generator
              </button>
            </li>
          )}

          {allowedPages.length === 0 && (
            <li className="disabled">No extra permissions</li>
          )}
        </ul>
      </nav>
    </div>
  );
};

export default Sidebar;
