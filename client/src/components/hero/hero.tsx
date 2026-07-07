import { ArrowRight } from "lucide-react";
import { GithubButton } from "@/components/hero/github-button";
import { TerminalDemo } from "@/components/hero/terminal-demo";

export function Hero() {
  return (
    <section className="relative z-10 px-8 pb-10 pt-22 text-center">
      <div className="mx-auto inline-flex items-center gap-2 rounded-full border border-border bg-card px-3 py-1.5 font-mono text-[12.5px] text-muted-foreground">
        <span className="size-1.5 animate-pulse-dot rounded-full bg-green" />
        Reading your repo, not just its README
      </div>

      <h1 className="mx-auto mt-6 max-w-[760px] text-[42px] font-extrabold leading-[1.08] tracking-[-1.6px] sm:text-[58px] sm:tracking-[-2.2px]">
        Point it at a repo.
        <br />
        Get tests{" "}
        <span className="font-mono font-semibold tracking-[-1px] text-green">
          it actually needs.
        </span>
      </h1>

      <p className="mx-auto mt-5 max-w-[520px] text-[17px] leading-relaxed text-muted-foreground">
        TestPilot AI reads your repository, detects your test framework, and
        writes test plans and test code your CI can run — not boilerplate you
        have to rewrite.
      </p>

      <div className="mt-9 flex flex-wrap items-center justify-center gap-3">
        <GithubButton size="lg" />
        <a
          href="#pipeline"
          className="inline-flex h-11 items-center gap-2 rounded-lg border border-border px-5 text-[14.5px] font-semibold text-muted-foreground transition-colors hover:text-foreground"
        >
          See how it works
          <ArrowRight className="size-4" />
        </a>
      </div>

      <div className="mt-4 font-mono text-[12.5px] text-faint">
        No credit card · Read-only repo access · Revoke anytime
      </div>

      <TerminalDemo />
    </section>
  );
}
