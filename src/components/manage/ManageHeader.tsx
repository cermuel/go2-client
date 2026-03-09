import { FiArrowLeft } from "react-icons/fi";
import { avatarUrl } from "#/utils/helpers";
import type { StoredProfile } from "#/types/manage";

const ManageHeader = ({
  profile,
  showModal,
  onBack,
  onReset,
}: {
  profile: StoredProfile | null;
  showModal: boolean;
  onBack: () => void;
  onReset: () => void;
}) => {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        gap: "12px",
        marginBottom: "24px",
      }}
    >
      <button onClick={onBack} className="mono" style={backBtnStyle}>
        <FiArrowLeft size={13} /> back
      </button>

      {profile && !showModal && (
        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
          <img
            src={avatarUrl(profile.email)}
            alt={profile.name}
            style={{ width: "24px", height: "24px", borderRadius: "999px" }}
          />
          <p
            className="mono"
            style={{ color: "var(--text-muted)", fontSize: "11px" }}
          >
            {profile.name}
          </p>
          <button onClick={onReset} className="mono" style={switchBtnStyle}>
            switch
          </button>
        </div>
      )}
    </div>
  );
};

const backBtnStyle: React.CSSProperties = {
  background: "none",
  border: "none",
  cursor: "pointer",
  color: "var(--text-muted)",
  fontSize: "13px",
  display: "flex",
  alignItems: "center",
  gap: "6px",
  padding: 0,
};

const switchBtnStyle: React.CSSProperties = {
  background: "transparent",
  color: "var(--text-muted)",
  border: "1px solid var(--border)",
  borderRadius: "6px",
  padding: "5px 8px",
  fontSize: "10px",
  cursor: "pointer",
};

export default ManageHeader;
