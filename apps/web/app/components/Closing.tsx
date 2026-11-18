import Image from "next/image";

import { APK_URL, REPO_URL } from "../lib/screens";
import { StoreBadges } from "./StoreBadges";

export function Closing() {
  return (
    <>
      <section className="px-4 pb-24 sm:px-6 lg:px-8">
        <div className="cta-panel grain mx-auto max-w-6xl">
          <div aria-hidden className="cta-glow" />
          <div className="relative">
            <h2 className="section-title max-w-2xl">
              Your next payment is <span className="text-mint">one sentence</span> away.
            </h2>
            <p className="mt-4 max-w-xl text-lg text-chalk-dim">
              Install the Android build, sign in with your number and say your first payment.
            </p>
            <div className="mt-8 flex flex-col gap-4 sm:flex-row sm:items-center">
              <a href={APK_URL} className="pop pop-mint" rel="noopener noreferrer">
                Download for Android
              </a>
              <a href={REPO_URL} className="btn-ghost" target="_blank" rel="noopener noreferrer">
                View the source
              </a>
            </div>
            <StoreBadges className="mt-8" />
          </div>
        </div>
      </section>

      <footer className="border-t border-line px-4 py-10 sm:px-6 lg:px-8">
        <div className="mx-auto flex max-w-7xl flex-col items-start justify-between gap-6 text-sm text-mute sm:flex-row sm:items-center">
          <div className="flex items-center gap-2.5">
            <span className="grid h-8 w-8 place-items-center rounded-lg border border-line-strong bg-ink-3">
              <Image src="/symbol-logo.png" alt="" width={22} height={22} />
            </span>
            <span className="font-bold text-chalk-dim">TunePay</span>
            <span>· An educational project. Not a licensed payment service.</span>
          </div>
          <a href={REPO_URL} target="_blank" rel="noopener noreferrer" className="font-semibold transition-colors hover:text-chalk-dim">
            github.com/jefin10/TunePay
          </a>
        </div>
      </footer>
    </>
  );
}
