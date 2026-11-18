import { APK_URL } from "../../lib/screens";
import { AndroidIcon, AppleIcon, ArrowUpRight } from "./Icons";

/** Android ships as an APK today; iOS is shown as coming soon, not as a dead store link. */
export function StoreLinks({ className = "" }: { className?: string }) {
  return (
    <div className={`stores ${className}`}>
      <a href={APK_URL} className="store wipe" rel="noopener noreferrer">
        <span className="store-title">
          <AndroidIcon />
          <span className="wipe-line">
            Android
            <span aria-hidden className="wipe-bar" />
          </span>
          <ArrowUpRight />
        </span>
        <span className="store-sub">Download the APK</span>
      </a>
      <span className="store is-soon" aria-label="iPhone app coming soon">
        <span className="store-title">
          <AppleIcon />
          iPhone
          <ArrowUpRight />
        </span>
        <span className="store-sub">Coming soon</span>
      </span>
    </div>
  );
}
