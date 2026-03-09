const BarChart = ({
  data,
  label,
}: {
  data: Record<string, number>;
  label: string;
}) => {
  const entries = Object.entries(data)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5);
  const max = entries[0]?.[1] ?? 1;

  if (!entries.length) return null;

  return (
    <div
      style={{
        background: "var(--bg)",
        border: "1px solid var(--border)",
        borderRadius: "8px",
        padding: "20px",
      }}
    >
      <p className="mono" style={{ color: "var(--text-muted)", fontSize: "11px", marginBottom: "16px" }}>
        {label}
      </p>
      <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
        {entries.map(([key, count]) => (
          <div key={key} style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            <span
              className="mono"
              style={{ color: "var(--text-muted)", fontSize: "12px", minWidth: "80px", textAlign: "right" }}
            >
              {key || "unknown"}
            </span>
            <div style={{ flex: 1, background: "var(--bg-subtle)", borderRadius: "3px", height: "6px" }}>
              <div
                style={{
                  width: `${(count / max) * 100}%`,
                  background: "var(--text)",
                  borderRadius: "3px",
                  height: "100%",
                  transition: "width 0.6s ease",
                }}
              />
            </div>
            <span className="mono" style={{ color: "var(--text-subtle)", fontSize: "11px", minWidth: "24px" }}>
              {count}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default BarChart;
