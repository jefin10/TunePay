import { APK_URL } from "../../lib/screens";
import { LogoMark } from "../ui/Logo";

/** The floating bar that fades in three seconds late (study §8.5). */
export function DownloadBar() {
  return (
    <a href={APK_URL} className="dlbar" rel="noopener noreferrer">
      Get
      <span className="dlbar-mark">
        <LogoMark />
      </span>
      TunePay free on Android
    </a>
  );
}
