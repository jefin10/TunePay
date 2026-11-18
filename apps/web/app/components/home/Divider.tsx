const TAGS = ["Voice pay", "Contacts", "UPI ID", "Scan & pay", "Requests", "Biometric lock", "History"];

/** The quiet strip between the walk and the gradient section (fade-only reveal). */
export function Divider() {
  return (
    <section className="divider" aria-label="What TunePay does">
      <p className="tags" data-reveal="fade">
        {TAGS.map((t, i) => (
          <span key={t}>
            {i > 0 && <span aria-hidden className="mr-6 text-mint">•</span>}
            {t}
          </span>
        ))}
      </p>
    </section>
  );
}
