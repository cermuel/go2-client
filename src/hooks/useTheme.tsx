import themes from "#/constants/colors";
import { useEffect, useSyncExternalStore } from "react";

const THEME_KEY = "go2-theme";
type ThemeName = "dark" | "light";

const listeners = new Set<() => void>();

const readTheme = (): ThemeName => {
  if (typeof window === "undefined") return "dark";
  const stored = window.localStorage.getItem(THEME_KEY);
  return stored === "light" ? "light" : "dark";
};

let currentTheme: ThemeName = readTheme();

const emit = () => {
  listeners.forEach((listener) => listener());
};

const setTheme = (theme: ThemeName) => {
  currentTheme = theme;
  if (typeof window !== "undefined") {
    window.localStorage.setItem(THEME_KEY, theme);
  }
  emit();
};

const subscribe = (listener: () => void) => {
  listeners.add(listener);
  return () => listeners.delete(listener);
};

const getSnapshot = () => currentTheme === "dark";

const useTheme = () => {
  const dark = useSyncExternalStore(subscribe, getSnapshot, getSnapshot);

  useEffect(() => {
    const onStorage = (event: StorageEvent) => {
      if (event.key !== THEME_KEY) return;
      currentTheme = readTheme();
      emit();
    };
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, []);

  const vars = themes[dark ? "dark" : "light"];
  const style = vars as React.CSSProperties;

  return { dark, toggle: () => setTheme(dark ? "light" : "dark"), style };
};
export default useTheme;
