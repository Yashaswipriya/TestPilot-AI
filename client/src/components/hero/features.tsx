import { GitBranch, Layers, Braces, History, Search, Box } from "lucide-react";

const features = [
  {
    icon: GitBranch,
    title: "Full repo browsing",
    body: "Live tree view straight from the GitHub API — branches, folders, file contents, no local clone required.",
  },
  {
    icon: Layers,
    title: "Framework auto-detect",
    body: "Reads your package.json and config files to pick Jest, Vitest, Playwright, Cypress, or RTL — no dropdown to fill in.",
  },
  {
    icon: Braces,
    title: "Structured plans first",
    body: "See the test plan before the code — what's covered, what's skipped, and why — as parsed JSON, not a wall of text.",
  },
  {
    icon: History,
    title: "Run history",
    body: "Every generation is saved with its files, framework, and output. Revisit, compare, or delete a run anytime.",
  },
  {
    icon: Search,
    title: "Search across repos",
    body: "Find a file or a repository by name instead of scrolling a tree that's twelve folders deep.",
  },
  {
    icon: Box,
    title: "Ship it in a container",
    body: (
      <>
        MongoDB, Express, and Next.js behind one{" "}
        <code className="font-mono text-foreground">docker compose up</code>{" "}
        — same environment, every machine.
      </>
    ),
  },
];

export function Features() {
  return (
    <section id="features" className="relative z-10 px-8 pb-24">
      <div className="mx-auto max-w-[1120px]">
        <div className="mb-14 max-w-[560px]">
          <div className="mb-3.5 font-mono text-[12.5px] text-green">// FEATURES</div>
          <h2 className="mb-3.5 text-[28px] font-extrabold leading-tight tracking-[-1.2px] sm:text-[34px]">
            Built for repos you didn&apos;t write alone.
          </h2>
          <p className="text-[15.5px] leading-relaxed text-muted-foreground">
            Every piece exists because generated tests are only useful if you
            can trust, read, and rerun them.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-px overflow-hidden rounded-xl border border-border-soft bg-border-soft sm:grid-cols-2 lg:grid-cols-3">
          {features.map((f) => (
            <div key={f.title} className="bg-background p-7">
              <div className="mb-4 flex size-8.5 items-center justify-center rounded-lg border border-border bg-card text-green">
                <f.icon className="size-4" />
              </div>
              <h4 className="mb-1.5 text-[14.5px] font-bold tracking-[-0.1px]">{f.title}</h4>
              <p className="text-[13px] leading-relaxed text-muted-foreground">{f.body}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
