import { useState } from "react";
import { FiChevronDown, FiChevronUp } from "react-icons/fi";

const Collapsible = ({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) => {
  const [open, setOpen] = useState(false);
  return (
    <div>
      <button
        onClick={() => setOpen((v) => !v)}
        className="flex items-center gap-1.5 text-xs transition-colors"
        style={{ color: open ? "var(--text)" : "var(--text-muted)" }}
      >
        {open ? <FiChevronUp size={13} /> : <FiChevronDown size={13} />}
        {label}
      </button>
      <div
        style={{
          display: "grid",
          gridTemplateRows: open ? "1fr" : "0fr",
          transition: "grid-template-rows 0.2s ease",
        }}
      >
        <div style={{ overflow: "hidden" }}>
          <div className="mt-3">{children}</div>
        </div>
      </div>
    </div>
  );
};

export default Collapsible;
