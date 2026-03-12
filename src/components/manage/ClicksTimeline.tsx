import { useState } from "react";

const ClicksTimeline = ({
  series,
  maxDay,
  range,
  onRangeChange,
  customStart,
  customEnd,
  onCustomStartChange,
  onCustomEndChange,
  label,
}: {
  series: { label: string; value: number; tooltip: string }[];
  maxDay: number;
  range: "7d" | "30d" | "365d" | "custom";
  onRangeChange: (value: "7d" | "30d" | "365d" | "custom") => void;
  customStart: string;
  customEnd: string;
  onCustomStartChange: (value: string) => void;
  onCustomEndChange: (value: string) => void;
  label: string;
}) => {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
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
      <div style={{ display: "flex", justifyContent: "space-between", gap: "12px", marginBottom: "16px", flexWrap: "wrap" }}>
        <p className="mono" style={{ color: "var(--text-muted)", fontSize: "11px", marginBottom: 0 }}>
          {label}
        </p>
        <div style={{ display: "flex", gap: "8px", alignItems: "center", flexWrap: "wrap" }}>
          <select
            value={range}
            onChange={(event) => onRangeChange(event.target.value as "7d" | "30d" | "365d" | "custom")}
            className="mono outline-none"
            style={{
              background: "var(--bg-subtle)",
              color: "var(--text)",
              border: "1px solid var(--border)",
              borderRadius: "6px",
              padding: "4px 8px",
              fontSize: "11px",
              outline: "none",
            }}
          >
            <option value="7d">last 7 days</option>
            <option value="30d">last 30 days</option>
            <option value="365d">last 12 months</option>
            <option value="custom">custom</option>
          </select>
          {range === "custom" && (
            <>
              <input
                type="date"
                value={customStart}
                onChange={(event) => onCustomStartChange(event.target.value)}
                className="mono"
                style={{
                  background: "var(--bg-subtle)",
                  color: "var(--text)",
                  border: "1px solid var(--border)",
                  borderRadius: "6px",
                  padding: "4px 8px",
                  fontSize: "11px",
                  outline: "none",
                }}
              />
              <input
                type="date"
                value={customEnd}
                onChange={(event) => onCustomEndChange(event.target.value)}
                className="mono"
                style={{
                  background: "var(--bg-subtle)",
                  color: "var(--text)",
                  border: "1px solid var(--border)",
                  borderRadius: "6px",
                  padding: "4px 8px",
                  fontSize: "11px",
                  outline: "none",
                }}
              />
            </>
          )}
        </div>
      </div>
          {series.length ? (
        <div style={{ overflowX: "auto" }}>
          <div
            style={{
              display: "flex",
              alignItems: "flex-end",
              gap: "6px",
              height: "60px",
              minWidth: `${series.length * 18}px`,
            }}
          >
            {series.map((item, index) => (
            <div
              key={`${item.label}-${index}`}
              style={{
                flex: 1,
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: "6px",
                height: "100%",
                pointerEvents: "auto",
                position: "relative",
              }}
              onMouseEnter={() => setHoveredIndex(index)}
              onMouseLeave={() => setHoveredIndex(null)}
              title={item.tooltip}
            >
              <div style={{ flex: 1, width: "100%", display: "flex", alignItems: "flex-end" }}>
                <div
                  style={{
                    width: "100%",
                    height: `${((item.value ?? 0) / maxDay) * 100}%`,
                    minHeight: item.value ? "3px" : "0",
                    background: "var(--text)",
                    borderRadius: "3px 3px 0 0",
                    transition: "height 0.5s ease",
                    pointerEvents: "auto",
                  }}
                  title={item.tooltip}
                />
              </div>
              <div
                className="mono"
                style={{
                  position: "absolute",
                  top: "-18px",
                  left: "50%",
                  transform: "translateX(-50%)",
                  background: "var(--bg)",
                  border: "1px solid var(--border)",
                  color: "var(--text)",
                  fontSize: "9px",
                  padding: "2px 6px",
                  borderRadius: "6px",
                  opacity: hoveredIndex === index ? 1 : 0,
                  pointerEvents: "none",
                  transition: "opacity 0.2s ease",
                  whiteSpace: "nowrap",
                }}
              >
                {item.value}
              </div>
              <span className="mono" style={{ color: "var(--text-subtle)", fontSize: "9px" }}>
                {item.label}
              </span>
            </div>
          ))}
          </div>
        </div>
      ) : (
        <p className="mono" style={{ color: "var(--text-muted)", fontSize: "11px" }}>
          Select a date range to view clicks.
        </p>
      )}
    </div>
  );
};

export default ClicksTimeline;
