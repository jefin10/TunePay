"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

import { APK_URL, REPO_URL } from "../../lib/screens";
import { Spark } from "../ui/Icons";
import { Wordmark } from "../ui/Logo";
import { RollLabel } from "../ui/RollLabel";

const LINKS = [
  { href: "/", label: "Home" },
  { href: "/features", label: "Features" },
  { href: "/about", label: "About" },
  { href: "/#how-it-works", label: "How it works" },
  { href: REPO_URL, label: "Source", external: true },
];

export function Nav() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  // Escape closes the sheet; links close it themselves on click.
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  const current = (href: string) => (href === pathname ? "page" : undefined);

  return (
    <>
      <header className="nav">
        <Link href="/" aria-label="TunePay home">
          <Wordmark />
        </Link>

        <nav aria-label="Main" className="nav-links">
          {LINKS.map((l) =>
            l.external ? (
              <a key={l.href} href={l.href} className="nav-link" target="_blank" rel="noopener noreferrer">
                <span aria-hidden className="nav-link-bg" />
                {l.label}
              </a>
            ) : (
              <Link key={l.href} href={l.href} className="nav-link" aria-current={current(l.href)}>
                <span aria-hidden className="nav-link-bg" />
                {l.label}
              </Link>
            ),
          )}
        </nav>

        <div className="nav-right">
          <a href={APK_URL} className="btn-chalk roll-host nav-cta" rel="noopener noreferrer">
            <RollLabel text="Download" />
          </a>
          <Spark className="spin-badge hidden lg:block" />
          <button
            type="button"
            className="burger"
            aria-label={open ? "Close menu" : "Open menu"}
            aria-expanded={open}
            aria-controls="nav-sheet"
            onClick={() => setOpen((v) => !v)}
          >
            <i />
            <i />
            <i />
            <i />
          </button>
        </div>
      </header>

      {open && (
        <nav id="nav-sheet" aria-label="Main" className="nav-sheet">
          {LINKS.map((l) =>
            l.external ? (
              <a key={l.href} href={l.href} target="_blank" rel="noopener noreferrer" onClick={() => setOpen(false)}>
                {l.label}
              </a>
            ) : (
              <Link key={l.href} href={l.href} aria-current={current(l.href)} onClick={() => setOpen(false)}>
                {l.label}
              </Link>
            ),
          )}
          <a href={APK_URL} className="btn-chalk mt-2 h-12" rel="noopener noreferrer" onClick={() => setOpen(false)}>
            Download for Android
          </a>
        </nav>
      )}
    </>
  );
}
