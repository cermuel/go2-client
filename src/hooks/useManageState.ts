import { useEffect, useMemo, useState } from "react";
import axios from "axios";
import { BASE_URL } from "#/constants";
import type { StoredProfile, UrlData, UrlSummary } from "#/types/manage";
import {
  countBy,
  extractUrls,
  getClicksByDay,
  buildTimelineSeries,
  getDaysRange,
  getLastNDays,
} from "#/utils/helpers";

const PROFILES_KEY = "go2-manage-profiles";
const ACTIVE_EMAIL_KEY = "go2-manage-active-email";

export const useManageState = () => {
  const [profile, setProfile] = useState<StoredProfile | null>(null);
  const [savedProfiles, setSavedProfiles] = useState<StoredProfile[]>([]);
  const [urls, setUrls] = useState<UrlSummary[]>([]);
  const [urlData, setUrlData] = useState<UrlData | null>(null);
  const [selectedCode, setSelectedCode] = useState("");
  const [showModal, setShowModal] = useState(true);
  const [loading, setLoading] = useState(false);
  const [loadingDetails, setLoadingDetails] = useState(false);
  const [error, setError] = useState("");
  const [copied, setCopied] = useState(false);
  const [qrTarget, setQrTarget] = useState<string | null>(null);
  const [range, setRange] = useState<"7d" | "30d" | "365d" | "custom">("7d");
  const [customStart, setCustomStart] = useState("");
  const [customEnd, setCustomEnd] = useState("");

  useEffect(() => {
    try {
      const rawProfiles = localStorage.getItem(PROFILES_KEY);
      const rawActiveEmail = localStorage.getItem(ACTIVE_EMAIL_KEY);
      let profiles: StoredProfile[] = [];

      if (rawProfiles) {
        const parsed = JSON.parse(rawProfiles) as StoredProfile[];
        if (Array.isArray(parsed)) {
          profiles = parsed
            .filter((item) => !!item?.email)
            .map((item) => ({
              email: item.email,
              name: item.name || item.email.split("@")[0],
            }));
        }
      } else {
        const legacyRaw = localStorage.getItem("go2-manage-profile");
        if (legacyRaw) {
          const legacy = JSON.parse(legacyRaw) as StoredProfile;
          if (legacy?.email) {
            profiles = [
              {
                email: legacy.email,
                name: legacy.name || legacy.email.split("@")[0],
              },
            ];
          }
          localStorage.removeItem("go2-manage-profile");
        }
      }

      setSavedProfiles(profiles);
      if (!profiles.length) return;

      const active =
        profiles.find((item) => item.email === rawActiveEmail) ?? profiles[0];
      setProfile(active);
    } catch {
      localStorage.removeItem(PROFILES_KEY);
      localStorage.removeItem(ACTIVE_EMAIL_KEY);
    }
  }, []);

  const saveProfile = (next: StoredProfile) => {
    const merged = [
      next,
      ...savedProfiles.filter((item) => item.email !== next.email),
    ];
    localStorage.setItem(PROFILES_KEY, JSON.stringify(merged));
    localStorage.setItem(ACTIVE_EMAIL_KEY, next.email);
    setSavedProfiles(merged);
    setProfile(next);
  };

  const removeSavedProfile = (email: string) => {
    const nextProfiles = savedProfiles.filter((item) => item.email !== email);
    localStorage.setItem(PROFILES_KEY, JSON.stringify(nextProfiles));
    setSavedProfiles(nextProfiles);

    const currentActiveEmail = localStorage.getItem(ACTIVE_EMAIL_KEY);
    if (currentActiveEmail === email) {
      if (nextProfiles.length) {
        localStorage.setItem(ACTIVE_EMAIL_KEY, nextProfiles[0].email);
        setProfile(nextProfiles[0]);
      } else {
        localStorage.removeItem(ACTIVE_EMAIL_KEY);
        setProfile(null);
        setUrls([]);
        setUrlData(null);
        setSelectedCode("");
      }
    }
  };

  const loadUrlDetails = async (code: string, email: string) => {
    setLoadingDetails(true);
    setError("");
    try {
      const { data } = await axios.get(
        `${BASE_URL}/url/${code}?email=${encodeURIComponent(email)}`,
      );
      setUrlData(data);
      setSelectedCode(code);
    } catch (err: any) {
      setError(err?.response?.data?.message?.[0] ?? "Could not load URL stats");
    } finally {
      setLoadingDetails(false);
    }
  };

  const loadAllForEmail = async (email: string, name: string) => {
    setLoading(true);
    setError("");
    try {
      const { data } = await axios.get(
        `${BASE_URL}/url/email/${encodeURIComponent(email)}`,
      );
      const items = extractUrls(data);
      if (!items.length) {
        setUrls([]);
        setUrlData(null);
        setSelectedCode("");
        setError("No URLs found for this email");
        return;
      }

      const safeName = name || email.split("@")[0];
      saveProfile({ email, name: safeName });
      setUrls(items);
      setShowModal(false);
      await loadUrlDetails(items[0].customCode, email);
    } catch (err: any) {
      setError(
        err?.response?.data?.message?.[0] ??
          "Could not find URLs for this email",
      );
    } finally {
      setLoading(false);
    }
  };

  const openAccountSwitcher = () => {
    setError("");
    setShowModal(true);
  };

  const copyText = async (value: string) => {
    try {
      await navigator.clipboard.writeText(value);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1200);
    } catch {
      setError("Could not copy to clipboard");
    }
  };

  const clicks = urlData?.clicks ?? [];
  const byCountry = useMemo(() => countBy(clicks, "country"), [clicks]);
  const byCity = useMemo(() => countBy(clicks, "city"), [clicks]);

  console.log({ clicks });
  const byOS = useMemo(() => countBy(clicks, "os"), [clicks]);
  const byDevice = useMemo(() => countBy(clicks, "device"), [clicks]);
  const rangeDays = useMemo(() => {
    if (range === "7d") return getLastNDays(7);
    if (range === "30d") return getLastNDays(30);
    if (range === "365d") return getLastNDays(365);
    return getDaysRange(customStart, customEnd);
  }, [customEnd, customStart, range]);

  const clicksByDay = useMemo(
    () => getClicksByDay(clicks, rangeDays),
    [clicks, rangeDays],
  );
  const timelineSeries = useMemo(
    () => buildTimelineSeries({ clicks, range, customStart, customEnd }),
    [clicks, customEnd, customStart, range],
  );
  const maxDay = Math.max(...timelineSeries.map((item) => item.value), 1);

  return {
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
  };
};
