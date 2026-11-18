import type { CSSProperties } from "react";

import { REPO_URL } from "../../lib/screens";

const PARTS = [
  {
    name: "Phone app",
    stack: "React Native · Expo · TypeScript",
    body: "Expo Router screens, on-device speech recognition, biometrics, camera, contacts and QR scanning.",
  },
  {
    name: "Payments API",
    stack: "Django · PostgreSQL",
    body: "OTP sign-in, accounts, transfers by phone or UPI ID, and money requests on a simulated ledger.",
  },
  {
    name: "Voice intent",
    stack: "Flask · TensorFlow",
    body: "A small CNN decides whether you asked to pay, request money or check your balance; the server pulls out who and how much.",
  },
  {
    name: "Conversation",
    stack: "Rasa",
    body: "Anything that is not a payment, or that the model is unsure about, goes to a chat assistant instead.",
  },
];

/** How it's built — four rows that rise in on scroll. */
export function BuiltWith() {
  return (
    <section id="built-with" className="scroll-mt-24 px-[var(--pad-x)] py-24" aria-labelledby="bw-title">
      <div className="mx-auto max-w-[82rem]">
        <div className="mb-10 flex flex-wrap items-end justify-between gap-6">
          <h2
            id="bw-title"
            data-reveal="fade-move"
            className="font-display text-[clamp(2.2rem,5vw,4rem)] leading-[1.05] font-medium tracking-[-0.03em]"
          >
            Four services,
            <br />
            <span className="text-mint-grad">one sentence</span>
          </h2>
          <a
            href={REPO_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="ft-link wipe text-lg"
            data-reveal="fade"
          >
            <span className="wipe-line">
              Read the source on GitHub
              <span aria-hidden className="wipe-bar" />
            </span>
          </a>
        </div>
        {PARTS.map((p, i) => (
          <div key={p.name} className="stack-row" data-reveal="fade-move" style={{ "--d": `${i * 100}ms` } as CSSProperties}>
            <span className="tags text-mint">0{i + 1}</span>
            <h3 className="font-display text-2xl font-medium tracking-[-0.015em]">
              {p.name}
              <span className="tags mt-2 block">{p.stack}</span>
            </h3>
            <p className="leading-relaxed text-fog">{p.body}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
