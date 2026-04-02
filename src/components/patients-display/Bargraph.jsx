import "./bargraph.css";

export default function BarGraph({ data = [], reportType = "consultations" }) {
  // Title based on report type
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

  // Ensure array
  const chartData = data && data.length > 0 ? [...data] : [];

  // Sort Highest → Lowest
  chartData.sort((a, b) => b.value - a.value);

  // Max value
  const maxValue =
    chartData.length > 0
      ? Math.max(...chartData.map((item) => item.value))
      : 1;

  // Dynamic Y-axis
  const steps = 5;
  const yAxis = [];
  for (let i = 0; i <= steps; i++) {
    yAxis.push(Math.round((maxValue / steps) * i));
  }

  // Multi-color palette
  const barColors = [
    "#2c7be5",
    "#e52c2c",
    "#2ce59c",
    "#f0c42c",
    "#a32ce5",
    "#ff7f50",
    "#6ea8fe",
    "#ff69b4",
  ];

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

        {/* GRAPH */}
        <div className="bargraph">
          {chartData.length === 0 ? (
            <div className="empty-chart">No data available</div>
          ) : (
            chartData.map((item, index) => {
              const height = (item.value / maxValue) * 100;
              const color = barColors[index % barColors.length]; // cycle colors

              return (
                <div className="bar-wrapper" key={index}>
                  {/* VALUE */}
                  <span className="bar-count">{item.value}</span>

                  {/* BAR */}
                 <div
                    className="bar"
                    style={{
                      height: `${height}%`,
                      background: color, // SOLID COLOR
                    }}
                  />

                  {/* LABEL */}
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