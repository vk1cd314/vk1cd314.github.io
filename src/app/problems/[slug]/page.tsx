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
  const slugs = await getCollectionSlugs("problems");
  return slugs.map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<Params>;
}) {
  const { slug } = await params;
  try {
    const entry = await getCollectionEntry("problems", slug);
    return {
      title: `${entry.meta.title} - Problem Log`,
      description: entry.meta.summary,
    };
  } catch {
    return { title: "Problem not found" };
  }
}

export default async function ProblemEntryPage({
  params,
}: {
  params: Promise<Params>;
}) {
  const { slug } = await params;

  const entry = await getCollectionEntry("problems", slug).catch(() => null);

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
