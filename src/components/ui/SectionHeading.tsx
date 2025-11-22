type Props = {
  label: string;
  kicker?: string;
};

export function SectionHeading({ label, kicker }: Props) {
  return (
    <div className="space-y-2 border-t border-[var(--border)] pt-6">
      {kicker ? (
        <p className="text-xs uppercase tracking-[0.4em] text-[var(--muted)]">
          {kicker}
        </p>
      ) : null}
      <h2 className="text-3xl font-semibold tracking-tight text-white">
        {label}
      </h2>
    </div>
  );
}
