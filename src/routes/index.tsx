import Collapsible from "#/components/shared/collapsible";
import EmailTrackerSection from "#/components/home/EmailTrackerSection";
import Label from "#/components/shared/label";
import ResultBar from "#/components/shared/result";
import TextInput from "#/components/shared/text-input";
import AppNavbar from "#/components/AppNavbar";
import { BASE_URL } from "#/constants";
import { useDebounce } from "#/hooks/useDebounce";
import { useSeo } from "#/hooks/useSeo";
import useTheme from "#/hooks/useTheme";
import type { StoredProfile } from "#/types/manage";
import { Link, createFileRoute } from "@tanstack/react-router";
import axios from "axios";
import { useEffect, useState } from "react";

export const Route = createFileRoute("/")({
  component: Home,
});

function Home() {
  const PROFILES_KEY = "go2-manage-profiles";
  const { dark, toggle, style } = useTheme();
  useSeo({
    title: "Short links with email-based analytics",
    description:
      "Create clean short links, reserve custom codes, attach links to an email profile, and review click analytics with go2.",
    path: "/",
    keywords: [
      "link shortener",
      "short url",
      "custom short links",
      "url analytics",
      "email link tracking",
      "qr code links",
    ],
    schema: {
      "@context": "https://schema.org",
      "@type": "SoftwareApplication",
      name: "go2",
      applicationCategory: "BusinessApplication",
      operatingSystem: "Web",
      description:
        "A minimal web app for creating short links, assigning them to an email profile, and reviewing click analytics.",
    },
  });
  const [destination, setDestination] = useState("");
  const [customCode, setCustomCode] = useState("");
  const [email, setEmail] = useState("");
  const [savedProfiles, setSavedProfiles] = useState<StoredProfile[]>([]);
  const [result, setResult] = useState<{
    customCode: string;
    destination: string;
  } | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [checking, setChecking] = useState(false);
  const [checkError, setCheckError] = useState(false);
  const [checkSuccess, setCheckSuccess] = useState(false);

  const debouncedCode = useDebounce(customCode, 500);

  const handleSubmit = async () => {
    if (!destination) return;
    setLoading(true);
    setError("");
    try {
      const { data } = await axios.post(`${BASE_URL}/url`, {
        destination,
        customCode: customCode || undefined,
        email: email || undefined,
      });
      setResult(data);
      setDestination("");
      setError("");
    } catch {
      setError("Something went wrong. Check the URL and try again.");
    } finally {
      setLoading(false);
    }
  };

  const checkCode = async () => {
    if (!debouncedCode) return;
    setChecking(true);
    setError("");
    try {
      const { data } = await axios.get(`${BASE_URL}/url/code/${debouncedCode}`);
      if (data.data) {
        setCheckError(true);
      } else {
        setCheckSuccess(true);
      }
    } catch (e) {
      console.log({ e });
      setCheckError(true);
    } finally {
      setChecking(false);
    }
  };

  useEffect(() => {
    if (debouncedCode) checkCode();
  }, [debouncedCode]);

  useEffect(() => {
    try {
      const rawProfiles = localStorage.getItem(PROFILES_KEY);
      if (rawProfiles) {
        const parsed = JSON.parse(rawProfiles) as StoredProfile[];
        if (Array.isArray(parsed)) {
          const profiles = parsed
            .filter((item) => !!item?.email)
            .map((item) => ({
              email: item.email,
              name: item.name || item.email.split("@")[0],
            }));
          setSavedProfiles(profiles);
          if (profiles.length) {
            setEmail(profiles[0].email);
          }
          return;
        }
      }

      const legacyRaw = localStorage.getItem("go2-manage-profile");
      if (legacyRaw) {
        const legacy = JSON.parse(legacyRaw) as StoredProfile;
        if (legacy?.email) {
          const profile = {
            email: legacy.email,
            name: legacy.name || legacy.email.split("@")[0],
          };
          setSavedProfiles([profile]);
          setEmail(profile.email);
          return;
        }
      }
    } catch {}
  }, []);

  return (
    <div
      className="min-h-screen"
      style={{ ...style, background: "var(--bg)" }}
    >
      <AppNavbar dark={dark} onToggle={toggle} />

      <div className="flex flex-col items-center justify-center px-4 py-14">
        <div className="mb-16 text-center">
          <h1
            className="mono text-5xl font-medium tracking-tight"
            style={{ color: "var(--text)" }}
          >
            go2
          </h1>
          <p className="mt-2 text-sm" style={{ color: "var(--text-muted)" }}>
            short links, no noise
          </p>
        </div>

        <div
          className="w-full max-w-lg rounded-lg border p-6 space-y-4"
          style={{ background: "var(--bg-subtle)", borderColor: "var(--border)" }}
        >
          <div className="space-y-1">
            <Label>destination</Label>
            <TextInput
              type="url"
              value={destination}
              onChange={setDestination}
              onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
              placeholder="https://example.com/very/long/url"
            />
          </div>

          <Collapsible label="custom code">
            <div className="space-y-1">
              <Label>custom code</Label>
              <TextInput
                value={customCode}
                onChange={setCustomCode}
                placeholder="my-link"
                prefix="go2/"
                error={
                  checkError ? "This code is already used by another URL" : ""
                }
                failed={checkError}
                success={checkSuccess}
                loading={checking}
              />
            </div>
          </Collapsible>

          <Collapsible label="track with email">
            <EmailTrackerSection
              email={email}
              savedProfiles={savedProfiles}
              onEmailChange={setEmail}
            />
          </Collapsible>

          {error && (
            <p className="text-xs" style={{ color: "#ef4444" }}>
              {error}
            </p>
          )}

          <button
            onClick={handleSubmit}
            disabled={
              !destination ||
              loading ||
              !destination.includes("https://") ||
              checkError
            }
            className="w-full rounded py-2.5 text-sm font-medium mono transition-opacity disabled:opacity-30"
            style={{ background: "var(--text)", color: "var(--bg)" }}
          >
            {loading ? "shortening..." : "shorten →"}
          </button>
        </div>

        <Link
          to="/manage"
          className="mono mt-2 text-xs"
          style={{
            color: "var(--text-subtle)",
          }}
        >
          manage urls →
        </Link>

        {result && <ResultBar code={result.customCode} />}
      </div>
    </div>
  );
}
