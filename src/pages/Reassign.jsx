import React, { useState } from 'react';
import './reassign.css';
import Sidebar from '../components/Sidebar';
import useLogout from '../hooks/useLogout';
import { usePatientImage } from '../hooks/image display/usePatientImage';
import useReassignPatients from '../hooks/useReassignPatients';

// Helper component to handle the image hook cleanly within a mapped list
const PatientAvatar = ({ patientId }) => {
  const { imageUrl } = usePatientImage(patientId);
  return (
    <img 
      src={imageUrl || '/default-avatar.png'} 
      alt="Patient Profile" 
      className="patient-avatar" 
    />
  );
};

const Reassign = ({ user, onNavigateToProfile, allowedPages, onNavigate, handleLogout: propHandleLogout }) => {
  const { handleLogout } = useLogout();
  const [statusFilter, setStatusFilter] = useState('all');
  
  const {
    assignedPatients,
    doctors,
    loading,
    error,
    selectedPatientId,
    setSelectedPatientId,
    selectedDoctorId,
    setSelectedDoctorId,
    reassigningPatientId,
    handleReassignDoctor,
    getDoctorName,
    getStatusColor,
  } = useReassignPatients();

  // Filter patients based on selected status
  const filteredPatients = statusFilter === 'all' 
    ? assignedPatients 
    : assignedPatients.filter(p => p.status?.toLowerCase() === statusFilter.toLowerCase());

  // Get status counts
  const statusCounts = {
    all: assignedPatients.length,
    waiting: assignedPatients.filter(p => p.status?.toLowerCase() === 'waiting').length,
    serving: assignedPatients.filter(p => p.status?.toLowerCase() === 'serving').length,
    done: assignedPatients.filter(p => p.status?.toLowerCase() === 'done').length,
  };

  return (
    <div className="dashboard-container">
      <Sidebar allowedPages={allowedPages} currentPage="reassign" onNavigate={onNavigate} />
      
      <main className="main-content">
        <header className="dashboard-header">
          <div>
            <h1>Patient Directory</h1>
            <p className="subtitle">Manage patient assignments and locations</p>
          </div>
          <div className="user-info" onClick={onNavigateToProfile} style={{ cursor: 'pointer' }}>
            <span className="user-name">{user?.name || 'User'}</span>
            <button className="logout-btn" onClick={handleLogout}>
              Logout
            </button>
          </div>
        </header>

        {/* Status Filter Section */}
        <div style={{ 
          display: 'flex', 
          gap: '12px', 
          alignItems: 'center',
          padding: '1.5rem',
          backgroundColor: '#f5f5f5',
          borderRadius: '8px',
          marginBottom: '2rem'
        }}>
          <label style={{ fontWeight: '600', color: '#333', whiteSpace: 'nowrap' }}>Filter by Status:</label>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            style={{
              padding: '10px 15px',
              borderRadius: '6px',
              border: '2px solid #2196f3',
              fontSize: '14px',
              fontWeight: '500',
              cursor: 'pointer',
              backgroundColor: 'white',
              color: '#333',
              width: 'auto',
              minWidth: '200px'
            }}
          >
            <option value="all">All Patients ({statusCounts.all})</option>
            <option value="waiting">⏳ Waiting ({statusCounts.waiting})</option>
            <option value="serving">👨‍⚕️ Serving ({statusCounts.serving})</option>
            <option value="done">✅ Done ({statusCounts.done})</option>
          </select>

          {/* Status Summary Cards */}
          <div style={{ 
            display: 'flex', 
            gap: '10px',
            marginLeft: 'auto'
          }}>
            <div style={{
              padding: '8px 12px',
              backgroundColor: '#fff3cd',
              borderRadius: '4px',
              fontSize: '12px',
              fontWeight: '600',
              color: '#856404'
            }}>
              ⏳ {statusCounts.waiting}
            </div>
            <div style={{
              padding: '8px 12px',
              backgroundColor: '#d1ecf1',
              borderRadius: '4px',
              fontSize: '12px',
              fontWeight: '600',
              color: '#0c5460'
            }}>
              👨‍⚕️ {statusCounts.serving}
            </div>
            <div style={{
              padding: '8px 12px',
              backgroundColor: '#d4edda',
              borderRadius: '4px',
              fontSize: '12px',
              fontWeight: '600',
              color: '#155724'
            }}>
              ✅ {statusCounts.done}
            </div>
          </div>
        </div>

        <div className="patient-grid">
          {loading && (
            <div style={{ gridColumn: '1 / -1', textAlign: 'center', padding: '2rem' }}>
              <p>Loading assigned patients...</p>
            </div>
          )}

          {error && (
            <div style={{ gridColumn: '1 / -1', textAlign: 'center', padding: '2rem', color: '#e74c3c' }}>
              <p>ℹ️ {error}</p>
            </div>
          )}

          {!loading && filteredPatients.length === 0 && (
            <div style={{ gridColumn: '1 / -1', textAlign: 'center', padding: '2rem', color: '#666' }}>
              <p>No patients with status: <strong>{statusFilter.toUpperCase()}</strong></p>
            </div>
          )}

          {!loading && filteredPatients.map((patient) => (
            <div key={patient.id} className="patient-card">
              {console.log('🔍 Rendering patient:', patient)}
              <div className="card-header">
                <PatientAvatar patientId={patient.patient_id} />
                <div className="patient-info">
                  <h3>{patient.patient_name}</h3>
                  <span className="patient-id">Queue: {patient.queue_number}</span>
                </div>
              </div>
              
              <div className="card-body">
                <div className="info-row">
                  <span className="label">Current Doctor:</span>
                  <span className="value" title={`Doctor ID: ${patient.doctor_id}`}>
                    {getDoctorName(patient.doctor_id, patient.doctor_name)}
                  </span>
                </div>
                <div className="info-row">
                  <span className="label">Queue Date:</span>
                  <span className="value">{patient.queue_date}</span>
                </div>
                <div className="info-row">
                  <span className="label">Status:</span>
                  <span 
                    className="status-badge"
                    style={{ backgroundColor: getStatusColor(patient.status), color: 'white' }}
                  >
                    {patient.status?.toUpperCase()}
                  </span>
                </div>
                <div className="info-row" style={{ fontSize: '12px', color: '#999' }}>
                  <span className="label">Patient Queue ID:</span>
                  <span className="value">{patient.patient_queue_id || 'N/A'}</span>
                </div>
              </div>

              <div className="card-actions">
                {selectedPatientId === patient.id ? (
                  <div className="reassign-form" style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    <select 
                      value={selectedDoctorId || ''} 
                      onChange={(e) => setSelectedDoctorId(parseInt(e.target.value))}
                      className="doctor-select"
                      style={{
                        padding: '8px',
                        borderRadius: '4px',
                        border: '1px solid #ddd',
                        flex: 1
                      }}
                    >
                      <option value="">Select Doctor...</option>
                      {doctors.map(doctor => (
                        <option key={doctor.id} value={doctor.id}>
                          {doctor.name}
                        </option>
                      ))}
                    </select>
                    <div style={{ display: 'flex', gap: '6px' }}>
                      <button
                        className="btn-confirm"
                        onClick={() => handleReassignDoctor(patient, selectedDoctorId)}
                        disabled={reassigningPatientId === patient.id}
                        style={{
                          flex: 1,
                          padding: '8px',
                          backgroundColor: '#4caf50',
                          color: 'white',
                          border: 'none',
                          borderRadius: '4px',
                          cursor: reassigningPatientId === patient.id ? 'not-allowed' : 'pointer',
                          opacity: reassigningPatientId === patient.id ? 0.6 : 1
                        }}
                      >
                        {reassigningPatientId === patient.id ? 'Reassigning...' : '✓ Confirm'}
                      </button>
                      <button
                        className="btn-cancel"
                        onClick={() => {
                          setSelectedPatientId(null);
                          setSelectedDoctorId(null);
                        }}
                        disabled={reassigningPatientId === patient.id}
                        style={{
                          flex: 1,
                          padding: '8px',
                          backgroundColor: '#f44336',
                          color: 'white',
                          border: 'none',
                          borderRadius: '4px',
                          cursor: reassigningPatientId === patient.id ? 'not-allowed' : 'pointer',
                          opacity: reassigningPatientId === patient.id ? 0.6 : 1
                        }}
                      >
                        ✕ Cancel
                      </button>
                    </div>
                  </div>
                ) : (
                  <button 
                    className="btn-primary" 
                    onClick={() => setSelectedPatientId(patient.id)}
                    style={{
                      width: '100%',
                      padding: '10px',
                      backgroundColor: '#2196f3',
                      color: 'white',
                      border: 'none',
                      borderRadius: '4px',
                      cursor: 'pointer'
                    }}
                  >
                    🔄 Reassign Doctor
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
};

export default Reassign;