import Link from "next/link";
import { GithubButton } from "@/components/hero/github-button";

const links = [
  { href: "#pipeline", label: "Pipeline" },
  { href: "#features", label: "Features" },
  { href: "#frameworks", label: "Frameworks" },
];

export function Nav() {
  return (
    <header className="sticky top-0 z-50 border-b border-border-soft bg-background/85 backdrop-blur-md">
      <nav className="mx-auto flex h-16 max-w-[1120px] items-center justify-between px-8">
        <Link href="/" className="flex items-center gap-2 font-mono text-[15px] font-semibold tracking-tight">
          <span className="size-2 rounded-sm bg-green shadow-[0_0_12px_rgba(63,185,80,0.7)]" />
          testpilot<span className="text-faint">.ai</span>
        </Link>

        <div className="hidden gap-7 text-sm text-muted-foreground md:flex">
          {links.map((l) => (
            <Link key={l.href} href={l.href} className="transition-colors hover:text-foreground">
              {l.label}
            </Link>
          ))}
        </div>

        <GithubButton />
      </nav>
    </header>
  );
}
