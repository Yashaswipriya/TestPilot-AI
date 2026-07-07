const frameworks = ["Jest", "Vitest", "Playwright", "Cypress", "React Testing Library"];

export function StackStrip() {
  return (
    <section className="relative z-10 px-8 py-16">
      <div className="mx-auto max-w-[1120px] text-center">
        <div className="mb-6 font-mono text-xs tracking-wide text-faint">
          DETECTS AND WRITES FOR
        </div>
        <div className="flex flex-wrap justify-center gap-3">
          {frameworks.map((fw) => (
            <div
              key={fw}
              className="rounded-md border border-border bg-card px-3.5 py-1.5 font-mono text-[12.5px] text-muted-foreground"
            >
              {fw}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
