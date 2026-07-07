"use client";

import { motion } from "framer-motion";
import { Check, ChevronDown, Circle, Play } from "lucide-react";
import { cn } from "@/lib/utils";

const tree = [
  { label: "src/", depth: 0, kind: "dir" },
  { label: "server/", depth: 1, kind: "dir" },
  { label: "websocket.ts", depth: 2, kind: "checked" },
  { label: "redis-pubsub.ts", depth: 2, kind: "checked" },
  { label: "auth.ts", depth: 2, kind: "file" },
  { label: "routes/", depth: 1, kind: "dir" },
  { label: "documents.ts", depth: 2, kind: "active" },
  { label: "tests/", depth: 0, kind: "dir-collapsed" },
  { label: "package.json", depth: 0, kind: "file" },
] as const;

const codeLines: { text: string; added?: boolean }[] = [
  { text: "import { createDoc, applyPatch } from '../routes/documents';" },
  { text: "import { mockRedisClient } from '../__mocks__/redis';" },
  { text: "" },
  { text: "// covers: optimistic concurrency on version column" },
  { text: "describe('applyPatch — version conflicts', () => {", added: true },
  { text: "  it('rejects stale version writes', async () => {", added: true },
  { text: "    const doc = await createDoc({ version: 3 });", added: true },
  { text: "    const res = await applyPatch(doc.id, { version: 2 });", added: true },
  { text: "    expect(res.status).toBe(409);" },
  { text: "  });" },
  { text: "});" },
];

function TreeIcon({ kind }: { kind: (typeof tree)[number]["kind"] }) {
  if (kind === "dir" || kind === "dir-collapsed") {
    return (
      <ChevronDown
        className={cn("size-3 text-faint", kind === "dir-collapsed" && "-rotate-90")}
      />
    );
  }
  if (kind === "checked" || kind === "active") {
    return <Check className="size-3 text-green" />;
  }
  return <Circle className="size-1.5 fill-faint text-faint" />;
}

export function TerminalDemo() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: "easeOut", delay: 0.15 }}
      className="mx-auto mt-14 max-w-[920px] overflow-hidden rounded-xl border border-border bg-card shadow-[0_40px_100px_-40px_rgba(0,0,0,0.8)]"
    >
      <div className="flex items-center justify-between border-b border-border-soft bg-card-2 px-4 py-2.5">
        <div className="flex gap-1.5">
          <span className="size-2.5 rounded-full bg-[#2A2F38]" />
          <span className="size-2.5 rounded-full bg-[#2A2F38]" />
          <span className="size-2.5 rounded-full bg-[#2A2F38]" />
        </div>
        <div className="font-mono text-xs text-faint">yashaswi / collabx-editor</div>
        <div className="flex items-center gap-1.5 font-mono text-[11px] text-green">
          <span className="size-1.5 animate-pulse-dot rounded-full bg-green" />
          connected
        </div>
      </div>

      <div className="grid min-h-[380px] grid-cols-1 md:grid-cols-[230px_1fr]">
        <div className="hidden border-r border-border-soft bg-white/[0.007] py-4 md:block">
          {tree.map((item, i) => (
            <div
              key={i}
              className={cn(
                "flex items-center gap-2 border-l-2 border-transparent px-4 py-1.5 font-mono text-[12.5px] text-muted-foreground",
                item.kind === "active" &&
                  "border-l-green bg-green/[0.06] text-foreground"
              )}
              style={{ paddingLeft: `${16 + item.depth * 16}px` }}
            >
              <TreeIcon kind={item.kind} />
              {item.label}
            </div>
          ))}
        </div>

        <div className="p-6">
          <div className="mb-4 flex items-center justify-between">
            <div className="font-mono text-[13px] text-muted-foreground">
              generating tests for <b className="font-semibold text-foreground">documents.ts</b> · jest detected
            </div>
            <div className="flex items-center gap-1.5 rounded-md bg-green px-3 py-1.5 font-mono text-[11.5px] font-semibold text-[#04150a]">
              <Play className="size-3" fill="currentColor" />
              RUN
            </div>
          </div>

          <div className="font-mono text-[12.3px] leading-[1.85] text-muted-foreground">
            {codeLines.map((line, i) => (
              <div
                key={i}
                className={cn(
                  "flex gap-3 px-0",
                  line.added && "-mx-6 border-l-2 border-green bg-green/[0.08] px-6"
                )}
              >
                <span className="w-5 shrink-0 select-none text-faint">{i + 1}</span>
                <span className="whitespace-pre">{line.text || "\u00A0"}</span>
              </div>
            ))}
          </div>

          <div className="mt-4 flex items-center gap-2 border-t border-border-soft pt-4 font-mono text-[12.5px] text-muted-foreground">
            <Check className="size-3.5 text-green" />
            14 tests generated · 3 files · est. coverage +18%
          </div>
        </div>
      </div>
    </motion.div>
  );
}
