import React from "react";
import "./Sidebar.css";

const Sidebar = ({ allowedPages = [], onNavigate }) => {
  const handleNavClick = (page) => {
    if (onNavigate) {
      onNavigate(page);
    }
  };

  return (
    <div className="sidebar">
      <nav className="sidebar-nav">
        <h3 style={{ padding: "15px 20px", margin: "0", color: "white", fontSize: "14px", fontWeight: "600" }}>
          Pages
        </h3>
        <ul>
          {/* Global Dashboard - Always Available */}
          <li>
            <button 
              onClick={() => handleNavClick("dashboard")}
              style={{ 
                background: "none", 
                border: "none", 
                cursor: "pointer",
                width: "100%",
                textAlign: "left"
              }}
            >
              <a href="#!" style={{ color: "white", textDecoration: "none" }}>🏠 Dashboard</a>
            </button>
          </li>

          {/* Permission-controlled pages */}
          {allowedPages.includes("patient") && (
            <li>
              <button 
                onClick={() => handleNavClick("patient")}
                style={{ 
                  background: "none", 
                  border: "none", 
                  cursor: "pointer",
                  width: "100%",
                  textAlign: "left"
                }}
              >
                <a href="#!" style={{ color: "white", textDecoration: "none" }}>👥 Patient</a>
              </button>
            </li>
          )}
          {allowedPages.includes("queuegen") && (
            <li>
              <button 
                onClick={() => handleNavClick("queuegen")}
                style={{ 
                  background: "none", 
                  border: "none", 
                  cursor: "pointer",
                  width: "100%",
                  textAlign: "left"
                }}
              >
                <a href="#!" style={{ color: "white", textDecoration: "none" }}>📋 Queue Gen</a>
              </button>
            </li>
          )}
          {allowedPages.length === 0 && (
            <li style={{ padding: "10px 20px", color: "#ccc", fontSize: "12px" }}>
              No additional pages available
            </li>
          )}
        </ul>
      </nav>
    </div>
  );
};

export default Sidebar;
