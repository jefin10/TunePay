"use client";

import { useId, useState } from "react";

const QA = [
  {
    q: "Is TunePay connected to real UPI?",
    a: "No. TunePay is an educational project. Money moves on a simulated ledger: every account starts with ₹5,000 and transfers update those balances. It is not a licensed payment service.",
  },
  {
    q: "What happens to my voice?",
    a: "Your phone turns speech into text. Only that text is sent to TunePay’s intent service, which decides whether you asked to pay, request money or check your balance.",
  },
  {
    q: "What if it hears me wrong?",
    a: "Nothing moves on a guess. If the model is less than 70% sure, your words go to the chat assistant instead. When it is sure, you still see the recipient and amount, can edit them, and confirm with your fingerprint or PIN.",
  },
  {
    q: "Who can I pay?",
    a: "Anyone in your contacts, any phone number or UPI ID registered with TunePay, or anyone whose UPI QR code you scan.",
  },
  {
    q: "Is there an iPhone app?",
    a: "Not yet. TunePay ships as an Android APK today.",
  },
  {
    q: "Can I see the code?",
    a: "Yes. The app, the payments API, the voice model and the chat assistant are all open source on GitHub.",
  },
];

/** Click to open: the plus turns 135° into a ×, the answer opens (350ms) and fades in (500ms). Study §5.8. */
export function Faq() {
  const [open, setOpen] = useState<number | null>(0);
  const base = useId();

  return (
    <section id="faq" className="scroll-mt-24 px-[var(--pad-x)] py-24" aria-labelledby="faq-title">
      <div className="mx-auto grid max-w-[82rem] gap-10 lg:grid-cols-[1fr_1.6fr]">
        <h2
          id="faq-title"
          data-reveal="fade-move"
          className="font-display text-[clamp(2.2rem,5vw,4rem)] leading-[1.05] font-medium tracking-[-0.03em]"
        >
          Questions,
          <br />
          <span className="text-mint-grad">answered</span>
        </h2>
        <div>
          {QA.map((item, i) => {
            const isOpen = open === i;
            const id = `${base}-${i}`;
            return (
              <div key={item.q} className={`faq-item ${isOpen ? "is-open" : ""}`} data-reveal="fade-move">
                <h3>
                  <button
                    type="button"
                    className="faq-q"
                    aria-expanded={isOpen}
                    aria-controls={id}
                    onClick={() => setOpen(isOpen ? null : i)}
                  >
                    {item.q}
                    <span aria-hidden className="faq-plus" />
                  </button>
                </h3>
                <div id={id} className="faq-a" role="region" aria-label={item.q}>
                  <div>
                    <p>{item.a}</p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
