type Props = {
  title: string;
  tag: string;
  date: string;
  summary: string;
  body: string;
};

export function ArticleLayout({ title, tag, date, summary, body }: Props) {
  const formatted = new Date(date).toLocaleDateString(undefined, {
    month: "long",
    day: "numeric",
    year: "numeric",
  });

  return (
    <article className="space-y-8">
      <header className="space-y-4 border-t border-[var(--border)] pt-6">
        <p className="text-xs uppercase tracking-[0.35em] text-[var(--muted)]">
          {tag}
        </p>
        <h1 className="text-4xl font-semibold text-white">{title}</h1>
        <p className="text-sm text-[var(--muted)]">{formatted}</p>
        <p className="max-w-3xl text-lg text-[#dedede]">{summary}</p>
      </header>
      <div
        className="article-content mt-8 space-y-4"
        dangerouslySetInnerHTML={{ __html: body }}
      />
    </article>
  );
}
