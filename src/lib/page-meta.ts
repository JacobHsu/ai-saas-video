import { useEffect } from "react";

type PageMeta = {
  title: string;
  description?: string;
  ogTitle?: string;
  ogDescription?: string;
  robots?: string;
};

function setMeta(attr: "name" | "property", key: string, value: string | undefined) {
  const selector = `meta[${attr}="${key}"]`;
  const existing = document.head.querySelector<HTMLMetaElement>(selector);
  if (value === undefined) {
    existing?.remove();
    return;
  }
  const el = existing ?? document.head.appendChild(document.createElement("meta"));
  el.setAttribute(attr, key);
  el.setAttribute("content", value);
}

// Client-side replacement for the per-route `head()` metadata the SSR router used to render.
export function usePageMeta({ title, description, ogTitle, ogDescription, robots }: PageMeta) {
  useEffect(() => {
    document.title = title;
    setMeta("name", "description", description);
    setMeta("property", "og:title", ogTitle);
    setMeta("property", "og:description", ogDescription);
    setMeta("name", "robots", robots);
  }, [title, description, ogTitle, ogDescription, robots]);
}
