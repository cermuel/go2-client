import { createFileRoute, useNavigate } from "@tanstack/react-router";
import useTheme from "#/hooks/useTheme";
import AppNavbar from "#/components/AppNavbar";
import QrCodeModal from "#/components/shared/qr-code-modal";
import AccessModal from "#/components/manage/AccessModal";
import UrlListPanel from "#/components/manage/UrlListPanel";
import LinkSummaryCard from "#/components/manage/LinkSummaryCard";
import StatCard from "#/components/manage/StatCard";
import ClicksTimeline from "#/components/manage/ClicksTimeline";
import BarChart from "#/components/manage/BarChart";
import ManageHeader from "#/components/manage/ManageHeader";
import { useManageState } from "#/hooks/useManageState";
import { useSeo } from "#/hooks/useSeo";

export const Route = createFileRoute("/manage")({ component: Manage });

function Manage() {
  const { dark, toggle, style } = useTheme();
  useSeo({
    title: "Manage saved links and analytics",
    description:
      "Access your saved go2 links, view click breakdowns, and manage profiles from the analytics dashboard.",
    path: "/manage",
    robots: "noindex,nofollow,noarchive",
  });
  const navigate = useNavigate();
  const {
    profile,
    savedProfiles,
    urls,
    urlData,
    selectedCode,
    showModal,
    loading,
    loadingDetails,
    error,
    copied,
    qrTarget,
    setQrTarget,
    loadUrlDetails,
    loadAllForEmail,
    removeSavedProfile,
    openAccountSwitcher,
    copyText,
    clicks,
    byCountry,
    byCity,
    byOS,
    byDevice,
    range,
    setRange,
    customStart,
    setCustomStart,
    customEnd,
    setCustomEnd,
    rangeDays,
    clicksByDay,
    timelineSeries,
    maxDay,
  } = useManageState();

  return (
    <div className="min-h-screen" style={{ ...style, background: "var(--bg)" }}>
      <AppNavbar dark={dark} onToggle={toggle} />

      {showModal && (
        <AccessModal
          savedProfiles={savedProfiles}
          activeProfile={profile}
          loading={loading}
          error={error}
          onContinue={(nextProfile) =>
            loadAllForEmail(nextProfile.email, nextProfile.name)
          }
          onSubmit={loadAllForEmail}
          onDeleteProfile={removeSavedProfile}
        />
      )}

      <div
        style={{
          maxWidth: "860px",
          margin: "0 auto",
          padding: "28px 16px 40px",
        }}
      >
        <ManageHeader
          profile={profile}
          showModal={showModal}
          onBack={() => navigate({ to: "/" })}
          onReset={openAccountSwitcher}
        />

        {!showModal && (
          <div className="grid gap-3.5 md:grid-cols-[minmax(220px,280px)_minmax(0,1fr)]">
            <UrlListPanel
              urls={urls}
              selectedCode={selectedCode}
              onSelect={(code) =>
                profile && loadUrlDetails(code, profile.email)
              }
            />

            <div>
              {error && (
                <p
                  style={{
                    color: "#ef4444",
                    fontSize: "12px",
                    marginBottom: "12px",
                  }}
                >
                  {error}
                </p>
              )}
              {loadingDetails && (
                <p
                  className="mono"
                  style={{ color: "var(--text-muted)", fontSize: "12px" }}
                >
                  loading stats...
                </p>
              )}

              {urlData && !loadingDetails && (
                <>
                  <LinkSummaryCard
                    urlData={urlData}
                    copied={copied}
                    onCopy={copyText}
                    onOpen={(value) =>
                      window.open(value, "_blank", "noopener,noreferrer")
                    }
                    onShowQr={setQrTarget}
                  />

                  <div
                    style={{
                      display: "grid",
                      gridTemplateColumns:
                        "repeat(auto-fit, minmax(120px, 1fr))",
                      gap: "12px",
                      marginBottom: "20px",
                    }}
                  >
                    <StatCard label="total clicks" value={clicks.length} />
                    <StatCard
                      label="countries"
                      value={Object.keys(byCountry).length}
                    />
                    <StatCard
                      label="devices"
                      value={Object.keys(byDevice).length}
                    />
                  </div>

                  <ClicksTimeline
                    series={timelineSeries}
                    maxDay={maxDay}
                    range={range}
                    onRangeChange={setRange}
                    customStart={customStart}
                    customEnd={customEnd}
                    onCustomStartChange={setCustomStart}
                    onCustomEndChange={setCustomEnd}
                    label="clicks"
                  />

                  <div
                    style={{
                      display: "grid",
                      gridTemplateColumns:
                        "repeat(auto-fit, minmax(220px, 1fr))",
                      gap: "12px",
                      marginBottom: "12px",
                    }}
                  >
                    <BarChart data={byCountry} label="by country" />
                    <BarChart data={byCity} label="by city" />
                    <BarChart data={byOS} label="by os" />
                  </div>
                  <BarChart data={byDevice} label="by device" />
                </>
              )}
            </div>
          </div>
        )}
      </div>

      <QrCodeModal
        open={!!qrTarget}
        value={qrTarget ?? ""}
        title="QR CODE"
        onClose={() => setQrTarget(null)}
      />
    </div>
  );
}
