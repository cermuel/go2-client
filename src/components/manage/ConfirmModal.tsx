const ConfirmModal = ({
  open,
  title,
  description,
  confirmLabel,
  loading,
  onCancel,
  onConfirm,
}: {
  open: boolean;
  title: string;
  description: string;
  confirmLabel: string;
  loading?: boolean;
  onCancel: () => void;
  onConfirm: () => void;
}) => {
  if (!open) return null;

  return (
    <div style={overlayStyle}>
      <div style={cardStyle}>
        <p className="mono" style={{ color: "var(--text)", fontSize: "15px", marginBottom: "8px" }}>
          {title}
        </p>
        <p style={{ color: "var(--text-muted)", fontSize: "12px", marginBottom: "16px" }}>
          {description}
        </p>
        <div style={{ display: "flex", gap: "8px" }}>
          <button onClick={onCancel} className="mono" style={secondaryBtnStyle}>
            cancel
          </button>
          <button
            onClick={onConfirm}
            disabled={loading}
            className="mono"
            style={{ ...primaryBtnStyle, opacity: loading ? 0.5 : 1 }}
          >
            {loading ? "deleting..." : confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
};

const overlayStyle: React.CSSProperties = {
  position: "fixed",
  inset: 0,
  zIndex: 70,
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  background: "rgba(0,0,0,0.65)",
  backdropFilter: "blur(4px)",
  padding: "16px",
};

const cardStyle: React.CSSProperties = {
  width: "100%",
  maxWidth: "360px",
  border: "1px solid var(--border)",
  borderRadius: "10px",
  background: "var(--bg-subtle)",
  padding: "16px",
};

const secondaryBtnStyle: React.CSSProperties = {
  flex: 1,
  border: "1px solid var(--border)",
  borderRadius: "6px",
  background: "transparent",
  color: "var(--text-muted)",
  padding: "8px",
  fontSize: "11px",
  cursor: "pointer",
};

const primaryBtnStyle: React.CSSProperties = {
  flex: 1,
  border: "1px solid #dc2626",
  borderRadius: "6px",
  background: "#dc2626",
  color: "#fff",
  padding: "8px",
  fontSize: "11px",
  cursor: "pointer",
};

export default ConfirmModal;
