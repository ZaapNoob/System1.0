import { useState } from "react";

export default function MedicalCertificates({
  patient,
  medicalHistory,
  medicalLoading,
}) {
  const [expanded, setExpanded] = useState(true);
  const [expandedCert, setExpandedCert] = useState(null);

  if (!medicalHistory || medicalHistory.length === 0) {
    return (
      <div className="section-container medical-history-section">
        <button 
          className="section-toggle"
          onClick={() => setExpanded(!expanded)}
        >
          <span className={`toggle-icon ${expanded ? 'open' : 'closed'}`}>▼</span>
          <h4>Medical Certificates</h4>
          <span className="member-count">0</span>
        </button>
        {expanded && (
          <div className="section-content">
            <p className="muted">No medical certificates found.</p>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="section-container medical-history-section">
      <button 
        className="section-toggle"
        onClick={() => setExpanded(!expanded)}
      >
        <span className={`toggle-icon ${expanded ? 'open' : 'closed'}`}>▼</span>
        <h4>Medical Certificates</h4>
        <span className="member-count">{medicalHistory.length}</span>
      </button>

      {expanded && (
        <div className="section-content">
          {medicalLoading ? (
            <p>Loading medical certificates...</p>
          ) : (
            <div className="medical-history-list">
              {medicalHistory.map((cert) => (
                <div key={cert.id} className="medical-record">
                  <button
                    className="medical-header-toggle"
                    onClick={() => setExpandedCert(expandedCert === cert.id ? null : cert.id)}
                  >
                    <span className={`toggle-icon ${expandedCert === cert.id ? 'open' : 'closed'}`}>▼</span>
                    <div className="medical-header-info">
                      <span className="cert-date">{cert.issued_at || "—"}</span>
                      <span className="cert-no">{cert.certificate_no || "—"}</span>
                      {cert.impression && (
                        <span className="cert-impression">{cert.impression}</span>
                      )}
                    </div>
                  </button>

                  {expandedCert === cert.id && (
                    <div className="medical-record-content">
                      <div className="medical-details-grid">
                        {cert.certificate_no && (
                          <div className="detail-item">
                            <strong>Certificate No:</strong>
                            <p>{cert.certificate_no}</p>
                          </div>
                        )}
                        {cert.doctor_name && (
                          <div className="detail-item">
                            <strong>Doctor:</strong>
                            <p>{cert.doctor_name}</p>
                          </div>
                        )}
                        {cert.issued_at && (
                          <div className="detail-item">
                            <strong>Issued At:</strong>
                            <p>{new Date(cert.issued_at).toLocaleDateString()}</p>
                          </div>
                        )}
                      </div>

                      {cert.impression && (
                        <div className="detail-item full-width">
                          <strong>Impression:</strong>
                          <p>{cert.impression}</p>
                        </div>
                      )}

                      {cert.remarks && (
                        <div className="detail-item full-width">
                          <strong>Remarks:</strong>
                          <p>{cert.remarks}</p>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
