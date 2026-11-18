"use client";

import Link from "next/link";
import { useRef } from "react";

import { APK_URL, ISSUES_URL, REPO_URL } from "../../lib/screens";
import { gsap, prefersReducedMotion, useGSAP } from "../../lib/gsap";
import { Wordmark } from "../ui/Logo";

type FooterLink = { href: string; label: string; external?: boolean };

const COLUMNS: { title: string; links: FooterLink[] }[] = [
  {
    title: "Pages",
    links: [
      { href: "/", label: "Home" },
      { href: "/features", label: "Features" },
      { href: "/about", label: "About" },
      { href: "/#how-it-works", label: "How it works" },
    ],
  },
  {
    title: "Get it",
    links: [
      { href: APK_URL, label: "Android APK", external: true },
      { href: `${REPO_URL}/releases`, label: "Releases", external: true },
      { href: "/features#faq", label: "FAQ" },
    ],
  },
  {
    title: "Project",
    links: [
      { href: REPO_URL, label: "Source code", external: true },
      { href: ISSUES_URL, label: "Report an issue", external: true },
      { href: "/about#built-with", label: "How it's built" },
    ],
  },
];

function FooterLinkItem({ link }: { link: FooterLink }) {
  const inner = (
    <span className="wipe-line">
      {link.label}
      <span aria-hidden className="wipe-bar" />
    </span>
  );
  return link.external ? (
    <a href={link.href} className="ft-link wipe" target="_blank" rel="noopener noreferrer">
      {inner}
    </a>
  ) : (
    <Link href={link.href} className="ft-link wipe">
      {inner}
    </Link>
  );
}

/**
 * The footer's giant wordmark carries a mint glow that follows the cursor
 * across the footer (study §7.10), eased with quickTo so it trails softly.
 */
export function Footer() {
  const root = useRef<HTMLElement>(null);
  const word = useRef<HTMLSpanElement>(null);

  useGSAP(
    () => {
      const footer = root.current;
      const el = word.current;
      if (!footer || !el || prefersReducedMotion()) return;
      const glow = { x: 14 };
      const toX = gsap.quickTo(glow, "x", {
        duration: 0.9,
        ease: "power3",
        onUpdate: () => el.style.setProperty("--fx", glow.x.toFixed(2)),
      });
      const onMove = (e: PointerEvent) => {
        const r = footer.getBoundingClientRect();
        toX(gsap.utils.clamp(4, 96, ((e.clientX - r.left) / r.width) * 100));
      };
      footer.addEventListener("pointermove", onMove);
      return () => footer.removeEventListener("pointermove", onMove);
    },
    { scope: root },
  );

  return (
    <footer ref={root} className="ft">
      <span ref={word} aria-hidden className="ft-word">
        TunePay
      </span>

      <div className="ft-grid">
        <div>
          <Link href="/" aria-label="TunePay home">
            <Wordmark />
          </Link>
          <p className="mt-4 max-w-xs text-sm leading-relaxed text-fog">
            Voice-first UPI payments. Say who and how much, check it, confirm with your fingerprint.
          </p>
        </div>
        {COLUMNS.map((col) => (
          <div key={col.title} className="ft-col">
            <h3 className="tags">{col.title}</h3>
            {col.links.map((l) => (
              <FooterLinkItem key={l.href} link={l} />
            ))}
          </div>
        ))}
      </div>

      <div className="ft-bottom">
        <p>An educational project, not a licensed payment service. Money moves on a simulated ledger.</p>
        <p>Open source on GitHub</p>
      </div>
    </footer>
  );
}
