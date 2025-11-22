import { getCollectionMeta } from "@/lib/content";
import { ContentCard } from "@/components/ui/ContentCard";
import { SectionHeading } from "@/components/ui/SectionHeading";

export const metadata = {
  title: "Problem Log",
  description: "Cards for every stubborn problem currently under the microscope.",
};

export default async function ProblemsPage() {
  const entries = await getCollectionMeta("problems");

  return (
    <div className="space-y-6">
      <SectionHeading
        label="Problems"
        kicker="Stuff I like or have authored"
      />
      <div className="grid gap-6 md:grid-cols-2">
        {entries.map((entry) => (
          <ContentCard
            key={entry.slug}
            title={entry.title}
            summary={entry.summary}
            meta={entry.tag}
            date={entry.date}
            href={`/problems/${entry.slug}`}
          />
        ))}
      </div>
    </div>
  );
}
