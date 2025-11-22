const education = [
  {
    title: "BSc in Computer Science and Engineering",
    institution: "University of Dhaka, 2025",
  },
  {
    title: "A Levels & O Levels",
    institution: "South Point School & College",
  },
];

const accomplishments = [
  "Represented Bangladesh at the 47th ICPC World Finals in Luxor, Egypt.",
  "Placed in the top 10 across several regional programming contests.",
];

export function AboutGrid() {
  return (
    <section className="mt-16 space-y-10">
      <p className="text-xs uppercase tracking-[0.3em] text-[var(--muted)]">
        Background
      </p>

      <div className="grid gap-12 md:grid-cols-2">
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-white">Education</h3>
          <ul className="space-y-4">
            {education.map((item) => (
              <li
                key={item.title}
                className="border-t border-[var(--border)] pt-3 text-[#f2f2f2]"
              >
                <p className="font-medium text-white">{item.title}</p>
                <p className="text-sm text-[var(--muted)]">
                  {item.institution}
                </p>
              </li>
            ))}
          </ul>
        </div>

        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-white">
            Major Accomplishments
          </h3>
          <ul className="space-y-4 text-[#e7e7e7]">
            {accomplishments.map((item) => (
              <li
                key={item}
                className="border-t border-[var(--border)] pt-3 leading-snug"
              >
                {item}
              </li>
            ))}
          </ul>
        </div>
      </div>

    </section>
  );
}
