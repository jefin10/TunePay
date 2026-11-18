"use client";

import { usePathname } from "next/navigation";
import { useEffect } from "react";

/**
 * The page-wide motion plumbing, mirroring how Webflow IX2 runs LifeLogX:
 * one IntersectionObserver for every `[data-reveal]` element (fires at 0%
 * offset, plays once), and one delegated listener pair for every underline
 * wipe (`.wipe`), so no component owns a per-element scroll or hover listener.
 */
export function SiteEffects() {
  const pathname = usePathname();

  // Reveals: re-scan on every route change.
  useEffect(() => {
    const els = Array.from(document.querySelectorAll<HTMLElement>("[data-reveal]:not(.is-revealed)"));
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce || !("IntersectionObserver" in window)) {
      els.forEach((el) => el.classList.add("is-revealed"));
      return;
    }
    const io = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue;
          entry.target.classList.add("is-revealed");
          io.unobserve(entry.target);
        }
      },
      { threshold: 0 },
    );
    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, [pathname]);

  // Underline wipes: in from the left, out to the right, snap back.
  useEffect(() => {
    const find = (t: EventTarget | null) => (t instanceof Element ? t.closest<HTMLElement>(".wipe") : null);
    const enter = (e: Event) => {
      const el = find(e.target);
      const from = (e as MouseEvent | FocusEvent).relatedTarget;
      if (!el || (from instanceof Node && el.contains(from))) return;
      el.classList.remove("is-out");
      el.classList.add("is-in");
    };
    const leave = (e: Event) => {
      const el = find(e.target);
      const to = (e as MouseEvent | FocusEvent).relatedTarget;
      if (!el || (to instanceof Node && el.contains(to))) return;
      if (!el.classList.contains("is-in")) return;
      el.classList.remove("is-in");
      el.classList.add("is-out");
    };
    const settle = (e: TransitionEvent) => {
      if (!(e.target instanceof Element) || !e.target.classList.contains("wipe-bar")) return;
      const el = find(e.target);
      if (el?.classList.contains("is-out")) el.classList.remove("is-out");
    };
    document.addEventListener("mouseover", enter);
    document.addEventListener("mouseout", leave);
    document.addEventListener("focusin", enter);
    document.addEventListener("focusout", leave);
    document.addEventListener("transitionend", settle);
    return () => {
      document.removeEventListener("mouseover", enter);
      document.removeEventListener("mouseout", leave);
      document.removeEventListener("focusin", enter);
      document.removeEventListener("focusout", leave);
      document.removeEventListener("transitionend", settle);
    };
  }, []);

  return null;
}
