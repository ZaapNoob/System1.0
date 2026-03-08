// Import React hooks
import { useState, useEffect } from "react";

// Sidebar
import Sidebar from "../components/Sidebar";

// Styles
import "./Dashboard.css";

// API
import API from "../config/api";

// Accept queue hook
import useAcceptQueue from "../hooks/AcceptQueue";

// Modal context
import { useModal } from "../components/modal/ModalProvider";

// Modals
import TriageModal from "./modal/TriageModal";
import DoctorModal from "./modal/DoctorModal";
import Consultation from "./modal/consultation";
import ConsultationHistoryView from "./ConsultationHistoryView";

// Doctor hooks
import { useDoctorAssignments } from "../hooks/useDoctors";

// Auto-fetch hook
import useAutoFetchStable from "../hooks/useAutoFetchStable";

// WebSocket context
import { useWebSocketContext } from "../context/WebSocketContext";

// WebSocket polling hook
import { useWebSocketPolling } from "../hooks/useWebSocketPolling";

// Auto-revert triage hook
import useAutoRevertTriage from "../hooks/useAutoRevertTriage";

// Cancel waiting queues hook
import useCancelWaitingQueues from "../hooks/useCancelWaitingQueues";

// Encoder queue filter hook
import { useEncoderQueueFilter } from "../hooks/useEncoderQueueFilter";


