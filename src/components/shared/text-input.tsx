import { PiSpinnerGapLight } from "react-icons/pi";
import { MdErrorOutline } from "react-icons/md";
import { IoCheckmarkCircleOutline } from "react-icons/io5";

const TextInput = ({
  value,
  onChange,
  onKeyDown,
  placeholder,
  type = "text",
  prefix,
  error,
  loading = false,
  success = false,
  failed = false,
}: {
  value: string;
  onChange: (v: string) => void;
  onKeyDown?: React.KeyboardEventHandler<HTMLInputElement>;
  placeholder?: string;
  type?: string;
  prefix?: string;
  error?: string;
  loading?: boolean;
  success?: boolean;
  failed?: boolean;
}) => {
  const base = {
    background: "var(--bg)",
    border: "1px solid var(--border)",
    color: "var(--text)",
  };

  if (prefix) {
    return (
      <div
        className={`flex items-center rounded px-3 py-2.5 gap-2 ${error && !loading && "border-[#EC0000]!"}`}
        style={base}
        onFocus={(e) =>
          ((e.currentTarget as HTMLElement).style.borderColor = "#555")
        }
        onBlur={(e) =>
          ((e.currentTarget as HTMLElement).style.borderColor = "var(--border)")
        }
      >
        <span className="text-xs mono" style={{ color: "var(--text-subtle)" }}>
          {prefix}
        </span>
        <input
          type={type}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onKeyDown={onKeyDown}
          placeholder={placeholder}
          className="flex-1 bg-transparent text-sm outline-none mono"
          style={{ color: "var(--text)" }}
        />
        {loading ? (
          <div className="ml-auto">
            <PiSpinnerGapLight className="animate-spin" />
          </div>
        ) : failed ? (
          <MdErrorOutline color="#EC0000" />
        ) : success ? (
          <IoCheckmarkCircleOutline />
        ) : null}
      </div>
    );
  }

  return (
    <div
      className={`w-full rounded px-3 py-2.5 text-sm  mono flex items-center text-left gap-2  ${error && !loading && "border-[#EC0000]!"}`}
      style={base}
      onFocus={(e) => (e.target.style.borderColor = "#555")}
      onBlur={(e) => (e.target.style.borderColor = "var(--border)")}
    >
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onKeyDown={onKeyDown}
        placeholder={placeholder}
        className="outline-none flex-1"
      />
      {loading && (
        <div className="ml-auto">
          <PiSpinnerGapLight className="animate-spin" />
        </div>
      )}
    </div>
  );
};

export default TextInput;
