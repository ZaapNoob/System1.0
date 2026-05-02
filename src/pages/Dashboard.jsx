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

// Doctor stats hook
import { useDoctorStats } from "../hooks/useDoctorStats";

// Encoder stats hook
import { useEncoderStats } from "../hooks/useEncoderStats";

// Completed patients card
import CompletedPatientsCard from "../components/CompletedPatientsCard";
import "../components/CompletedPatientsCard.css";

// Today completed patients card
import TodayCompletedPatientsCard from "../components/TodayCompletedPatientsCard";
import "../components/TodayCompletedPatientsCard.css";

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
    console.log("📋 [ENCODE] View/Encode clicked for patient:", patient);
    console.log("📋 [ENCODE] Patient ID:", patient?.patient_id);
    console.log("📋 [ENCODE] Patient name:", patient?.patient_name);
    console.log("📋 [ENCODE] Has consultation:", patient?.has_consultation);
    console.log("📋 [ENCODE] All fields:", patient ? Object.keys(patient) : "NO DATA");
    setSelectedPatient(patient);
  };

  const handleNavigate = (page) => {
    setCurrentPage(page);
    if (onNavigate) onNavigate(page);
  };

  // ===============================
  // QUEUE STATISTICS (Real data from database)
  // ===============================
  // Use doctor stats if user is a doctor, encoder stats if encoder, otherwise use queue stats
  const isDoctor = user?.role === "doctor";
  const isEncoder = user?.role === "encoder";
  const isTriage = user?.role === "triage";
  const { stats: doctorStats } = useDoctorStats(isDoctor ? user?.id : null);
  const { stats: encoderStats } = useEncoderStats(isEncoder ? user?.id : null);
  const { stats: queueStats, loading: statsLoading, error: statsError, refreshStats } = useQueueStats(user);
  
  // Select appropriate stats based on role
  let stats = queueStats;
  if (isDoctor) {
    stats = doctorStats;
  } else if (isEncoder) {
    stats = {
      overallCompleted: encoderStats.overallEncoded,
      todayCompleted: encoderStats.todayEncoded
    };
  }

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
      const response = await fetch(`${API}/widgets/get.php?user_id=${user.id}`, {
        credentials: 'include'
      });

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
        headers: { Authorization: token },
        credentials: 'include'
      });
    } catch (error) {
      console.error("Logout error:", error);
    } finally {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
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

              {/* Clickable Completed Patients Card */}
              {(isDoctor || isEncoder || isTriage) && (
                <CompletedPatientsCard
                  userId={isTriage ? user?.id : (isEncoder ? user?.id : null)}
                  doctorId={isDoctor ? user?.id : null}
                  encoderId={isEncoder ? user?.id : null}
                  completedCount={stats.overallCompleted}
                  role={user?.role}
                />
              )}

              {/* Clickable Today Completed Patients Card */}
              {(isDoctor || isEncoder || isTriage) && (
                <TodayCompletedPatientsCard
                  userId={isTriage ? user?.id : (isEncoder ? user?.id : null)}
                  doctorId={isDoctor ? user?.id : null}
                  encoderId={isEncoder ? user?.id : null}
                  completedCount={stats.todayCompleted}
                  role={user?.role}
                />
              )}

           
             
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
      <button
        className="refresh-btn"
        onClick={() => {
          console.log('🔄 Manual refresh triggered for doctor assignments');
          wsSend({ type: 'refresh-doctor-queue-now', doctor_id: user?.id });
        }}
        title="Refresh patient list"
        style={{
          padding: '8px 12px',
          backgroundColor: '#4CAF50',
          color: 'white',
          border: 'none',
          borderRadius: '4px',
          cursor: 'pointer',
          fontSize: '12px',
          fontWeight: 'bold'
        }}
      >
        🔄 Refresh
      </button>
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
          {!doctorAssignmentsLoading && doctorAssignments.length === 0 && (
            <tr>
              <td colSpan="3">
                <div style={{ padding: '20px', textAlign: 'center' }}>
                  <div>No assigned patients</div>
                  <div style={{ fontSize: '12px', color: '#666', marginTop: '10px' }}>
                    Waiting for triage to assign patients...
                  </div>
                </div>
              </td>
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

      <button
        className="refresh-btn"
        onClick={() => {
          console.log('🔄 Manual refresh triggered for waiting queue');
          wsSend({ type: 'refresh-queue-now' });
        }}
        title="Refresh patient list"
        style={{
          padding: '8px 12px',
          backgroundColor: '#4CAF50',
          color: 'white',
          border: 'none',
          borderRadius: '4px',
          cursor: 'pointer',
          fontSize: '12px',
          fontWeight: 'bold'
        }}
      >
        🔄 Refresh
      </button>

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
  

          <div className="queue-list">
           

            <div className="queue-group priority-group">
              <div className="queue-group-title priority">Priority Patients</div>
              {displayPriority.length === 0 && (
                <div className="empty-queue">No priority patients</div>
              )}
              {displayPriority.map((q) => {
                const waitMinutes = Math.floor(
                  (Date.now() - new Date(q.created_at)) / 60000
                );

                return (
                  <div key={q.id} className="queue-item priority-high">
                    <div className="queue-row-1">
                      <span className="queue-number">{q.queue_code}</span>
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
                    <div className="queue-row-2">
                      <span className="patient-name">{q.first_name} {q.last_name}</span>
                      <span className="wait-time">Wait: {waitMinutes} min</span>
                    </div>
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
              <div className="queue-group-title regular">Regular Patients</div>
              {displayRegular.length === 0 && (
                <div className="empty-queue">No regular patients</div>
              )}
              {displayRegular.map((q) => {
                  const waitMinutes = Math.floor(
                    (Date.now() - new Date(q.created_at)) / 60000
                  );

                  return (
                    <div key={q.id} className="queue-item priority-low">
                      <div className="queue-row-1">
                        <span className="queue-number">{q.queue_code}</span>
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
                    <div className="queue-row-2">
                      <span className="patient-name">{q.first_name} {q.last_name}</span>
                      <span className="wait-time">Wait: {waitMinutes} min</span>
                    </div>
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
          <h4> Queue Actions</h4>

          <button
            className="cancel-waiting-action-btn"
            onClick={handleCancelWaitingQueues}
          >
             Cancel All Waiting Patients
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
                  {parseInt(patient.has_consultation) === 0 ? (
                    <button
                      className="encode-btn"
                      onClick={() => handleEncode(patient)}
                    >
                      ✏️ Encode
                    </button>
                  ) : (
                    <button
                      className="view-btn"
                      onClick={() => handleEncode(patient)}
                    >
                      👁️ View
                    </button>
                  )}
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



          

        </main>
      </div>
    </div>
  );
}

/**
 * TV Display Widget Component
 * Shows active queues and waiting list for each doctor
 * Displays in real-time via WebSocket
 */
function TVDisplayWidget() {
  const { doctorAssignments } = useWebSocketContext();
  const [doctorQueues, setDoctorQueues] = useState([]);

  // Organize queues by doctor with active and waiting separation
  useEffect(() => {
    if (!doctorAssignments || doctorAssignments.length === 0) {
      setDoctorQueues([]);
      return;
    }

    // Group by doctor_id
    const doctors = {};
    
    doctorAssignments.forEach(queue => {
      const docId = queue.doctor_id;
      if (!doctors[docId]) {
        doctors[docId] = {
          doctor_id: docId,
          doctor_name: queue.doctor_name,
          active: null,
          waiting: []
        };
      }

      // Active patient (is_active = 1 or status = 'serving')
      if (parseInt(queue.is_active) === 1 || queue.status === 'serving') {
        doctors[docId].active = queue;
      }
      // Waiting patient (is_active = 0 or status = 'waiting')
      else if (parseInt(queue.is_active) === 0 || queue.status === 'waiting') {
        doctors[docId].waiting.push(queue);
      }
    });

    // Convert to array and sort by doctor_id
    const sorted = Object.values(doctors)
      .filter(doc => doc.active || doc.waiting.length > 0)
      .sort((a, b) => a.doctor_id - b.doctor_id);

    setDoctorQueues(sorted);

    console.log('📺 [TV-WIDGET] Doctor queues organized:', sorted);
  }, [doctorAssignments]);

  // Get queue code from queue object
  const getQueueNumber = (queue) => {
    return queue.queue_code || queue.patient_queue_id || queue.queue_number || queue.id || '---';
  };

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
          {doctorQueues.length === 0 ? (
            <div className="tv-no-queue">
              <p>No Active Queues</p>
            </div>
          ) : (
            doctorQueues.map((doctor) => (
              <div key={doctor.doctor_id} className="tv-widget-doctor-slot">
                {/* Doctor Name */}
                <div className="tv-widget-doctor-name">
                  Dr. {doctor.doctor_name || `Doctor ${doctor.doctor_id}`}
                </div>

                {/* Active Patient */}
                <div className="tv-widget-active">
                  {doctor.active ? (
                    <>
                      <div className="tv-widget-status-label">NOW SERVING</div>
                      <div className="tv-widget-queue-id">
                        {getQueueNumber(doctor.active)}
                      </div>
                      <div className="tv-widget-type-badge">
                        {doctor.active.queue_type?.toUpperCase() === 'PRIORITY' ? '⚡ PRIORITY' : '📋 REGULAR'}
                      </div>
                    </>
                  ) : (
                    <div className="tv-widget-no-current">No Patient</div>
                  )}
                </div>

                {/* Waiting List */}
                {doctor.waiting && doctor.waiting.length > 0 && (
                  <div className="tv-widget-waiting">
                    <div className="tv-widget-waiting-label">📋 WAITING ({doctor.waiting.length})</div>
                    <div className="tv-widget-waiting-list">
                      {doctor.waiting.slice(0, 2).map((queue, idx) => (
                        <div key={`${doctor.doctor_id}-waiting-${idx}`} className="tv-widget-waiting-item">
                          <span className="tv-widget-waiting-rank">#{idx + 1}</span>
                          <span className="tv-widget-waiting-queue">{getQueueNumber(queue)}</span>
                        </div>
                      ))}
                      {doctor.waiting.length > 2 && (
                        <div className="tv-widget-waiting-more">+{doctor.waiting.length - 2} more</div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
