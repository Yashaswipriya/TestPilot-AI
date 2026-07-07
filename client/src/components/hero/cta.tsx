import { GithubButton } from "@/components/hero/github-button";

export function Cta() {
  return (
    <section className="relative z-10 px-8 py-28 text-center sm:py-36">
      <div className="mx-auto max-w-[1120px]">
        <div className="mb-4 font-mono text-[12.5px] text-green">// GET STARTED</div>
        <h2 className="mx-auto mb-4 max-w-[600px] text-[30px] font-extrabold tracking-[-1px] sm:text-[40px]">
          Your next PR should ship with tests already written.
        </h2>
        <p className="mb-8 text-[15.5px] text-muted-foreground">
          Connect a repo. See the plan before the code. Keep what&apos;s useful.
        </p>
        <div className="flex justify-center">
          <GithubButton size="lg" />
        </div>
      </div>
    </section>
  );
}
