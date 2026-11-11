"use client";

import { useState } from "react";

import type { ScreenId } from "../lib/screens";
import { Phone } from "./Phone";

type Feature = {
  title: string;
  body: string;
  screen: ScreenId;
  tilt: [number, number];
  icon: string;
};

const FEATURES: Feature[] = [
  {
    title: "Pay by voice",
    body: "Say a payment in plain English. An intent model and entity extraction turn it into a recipient and an amount.",
    screen: "listening",
    tilt: [6, -20],
    icon: "M12 15a3 3 0 0 0 3-3V6a3 3 0 1 0-6 0v6a3 3 0 0 0 3 3Zm5-3a5 5 0 0 1-10 0M12 17v3m-3 0h6",
  },
  {
    title: "Pay anyone",
    body: "Send to a phone number, a UPI ID or straight from your contacts, with the recipient verified first.",
    screen: "contacts",
    tilt: [4, 18],
    icon: "M16 19v-1a4 4 0 0 0-4-4H7a4 4 0 0 0-4 4v1m6.5-8a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7ZM20 8v6m3-3h-6",
  },
  {
    title: "Scan & pay",
    body: "Point the camera at any UPI QR code, or pick a QR image from your gallery.",
    screen: "scan",
    tilt: [10, -12],
    icon: "M4 8V5a1 1 0 0 1 1-1h3m8 0h3a1 1 0 0 1 1 1v3m0 8v3a1 1 0 0 1-1 1h-3m-8 0H5a1 1 0 0 1-1-1v-3M7 12h10",
  },
  {
    title: "Request money",
    body: "Ask anyone to pay you, and pay, decline or cancel requests with a confirmation step.",
    screen: "requests",
    tilt: [2, 14],
    icon: "M7 17 17 7m0 0H9m8 0v8",
  },
  {
    title: "History that searches",
    body: "Every transfer in local time, filtered by sent, received or failed and searchable by name.",
    screen: "history",
    tilt: [8, -16],
    icon: "M12 8v4l2.5 2.5M21 12a9 9 0 1 1-3-6.7M21 4v4h-4",
  },
  {
    title: "Locked by biometrics",
    body: "Fingerprint or device PIN to unlock the app and to confirm every payment.",
    screen: "security",
    tilt: [5, 20],
    icon: "M12 3 5 6v5c0 4.5 3 8.3 7 10 4-1.7 7-5.5 7-10V6l-7-3Zm-2.5 9 1.8 1.8L15 10",
  },
];

export function Features() {
  const [active, setActive] = useState(0);
  const feature = FEATURES[active];

  return (
    <section id="features" className="relative scroll-mt-24 py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="max-w-2xl">
          <p className="eyebrow">
            <span className="eyebrow-dot" /> Features
          </p>
          <h2 className="section-title mt-5">
            Everything a UPI app does.
            <br />
            <span className="text-slate-400">Plus the part where you just ask.</span>
          </h2>
        </div>

        <div className="mt-14 grid items-start gap-12 lg:grid-cols-[1.25fr_1fr]">
          <ul className="grid gap-4 sm:grid-cols-2">
            {FEATURES.map((f, i) => (
              <li key={f.title}>
                <button
                  type="button"
                  onPointerEnter={() => setActive(i)}
                  onFocus={() => setActive(i)}
                  onClick={() => setActive(i)}
                  aria-pressed={i === active}
                  className={`feature-card ${i === active ? "is-active" : ""}`}
                >
                  <span className="feature-icon">
                    <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round">
                      <path d={f.icon} />
                    </svg>
                  </span>
                  <span className="mt-5 block text-lg font-semibold text-white">{f.title}</span>
                  <span className="mt-2 block text-sm leading-relaxed text-slate-400">{f.body}</span>
                </button>
              </li>
            ))}
          </ul>

          <div className="order-first flex justify-center lg:sticky lg:top-28 lg:order-none">
            <Phone
              screen={feature.screen}
              rotateX={feature.tilt[0]}
              rotateY={feature.tilt[1]}
              className="phone-md"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
