import Image from "next/image";
import Link from "next/link";
import { FiGithub, FiLinkedin } from "react-icons/fi";

import { author } from "@/data/author";

const formatList = (items: string[]) => {
  if (items.length === 1) return items[0];
  if (items.length === 2) return `${items[0]} and ${items[1]}`;
  const head = items.slice(0, -1).join(", ");
  const tail = items[items.length - 1];
  return `${head}, and ${tail}`;
};

const SOCIAL_ICONS = {
  github: FiGithub,
  linkedin: FiLinkedin,
};

export function Hero() {
  const interestsText = author.researchInterests?.length
    ? `${formatList(author.researchInterests)}.`
    : null;
  const heroParagraphs = [author.description, author.statement].filter(
    Boolean,
  );

  return (
    <section className="grid gap-10 md:grid-cols-[320px_minmax(0,1fr)]">
      <div className="space-y-6">
        <div className="border border-[var(--border)]">
          <Image
            src={author.profileImage}
            alt={author.name}
            width={540}
            height={640}
            priority
            className="w-full object-cover"
          />
        </div>
      </div>
      <div className="space-y-8">
        <div className="flex items-start justify-between gap-6">
          <div>
            <p className="text-xs uppercase tracking-[0.3em] text-[var(--muted)]">
              {author.location}
            </p>
            <h1 className="mt-4 text-4xl font-semibold text-white">
              Hi! I&apos;m Niloy
            </h1>
          </div>
          {author.socials.length ? (
            <div className="flex gap-3">
              {author.socials.map((social) => {
                const Icon =
                  SOCIAL_ICONS[
                    social.icon as keyof typeof SOCIAL_ICONS
                  ] ?? FiLinkedin;
                return (
                  <Link
                    key={social.label}
                    href={social.url}
                    className="inline-flex h-11 w-11 items-center justify-center border border-[var(--border)] text-lg transition hover:bg-white hover:text-black"
                    target="_blank"
                    rel="noreferrer"
                    aria-label={social.label}
                    title={social.label}
                  >
                    <Icon />
                  </Link>
                );
              })}
            </div>
          ) : null}
        </div>
        <div className="space-y-4">
          {heroParagraphs.map((text) => (
            <p key={text} className="text-lg text-[#e1e1e1]">
              {text}
            </p>
          ))}
        </div>
        {interestsText ? (
          <div className="space-y-2">
            <p className="text-xs uppercase tracking-[0.3em] text-[var(--muted)]">
              Interests
            </p>
            <p className="text-base text-white">{interestsText}</p>
          </div>
        ) : null}
      </div>
    </section>
  );
}
