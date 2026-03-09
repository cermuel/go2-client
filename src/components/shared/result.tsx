import { BASE_URL } from "#/constants";
import { useState } from "react";
import { FiCheck, FiCopy, FiExternalLink } from "react-icons/fi";
import { LuQrCode } from "react-icons/lu";
import QrCodeModal from "./qr-code-modal";

const ResultBar = ({ code }: { code: string }) => {
  const [copied, setCopied] = useState(false);
  const [showQr, setShowQr] = useState(false);
  const shortUrl = `${BASE_URL}/${code}`;
  const iconBtnStyle = {
    background: "transparent",
    border: "1px solid var(--border)",
    color: "var(--text-muted)",
    width: "28px",
    height: "28px",
    borderRadius: "6px",
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    cursor: "pointer",
  } as const;

  async function copy() {
    await navigator.clipboard.writeText(shortUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  return (
    <>
      <div
        className="w-full max-w-lg mt-4 rounded-lg border p-4"
        style={{ background: "var(--bg-subtle)", borderColor: "var(--border)" }}
      >
        <div className="flex items-center justify-between gap-3">
          <span
            className="mono text-sm"
            style={{ color: "var(--text)", overflowWrap: "anywhere" }}
          >
            {shortUrl}
          </span>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowQr(true)}
              aria-label="Show QR code"
              style={iconBtnStyle}
            >
              <LuQrCode size={14} style={{ color: "var(--text-muted)" }} />
            </button>
            <a
              href={shortUrl}
              target="_blank"
              rel="noreferrer"
              aria-label="Open link"
              style={iconBtnStyle}
            >
              <FiExternalLink
                size={14}
                style={{ color: "var(--text-muted)" }}
              />
            </a>
            <button onClick={copy} aria-label="Copy link" style={iconBtnStyle}>
              {copied ? (
                <FiCheck size={14} style={{ color: "var(--text)" }} />
              ) : (
                <FiCopy size={14} style={{ color: "var(--text-muted)" }} />
              )}
            </button>
          </div>
        </div>
      </div>
      <QrCodeModal
        open={showQr}
        value={shortUrl}
        title="QR CODE"
        onClose={() => setShowQr(false)}
      />
    </>
  );
};
export default ResultBar;
