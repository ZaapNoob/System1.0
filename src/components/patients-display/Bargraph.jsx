import "./bargraph.css";

export default function BarGraph({ data = [], reportType = "consultations" }) {
  // Map report type to display title
  const getTitleFromReportType = () => {
    switch (reportType) {
      case "patients":
        return "Patients per Barangay";
      case "labRequests":
        return "Lab Requests per Barangay";
      case "medicalCertificates":
        return "Medical Certificates per Barangay";
      case "consultations":
      default:
        return "Consultations per Barangay";
    }
  };

  const chartData = data && data.length > 0 ? data : [];

  const maxValue =
    chartData.length > 0
      ? Math.max(...chartData.map((item) => item.value))
      : 1;

  const yAxis = [];
  const steps = 5;
  for (let i = 0; i <= steps; i++) {
    yAxis.push(Math.round((maxValue / steps) * i));
  }

  return (
    <div className="bargraph-container">
      <h3 className="bargraph-title">{getTitleFromReportType()}</h3>
      <div className="chart-wrapper">

        {/* Y AXIS */}
        <div className="y-axis">
          {yAxis.reverse().map((num, index) => (
            <span key={index}>{num}</span>
          ))}
        </div>

        {/* GRAPH AREA */}
        <div className="bargraph">
          {chartData.length === 0 ? (
            <div className="empty-chart">No data available</div>
          ) : (
            chartData.map((item, index) => {
              const height = (item.value / maxValue) * 100;
              return (
                <div className="bar-wrapper" key={index}>
                  <span className="bar-count">{item.value}</span>
                  <div className="bar" style={{ height: `${height}%` }} />
                  <span className="bar-label">{item.label}</span>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
}