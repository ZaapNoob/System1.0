import { useState } from "react";

export default function LabHistory({
  patient,
  labHistory,
  labLoading,
}) {
  const [expanded, setExpanded] = useState(true);
  const [expandedLab, setExpandedLab] = useState(null);

  if (!labHistory || labHistory.length === 0) {
    return (
      <div className="section-container lab-history-section">
        <button 
          className="section-toggle"
          onClick={() => setExpanded(!expanded)}
        >
          <span className={`toggle-icon ${expanded ? 'open' : 'closed'}`}>▼</span>
          <h4>Laboratory History</h4>
          <span className="member-count">0</span>
        </button>
        {expanded && (
          <div className="section-content">
            <p className="muted">No laboratory requests found.</p>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="section-container lab-history-section">
      <button 
        className="section-toggle"
        onClick={() => setExpanded(!expanded)}
      >
        <span className={`toggle-icon ${expanded ? 'open' : 'closed'}`}>▼</span>
        <h4>Laboratory History</h4>
        <span className="member-count">{labHistory.length}</span>
      </button>

      {expanded && (
        <div className="section-content">
          {labLoading ? (
            <p>Loading laboratory history...</p>
          ) : (
            <div className="lab-history-list">
              {labHistory.map((lab) => (
                <div key={lab.id} className="lab-record">
                  <button
                    className="lab-header-toggle"
                    onClick={() => setExpandedLab(expandedLab === lab.id ? null : lab.id)}
                  >
                    <span className={`toggle-icon ${expandedLab === lab.id ? 'open' : 'closed'}`}>▼</span>
                    <div className="lab-header-info">
                      <span className="lab-date">{lab.created_at || "—"}</span>
                      <span className="lab-request-no">{lab.request_no || "—"}</span>
                      {lab.diagnosis && (
                        <span className="lab-diagnosis">{lab.diagnosis}</span>
                      )}
                    </div>
                  </button>

                  {expandedLab === lab.id && (
                    <div className="lab-record-content">
                      <div className="lab-details">
                        {lab.diagnosis && (
                          <div className="detail-item">
                            <strong>Diagnosis:</strong>
                            <p>{lab.diagnosis}</p>
                          </div>
                        )}
                        {lab.doctor_name && (
                          <div className="detail-item">
                            <strong>Doctor:</strong>
                            <p>{lab.doctor_name}</p>
                          </div>
                        )}
                      </div>

                      {/* Tests Table */}
                      {lab.tests && lab.tests.length > 0 && (
                        <div className="lab-tests-table-wrapper">
                          <h5>Laboratory Tests</h5>
                          <table className="lab-tests-table">
                            <thead>
                              <tr>
                                <th>Category</th>
                                <th>Test Name</th>
                                <th>Value</th>
                              </tr>
                            </thead>
                            <tbody>
                              {lab.tests.map((test, idx) => (
                                <tr key={idx}>
                                  <td>{test.category || "—"}</td>
                                  <td>{test.test_name || "—"}</td>
                                  <td>{test.other_value || "—"}</td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      )}

                      {/* Findings */}
                      <div className="lab-findings">
                        {lab.xray_findings && (
                          <div className="finding-item">
                            <strong>X-Ray Findings:</strong>
                            <p>{lab.xray_findings}</p>
                          </div>
                        )}
                        {lab.utz_findings && (
                          <div className="finding-item">
                            <strong>Ultrasound Findings:</strong>
                            <p>{lab.utz_findings}</p>
                          </div>
                        )}
                        {lab.ct_scan_findings && (
                          <div className="finding-item">
                            <strong>CT Scan Findings:</strong>
                            <p>{lab.ct_scan_findings}</p>
                          </div>
                        )}
                        {lab.other_findings && (
                          <div className="finding-item">
                            <strong>Other Findings:</strong>
                            <p>{lab.other_findings}</p>
                          </div>
                        )}
                      </div>
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
