export function Footer() {
  return (
    <footer className="relative z-10 border-t border-border-soft px-8 py-9">
      <div className="mx-auto flex max-w-[1120px] flex-col items-center justify-between gap-3 text-[13px] text-faint sm:flex-row">
        <div className="flex items-center gap-2 font-mono text-[13px]">
          <span className="size-1.5 rounded-sm bg-green" />
          testpilot<span className="text-faint">.ai</span>
        </div>
        <div>Built on Express, MongoDB, Next.js &amp; Gemini</div>
        <div>© 2026</div>
      </div>
    </footer>
  );
}
