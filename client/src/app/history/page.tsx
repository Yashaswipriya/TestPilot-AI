"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {ArrowRight,CheckCircle2,Clock3,FileCode2,History as HistoryIcon,Loader2} from "lucide-react";
import {historyService,TestGenerationHistory} from "@/services/history.service";

export default function HistoryPage() {
  const [history, setHistory] = useState<
    TestGenerationHistory[]
  >([]);

  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(
    null
  );

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        setIsLoading(true);
        setError(null);

        const data = await historyService.getHistory();

        setHistory(data);
      } catch (error: any) {
        console.error(
          "Failed to fetch history:",
          error
        );

        setError(
          error?.response?.data?.error ||
            "Failed to load test generation history."
        );
      } finally {
        setIsLoading(false);
      }
    };

    fetchHistory();
  }, []);

  return (
    <div className="min-h-full w-full">
      {/* Header */}
      <header className="border-b border-border/60">
        <div className="mx-auto w-full max-w-7xl px-6 py-8">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg border border-border bg-card-2">
              <HistoryIcon className="h-5 w-5 text-muted-foreground" />
            </div>

            <div>
              <p className="font-mono text-[10px] font-medium uppercase tracking-[0.18em] text-muted-foreground">
                TestPilot
              </p>

              <h1 className="mt-1 text-2xl font-bold tracking-tight text-foreground">
                Generation history
              </h1>
            </div>
          </div>

          <p className="mt-3 max-w-2xl text-sm leading-relaxed text-muted-foreground">
            View your previous test generations and
            revisit the tests TestPilot created.
          </p>
        </div>
      </header>

      {/* Content */}
      <main className="mx-auto w-full max-w-7xl px-6 py-8">
        {isLoading && (
          <div className="flex min-h-[320px] flex-col items-center justify-center gap-3">
            <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />

            <p className="text-sm text-muted-foreground">
              Loading generation history...
            </p>
          </div>
        )}

        {!isLoading && error && (
          <div className="rounded-xl border border-destructive/30 bg-destructive/5 px-5 py-4">
            <p className="text-sm font-medium text-destructive">
              Could not load history
            </p>

            <p className="mt-1 text-xs text-destructive/80">
              {error}
            </p>
          </div>
        )}

        {!isLoading &&
          !error &&
          history.length === 0 && (
            <div className="flex min-h-[360px] flex-col items-center justify-center rounded-xl border border-dashed border-border bg-card px-6 text-center">
              <div className="flex h-10 w-10 items-center justify-center rounded-full border border-border bg-card-2">
                <HistoryIcon className="h-4 w-4 text-muted-foreground" />
              </div>

              <h2 className="mt-4 text-sm font-semibold text-foreground">
                No generation history yet
              </h2>

              <p className="mt-1 max-w-md text-xs leading-relaxed text-muted-foreground">
                Generate tests from one of your repositories
                and your previous generations will appear
                here.
              </p>

              <Link
                href="/repositories"
                className="mt-5 text-xs font-medium text-foreground underline underline-offset-4 transition-colors hover:text-muted-foreground"
              >
                Browse repositories
              </Link>
            </div>
          )}

        {!isLoading &&
          !error &&
          history.length > 0 && (
            <div className="space-y-3">
              {history.map((item) => {
                const createdDate = new Date(
                  item.createdAt
                );

                const totalFiles =
                  item.files.length;

                const totalTests =
                  item.generatedTests.length;

                return (
                  <Link
                    key={item._id}
                    href={`/history/${item._id}`}
                    className="group block rounded-xl border border-border bg-card p-5 transition-colors hover:bg-card-2/50"
                  >
                    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                      <div className="min-w-0">
                        <div className="flex items-center gap-2">
                          <FileCode2 className="h-4 w-4 shrink-0 text-muted-foreground" />

                          <h2 className="truncate text-sm font-semibold text-foreground">
                            {item.repository.name}
                          </h2>

                          <span className="rounded-md border border-border bg-card-2 px-2 py-0.5 font-mono text-[9px] uppercase tracking-wider text-muted-foreground">
                            {item.repository.owner}
                          </span>
                        </div>

                        <div className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-2 text-[11px] text-muted-foreground">
                          <span>
                            {totalFiles} source{" "}
                            {totalFiles === 1
                              ? "file"
                              : "files"}
                          </span>

                          <span>
                            {totalTests} test{" "}
                            {totalTests === 1
                              ? "file"
                              : "files"}
                          </span>

                          {item.files.length > 0 && (
                            <span className="font-mono uppercase">
                              {item.files[0].framework}
                            </span>
                          )}

                          <span className="flex items-center gap-1">
                            <Clock3 className="h-3 w-3" />

                            {createdDate.toLocaleDateString(
                              undefined,
                              {
                                month: "short",
                                day: "numeric",
                                year: "numeric",
                              }
                            )}
                          </span>
                        </div>
                      </div>

                      <div className="flex shrink-0 items-center gap-3">
                        <span className="flex items-center gap-1.5 rounded-md border border-border bg-card-2 px-2.5 py-1.5 text-[10px] font-medium text-muted-foreground">
                          <CheckCircle2 className="h-3 w-3" />
                          {item.status}
                        </span>

                        <ArrowRight className="h-4 w-4 text-muted-foreground transition-transform group-hover:translate-x-0.5 group-hover:text-foreground" />
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>
          )}
      </main>
    </div>
  );
}