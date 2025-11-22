import Link from "next/link";
import { FiArrowUpRight } from "react-icons/fi";

type Props = {
  title: string;
  summary: string;
  meta: string;
  date: string;
  href: string;
};

export function ContentCard({ title, summary, meta, date, href }: Props) {
  return (
    <Link
      href={href}
      className="group block border-t border-[var(--border)] pt-4 transition hover:translate-x-1"
    >
      <div className="flex flex-wrap items-center justify-between gap-2 text-xs uppercase tracking-[0.3em] text-[var(--muted)]">
        <p>
          {meta}
        </p>
        <span className="text-xs text-[var(--muted)]">
          {new Date(date).toLocaleDateString(undefined, {
            month: "short",
            day: "numeric",
            year: "numeric",
          })}
        </span>
      </div>
      <div className="mt-4 flex items-start justify-between gap-4">
        <h3 className="text-2xl font-semibold text-white">{title}</h3>
        <FiArrowUpRight className="shrink-0 text-2xl text-[var(--accent)] transition group-hover:-translate-y-1 group-hover:translate-x-1" />
      </div>
      <p className="mt-3 text-base text-[#dedede]">{summary}</p>
    </Link>
  );
}
