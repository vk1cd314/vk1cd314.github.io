import { notFound } from "next/navigation";
import {
  getCollectionEntry,
  getCollectionSlugs,
} from "@/lib/content";
import { ArticleLayout } from "@/components/layout/ArticleLayout";

type Params = {
  slug: string;
};

export async function generateStaticParams() {
  const slugs = await getCollectionSlugs("research");
  return slugs.map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<Params>;
}) {
  const { slug } = await params;
  try {
    const entry = await getCollectionEntry("research", slug);
    return {
      title: `${entry.meta.title} — Research Notes`,
      description: entry.meta.summary,
    };
  } catch {
    return { title: "Research note not found" };
  }
}

export default async function ResearchEntryPage({
  params,
}: {
  params: Promise<Params>;
}) {
  const { slug } = await params;

  const entry = await getCollectionEntry("research", slug).catch(() => null);

  if (!entry) {
    return notFound();
  }

  return (
    <ArticleLayout
      title={entry.meta.title}
      tag={entry.meta.tag}
      date={entry.meta.date}
      summary={entry.meta.summary}
      body={entry.body}
    />
  );
}
