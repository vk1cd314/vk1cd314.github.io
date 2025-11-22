import { getCollectionMeta } from "@/lib/content";
import { ContentCard } from "@/components/ui/ContentCard";
import { SectionHeading } from "@/components/ui/SectionHeading";

export const metadata = {
  title: "Research Notes",
  description:
    "Description of prior research I have done.",
};

export default async function ResearchPage() {
  const entries = await getCollectionMeta("research");

  return (
    <div className="space-y-6">
      <SectionHeading label="Research"/>
      <div className="grid gap-6 md:grid-cols-2">
        {entries.map((entry) => (
          <ContentCard
            key={entry.slug}
            title={entry.title}
            summary={entry.summary}
            meta={entry.tag}
            date={entry.date}
            href={`/research/${entry.slug}`}
          />
        ))}
      </div>
    </div>
  );
}
