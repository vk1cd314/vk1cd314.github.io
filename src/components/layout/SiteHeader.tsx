import { author } from "@/data/author";
import { MainNav } from "@/components/navigation/MainNav";

export function SiteHeader() {
  return (
    <header className="border-b border-[var(--border)] pb-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <div>
          <h1 className="text-3xl font-semibold tracking-tight text-white">
            {author.name}
          </h1>
        </div>
        <MainNav />
      </div>
    </header>
  );
}
