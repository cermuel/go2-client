import { FiMoon, FiSun } from "react-icons/fi";

const ThemeToggle = ({
  dark,
  onToggle,
  className = "",
  style,
}: {
  dark: boolean;
  onToggle: () => void;
  className?: string;
  style?: React.CSSProperties;
}) => {
  return (
    <button
      onClick={onToggle}
      className={`p-2 rounded-lg transition-colors ${className}`}
      style={{
        background: "var(--bg-subtle)",
        border: "1px solid var(--border)",
        color: "var(--text-muted)",
        ...style,
      }}
    >
      {dark ? <FiSun size={15} /> : <FiMoon size={15} />}
    </button>
  );
};
export default ThemeToggle;
