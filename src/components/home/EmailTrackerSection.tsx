import Label from "#/components/shared/label";
import TextInput from "#/components/shared/text-input";
import type { StoredProfile } from "#/types/manage";

const EmailTrackerSection = ({
  email,
  savedProfiles,
  onEmailChange,
}: {
  email: string;
  savedProfiles: StoredProfile[];
  onEmailChange: (value: string) => void;
}) => {
  return (
    <div className="space-y-1">
      <Label>email</Label>
      <TextInput
        type="email"
        value={email}
        onChange={onEmailChange}
        placeholder="you@example.com"
      />

      {savedProfiles.length > 0 && (
        <>
          <p
            className="mono text-[10px]"
            style={{ color: "var(--text-muted)" }}
          >
            or choose saved account
          </p>
          <select
            className="w-full rounded-md border px-3 py-2 text-xs mono outline-none"
            style={{
              borderColor: "var(--border)",
              background: "var(--bg)",
              color: "var(--text-muted)",
            }}
            value={
              savedProfiles.some((item) => item.email === email) ? email : ""
            }
            onChange={(event) => onEmailChange(event.target.value)}
          >
            <option value="">select account</option>
            {savedProfiles.map((profile) => (
              <option key={profile.email} value={profile.email}>
                {profile.name} ({profile.email})
              </option>
            ))}
          </select>
        </>
      )}

      <p className="text-xs" style={{ color: "var(--text-subtle)" }}>
        get stats for this link sent to your email
      </p>
    </div>
  );
};

export default EmailTrackerSection;
