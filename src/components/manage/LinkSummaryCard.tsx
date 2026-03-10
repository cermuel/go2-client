import { FRONTEND_URL } from "#/constants";
import type { UrlData } from "#/types/manage";
import { FiCheck, FiCopy, FiExternalLink } from "react-icons/fi";
import { LuQrCode } from "react-icons/lu";

const iconBtnStyle: React.CSSProperties = {
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
  flexShrink: 0,
};

const LinkSummaryCard = ({
  urlData,
  copied,
  onCopy,
  onOpen,
  onShowQr,
}: {
  urlData: UrlData;
  copied: boolean;
  onCopy: (value: string) => void;
  onOpen: (value: string) => void;
  onShowQr: (value: string) => void;
}) => {
  const shortUrl = `${FRONTEND_URL}/${urlData.customCode}`;

  return (
    <div style={outerCardStyle}>
      <div style={innerCardStyle}>
        <p className="mono" style={labelStyle}>
          short url
        </p>

        <div style={rowStyle}>
          <p className="mono" style={shortUrlStyle}>
            {shortUrl}
          </p>
          <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            <button
              onClick={() => onShowQr(shortUrl)}
              aria-label="Show QR"
              style={iconBtnStyle}
            >
              <LuQrCode size={14} style={{ color: "var(--text-muted)" }} />
            </button>
            <button
              onClick={() => onOpen(shortUrl)}
              aria-label="Open short url"
              style={iconBtnStyle}
            >
              <FiExternalLink
                size={14}
                style={{ color: "var(--text-muted)" }}
              />
            </button>
            <button
              onClick={() => onCopy(shortUrl)}
              aria-label="Copy short url"
              style={iconBtnStyle}
            >
              {copied ? (
                <FiCheck size={14} style={{ color: "var(--text)" }} />
              ) : (
                <FiCopy size={14} style={{ color: "var(--text-muted)" }} />
              )}
            </button>
          </div>
        </div>

        <div style={destinationRowStyle}>
          <p style={destinationValueStyle}>{urlData.destination}</p>
        </div>
      </div>
    </div>
  );
};

const outerCardStyle: React.CSSProperties = {
  background: "var(--bg-subtle)",
  border: "1px solid var(--border)",
  borderRadius: "10px",
  padding: "16px",
  marginBottom: "20px",
};

const innerCardStyle: React.CSSProperties = {
  border: "1px solid var(--border)",
  borderRadius: "8px",
  padding: "12px",
  background: "var(--bg)",
};

const labelStyle: React.CSSProperties = {
  color: "var(--text-muted)",
  fontSize: "10px",
  marginBottom: "6px",
  letterSpacing: "0.04em",
  textTransform: "uppercase",
};

const rowStyle: React.CSSProperties = {
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  gap: "10px",
};

const shortUrlStyle: React.CSSProperties = {
  color: "var(--text)",
  fontSize: "12px",
  wordBreak: "break-all",
};

const destinationRowStyle: React.CSSProperties = {
  borderTop: "1px solid var(--border)",
  marginTop: "10px",
  paddingTop: "8px",
};

const destinationValueStyle: React.CSSProperties = {
  color: "var(--text-subtle)",
  fontSize: "11px",
  wordBreak: "break-all",
};

export default LinkSummaryCard;
