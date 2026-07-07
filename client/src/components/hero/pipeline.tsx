const steps = [
  {
    num: "01 · auth",
    title: "Sign in with GitHub",
    body: "OAuth handshake, session established, your repos listed — nothing written to your account.",
  },
  {
    num: "02 · select",
    title: "Pick files, not the whole tree",
    body: "Browse the repo tree, open a file, check the ones you want covered.",
  },
  {
    num: "03 · analyze",
    title: "Build repository context",
    body: "Recursive traversal, dependency and test-framework detection, irrelevant folders skipped.",
  },
  {
    num: "04 · generate",
    title: "Gemini writes the plan, then the code",
    body: "Structured prompt → test plan → parsed, validated test files in your framework's syntax.",
  },
  {
    num: "05 · keep",
    title: "Saved to your history",
    body: "Every run — repo, files, framework, plan, output — stored, searchable, revisitable.",
  },
];

export function Pipeline() {
  return (
    <section id="pipeline" className="relative z-10 px-8 py-24">
      <div className="mx-auto max-w-[1120px]">
        <div className="mb-14 max-w-[560px]">
          <div className="mb-3.5 font-mono text-[12.5px] text-green">// PIPELINE</div>
          <h2 className="mb-3.5 text-[28px] font-extrabold leading-tight tracking-[-1.2px] sm:text-[34px]">
            Repo in. Tests out. No middle steps you have to babysit.
          </h2>
          <p className="text-[15.5px] leading-relaxed text-muted-foreground">
            The same path every generation takes — repository access, static
            analysis, prompt construction, model call, and a result you can
            actually run.
          </p>
        </div>

        <div className="flex flex-col overflow-hidden rounded-xl border border-border bg-card md:flex-row">
          {steps.map((step, i) => (
            <div
              key={step.num}
              className="relative flex-1 border-b border-border-soft p-6 last:border-b-0 md:border-b-0 md:border-r md:last:border-r-0"
            >
              <div className="mb-3.5 font-mono text-[11px] text-faint">{step.num}</div>
              <h3 className="mb-2 text-[15px] font-bold tracking-[-0.2px]">{step.title}</h3>
              <p className="text-[13px] leading-relaxed text-muted-foreground">{step.body}</p>
              {i < steps.length - 1 && (
                <div className="absolute right-[-9px] top-1/2 z-10 hidden size-[18px] -translate-y-1/2 items-center justify-center rounded-full border border-border bg-card text-[10px] text-faint md:flex">
                  →
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
