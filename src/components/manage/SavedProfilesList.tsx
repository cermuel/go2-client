import { avatarUrl } from "#/utils/helpers";
import type { StoredProfile } from "#/types/manage";
import { FiTrash2 } from "react-icons/fi";

const SavedProfilesList = ({
  profiles,
  loading,
  onContinue,
  onDelete,
}: {
  profiles: StoredProfile[];
  loading: boolean;
  onContinue: (profile: StoredProfile) => void;
  onDelete: (profile: StoredProfile) => void;
}) => {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
      {profiles.map((item) => (
        <div key={item.email} style={rowStyle}>
          <button
            onClick={() => onContinue(item)}
            className="mono"
            style={continueBtnStyle}
            disabled={loading}
          >
            <img
              src={avatarUrl(item.email)}
              alt={item.name}
              style={{ width: "36px", height: "36px", borderRadius: "999px" }}
            />
            <div style={{ minWidth: 0, textAlign: "left", flex: 1 }}>
              <p style={{ color: "var(--text)", fontSize: "13px" }}>{item.name}</p>
              <p className="mono" style={emailStyle}>
                {item.email}
              </p>
            </div>
          </button>

          <button
            onClick={() => onDelete(item)}
            aria-label={`Delete ${item.email}`}
            className="mono"
            style={deleteBtnStyle}
            disabled={loading}
          >
            <FiTrash2 size={13} />
          </button>
        </div>
      ))}
    </div>
  );
};

const rowStyle: React.CSSProperties = {
  display: "flex",
  alignItems: "stretch",
  gap: "8px",
};

const continueBtnStyle: React.CSSProperties = {
  display: "flex",
  alignItems: "center",
  gap: "10px",
  border: "1px solid var(--border)",
  borderRadius: "8px",
  padding: "10px",
  background: "var(--bg)",
  flex: 1,
  cursor: "pointer",
};

const deleteBtnStyle: React.CSSProperties = {
  border: "1px solid var(--border)",
  borderRadius: "8px",
  background: "transparent",
  color: "var(--text-muted)",
  width: "38px",
  display: "inline-flex",
  alignItems: "center",
  justifyContent: "center",
  cursor: "pointer",
};

const emailStyle: React.CSSProperties = {
  color: "var(--text-muted)",
  fontSize: "11px",
  overflow: "hidden",
  textOverflow: "ellipsis",
  whiteSpace: "nowrap",
};

export default SavedProfilesList;
