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

// Encoder queue hook (date-filtered, API-only)
import { useEncoderQueue } from "../hooks/useEncoderQueue";

// Queue stats hook
import { useQueueStats } from "../hooks/useQueueStats";


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
  // QUEUE STATISTICS (Real data from database)
  // ===============================
  const { stats, loading: statsLoading, error: statsError, refreshStats } = useQueueStats(user);

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
  const [showAllPriority, setShowAllPriority] = useState(false);
  const [showAllRegular, setShowAllRegular] = useState(false);

  const priorityQueue = waitingQueue.filter(q => q.queue_type === "PRIORITY");
  const regularQueue = waitingQueue.filter(q => q.queue_type === "REGULAR");
  const displayPriority = showAllPriority ? priorityQueue : priorityQueue.slice(0, 3);
  const displayRegular = showAllRegular ? regularQueue : regularQueue.slice(0, 3);

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
  // ENCODER QUEUE (DATE-FILTERED API POLLING - NO WEBSOCKET)
  // ===============================
  // Fetches DONE patients for the selected date from API only
  // ✅ Bypasses WebSocket to allow proper date filtering
  const { encoderQueue, encoderFilterDate, setEncoderFilterDate } = useEncoderQueue();

  // ===============================
  // ENCODER QUEUE FILTER HOOK
  // ===============================
  const { search: encoderSearch, setSearch: setEncoderSearch, filteredQueue: filteredEncoderQueue } = useEncoderQueueFilter(encoderQueue);

  // ===============================
  // ACCEPT QUEUE HOOK
  // ===============================
  const { handleAcceptQueue, loading: accepting } = useAcceptQueue({
    onAccepted: (patient) => {
      setServingPatient(patient);
    },
    user
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
        <main className="dashboard-main1">

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
                  <h3>Over All completed</h3>
                  <p className="stat-number">{statsLoading ? "..." : stats.overallCompleted}</p>
                </div>
              </div>

              <div className="stat-card">
                <div className="stat-icon">✅</div>
                <div className="stat-content">
                  <h3>Today Completed</h3>
                  <p className="stat-number">{statsLoading ? "..." : stats.todayCompleted}</p>
                </div>
              </div>

              <div className="stat-card">
                <div className="stat-icon">⚡</div>
                <div className="stat-content">
                  <h3>Waiting</h3>
                  <p className="stat-number">{statsLoading ? "..." : stats.waiting}</p>
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
  <div className="widget-card widget-doctor-new">

    <div className="widget-header-new">
      <div className="doctor-title">
        <h3>Doctor Panel</h3>
        <span>Patient Consultations</span>
      </div>
    </div>

    <div className="widget-content-new">
      <table className="consultation-table-new">
        <thead>
          <tr>
            <th>Patient Name</th>
            <th>Status</th>
            <th></th>
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
              <td className="patient-name-cell">{item.patient_name}</td>

              <td>
                <span className={`status-badge-new ${getStatusColor(item.status)}`}>
                  {item.status}
                </span>
              </td>

              <td className="action-cell">
                {item.status !== "done" && (
                  <button
                    className="select-btn-new"
                    onClick={async () => {
                      const patientData = await setActive(item.id);

                      wsSend({
                        type: 'doctor-assignment-updated',
                        doctor_id: user?.id
                      });

                      openModal(
                        <DoctorModal
                          patient={patientData}
                          onDone={async () => {
                            await markDone(item.id);
                            wsSend({ type: 'refresh-doctor-queue-now', doctor_id: user?.id });
                            closeModal();
                          }}
                        />
                      );
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
)}








                {/* Triage Widget */}
{selectedWidgets.includes("triage") && (
  <div className="widget-card widget-triage">

    {/* 🔥 HEADER WITH STATS */}
    <div className="widget-header triage-header-redesign">
      <div className="triage-title-group">
        <h3>🚨 Triage Panel</h3>
        <span className="triage-subtitle">Live waiting queue monitor</span>
      </div>

      <div className="triage-header-stats">
        <div className="header-stat priority">
          <span>Priority</span>
          <strong>
            {waitingQueue.filter(q => q.queue_type === "PRIORITY").length}
          </strong>
        </div>

        <div className="header-stat regular">
          <span>Regular</span>
          <strong>
            {waitingQueue.filter(q => q.queue_type === "REGULAR").length}
          </strong>
        </div>

        <div className="header-stat total">
          <span>Total</span>
          <strong>{waitingQueue.length}</strong>
        </div>
      </div>
    </div>

    <div className="widget-content">
      <div className="triage-widget">

        {/* =========================
            PATIENT QUEUE
        ========================== */}
        <div className="widget-section">
          <h4>⏱️ Patient Queue</h4>

          <div className="queue-list">
            {waitingQueue.length === 0 && (
              <div className="empty-queue">No patients waiting</div>
            )}

            <div className="queue-group priority-group">
              <div className="queue-group-title priority">🔥 Priority Patients</div>
              {displayPriority.length === 0 && (
                <div className="empty-queue">No priority patients</div>
              )}
              {displayPriority.map((q) => {
                const waitMinutes = Math.floor(
                  (Date.now() - new Date(q.created_at)) / 60000
                );

                return (
                  <div key={q.id} className="queue-item priority-high">
                    <span className="queue-number">{q.queue_code}</span>

                    <span className="patient-info">
                      {q.first_name} {q.last_name}
                    </span>

                    <span className="wait-time">Wait: {waitMinutes} min</span>

                    <button
                      className="accept-btn"
                      disabled={accepting}
                      onClick={() => {
                        handleAcceptQueue(q, (patient) => {
                          const patientQueueId = patient.id;

                          localStorage.setItem("activeTriageQueueId", patientQueueId);
                          localStorage.setItem("triageAssignmentCompleted", "false");

                          setTriageQueueId(patientQueueId);
                          setAssignmentCompleted(false);

                          openModal(
                            <TriageModal
                              patient={patient}
                              triggerPollingReset={triggerPollingReset}

                                onAssign={() => {
                                  setAssignmentCompleted(true);
                                  localStorage.setItem("triageAssignmentCompleted", "true");
                                  console.log("✅ Doctor assigned - triage complete");
                                }}

                                onClose={async () => {
                                  if (!assignmentCompleted) {
                                    await revertTriage(patientQueueId);

                                    wsSend({ type: "refresh-queue-now" });
                                    console.log("📡 Patient reverted to waiting");
                                  }

                                  setTriageQueueId(null);
                                  setAssignmentCompleted(false);
                                  localStorage.removeItem("activeTriageQueueId");
                                  localStorage.removeItem("triageAssignmentCompleted");

                                  closeModal();
                                }}
                              />
                            );
                          });
                        }}
                      >
                        {accepting ? "Accepting..." : "Accept"}
                      </button>
                    </div>
                  );
                })}
            </div>
            {priorityQueue.length > 3 && (
              <button
                className="queue-group-toggle"
                onClick={() => setShowAllPriority(!showAllPriority)}
              >
                {showAllPriority ? "Show less priority" : `Show all ${priorityQueue.length} priority`}
              </button>
            )}

            <div className="queue-group regular-group">
              <div className="queue-group-title regular">🧍 Regular Patients</div>
              {displayRegular.length === 0 && (
                <div className="empty-queue">No regular patients</div>
              )}
              {displayRegular.map((q) => {
                  const waitMinutes = Math.floor(
                    (Date.now() - new Date(q.created_at)) / 60000
                  );

                  return (
                    <div key={q.id} className="queue-item priority-low">
                      <span className="queue-number">{q.queue_code}</span>

                      <span className="patient-info">
                        {q.first_name} {q.last_name}
                      </span>

                      <span className="wait-time">Wait: {waitMinutes} min</span>

                      <button
                        className="accept-btn"
                        disabled={accepting}
                        onClick={() => {
                          handleAcceptQueue(q, (patient) => {
                            const patientQueueId = patient.id;

                            localStorage.setItem("activeTriageQueueId", patientQueueId);
                            localStorage.setItem("triageAssignmentCompleted", "false");

                            setTriageQueueId(patientQueueId);
                            setAssignmentCompleted(false);

                            openModal(
                              <TriageModal
                                patient={patient}
                                triggerPollingReset={triggerPollingReset}

                                onAssign={() => {
                                  setAssignmentCompleted(true);
                                  localStorage.setItem("triageAssignmentCompleted", "true");
                                  console.log("✅ Doctor assigned - triage complete");
                                }}

                                onClose={async () => {
                                  if (!assignmentCompleted) {
                                    await revertTriage(patientQueueId);

                                    wsSend({ type: "refresh-queue-now" });
                                    console.log("📡 Patient reverted to waiting");
                                  }

                                  setTriageQueueId(null);
                                  setAssignmentCompleted(false);
                                  localStorage.removeItem("activeTriageQueueId");
                                  localStorage.removeItem("triageAssignmentCompleted");

                                  closeModal();
                                }}
                              />
                            );
                          });
                        }}
                      >
                        {accepting ? "Accepting..." : "Accept"}
                      </button>
                    </div>
                  );
                })}
            </div>
            {regularQueue.length > 3 && (
              <button
                className="queue-group-toggle"
                onClick={() => setShowAllRegular(!showAllRegular)}
              >
                {showAllRegular ? "Show less regular" : `Show all ${regularQueue.length} regular`}
              </button>
            )}

          </div>
        </div>

        {/* =========================
            ACTION SECTION
        ========================== */}
        <div className="widget-section triage-action-section">
          <h4>📊 Queue Actions</h4>

          <button
            className="cancel-waiting-action-btn"
            onClick={handleCancelWaitingQueues}
          >
            ⚠️ Cancel All Waiting Patients
          </button>
        </div>

      </div>
    </div>
  </div>
)}





{selectedWidgets.includes("encoder") && (
  <div className="widget-card widget-encoder-new">

    {/* HEADER */}
    <div className="encoder-header">
      <div>
        <h3>🧾 Encoder Panel</h3>
        <span>Manage and encode patient consultations</span>
      </div>
    </div>

    {/* STEP 1: QUEUE */}
    {!selectedPatient && (
      <div className="encoder-body">

        {/* FILTER BAR */}
        <div className="encoder-filters">
          <input
            type="text"
            placeholder="🔍 Search patient or queue #"
            value={encoderSearch}
            onChange={(e) => setEncoderSearch(e.target.value)}
          />

          <input
            type="date"
            value={encoderFilterDate}
            onChange={(e) => setEncoderFilterDate(e.target.value)}
          />

          {encoderSearch && (
            <button
              className="clear-btn"
              onClick={() => setEncoderSearch("")}
            >
              Clear
            </button>
          )}
        </div>

        {/* RESULT INFO */}
        <div className="encoder-info">
          {filteredEncoderQueue.length} / {encoderQueue.length} patients
        </div>

        {/* LIST */}
        <div className="encoder-list">
          {filteredEncoderQueue.length === 0 ? (
            <div className="empty-state">
              {encoderQueue.length === 0
                ? "No patients to encode"
                : "No matching results"}
            </div>
          ) : (
            filteredEncoderQueue.map((patient) => (
              <div key={patient.queue_id} className="encoder-item">

                <div className="encoder-main">
                  <div className="patient-name">
                    {patient.patient_name}
                  </div>
                  <div className="queue-meta">
                    #{patient.queue_number} • {patient.queue_date}
                  </div>
                </div>

                <div className="encoder-status">
                  <span
                    className={`status-pill ${
                      parseInt(patient.has_consultation) > 0
                        ? "done"
                        : "pending"
                    }`}
                  >
                    {parseInt(patient.has_consultation) > 0
                      ? "Encoded"
                      : "Pending"}
                  </span>
                </div>

                <div className="encoder-action">
                  <button
                    className="encode-btn"
                    onClick={() => handleEncode(patient)}
                  >
                    ✏️ Encode
                  </button>
                </div>

              </div>
            ))
          )}
        </div>
      </div>
    )}

    {/* STEP 2: HISTORY */}
    {selectedPatient && (
      <div className="encoder-body">

        <div className="encoder-topbar">
          <button
            className="back-btn"
            onClick={() => {
              setSelectedPatient(null);
              setEditingConsultation(null);
            }}
          >
            ← Back
          </button>

          <div className="selected-patient">
            {selectedPatient.patient_name}
          </div>
        </div>

        <ConsultationHistoryView patient={selectedPatient} />
      </div>
    )}
  </div>
)}





                {/* TV Widget */}
                {selectedWidgets.includes("tv") && (
                  <TVDisplayWidget />
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

/**
 * TV Display Widget Component
 * Shows all active queues in real-time via WebSocket
 * Displays all doctors' current patients (up to doctor capacity)
 */
function TVDisplayWidget() {
  const { doctorAssignments } = useWebSocketContext();

  console.log('📺 [TV-RENDER] All doctorAssignments from WebSocket:', doctorAssignments);

  // Get all active queues (is_active = 1 OR status = 'serving')
  const activeQueues = doctorAssignments
    .filter(q => q.is_active === 1 || q.status === 'serving')
    .sort((a, b) => {
      // Sort by doctor_id first, then by patient_queue_id
      if (a.doctor_id !== b.doctor_id) {
        return a.doctor_id - b.doctor_id;
      }
      const aId = a.patient_queue_id || a.id;
      const bId = b.patient_queue_id || b.id;
      return aId - bId;
    });

  // Debug: Log active queues with ALL fields
  console.log('📺 [TV-ACTIVE] Filtered active queues:', activeQueues.map(q => ({
    id: q.id,
    patient_queue_id: q.patient_queue_id,
    queue_number: q.queue_number,
    doctor_id: q.doctor_id,
    doctor_name: q.doctor_name,
    patient_name: `${q.first_name} ${q.last_name}`,
    status: q.status,
    is_active: q.is_active,
    all_keys: Object.keys(q)  // Show ALL available fields
  })));

  // Handle expand button click
  const handleExpandTV = () => {
    window.open(`${window.location.origin}?view=tv-display`, 'TV-Display', 'width=1920,height=1080,fullscreen=yes');
  };

  return (
    <div className="widget-card widget-tv">
      <div className="widget-header">
        <div className="widget-header-content">
          <h3>📺 TV Display Panel - Now Serving</h3>
          <button onClick={handleExpandTV} className="expand-btn" title="Open in new tab for TV display">
            🖥️ Expand to TV
          </button>
        </div>
      </div>

      <div className="widget-content">
        <div className="tv-widget-grid">
          {activeQueues.length === 0 ? (
            <div className="tv-no-queue">
              <p>No Active Queues</p>
            </div>
          ) : (
            activeQueues.map((queue, index) => (
              <div key={`${queue.doctor_id}-${index}`} className="tv-queue-slot">
                <div className="tv-doctor-label">Dr. {queue.doctor_name || `Doctor ${queue.doctor_id}`}</div>
                <div className="tv-queue-display">
                  <div className="tv-queue-id">
                    {queue.queue_code || queue.queue_number || queue.patient_queue_id || queue.id || '---'}
                  </div>
                  <div className="tv-queue-type-badge">
                    {queue.queue_type?.toUpperCase() === 'PRIORITY' ? '⚡ PRIORITY' : '📋 REGULAR'}
                  </div>
                  <div className="tv-status-badge">
                    {queue.status.toUpperCase()}
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
