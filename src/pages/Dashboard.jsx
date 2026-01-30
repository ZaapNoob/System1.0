// Import useState hook from React
// This allows the component to manage internal state (tasks list)
import { useState, useEffect } from "react";

// Import Sidebar component for navigation
import Sidebar from "../components/Sidebar";

// Import dashboard styles
import "./Dashboard.css";

// Import API configuration
import API from "../config/api";

// Export Dashboard component
// Receives the authenticated user object, callback to navigate to profile, and allowed pages
export default function Dashboard({ user, onNavigateToProfile, allowedPages = [], onNavigate }) {

  // Local state holding a list of tasks
  // Currently hardcoded (mock data) for UI demonstration
  const [tasks, setTasks] = useState([
    { id: 1, title: "Review project proposal", status: "In Progress", priority: "High" },
    { id: 2, title: "Update documentation", status: "Pending", priority: "Medium" },
    { id: 3, title: "Fix critical bugs", status: "Completed", priority: "High" },
    { id: 4, title: "Design new features", status: "In Progress", priority: "Medium" }
  ]);





  // ===================================
  // WIDGET ACCESS MANAGEMENT
  // ===================================
  const [selectedWidgets, setSelectedWidgets] = useState([]);

  // Load user's accessible widgets on component mount
  useEffect(() => {
    if (user?.id) {
      loadUserWidgets();
    }
  }, [user?.id]);

  const loadUserWidgets = async () => {
    try {
      const response = await fetch(
        `${API}/widgets/get.php?user_id=${user.id}`
      );
      
      if (!response.ok) {
        console.error("API response not OK:", response.status);
        setSelectedWidgets([]);
        return;
      }
      
      const text = await response.text();
      console.log("Raw API response:", text);
      
      if (!text) {
        console.warn("Empty response from API");
        setSelectedWidgets([]);
        return;
      }
      
      const widgets = JSON.parse(text);
      console.log("Parsed widgets:", widgets);
      
      // If response has error property, set empty
      if (widgets.error) {
        console.error("API error:", widgets.error);
        setSelectedWidgets([]);
        return;
      }
      
      setSelectedWidgets(Array.isArray(widgets) ? widgets : []);
    } catch (error) {
      console.error("Error loading user widgets:", error);
      setSelectedWidgets([]);
    } 
  };








  // -----------------------------------
  // LOGOUT HANDLER
  // -----------------------------------

  // Function triggered when user clicks "Logout"
  const handleLogout = async (e) => {
    // Prevent click event from bubbling to parent user-info div
    // This stops the profile navigation from being triggered
    e.stopPropagation();

    // Retrieve stored authentication token
    const token = localStorage.getItem("token");
    
    try {
      // Send logout request to backend
      // This removes the session token from the database
      await fetch(`${API}/auth/logout.php`, {
        method: "POST",
        headers: {
          Authorization: token
        }
      });
    } catch (error) {
      // Log errors if logout request fails
      console.error("Logout error:", error);
    } finally {
      // Always remove token from browser
      // This immediately logs the user out on the frontend
      localStorage.removeItem("token");

      // Reload page so App.jsx re-checks authentication state
      window.location.reload();
    }
  };






  // -----------------------------------
  // UI HELPERS
  // -----------------------------------

  // Returns a CSS class based on task status
  const getStatusColor = (status) => {
    switch (status) {
      case "Completed":
        return "status-completed";
      case "In Progress":
        return "status-progress";
      case "Pending":
        return "status-pending";
      default:
        return "";
    }
  };

  // Returns a CSS class based on task priority
  const getPriorityColor = (priority) => {
    switch (priority) {
      case "High":
        return "priority-high";
      case "Medium":
        return "priority-medium";
      case "Low":
        return "priority-low";
      default:
        return "";
    }
  };

  // -----------------------------------
  // RENDER UI
  // -----------------------------------

  return (
    <div className="dashboard-container">

      {/* Sidebar Navigation */}
      <Sidebar allowedPages={allowedPages} onNavigate={onNavigate} />

      {/* Right content wrapper */}
      <div className="dashboard-content">
        {/* Top header */}
        <header className="dashboard-header">
          <div className="header-content">
            <h1>Dashboard</h1>

            {/* Logged-in user info */}
            <div className="user-info" onClick={onNavigateToProfile} style={{ cursor: 'pointer' }}>
              <span className="user-name">{user?.name || "User"}</span>
              <span className="user-role">{user?.role || "Member"}</span>

              {/* Logout button */}
              <button className="logout-btn" onClick={handleLogout}>
                Logout
              </button>
            </div>
          </div>
        </header>

        {/* Main content */}
        <main className="dashboard-main">

        {/* Welcome message */}
                <div className="left-panel">

        <section className="welcome-section">
          <div className="welcome-card">
            <h2>Welcome back, {user?.name}!</h2>
            <p>Here's your task overview and activity summary.</p>
          </div>
        </section>

        {/* Statistics overview */}
        <section className="stats-section">

          <div className="stat-card">
            <div className="stat-icon">📋</div>
            <div className="stat-content">
              <h3>Total Tasks</h3>
              <p className="stat-number">{tasks.length}</p>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon">✅</div>
            <div className="stat-content">
              <h3>Completed</h3>
              <p className="stat-number">
                {tasks.filter(t => t.status === "Completed").length}
              </p>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon">⚡</div>
            <div className="stat-content">
              <h3>In Progress</h3>
              <p className="stat-number">
                {tasks.filter(t => t.status === "In Progress").length}
              </p>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon">⏳</div>
            <div className="stat-content">
              <h3>Pending</h3>
              <p className="stat-number">
                {tasks.filter(t => t.status === "Pending").length}
              </p>
            </div>
          </div>

        </section>
        </div>

        {/* Widgets Section - Only show if widgets are selected */}
        {selectedWidgets.length > 0 && (
          <section className="widgets-section">

            <div className="widgets-grid">
              {/* Doctor Widget */}
              {selectedWidgets.includes("doctor") && (
                <div className="widget-card widget-doctor">
                  <div className="widget-header">
                    <h3>👨‍⚕️ Doctor Panel</h3>
                  </div>
                  <div className="widget-content">
                    <div className="doctor-widget">
                      <div className="doctor-summary-grid">

  <div className="doctor-summary-card">
    <span className="summary-label">Appointments</span>
  </div>

  <div className="doctor-summary-card">
    <span className="summary-label">Completed</span>
  </div>

  <div className="doctor-summary-card">
    <span className="summary-label">Patients</span>
  </div>

</div>

                   <div className="widget-section">
  <h4>📋 Patient Consultations</h4>

  <table className="consultation-table">
    <thead>
      <tr>
        <th>Patient Name</th>
        <th>Status</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td>Juan Dela Cruz</td>
        <td>
          <span className="status-badge in-progress">In Progress</span>
        </td>
      </tr>
      <tr>
        <td>Maria Santos</td>
        <td>
          <span className="status-badge completed">Completed</span>
        </td>
      </tr>
      <tr>
        <td>Pedro Ramos</td>
        <td>
          <span className="status-badge scheduled">Scheduled</span>
        </td>
      </tr>
    </tbody>
  </table>
</div>


                      <div className="widget-section">
                        <h4>💊 Active Prescriptions</h4>
                        <div className="prescription-list">
                          <div className="prescription-item">
                            <span className="medicine">Amoxicillin 500mg</span>
                            <span className="dosage">2x Daily</span>
                          </div>
                          <div className="prescription-item">
                            <span className="medicine">Ibuprofen 200mg</span>
                            <span className="dosage">3x Daily</span>
                          </div>
                        </div>
                      </div>

                      <div className="widget-section">
                        <h4>🔬 Lab Results Pending</h4>
                        <ul style={{ margin: 0, paddingLeft: '20px' }}>
                          <li>Blood Test - Juan Dela Cruz</li>
                          <li>X-Ray Report - Maria Santos</li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Triage Widget */}
              {selectedWidgets.includes("triage") && (
                <div className="widget-card widget-triage">
                  <div className="widget-header">
                    <h3>🚨 Triage Panel</h3>
                  </div>
                  <div className="widget-content">
                    <div className="triage-widget">
                      <div className="widget-section">
                        <h4>⏱️ Patient Queue</h4>
                        <div className="queue-list">
                          <div className="queue-item priority-high">
                            <span className="queue-number">Q001</span>
                            <span className="patient-info">Maria Santos - Critical</span>
                            <span className="wait-time">Wait: 5 min</span>
                          </div>
                          <div className="queue-item priority-medium">
                            <span className="queue-number">Q002</span>
                            <span className="patient-info">Pedro Ramos - Moderate</span>
                            <span className="wait-time">Wait: 12 min</span>
                          </div>
                          <div className="queue-item priority-low">
                            <span className="queue-number">Q003</span>
                            <span className="patient-info">Juan Dela Cruz - Low</span>
                            <span className="wait-time">Wait: 25 min</span>
                          </div>
                        </div>
                      </div>

                      <div className="widget-section">
                        <h4>❤️ Vital Signs Summary</h4>
                        <div className="vitals-grid">
                          <div className="vital-item">
                            <span className="vital-label">Blood Pressure</span>
                            <span className="vital-value">120/80 mmHg</span>
                          </div>
                          <div className="vital-item">
                            <span className="vital-label">Heart Rate</span>
                            <span className="vital-value">72 bpm</span>
                          </div>
                          <div className="vital-item">
                            <span className="vital-label">Temperature</span>
                            <span className="vital-value">37.2°C</span>
                          </div>
                          <div className="vital-item">
                            <span className="vital-label">Oxygen Level</span>
                            <span className="vital-value">98%</span>
                          </div>
                        </div>
                      </div>

                      <div className="widget-section">
                        <h4>📊 Triage Statistics</h4>
                        <div className="stats-mini">
                          <div className="stat-box critical">
                            <span className="stat-label">Critical</span>
                            <span className="stat-count">2</span>
                          </div>
                          <div className="stat-box moderate">
                            <span className="stat-label">Moderate</span>
                            <span className="stat-count">5</span>
                          </div>
                          <div className="stat-box low">
                            <span className="stat-label">Low</span>
                            <span className="stat-count">8</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </section>
        )}

        {/* Task list */}
        <section className="tasks-section">

          <div className="section-header">
            <h2>Your Tasks</h2>
            <button className="add-task-btn">+ Add Task</button>
          </div>

          {/* Grid of task cards */}
          <div className="tasks-grid">
            {tasks.map(task => (
              <div key={task.id} className="task-card">

                <div className="task-header">
                  <h3>{task.title}</h3>
                  <span className={`task-status ${getStatusColor(task.status)}`}>
                    {task.status}
                  </span>
                </div>

                <div className="task-footer">
                  <span className={`task-priority ${getPriorityColor(task.priority)}`}>
                    {task.priority} Priority
                  </span>
                </div>

              </div>
            ))}
          </div>
        </section>

        {/* User profile section */}
        <section className="user-section">
          <h2>User Profile</h2>

          <div className="profile-card" onClick={onNavigateToProfile} style={{ cursor: 'pointer' }}>
            <div className="profile-item">
              <label>Name</label>
              <p>{user?.name}</p>
            </div>

            <div className="profile-item">
              <label>Role</label>
              <p>{user?.role}</p>
            </div>

            <div className="profile-item">
              <label>User ID</label>
              <p className="user-id">{user?.uuid}</p>
            </div>
          </div>
        </section>

      </main>
      </div>
    </div>
  );
}
