const Label = ({ children }: { children: React.ReactNode }) => {
  return (
    <label className="text-xs mono" style={{ color: "var(--text-muted)" }}>
      {children}
    </label>
  );
};

export default Label;
