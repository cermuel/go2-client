const StatCard = ({ label, value }: { label: string; value: string | number }) => {
  return (
    <div
      style={{
        background: "var(--bg)",
        border: "1px solid var(--border)",
        borderRadius: "8px",
        padding: "16px 20px",
      }}
    >
      <p className="mono" style={{ color: "var(--text-muted)", fontSize: "11px", marginBottom: "6px" }}>
        {label}
      </p>
      <p className="mono" style={{ color: "var(--text)", fontSize: "22px", fontWeight: 500 }}>
        {value}
      </p>
    </div>
  );
};

export default StatCard;
