import ThemeToggle from "#/components/ThemeToggle";

const AppNavbar = ({
  dark,
  onToggle,
}: {
  dark: boolean;
  onToggle: () => void;
}) => {
  return (
    <header
      style={{
        position: "sticky",
        top: 0,
        zIndex: 30,
        background: "color-mix(in srgb, var(--bg) 92%, transparent)",
        borderBottom: "1px solid var(--border)",
        backdropFilter: "blur(8px)",
      }}
    >
      <div
        style={{
          maxWidth: "980px",
          margin: "0 auto",
          padding: "12px 16px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: "12px",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
          <p className="mono" style={{ color: "var(--text)", fontSize: "14px" }}>
            go2
          </p>
        </div>

        <ThemeToggle dark={dark} onToggle={onToggle} />
      </div>
    </header>
  );
};

export default AppNavbar;
