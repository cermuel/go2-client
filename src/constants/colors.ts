const themes = {
  dark: {
    "--bg": "#111111",
    "--bg-subtle": "#1a1a1a",
    "--bg-hover": "#222222",
    "--border": "#2a2a2a",
    "--text": "#f0f0f0",
    "--text-muted": "#666666",
    "--text-subtle": "#444444",
  },
  light: {
    "--bg": "#f9fafb",
    "--bg-subtle": "#F5F5F5",
    "--bg-hover": "#f0f0f0",
    "--border": "#e8e8e8",
    "--text": "#111111",
    "--text-muted": "#444",
    "--text-subtle": "#bbbbbb",
  },
} as const;

export default themes;
