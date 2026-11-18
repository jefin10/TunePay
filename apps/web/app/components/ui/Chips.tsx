import { CheckIcon } from "./Icons";

export function SaidChip({ className = "" }: { className?: string }) {
  return (
    <div className={`chip ${className}`} aria-hidden>
      <span className="chip-wave">
        {Array.from({ length: 5 }, (_, i) => (
          <i key={i} style={{ animationDelay: `${i * 0.12}s` }} />
        ))}
      </span>
      <span>
        <small>You said</small>
        &ldquo;Send ₹500 to Priya&rdquo;
      </span>
    </div>
  );
}

export function PaidChip({ className = "" }: { className?: string }) {
  return (
    <div className={`chip ${className}`} aria-hidden>
      <span className="chip-check">
        <CheckIcon className="h-4 w-4" />
      </span>
      <span>
        <small>Payment sent</small>
        ₹500.00 · Priya Sharma
      </span>
    </div>
  );
}
