"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import {ArrowLeft,Check,Clock3,Copy,FileCode2,History as HistoryIcon,Loader2} from "lucide-react";
import {historyService,TestGenerationHistory} from "@/services/history.service";

export default function HistoryDetailPage() {
  const params = useParams();
  const router = useRouter();

  const id = params.id as string;

  const [history, setHistory] =
    useState<TestGenerationHistory | null>(null);

  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(
    null
  );

  const [copiedFile, setCopiedFile] = useState<
    string | null
  >(null);

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        setIsLoading(true);
        setError(null);

        const data =
          await historyService.getHistoryById(id);

        setHistory(data);
      } catch (error: any) {
        console.error(
          "Failed to fetch history entry:",
          error
        );

        if (error?.response?.status === 404) {
          setError("History entry not found.");
        } else {
          setError(
            error?.response?.data?.error ||
              "Failed to load this generation."
          );
        }
      } finally {
        setIsLoading(false);
      }
    };

    if (id) {
      fetchHistory();
    }
  }, [id]);

  const handleCopy = async (
    testCode: string,
    filePath: string
  ) => {
    try {
      await navigator.clipboard.writeText(testCode);

      setCopiedFile(filePath);

      setTimeout(() => {
        setCopiedFile(null);
      }, 2000);
    } catch (error) {
      console.error(
        "Failed to copy generated test:",
        error
      );
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-full w-full">
        <div className="mx-auto flex min-h-[500px] w-full max-w-7xl flex-col items-center justify-center gap-3 px-6">
          <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />

          <p className="text-sm text-muted-foreground">
            Loading generation...
          </p>
        </div>
      </div>
    );
  }

  if (error || !history) {
    return (
      <div className="min-h-full w-full">
        <main className="mx-auto flex min-h-[500px] w-full max-w-7xl flex-col items-center justify-center px-6 text-center">
          <div className="flex h-10 w-10 items-center justify-center rounded-full border border-border bg-card-2">
            <HistoryIcon className="h-4 w-4 text-muted-foreground" />
          </div>

          <h1 className="mt-4 text-sm font-semibold text-foreground">
            {error || "Generation not found"}
          </h1>

          <p className="mt-1 max-w-md text-xs leading-relaxed text-muted-foreground">
            This generation may have been deleted or you
            may not have access to it.
          </p>

          <Link
            href="/history"
            className="mt-5 inline-flex items-center gap-2 text-xs font-medium text-foreground underline underline-offset-4 transition-colors hover:text-muted-foreground"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            Back to history
          </Link>
        </main>
      </div>
    );
  }

  const createdDate = new Date(history.createdAt);

  return (
    <div className="min-h-full w-full">
      {/* Header */}
      <header className="border-b border-border/60">
        <div className="mx-auto w-full max-w-7xl px-6 py-6">
          <button
            type="button"
            onClick={() => router.push("/history")}
            className="mb-5 flex items-center gap-2 text-xs text-muted-foreground transition-colors hover:text-foreground"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            Back to history
          </button>

          <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
            <div className="min-w-0">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border border-border bg-card-2">
                  <FileCode2 className="h-5 w-5 text-muted-foreground" />
                </div>

                <div className="min-w-0">
                  <h1 className="truncate text-2xl font-bold tracking-tight text-foreground">
                    {history.repository.name}
                  </h1>

                  <p className="mt-0.5 text-xs text-muted-foreground">
                    {history.repository.owner}
                  </p>
                </div>
              </div>

              <div className="mt-4 flex flex-wrap items-center gap-2">
                <span className="flex items-center gap-1.5 rounded-md border border-border bg-card-2 px-2.5 py-1 font-mono text-[10px] uppercase tracking-wider text-muted-foreground">
                  <Check className="h-3 w-3" />
                  {history.status}
                </span>

                {history.files.length > 0 && (
                  <span className="rounded-md border border-border bg-card-2 px-2.5 py-1 font-mono text-[10px] uppercase tracking-wider text-muted-foreground">
                    {history.files[0].framework}
                  </span>
                )}

                <span className="flex items-center gap-1.5 px-1 text-[10px] text-muted-foreground">
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

            <div className="shrink-0 text-left sm:text-right">
              <p className="font-mono text-[10px] uppercase tracking-[0.15em] text-muted-foreground">
                Generation
              </p>

              <p className="mt-1 text-xs text-muted-foreground">
                {history.generatedTests.length} test{" "}
                {history.generatedTests.length === 1
                  ? "file"
                  : "files"}{" "}
                generated
              </p>
            </div>
          </div>
        </div>
      </header>

      {/* Content */}
      <main className="mx-auto w-full max-w-7xl px-6 py-8">
        <div className="mb-7">
          <p className="mb-2 font-mono text-[11px] font-medium uppercase tracking-[0.18em] text-muted-foreground">
            Generated tests
          </p>

          <h2 className="text-xl font-bold tracking-tight text-foreground">
            Test generation result
          </h2>

          <p className="mt-2 max-w-2xl text-sm leading-relaxed text-muted-foreground">
            A saved snapshot of the tests TestPilot generated
            for this repository.
          </p>
        </div>

        {history.generatedTests.length === 0 ? (
          <div className="rounded-xl border border-dashed border-border bg-card px-6 py-10 text-center">
            <p className="text-sm font-medium text-foreground">
              No generated tests
            </p>

            <p className="mt-1 text-xs text-muted-foreground">
              This history entry does not contain any
              generated test files.
            </p>
          </div>
        ) : (
          <div className="space-y-6">
            {history.generatedTests.map((test) => {
              const isCopied =
                copiedFile === test.testFilePath;

              return (
                <section
                  key={`${test.sourceFilePath}-${test.testFilePath}`}
                  className="overflow-hidden rounded-xl border border-border bg-card shadow-sm"
                >
                  {/* Test header */}
                  <div className="border-b border-border/60 px-5 py-4">
                    <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                      <div className="min-w-0">
                        <div className="flex items-center gap-2">
                          <FileCode2 className="h-4 w-4 shrink-0 text-muted-foreground" />

                          <p className="truncate font-mono text-xs text-muted-foreground">
                            {test.sourceFilePath}
                          </p>
                        </div>

                        <div className="mt-1.5 flex items-center gap-2">
                          <span className="text-xs text-muted-foreground">
                            →
                          </span>

                          <p className="truncate font-mono text-sm font-medium text-foreground">
                            {test.testFilePath}
                          </p>
                        </div>
                      </div>

                      <div className="flex shrink-0 items-center gap-2">
                        <span className="rounded-md border border-border bg-card-2 px-2 py-1 font-mono text-[10px] uppercase tracking-wider text-muted-foreground">
                          {test.framework}
                        </span>

                        <button
                          type="button"
                          onClick={() =>
                            handleCopy(
                              test.testCode,
                              test.testFilePath
                            )
                          }
                          className="flex h-7 items-center gap-1.5 rounded-md border border-border bg-card-2 px-2.5 font-mono text-[10px] text-muted-foreground transition-colors hover:bg-card hover:text-foreground"
                        >
                          {isCopied ? (
                            <>
                              <Check className="h-3 w-3" />
                              Copied
                            </>
                          ) : (
                            <>
                              <Copy className="h-3 w-3" />
                              Copy
                            </>
                          )}
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Code */}
                  <div className="p-5">
                    <div className="overflow-hidden rounded-lg border border-border bg-background">
                      <pre className="max-h-[600px] overflow-auto p-5 font-mono text-xs leading-relaxed text-foreground">
                        <code>{test.testCode}</code>
                      </pre>
                    </div>

                    {/* Explanation */}
                    <div className="mt-4 rounded-lg bg-card-2/40 px-4 py-3">
                      <p className="text-xs leading-relaxed text-muted-foreground">
                        {test.explanation}
                      </p>
                    </div>
                  </div>
                </section>
              );
            })}
          </div>
        )}
      </main>
    </div>
  );
}