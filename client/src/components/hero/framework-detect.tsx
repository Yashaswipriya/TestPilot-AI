const configFiles = [
  "jest.config.js",
  "vitest.config.ts",
  "playwright.config.ts",
  "cypress.json",
];

const detectionLog: { label: string; result: string; hit: boolean }[] = [
  { label: "package.json → devDependencies", result: "jest ^29.7", hit: true },
  { label: "cypress.config.ts", result: "not found", hit: false },
  { label: "playwright.config.ts", result: "not found", hit: false },
  { label: "__tests__/ directory", result: "present, 6 files", hit: true },
  { label: "selected framework", result: "Jest", hit: true },
];

export function FrameworkDetect() {
  return (
    <section id="frameworks" className="relative z-10 px-8 py-22">
      <div className="mx-auto max-w-[1120px]">
        <div className="grid grid-cols-1 overflow-hidden rounded-xl border border-border bg-card md:grid-cols-2">
          <div className="border-b border-border-soft p-9 md:border-b-0 md:border-r">
            <div className="mb-2.5 font-mono text-[12.5px] text-green">// DETECTION</div>
            <h3 className="mb-3 text-[22px] font-extrabold tracking-[-0.6px]">
              It reads your config, not your description.
            </h3>
            <p className="mb-5.5 text-sm leading-relaxed text-muted-foreground">
              No form asking what testing framework you use. TestPilot
              inspects dependencies, config files, and existing test folders
              to decide — then writes in that framework&apos;s actual syntax
              and conventions.
            </p>
            <div className="flex flex-wrap gap-2.5">
              {configFiles.map((cfg) => (
                <div
                  key={cfg}
                  className="flex items-center gap-1.5 rounded-md border border-border px-2.5 py-1.5 font-mono text-xs text-muted-foreground"
                >
                  <span className="size-1.5 rounded-full bg-green" />
                  {cfg}
                </div>
              ))}
            </div>
          </div>

          <div className="flex flex-col justify-center gap-0.5 p-6">
            {detectionLog.map((row) => (
              <div
                key={row.label}
                className={`flex items-center justify-between rounded-md px-3 py-1.5 font-mono text-[12.5px] ${
                  row.hit ? "bg-green/[0.07] text-foreground" : "text-muted-foreground"
                }`}
              >
                <span>{row.label}</span>
                <span className={row.hit ? "text-green" : "text-faint"}>{row.result}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
