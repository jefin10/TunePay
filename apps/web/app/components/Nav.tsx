"use client";

import Image from "next/image";
import { useEffect, useState } from "react";

import { APK_URL } from "../lib/screens";

const LINKS = [
  { href: "#features", label: "Features" },
  { href: "#how-it-works", label: "How it works" },
  { href: "#under-the-hood", label: "Under the hood" },
];

export function Nav() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header className="fixed inset-x-0 top-0 z-50 px-3 pt-3 sm:px-6">
      <nav
        className={`mx-auto flex max-w-6xl items-center justify-between rounded-2xl px-4 py-3 transition-all duration-300 sm:px-5 ${
          scrolled || open ? "plate shadow-2xl shadow-black/40" : "bg-transparent"
        }`}
      >
        <a href="#top" className="flex items-center gap-2.5" onClick={() => setOpen(false)}>
          <span className="grid h-9 w-9 place-items-center rounded-xl border border-line-strong bg-ink-3">
            <Image src="/symbol-logo.png" alt="" width={26} height={26} />
          </span>
          <span className="text-lg font-extrabold tracking-tight text-chalk">TunePay</span>
        </a>

        <div className="hidden items-center gap-8 md:flex">
          {LINKS.map((l) => (
            <a key={l.href} href={l.href} className="text-sm font-semibold text-chalk-dim transition-colors hover:text-chalk">
              {l.label}
            </a>
          ))}
          <a href={APK_URL} className="pop pop-mint btn-sm" rel="noopener noreferrer">
            Get the app
          </a>
        </div>

        <button
          type="button"
          className="grid h-10 w-10 place-items-center rounded-xl text-slate-200 md:hidden"
          aria-label={open ? "Close menu" : "Open menu"}
          aria-expanded={open}
          onClick={() => setOpen((v) => !v)}
        >
          <svg viewBox="0 0 24 24" className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round">
            {open ? <path d="M6 6l12 12M18 6 6 18" /> : <path d="M4 7h16M4 12h16M4 17h16" />}
          </svg>
        </button>
      </nav>

      {open && (
        <div className="plate mx-auto mt-2 max-w-6xl rounded-2xl p-3 md:hidden">
          {LINKS.map((l) => (
            <a
              key={l.href}
              href={l.href}
              onClick={() => setOpen(false)}
              className="block rounded-xl px-3 py-3 font-semibold text-chalk-dim hover:bg-ink-3"
            >
              {l.label}
            </a>
          ))}
          <a href={APK_URL} onClick={() => setOpen(false)} className="pop pop-mint mt-2 w-full" rel="noopener noreferrer">
            Get the app
          </a>
        </div>
      )}
    </header>
  );
}
