"use client";

import { useEffect, useRef } from "react";

import { APK_URL } from "../lib/screens";
import { StoreBadges } from "./StoreBadges";
import { Phone } from "./Phone";

const MAX_TILT_Y = 22;
const MAX_TILT_X = 14;

/**
 * Eases the phone toward the pointer. Writes the transform straight to the
 * DOM so the hero never re-renders per frame, and stops the loop once the
 * phone has caught up.
 */
function usePointerTilt() {
  const bodyRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const body = bodyRef.current;
    if (!body || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const base = { x: 6, y: -16 };
    const target = { ...base };
    const current = { ...base };
    let frame = 0;

    const render = () => {
      current.x += (target.x - current.x) * 0.08;
      current.y += (target.y - current.y) * 0.08;
      body.style.transform = `rotateX(${current.x.toFixed(2)}deg) rotateY(${current.y.toFixed(2)}deg)`;
      body.style.setProperty("--glare", `${50 + current.y * 1.6}%`);
      const settled =
        Math.abs(target.x - current.x) < 0.01 && Math.abs(target.y - current.y) < 0.01;
      frame = settled ? 0 : requestAnimationFrame(render);
    };
    const kick = () => {
      if (!frame) frame = requestAnimationFrame(render);
    };
    const onMove = (e: PointerEvent) => {
      if (e.pointerType !== "mouse") return;
      const nx = (e.clientX / window.innerWidth) * 2 - 1;
      const ny = (e.clientY / window.innerHeight) * 2 - 1;
      target.y = base.y + nx * MAX_TILT_Y;
      target.x = base.x - ny * MAX_TILT_X;
      kick();
    };
    const onLeave = () => {
      target.x = base.x;
      target.y = base.y;
      kick();
    };

    kick();
    window.addEventListener("pointermove", onMove, { passive: true });
    document.addEventListener("pointerleave", onLeave);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("pointermove", onMove);
      document.removeEventListener("pointerleave", onLeave);
    };
  }, []);

  return bodyRef;
}

export function Hero() {
  const bodyRef = usePointerTilt();

  return (
    <section className="relative overflow-hidden pt-32 pb-20 sm:pt-40 lg:pb-28">
      <div aria-hidden className="hero-aurora" />
      <div className="mx-auto grid max-w-7xl items-center gap-16 px-4 sm:px-6 lg:grid-cols-[1.05fr_1fr] lg:px-8">
        <div className="relative z-10 max-w-xl">
          <p className="eyebrow">
            <span className="eyebrow-dot" /> Voice-first UPI payments
          </p>
          <h1 className="mt-6 text-5xl font-semibold leading-[1.02] tracking-[-0.035em] text-white sm:text-6xl lg:text-7xl">
            Say it.
            <br />
            <span className="text-gradient">It&apos;s paid.</span>
          </h1>
          <p className="mt-6 text-lg leading-relaxed text-slate-300 sm:text-xl">
            TunePay turns a sentence into a UPI transfer. Say{" "}
            <span className="text-white">&ldquo;Send ₹500 to Priya&rdquo;</span> and it finds the
            contact, fills in the amount and waits for your fingerprint before a single rupee
            moves.
          </p>

          <div className="mt-9 flex flex-col gap-4 sm:flex-row sm:items-center">
            <a href={APK_URL} className="btn-glow" rel="noopener noreferrer">
              Download for Android
              <svg aria-hidden viewBox="0 0 20 20" className="h-5 w-5" fill="currentColor">
                <path d="M10 3a1 1 0 0 1 1 1v7.59l2.3-2.3a1 1 0 1 1 1.4 1.42l-4 4a1 1 0 0 1-1.4 0l-4-4a1 1 0 1 1 1.4-1.42L9 11.6V4a1 1 0 0 1 1-1Zm-6 12a1 1 0 0 1 1 1v.5h10V16a1 1 0 1 1 2 0v1.5a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V16a1 1 0 0 1 1-1Z" />
              </svg>
            </a>
            <a href="#how-it-works" className="btn-ghost">
              See it in action
            </a>
          </div>

          <StoreBadges className="mt-8" />

          <ul className="mt-10 flex flex-wrap gap-x-6 gap-y-3 text-sm text-slate-400">
            {["Biometric confirmation", "Phone, UPI ID, contacts or QR", "Open source"].map((t) => (
              <li key={t} className="flex items-center gap-2">
                <svg aria-hidden viewBox="0 0 20 20" className="h-4 w-4 text-violet-400" fill="currentColor">
                  <path d="M16.7 5.3a1 1 0 0 1 0 1.4l-7.5 7.5a1 1 0 0 1-1.4 0L3.3 9.7a1 1 0 1 1 1.4-1.4l3.8 3.8 6.8-6.8a1 1 0 0 1 1.4 0Z" />
                </svg>
                {t}
              </li>
            ))}
          </ul>
        </div>

        <div className="relative flex justify-center lg:justify-end lg:pr-10">
          <div className="float-slow">
            <Phone screen="home" bodyRef={bodyRef} priority className="phone-lg">
              <div className="float-card float-card-voice" aria-hidden>
                <span className="wave">
                  {Array.from({ length: 5 }, (_, i) => (
                    <i key={i} style={{ animationDelay: `${i * 0.12}s` }} />
                  ))}
                </span>
                <span>
                  <small>You said</small>
                  &ldquo;Send ₹500 to Priya&rdquo;
                </span>
              </div>
              <div className="float-card float-card-paid" aria-hidden>
                <span className="paid-check">
                  <svg viewBox="0 0 20 20" fill="currentColor" className="h-4 w-4">
                    <path d="M16.7 5.3a1 1 0 0 1 0 1.4l-7.5 7.5a1 1 0 0 1-1.4 0L3.3 9.7a1 1 0 1 1 1.4-1.4l3.8 3.8 6.8-6.8a1 1 0 0 1 1.4 0Z" />
                  </svg>
                </span>
                <span>
                  <small>Payment sent</small>
                  ₹500.00 · Priya Sharma
                </span>
              </div>
              <div className="float-card float-card-intent" aria-hidden>
                <small>Intent</small>
                <b>send_money</b>
                <span className="intent-bar">
                  <i style={{ width: "96%" }} />
                </span>
              </div>
            </Phone>
          </div>
        </div>
      </div>
    </section>
  );
}
