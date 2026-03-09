import { useEffect } from "react";

type SeoConfig = {
  title: string;
  description: string;
  path?: string;
  keywords?: string[];
  robots?: string;
  type?: "website" | "article";
  imagePath?: string;
  schema?: Record<string, unknown> | Record<string, unknown>[];
};

const SITE_NAME = "go2";
const DEFAULT_DESCRIPTION =
  "go2 is a minimal link shortener for creating branded short URLs, assigning ownership by email, and reviewing click analytics in one place.";
const DEFAULT_IMAGE_PATH = "/icon.png";

function getSiteUrl() {
  const envUrl = import.meta.env.VITE_PUBLIC_SITE_URL as string | undefined;

  if (envUrl) {
    return envUrl.replace(/\/+$/, "");
  }

  if (typeof window !== "undefined") {
    return window.location.origin;
  }

  return "";
}

function upsertMeta(
  selector: string,
  attributes: Record<string, string>,
  content: string,
) {
  let element = document.head.querySelector(selector) as HTMLMetaElement | null;

  if (!element) {
    element = document.createElement("meta");
    Object.entries(attributes).forEach(([key, value]) =>
      element?.setAttribute(key, value),
    );
    document.head.appendChild(element);
  }

  element.setAttribute("content", content);
}

function upsertLink(
  selector: string,
  attributes: Record<string, string>,
  href: string,
) {
  let element = document.head.querySelector(selector) as HTMLLinkElement | null;

  if (!element) {
    element = document.createElement("link");
    Object.entries(attributes).forEach(([key, value]) =>
      element?.setAttribute(key, value),
    );
    document.head.appendChild(element);
  }

  element.setAttribute("href", href);
}

export function useSeo({
  title,
  description,
  path = "/",
  keywords = [],
  robots = "index,follow,max-image-preview:large,max-snippet:-1,max-video-preview:-1",
  type = "website",
  imagePath = DEFAULT_IMAGE_PATH,
  schema,
}: SeoConfig) {
  useEffect(() => {
    const siteUrl = getSiteUrl();
    const canonicalUrl = path.startsWith("http")
      ? path
      : `${siteUrl}${path === "/" ? "" : path}`;
    const imageUrl = imagePath.startsWith("http")
      ? imagePath
      : `${siteUrl}${imagePath}`;
    const fullTitle = `${title} | ${SITE_NAME}`;
    const keywordContent = keywords.join(", ");

    document.title = fullTitle;
    document.documentElement.lang = "en";

    upsertMeta('meta[name="description"]', { name: "description" }, description);
    upsertMeta('meta[name="robots"]', { name: "robots" }, robots);
    upsertMeta(
      'meta[property="og:site_name"]',
      { property: "og:site_name" },
      SITE_NAME,
    );
    upsertMeta('meta[property="og:type"]', { property: "og:type" }, type);
    upsertMeta('meta[property="og:title"]', { property: "og:title" }, fullTitle);
    upsertMeta(
      'meta[property="og:description"]',
      { property: "og:description" },
      description,
    );
    upsertMeta('meta[property="og:url"]', { property: "og:url" }, canonicalUrl);
    upsertMeta('meta[property="og:image"]', { property: "og:image" }, imageUrl);
    upsertMeta(
      'meta[property="og:image:alt"]',
      { property: "og:image:alt" },
      `${SITE_NAME} icon`,
    );
    upsertMeta('meta[name="twitter:card"]', { name: "twitter:card" }, "summary");
    upsertMeta('meta[name="twitter:title"]', { name: "twitter:title" }, fullTitle);
    upsertMeta(
      'meta[name="twitter:description"]',
      { name: "twitter:description" },
      description,
    );
    upsertMeta('meta[name="twitter:image"]', { name: "twitter:image" }, imageUrl);

    if (keywordContent) {
      upsertMeta('meta[name="keywords"]', { name: "keywords" }, keywordContent);
    }

    upsertLink('link[rel="canonical"]', { rel: "canonical" }, canonicalUrl);

    const schemaNodes = Array.isArray(schema) ? schema : schema ? [schema] : [];
    const defaultSchema = [
      {
        "@context": "https://schema.org",
        "@type": "WebSite",
        name: SITE_NAME,
        url: siteUrl,
        description: DEFAULT_DESCRIPTION,
      },
    ];
    const nextSchema = [...defaultSchema, ...schemaNodes];

    let script = document.head.querySelector(
      'script[data-go2-seo="structured-data"]',
    ) as HTMLScriptElement | null;

    if (!script) {
      script = document.createElement("script");
      script.type = "application/ld+json";
      script.setAttribute("data-go2-seo", "structured-data");
      document.head.appendChild(script);
    }

    script.textContent = JSON.stringify(nextSchema);
  }, [description, imagePath, keywords, path, robots, schema, title, type]);
}
