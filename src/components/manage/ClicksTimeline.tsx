const ClicksTimeline = ({
  days,
  clicksByDay,
  maxDay,
}: {
  days: string[];
  clicksByDay: Record<string, number>;
  maxDay: number;
}) => {
  return (
    <div
      style={{
        background: "var(--bg)",
        border: "1px solid var(--border)",
        borderRadius: "8px",
        padding: "20px",
        marginBottom: "12px",
      }}
    >
      <p className="mono" style={{ color: "var(--text-muted)", fontSize: "11px", marginBottom: "16px" }}>
        clicks - last 7 days
      </p>
      <div style={{ display: "flex", alignItems: "flex-end", gap: "6px", height: "60px" }}>
        {days.map((day) => (
          <div
            key={day}
            style={{
              flex: 1,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: "6px",
              height: "100%",
            }}
          >
            <div style={{ flex: 1, width: "100%", display: "flex", alignItems: "flex-end" }}>
              <div
                style={{
                  width: "100%",
                  height: `${((clicksByDay[day] ?? 0) / maxDay) * 100}%`,
                  minHeight: clicksByDay[day] ? "3px" : "0",
                  background: "var(--text)",
                  borderRadius: "3px 3px 0 0",
                  transition: "height 0.5s ease",
                }}
              />
            </div>
            <span className="mono" style={{ color: "var(--text-subtle)", fontSize: "9px" }}>
              {new Date(day).toLocaleDateString("en", { weekday: "short" })}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ClicksTimeline;
