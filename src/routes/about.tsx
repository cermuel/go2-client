import AppNavbar from "#/components/AppNavbar";
import { useSeo } from "#/hooks/useSeo";
import useTheme from "#/hooks/useTheme";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/about")({
  component: About,
});

function About() {
  const { dark, toggle, style } = useTheme();
  useSeo({
    title: "About the go2 link shortener",
    description:
      "Learn how go2 helps teams create short links, manage them by email, and inspect click activity from one lightweight dashboard.",
    path: "/about",
    keywords: [
      "about go2",
      "link management",
      "short link analytics",
      "url dashboard",
    ],
    schema: {
      "@context": "https://schema.org",
      "@type": "AboutPage",
      name: "About go2",
      description:
        "Overview of the go2 short link creator and analytics dashboard.",
    },
  });

  return (
    <main className="min-h-screen" style={{ ...style, background: "var(--bg)" }}>
      <AppNavbar dark={dark} onToggle={toggle} />
      <section
        style={{
          maxWidth: "860px",
          margin: "0 auto",
          padding: "32px 16px",
        }}
      >
        <div
          style={{
            border: "1px solid var(--border)",
            borderRadius: "12px",
            background: "var(--bg-subtle)",
            padding: "24px",
          }}
        >
          <p className="mono" style={{ color: "var(--text-muted)", fontSize: "11px" }}>
            about
          </p>
          <h1 className="mono" style={{ color: "var(--text)", fontSize: "28px", margin: "12px 0" }}>
            go2 link shortener
          </h1>
          <p style={{ color: "var(--text-subtle)", fontSize: "14px", lineHeight: "1.7" }}>
            Create short links, attach them to an email for management, and
            inspect click analytics in one minimal dashboard.
          </p>
        </div>
      </section>
    </main>
  );
}
