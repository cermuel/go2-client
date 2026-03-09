import { useEffect } from "react";
import QRCode from "react-qr-code";

const QrCodeModal = ({
  open,
  value,
  title,
  onClose,
}: {
  open: boolean;
  value: string;
  title?: string;
  onClose: () => void;
}) => {
  useEffect(() => {
    if (!open) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div
      onClick={onClose}
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 60,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "rgba(0,0,0,0.72)",
        backdropFilter: "blur(4px)",
        padding: "16px",
      }}
    >
      <div
        onClick={(event) => event.stopPropagation()}
        style={{
          width: "100%",
          maxWidth: "340px",
          border: "1px solid var(--border)",
          borderRadius: "12px",
          padding: "16px",
          background: "var(--bg-subtle)",
        }}
      >
        <p
          className="mono"
          style={{
            color: "var(--text-muted)",
            fontSize: "11px",
            marginBottom: "12px",
          }}
        >
          {title || "qr code"}
        </p>

        <div
          style={{
            display: "flex",
            justifyContent: "center",
            border: "1px solid var(--border)",
            borderRadius: "10px",
            background: "#fff",
            padding: "18px",
            marginBottom: "12px",
          }}
        >
          <QRCode value={value} size={220} />
        </div>

        <p
          className="mono"
          style={{
            color: "var(--text-muted)",
            fontSize: "10px",
            wordBreak: "break-all",
            marginBottom: "12px",
          }}
        >
          {value}
        </p>

        <button
          className="mono"
          onClick={onClose}
          style={{
            width: "100%",
            border: "1px solid var(--border)",
            borderRadius: "6px",
            padding: "8px",
            background: "transparent",
            color: "var(--text-muted)",
            fontSize: "11px",
            cursor: "pointer",
          }}
        >
          close
        </button>
      </div>
    </div>
  );
};

export default QrCodeModal;
