import type { UrlSummary } from "#/types/manage";

const UrlListPanel = ({
  urls,
  selectedCode,
  onSelect,
}: {
  urls: UrlSummary[];
  selectedCode: string;
  onSelect: (code: string) => void;
}) => {
  return (
    <div style={panelStyle}>
      <p className="mono" style={titleStyle}>
        your urls ({urls.length})
      </p>
      <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
        {urls.map((item) => {
          const active = item.customCode === selectedCode;
          return (
            <button
              key={item.customCode}
              onClick={() => onSelect(item.customCode)}
              className="mono"
              style={itemStyle(active)}
            >
              <p
                style={{
                  color: "var(--text)",
                  fontSize: "12px",
                  marginBottom: "4px",
                }}
              >
                go2/{item.customCode}
              </p>
              <p style={destinationStyle}>{item.destination}</p>
            </button>
          );
        })}
      </div>
    </div>
  );
};

const panelStyle: React.CSSProperties = {
  background: "var(--bg-subtle)",
  border: "1px solid var(--border)",
  borderRadius: "10px",
  padding: "12px",
  height: "fit-content",
};

const titleStyle: React.CSSProperties = {
  color: "var(--text-muted)",
  fontSize: "11px",
  marginBottom: "10px",
};

const itemStyle = (active: boolean): React.CSSProperties => ({
  textAlign: "left",
  border: `1px solid ${active ? "var(--text-subtle)" : "var(--border)"}`,
  background: active ? "var(--bg)" : "transparent",
  borderRadius: "8px",
  padding: "10px",
  cursor: "pointer",
});

const destinationStyle: React.CSSProperties = {
  color: "var(--text-subtle)",
  fontSize: "10px",
  overflow: "hidden",
  textOverflow: "ellipsis",
  whiteSpace: "nowrap",
};

export default UrlListPanel;
