export default function BaseTable({
  columns,
  data,
  loading,
  emptyMessage = "No data found",
  onRowClick,
  selectedRowKey,
}) {
  return (
    <table className="base-table">
      <thead>
        <tr>
          {columns.map((col) => (
            <th key={col.key}>{col.header}</th>
          ))}
        </tr>
      </thead>
      <tbody>
        {loading ? (
          <tr>
            <td colSpan={columns.length}>Loading...</td>
          </tr>
        ) : data.length === 0 ? (
          <tr>
            <td colSpan={columns.length}>{emptyMessage}</td>
          </tr>
        ) : (
          data.map((row, idx) => (
            <tr
              key={idx}
              onClick={() => onRowClick?.(row)}
              className={
                selectedRowKey &&
                row.household_no === selectedRowKey
                  ? "selected-row"
                  : ""
              }
            >
              {columns.map((col) => (
                <td key={col.key}>
                  {col.render ? col.render(row) : row[col.key]}
                </td>
              ))}
            </tr>
          ))
        )}
      </tbody>
    </table>
  );
}
