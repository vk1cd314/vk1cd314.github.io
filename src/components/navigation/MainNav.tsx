"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const links = [
  { href: "/", label: "Home" },
  { href: "/problems", label: "Problems" },
  { href: "/research", label: "Research" },
];

const isActiveRoute = (pathname: string, href: string) => {
  if (href === "/") return pathname === "/";
  return pathname === href || pathname.startsWith(`${href}/`);
};

export function MainNav() {
  const pathname = usePathname();

  return (
    <nav>
      <ul className="mt-4 flex flex-wrap gap-4 text-sm uppercase tracking-[0.2em] text-[var(--muted)] md:mt-0 md:justify-end">
        {links.map((link) => {
          const active = isActiveRoute(pathname, link.href);
          return (
            <li key={link.href}>
              <Link
                href={link.href}
                className={`inline-flex items-center border-b-2 py-1 transition ${
                  active
                    ? "border-white text-white"
                    : "border-transparent hover:border-white/60 hover:text-white"
                }`}
              >
                {link.label}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
