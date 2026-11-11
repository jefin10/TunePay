import { APK_URL } from "../lib/screens";

/**
 * TunePay ships as an Android APK today, so the iOS badge is shown as
 * "coming soon" rather than linking to a store listing that does not exist.
 */
export function StoreBadges({ className = "" }: { className?: string }) {
  return (
    <div className={`flex flex-wrap gap-3 ${className}`}>
      <a href={APK_URL} className="store-badge" rel="noopener noreferrer">
        <svg aria-hidden viewBox="0 0 24 24" className="h-7 w-7" fill="currentColor">
          <path d="M17.6 9.48 19.44 6.3a.38.38 0 0 0-.66-.38l-1.87 3.23a11.43 11.43 0 0 0-9.82 0L5.22 5.92a.38.38 0 0 0-.66.38L6.4 9.48A10.78 10.78 0 0 0 1 18h22a10.78 10.78 0 0 0-5.4-8.52ZM7 15.25a1.25 1.25 0 1 1 1.25-1.25A1.25 1.25 0 0 1 7 15.25Zm10 0A1.25 1.25 0 1 1 18.25 14 1.25 1.25 0 0 1 17 15.25Z" />
        </svg>
        <span>
          <small>Download the APK for</small>
          Android
        </span>
      </a>
      <span className="store-badge is-soon" aria-label="iOS app coming soon">
        <svg aria-hidden viewBox="0 0 24 24" className="h-7 w-7" fill="currentColor">
          <path d="M16.37 12.6c-.02-2.2 1.8-3.26 1.88-3.31a4.05 4.05 0 0 0-3.18-1.72c-1.35-.14-2.64.8-3.33.8-.7 0-1.75-.78-2.88-.76a4.26 4.26 0 0 0-3.6 2.18c-1.54 2.67-.39 6.62 1.1 8.79.74 1.06 1.61 2.25 2.75 2.2 1.1-.04 1.52-.71 2.86-.71 1.33 0 1.71.71 2.88.69 1.19-.02 1.94-1.08 2.66-2.14a9.4 9.4 0 0 0 1.21-2.48 3.83 3.83 0 0 1-2.35-3.54ZM14.18 6.1a3.9 3.9 0 0 0 .89-2.8 3.97 3.97 0 0 0-2.57 1.33 3.71 3.71 0 0 0-.92 2.69 3.28 3.28 0 0 0 2.6-1.22Z" />
        </svg>
        <span>
          <small>Coming soon to</small>
          iOS
        </span>
      </span>
    </div>
  );
}
