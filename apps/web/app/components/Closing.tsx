import Image from "next/image";

import { APK_URL, REPO_URL } from "../lib/screens";
import { StoreBadges } from "./StoreBadges";

export function Closing() {
  return (
    <>
      <section className="px-4 pb-24 sm:px-6 lg:px-8">
        <div className="cta-panel mx-auto max-w-6xl">
          <div aria-hidden className="cta-glow" />
          <div className="relative">
            <h2 className="section-title max-w-2xl">
              Your next payment is <span className="text-gradient">one sentence</span> away.
            </h2>
            <p className="mt-4 max-w-xl text-lg text-slate-300">
              Install the Android build, sign in with your number and say your first payment.
            </p>
            <div className="mt-8 flex flex-col gap-4 sm:flex-row sm:items-center">
              <a href={APK_URL} className="btn-glow" rel="noopener noreferrer">
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

      <footer className="border-t border-white/5 px-4 py-10 sm:px-6 lg:px-8">
        <div className="mx-auto flex max-w-7xl flex-col items-start justify-between gap-6 text-sm text-slate-500 sm:flex-row sm:items-center">
          <div className="flex items-center gap-2.5">
            <span className="grid h-8 w-8 place-items-center rounded-lg bg-white">
              <Image src="/symbol-logo.png" alt="" width={22} height={22} />
            </span>
            <span className="font-medium text-slate-300">TunePay</span>
            <span>· An educational project. Not a licensed payment service.</span>
          </div>
          <a href={REPO_URL} target="_blank" rel="noopener noreferrer" className="transition-colors hover:text-slate-300">
            github.com/jefin10/TunePay
          </a>
        </div>
      </footer>
    </>
  );
}
