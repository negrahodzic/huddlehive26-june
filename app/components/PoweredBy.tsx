const PARTNERS = [
  { name: "PlanIt", href: "https://www.planit.org.uk" },
  { name: "Companies House", href: "https://www.gov.uk/government/organisations/companies-house" },
  { name: "postcodes.io", href: "https://postcodes.io" },
  { name: "OpenStreetMap", href: "https://www.openstreetmap.org" },
];

export default function PoweredBy({ className = "" }: { className?: string }) {
  return (
    <p className={`text-xs text-stone-400 ${className}`}>
      <span className="font-medium">Powered by</span>{" "}
      {PARTNERS.map((p, i) => (
        <span key={p.name}>
          {i > 0 && <span className="text-stone-300"> · </span>}
          <a
            href={p.href}
            target="_blank"
            rel="noopener noreferrer"
            className="underline decoration-stone-300 underline-offset-2 transition hover:text-brand-600 hover:decoration-brand-400"
          >
            {p.name}
          </a>
        </span>
      ))}
    </p>
  );
}
