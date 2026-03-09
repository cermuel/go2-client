import { useEffect, useState } from "react";
import type { StoredProfile } from "#/types/manage";
import { isValidEmail } from "#/utils/helpers";
import ConfirmModal from "#/components/manage/ConfirmModal";
import SavedProfilesList from "#/components/manage/SavedProfilesList";

const AccessModal = ({
  savedProfiles,
  activeProfile,
  loading,
  error,
  onContinue,
  onSubmit,
  onDeleteProfile,
}: {
  savedProfiles: StoredProfile[];
  activeProfile: StoredProfile | null;
  loading: boolean;
  error: string;
  onContinue: (profile: StoredProfile) => void;
  onSubmit: (email: string, name: string) => void;
  onDeleteProfile: (email: string) => void;
}) => {
  const [email, setEmail] = useState(activeProfile?.email ?? "");
  const [name, setName] = useState(activeProfile?.name ?? "");
  const [useAnother, setUseAnother] = useState(savedProfiles.length === 0);
  const [targetToDelete, setTargetToDelete] = useState<StoredProfile | null>(null);

  useEffect(() => {
    setEmail(activeProfile?.email ?? "");
    setName(activeProfile?.name ?? "");
    setUseAnother(savedProfiles.length === 0);
  }, [activeProfile, savedProfiles]);

  const canSubmit = isValidEmail(email) && !loading;

  return (
    <>
      <div style={overlayStyle}>
        <div style={cardStyle}>
          <h2 className="mono" style={titleStyle}>
            manage urls
          </h2>
          <p style={subtitleStyle}>
            enter your email to see every short url linked to your account
          </p>

          {savedProfiles.length > 0 && !useAnother ? (
            <div style={stackStyle}>
              <SavedProfilesList
                profiles={savedProfiles}
                loading={loading}
                onContinue={onContinue}
                onDelete={setTargetToDelete}
              />
              <button onClick={() => setUseAnother(true)} className="mono" style={secondaryBtnStyle}>
                use another account
              </button>
            </div>
          ) : (
            <div style={stackStyle}>
              <div>
                <label className="mono" style={labelStyle}>
                  display name (optional)
                </label>
                <input
                  value={name}
                  onChange={(event) => setName(event.target.value)}
                  placeholder="John"
                  style={inputStyle}
                />
              </div>

              <div>
                <label className="mono" style={labelStyle}>
                  email
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  onKeyDown={(event) =>
                    event.key === "Enter" && canSubmit && onSubmit(email.trim(), name.trim())
                  }
                  placeholder="you@example.com"
                  style={inputStyle}
                />
              </div>

              <button
                onClick={() => onSubmit(email.trim(), name.trim())}
                disabled={!canSubmit}
                className="mono"
                style={primaryBtnStyle(!canSubmit)}
              >
                {loading ? "loading..." : "view my urls →"}
              </button>

              {savedProfiles.length > 0 && (
                <button onClick={() => setUseAnother(false)} className="mono" style={secondaryBtnStyle}>
                  back
                </button>
              )}
            </div>
          )}

          {error && <p style={{ color: "#ef4444", fontSize: "12px", marginTop: "12px" }}>{error}</p>}
        </div>
      </div>

      <ConfirmModal
        open={!!targetToDelete}
        title="Remove saved account?"
        description={
          targetToDelete
            ? `This will remove ${targetToDelete.email} from this device only.`
            : ""
        }
        confirmLabel="remove"
        loading={loading}
        onCancel={() => setTargetToDelete(null)}
        onConfirm={() => {
          if (!targetToDelete) return;
          onDeleteProfile(targetToDelete.email);
          setTargetToDelete(null);
        }}
      />
    </>
  );
};

const inputStyle: React.CSSProperties = {
  background: "var(--bg)",
  border: "1px solid var(--border)",
  color: "var(--text)",
  width: "100%",
  borderRadius: "6px",
  padding: "10px 12px",
  fontSize: "13px",
  fontFamily: "DM Mono, monospace",
  outline: "none",
};

const overlayStyle: React.CSSProperties = {
  position: "fixed",
  inset: 0,
  zIndex: 50,
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  background: "rgba(0,0,0,0.7)",
  backdropFilter: "blur(4px)",
  padding: "16px",
};

const cardStyle: React.CSSProperties = {
  background: "var(--bg-subtle)",
  border: "1px solid var(--border)",
  borderRadius: "12px",
  padding: "28px",
  width: "100%",
  maxWidth: "420px",
};

const titleStyle: React.CSSProperties = {
  color: "var(--text)",
  fontSize: "18px",
  fontWeight: 500,
  marginBottom: "6px",
};

const subtitleStyle: React.CSSProperties = {
  color: "var(--text-muted)",
  fontSize: "13px",
  marginBottom: "24px",
};

const stackStyle: React.CSSProperties = { display: "flex", flexDirection: "column", gap: "14px" };

const labelStyle: React.CSSProperties = {
  color: "var(--text-muted)",
  fontSize: "11px",
  display: "block",
  marginBottom: "6px",
};

const primaryBtnStyle = (disabled: boolean): React.CSSProperties => ({
  background: "var(--text)",
  color: "var(--bg)",
  border: "none",
  borderRadius: "6px",
  padding: "10px",
  fontSize: "13px",
  fontWeight: 500,
  cursor: "pointer",
  opacity: disabled ? 0.3 : 1,
  transition: "opacity 0.15s",
});

const secondaryBtnStyle: React.CSSProperties = {
  background: "transparent",
  color: "var(--text-muted)",
  border: "1px solid var(--border)",
  borderRadius: "6px",
  padding: "9px",
  fontSize: "12px",
  cursor: "pointer",
};

export default AccessModal;
