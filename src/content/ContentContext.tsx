import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import { DEFAULT_CONTENT } from "../../cms/shared/defaults";
import type { SiteContent } from "../../cms/shared/types";

/**
 * The site renders instantly with the launch content, then swaps in the live
 * database content when it arrives. Visitors never see a blank page, and the
 * layout dimensions stay identical.
 */
const ContentContext = createContext<SiteContent>(DEFAULT_CONTENT);

export function useContent(): SiteContent {
  return useContext(ContentContext);
}

export function ContentProvider({ children }: { children: ReactNode }) {
  const [content, setContent] = useState<SiteContent>(DEFAULT_CONTENT);

  useEffect(() => {
    const controller = new AbortController();
    let etag: string | null = null;
    let disposed = false;

    /**
     * Conditional fetch: `304 Not Modified` keeps this almost free. We refresh
     * when the tab regains focus and once a minute, so an owner's saved change
     * appears on already-open pages too.
     */
    const load = async () => {
      try {
        const response = await fetch("/api/content", {
          headers: {
            Accept: "application/json",
            ...(etag ? { "If-None-Match": etag } : {}),
          },
          cache: "no-store",
          signal: controller.signal,
        });
        if (response.status === 304) return;
        if (!response.ok) return;
        etag = response.headers.get("etag");
        const data = (await response.json()) as SiteContent;
        if (!disposed && data?.business && Array.isArray(data.treatments)) {
          setContent(data);
        }
      } catch {
        /* Offline or preview without an API: keep the built-in content. */
      }
    };

    void load();

    const onVisible = () => {
      if (document.visibilityState === "visible") void load();
    };
    document.addEventListener("visibilitychange", onVisible);
    window.addEventListener("focus", onVisible);
    const timer = window.setInterval(() => void load(), 60_000);

    return () => {
      disposed = true;
      controller.abort();
      window.clearInterval(timer);
      document.removeEventListener("visibilitychange", onVisible);
      window.removeEventListener("focus", onVisible);
    };
  }, []);

  return <ContentContext.Provider value={content}>{children}</ContentContext.Provider>;
}
