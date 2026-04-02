import React from "react";

export default function HistoryCard({ title, history, latestLabel = "Latest", accent = "#0066cc" }) {
  return (
    <div className="doctor-card detail-card history-card">
      <h3 style={{ borderLeft: `4px solid ${accent}`, paddingLeft: "10px" }}>
        {title}
      </h3>

      <div className="history-content">
        {history && history.length > 0 ? (
          <ul className="history-list">
            {history.map((item, idx) => (
              <li key={idx} className={`history-item ${idx === 0 ? "latest-item" : ""}`}>
                {idx === 0 && <span className="latest-badge">🔴 {latestLabel}: </span>}
                {item}
              </li>
            ))}
          </ul>
        ) : (
          <span className="empty-history">—</span>
        )}
      </div>
    </div>
  );
}