export default function Dashboard({
  user,
  onNavigateToProfile,
  allowedPages = [],
  onNavigate
}) {
  // ===============================
  // ACTIVE PAGE STATE
  // ===============================
  const [currentPage, setCurrentPage] = useState("dashboard");
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [editingConsultation, setEditingConsultation] = useState(null);

  const handleEncode = (patient) => {
    setSelectedPatient(patient);
  };



  const handleNavigate = (page) => {
    setCurrentPage(page);
    if (onNavigate) onNavigate(page);
  };

  // ===============================
  // MOCK TASKS
  // ===============================
  const [tasks, setTasks] = useState([
    { id: 1, title: "Review project proposal", status: "In Progress", priority: "High" },
    { id: 2, title: "Update documentation", status: "Pending", priority: "Medium" },
    { id: 3, title: "Fix critical bugs", status: "Completed", priority: "High" },
    { id: 4, title: "Design new features", status: "In Progress", priority: "Medium" }
  ]);

  // ===============================
  // POLLING RESET TRIGGER & WEBSOCKET HANDLERS
  // ===============================
  const { pollingReset, triggerPollingReset } = useWebSocketPolling();

  // Get WebSocket connection status
  const { connected } = useWebSocketContext();

  // ===============================
  // TRIAGE QUEUE (AUTO REFRESH) - Uses WebSocket, fallback to polling
  // ===============================
  const waitingQueue = useAutoFetchStable(
    'waiting-queue',
    `${API}/Queue/get-waiting.php`,
    20000  // Fallback polling interval (only used if WebSocket is down)
  );
  const [servingPatient, setServingPatient] = useState(null);

  // ===============================
  // TRIAGE AUTO-REVERT HOOK
  // ===============================
  const { triageQueueId, assignmentCompleted, setTriageQueueId, setAssignmentCompleted, revertTriage } = useAutoRevertTriage();

  // ===============================
  // WEBSOCKET CONTEXT
  // ===============================
  const { send: wsSend } = useWebSocketContext();

  // ===============================
  // DOCTOR ASSIGNMENTS (AUTO REFRESH) - Uses WebSocket live fetch, fallback to polling
  // ===============================
  // Note: Pulls from doctor_patient_queue table for real-time doctor-patient assignments
  // Uses WebSocket-triggered live fetch when doctor assignments change
  // 🔒 Filters automatically by logged-in doctor's ID
  // 🔒 Filters by status: only 'waiting' and 'serving' (hides 'done')
  const doctorAssignments = useAutoFetchStable(
    'doctor-assignments',
    user?.id
      ? `${API}/Queue/get-doctor-assignments.php?doctor_id=${user.id}&status=waiting`
      : null,
    20000,  // Fallback polling interval (only used if WebSocket is down)
    user?.id,  // 🔒 Filter to this doctor's assignments only
    ['waiting', 'serving']  // 🔒 Only show waiting and serving statuses
  );

  const doctorAssignmentsLoading = false;

  const { setActive, markDone } = useDoctorAssignments({
    doctorId: user?.role === "doctor" ? user?.id : null,
    status: "waiting"
  });

  // ===============================
  // ENCODER QUEUE (AUTO REFRESH) - Uses WebSocket live fetch, fallback to polling
  // ===============================
  // Fetches ALL DONE patients needing consultation encoding
  // ✅ No filtering - displays all encoder queue data for anyone
  const encoderQueue = useAutoFetchStable(
    'encoder-queue',
    `${API}/consultation/encoder/get-encoder-queue.php`,
    20000,  // Fallback polling interval (only used if WebSocket is down)
    null  // ✅ No doctor filtering - show all encoder data
  );

  // ===============================
  // ENCODER QUEUE FILTER HOOK
  // ===============================
  const { search: encoderSearch, setSearch: setEncoderSearch, filterDate: encoderFilterDate, setFilterDate: setEncoderFilterDate, filteredQueue: filteredEncoderQueue } = useEncoderQueueFilter(encoderQueue);

  // ===============================
  // ACCEPT QUEUE HOOK
  // ===============================
  const { handleAcceptQueue, loading: accepting } = useAcceptQueue({
    onAccepted: (patient) => {
      setServingPatient(patient);
    }
  });

  // ===============================
  // MODALS
  // ===============================
  const { openModal, closeModal } = useModal();

  // ===============================
  // WIDGET ACCESS MANAGEMENT
  // ===============================
  const [selectedWidgets, setSelectedWidgets] = useState([]);
  const [widgetsLoading, setWidgetsLoading] = useState(false);

  useEffect(() => {
    if (user?.id) loadUserWidgets();
  }, [user?.id]);

  const loadUserWidgets = async () => {
    setWidgetsLoading(true);

    try {
      const response = await fetch(`${API}/widgets/get.php?user_id=${user.id}`);

      if (!response.ok) {
        setSelectedWidgets([]);
        setWidgetsLoading(false);
        return;
      }

      const widgets = await response.json();
      setSelectedWidgets(Array.isArray(widgets) ? widgets : []);
    } catch (error) {
      console.error("Error loading user widgets:", error);
      setSelectedWidgets([]);
    }

    setWidgetsLoading(false);
  };

  // ===============================
  // LOGOUT HANDLER
  // ===============================
  const handleLogout = async (e) => {
    e.stopPropagation();
    const token = localStorage.getItem("token");

    try {
      await fetch(`${API}/auth/logout.php`, {
        method: "POST",
        headers: { Authorization: token }
      });
    } catch (error) {
      console.error("Logout error:", error);
    } finally {
      localStorage.removeItem("token");
      window.location.reload();
    }
  };

  // ===============================
  // CANCEL WAITING QUEUES HOOK
  // ===============================
  const { handleCancelWaitingQueues } = useCancelWaitingQueues();




  // ===============================
  // UI HELPERS
  // ===============================
  const getPriorityClass = (type) =>
    type === "PRIORITY" ? "priority-high" : "priority-low";

  const getStatusColor = (status) => {
    switch (status) {
      case "done":
        return "completed";
      case "In Progress":
        return "in-progress";
      case "Pending":
        return "pending";
      default:
        return "default";
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case "High":
        return "priority-high";
      case "Medium":
        return "priority-medium";
      case "Low":
        return "priority-low";
      default:
        return "priority-default";
    }
  };


  // -----------------------------------
  // RENDER UI
  // -----------------------------------

  return (
    <div className="dashboard-container">

      {/* Sidebar Navigation */}
      <Sidebar
        allowedPages={allowedPages}
        currentPage={currentPage}
        onNavigate={handleNavigate}
      />

      {/* Right content wrapper */}
      <div className="dashboard-content">
        {/* Top header */}
        <header className="dashboard-header">
          <div className="header-content">
            <h1>RHU-Gubat-LGU</h1>

            {/* Logged-in user info */}
            <div className="user-info" onClick={onNavigateToProfile} style={{ cursor: 'pointer' }}>
              <div className="user-avatar-icon">
                👤
              </div>
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


                        <div className="widget-section">
                          <h4>📋 Patient Consultations</h4>
                          <table className="consultation-table">
                            <thead>
                              <tr>
                                <th>Patient Name</th>
                                <th>Status</th>
                                <th>Action</th>
                              </tr>
                            </thead>
                            <tbody>
                              {doctorAssignmentsLoading && (
                                <tr>
                                  <td colSpan="3">Loading assignments...</td>
                                </tr>
                              )}

                              {!doctorAssignmentsLoading && doctorAssignments.length === 0 && (
                                <tr>
                                  <td colSpan="3">No assigned patients</td>
                                </tr>
                              )}

                              {doctorAssignments.map((item) => (
                                <tr key={item.id}>
                                  <td>{item.patient_name}</td>
                                  <td>
                                    <span className={`status-badge ${getStatusColor(item.status)}`}>
                                      {item.status}
                                    </span>
                                  </td>
                                  <td>
                                    {item.status !== "done" && (
                                      <button
                                        className="btn btn-primary btn-sm"
                                        onClick={async () => {
                                          try {
                                            // ✅ 1. Mark patient as active & get full patient data
                                            const patientData = await setActive(item.id);

                                            // ✅ 2. Open modal with full patient data
                                            openModal(
                                              <DoctorModal
                                                patient={patientData}
                                                onDone={async () => {
                                                  await markDone(item.id); // mark as done

                                                  // 📡 Trigger WebSocket live fetch after marking done
                                                  wsSend({ type: 'refresh-doctor-queue-now', doctor_id: user?.id });
                                                  console.log('📡 Patient marked done - triggering WebSocket live fetch');

                                                  closeModal();
                                                }}
                                              />
                                            );
                                          } catch (err) {
                                            console.error("Error selecting patient:", err);
                                          }
                                        }}
                                      >
                                        Select
                                      </button>
                                    )}
                                  </td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>



                      </div>
                    </div>
                  </div>
                )}









                {/* Triage Widget */}
                {selectedWidgets.includes("triage") && (
                  <div className="widget-card widget-triage">
                 <div className="widget-header" style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
  <h3>🚨 Triage Panel</h3>

  <button
    className="btn btn-danger btn-sm"
    onClick={handleCancelWaitingQueues}
  >
    Cancel Waiting
  </button>
</div>
                    <div className="widget-content">
                      <div className="triage-widget">

                        {/* Patient Queue */}
                        <div className="widget-section">
                          <h4>⏱️ Patient Queue</h4>
                          <div className="queue-list">
                            {waitingQueue.length === 0 && (
                              <div className="empty-queue">No patients waiting</div>
                            )}

                            {waitingQueue.map((q) => {
                              const waitMinutes = Math.floor(
                                (Date.now() - new Date(q.created_at)) / 60000
                              );

                              return (
                                <div
                                  key={q.id}
                                  className={`queue-item ${q.queue_type === "PRIORITY"
                                      ? "priority-high"
                                      : "priority-low"
                                    }`}
                                >
                                  <span className="queue-number">{q.queue_code}</span>

                                  <span className="patient-info">
                                    {q.first_name} {q.last_name}
                                  </span>

                                  <span className="wait-time">
                                    Wait: {waitMinutes} min
                                  </span>

                                  {/* ✅ Accept Button Opens Modal */}
                                  <button
                                    className="accept-btn"
                                    disabled={accepting}
                                    onClick={() => {
                                      // Accept hook will trigger WebSocket live fetch automatically
                                      handleAcceptQueue(q, (patient) => {
                                        // 📝 Store triage state in localStorage for recovery
                                        const patientQueueId = patient.id;
                                        localStorage.setItem("activeTriageQueueId", patientQueueId);
                                        localStorage.setItem("triageAssignmentCompleted", "false");

                                        // Track in state
                                        setTriageQueueId(patientQueueId);
                                        setAssignmentCompleted(false);

                                        // Open Triage Modal after accepting
                                        openModal(
                                          <TriageModal
                                            patient={patient}
                                            triggerPollingReset={triggerPollingReset}
                                            onAssign={() => {
                                              // ✅ Mark assignment as completed
                                              setAssignmentCompleted(true);
                                              localStorage.setItem("triageAssignmentCompleted", "true");
                                              console.log("✅ Doctor assigned - triage complete");
                                            }}
                                            onClose={async () => {
                                              // ✅ Close modal & cleanup
                                              if (!assignmentCompleted) {
                                                // Auto-revert this specific triage back to waiting
                                                await revertTriage(patientQueueId); // 🔄 Wait for revert to complete

                                                // 📡 After revert completes, trigger WebSocket live fetch
                                                // This will broadcast updated queue to all connected dashboards
                                                wsSend({ type: 'refresh-queue-now' });
                                                console.log('📡 Patient reverted to waiting - triggering WebSocket live fetch');
                                              }

                                              // Clean up state
                                              setTriageQueueId(null);
                                              setAssignmentCompleted(false);
                                              localStorage.removeItem("activeTriageQueueId");
                                              localStorage.removeItem("triageAssignmentCompleted");
                                              closeModal();
                                            }}
                                          />
                                        );
                                      })
                                    }}
                                  >
                                    {accepting ? "Accepting..." : "Accept"}
                                  </button>
                                </div>
                              );
                            })}
                          </div>
                        </div>



                        {/* Triage Statistics */}
                        <div className="widget-section">
                          <h4>📊 Triage Statistics</h4>
                          <div className="stats-mini">
                            <div className="stat-box critical">
                              <span className="stat-label">Priority</span>
                              <span className="stat-count">
                                {waitingQueue.filter(q => q.queue_type === "PRIORITY").length}
                              </span>
                            </div>
                            <div className="stat-box low">
                              <span className="stat-label">Regular</span>
                              <span className="stat-count">
                                {waitingQueue.filter(q => q.queue_type === "REGULAR").length}
                              </span>
                            </div>
                            <div className="stat-box total">
                              <span className="stat-label">Total</span>
                              <span className="stat-count">{waitingQueue.length}</span>
                            </div>
                          </div>
                        </div>

                      </div>
                    </div>
                  </div>
                )}
                {selectedWidgets.includes("encoder") && (
                  <div className="widget-card widget-encoder">

                    <div className="widget-header">
                      <h3>🧾 Encoder Panel</h3>
                    </div>

                    {/* STEP 1 : QUEUE */}
                    {!selectedPatient && (
                      <div className="widget-content">
                        {/* Search and Filter Section */}
                        <div style={{ marginBottom: "15px", display: "flex", gap: "10px", flexWrap: "wrap" }}>
                          <input
                            type="text"
                            placeholder="Search patient name or queue #..."
                            value={encoderSearch}
                            onChange={(e) => setEncoderSearch(e.target.value)}
                            style={{
                              flex: 1,
                              minWidth: "250px",
                              padding: "8px 12px",
                              border: "1px solid #ddd",
                              borderRadius: "4px",
                              fontSize: "14px"
                            }}
                          />
                          <input
                            type="date"
                            value={encoderFilterDate}
                            onChange={(e) => setEncoderFilterDate(e.target.value)}
                            style={{
                              padding: "8px 12px",
                              border: "1px solid #ddd",
                              borderRadius: "4px",
                              fontSize: "14px"
                            }}
                          />
                          {(encoderSearch || encoderFilterDate) && (
                            <button
                              onClick={() => {
                                setEncoderSearch("");
                                setEncoderFilterDate("");
                              }}
                              style={{
                                padding: "8px 16px",
                                backgroundColor: "#f0f0f0",
                                border: "1px solid #ccc",
                                borderRadius: "4px",
                                cursor: "pointer",
                                fontSize: "14px"
                              }}
                            >
                              Clear Filters
                            </button>
                          )}
                        </div>

                        {/* Results count */}
                        {filteredEncoderQueue.length !== encoderQueue.length && (
                          <div style={{ marginBottom: "10px", fontSize: "12px", color: "#666" }}>
                            Showing {filteredEncoderQueue.length} of {encoderQueue.length} patients
                          </div>
                        )}

                        <table className="consultation-table">
                          <thead>
                            <tr>
                              <th>Patient Name</th>
                              <th>Queue #</th>
                              <th>Queue Date</th>
                              <th>Visit Date</th>
                              <th>Status</th>
                              <th>Action</th>
                            </tr>
                          </thead>

                          <tbody>
                            {filteredEncoderQueue.length === 0 && (
                              <tr>
                                <td colSpan="6">
                                  {encoderQueue.length === 0 ? "No patients to encode" : "No matching patients found"}
                                </td>
                              </tr>
                            )}

                            {filteredEncoderQueue.map((patient) => (
                              <tr key={patient.queue_id}>
                                <td>{patient.patient_name}</td>
                                <td>{patient.queue_number}</td>
                                <td>{patient.queue_date}</td>
                                <td>{patient.visit_date || "-"}</td>

                                <td>
                                  <span
                                    className={`status-badge ${parseInt(patient.has_consultation) > 0 ? "done" : "pending"
                                      }`}
                                  >
                                    {parseInt(patient.has_consultation) > 0 ? "Encoded" : "Pending"}
                                  </span>
                                </td>

                                <td>
                                  <button
                                    className="encode-btn"
                                    onClick={() => handleEncode(patient)}
                                  >
                                    ✏️ Encode
                                  </button>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    )}

                    {/* STEP 2 : CONSULTATION HISTORY */}
                    {selectedPatient && (
                      <div className="widget-content">
                        <div style={{ marginBottom: "15px" }}>
                          <button
                            className="back-btn"
                            onClick={() => {
                              setSelectedPatient(null);
                              setEditingConsultation(null);
                            }}
                            style={{
                              padding: "8px 16px",
                              backgroundColor: "#f0f0f0",
                              border: "1px solid #ccc",
                              borderRadius: "4px",
                              cursor: "pointer",
                              fontSize: "14px"
                            }}
                          >
                            ← Back to Queue
                          </button>
                        </div>

                        <div style={{ marginBottom: "10px", fontWeight: "bold" }}>
                          Patient: {selectedPatient.patient_name}
                        </div>

                        {/* Use ConsultationHistoryView Component */}
                        <ConsultationHistoryView patient={selectedPatient} />
                      </div>
                    )}
                  </div>
                )}





                {/* TV Widget */}
                {selectedWidgets.includes("tv") && (
                  <div className="widget-card widget-tv">
                    <div className="widget-header">
                      <h3>📺 TV Display Panel</h3>
                    </div>

                    <div className="widget-content">
                      <div className="tv-widget">
                        <div className="tv-queue-number">Q001</div>
                        <p className="tv-subtext">Now Serving</p>
                      </div>
                    </div>
                  </div>
                )}



              </div>


            </section>
          )}



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
