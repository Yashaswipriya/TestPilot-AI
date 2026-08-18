"use client";

import { useState } from "react";
import {Check,Copy,FileCode2,Loader2,Sparkles} from "lucide-react";
import { GitHubLogoIcon } from '@radix-ui/react-icons';
import { GeneratedTest } from "@/services/repository.service";
import api from "@/services/api";

interface GeneratedTestsProps {
  tests: GeneratedTest[];
  owner: string;
  repo: string;
  branch: string;
}

interface ApplyResult {
  path: string;
  sha?: string;
  action: "created" | "updated";
  commit?: {
    sha?: string;
    message?: string;
    url?: string;
  };
}

export function GeneratedTests({
  tests,
  owner,
  repo,
  branch,
}: GeneratedTestsProps) {
  const [copiedFile, setCopiedFile] = useState<
    string | null
  >(null);

  const [applyingFile, setApplyingFile] = useState<
    string | null
  >(null);

  const [appliedFiles, setAppliedFiles] = useState<
    Record<string, ApplyResult>
  >({});

  const [applyErrors, setApplyErrors] = useState<
    Record<string, string>
  >({});

  if (tests.length === 0) {
    return null;
  }

  const handleCopy = async (
    testCode: string,
    testFilePath: string
  ) => {
    try {
      await navigator.clipboard.writeText(testCode);

      setCopiedFile(testFilePath);

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

  const handleApplyToGitHub = async (
    test: GeneratedTest
  ) => {
    try {
      setApplyingFile(test.testFilePath);

      setApplyErrors((previous) => {
        const next = { ...previous };
        delete next[test.testFilePath];
        return next;
      });

      const response = await api.post(
        "/analysis/apply-test",
        {
          owner,
          repo,
          path: test.testFilePath,
          content: test.testCode,
          branch,
          commitMessage: `test: add generated test for ${test.sourceFilePath}`,
        }
      );

      const result: ApplyResult = response.data;

      setAppliedFiles((previous) => ({
        ...previous,
        [test.testFilePath]: result,
      }));
    } catch (error: any) {
      console.error(
        "Failed to apply generated test:",
        error
      );

      setApplyErrors((previous) => ({
        ...previous,
        [test.testFilePath]:
          error?.response?.data?.error ||
          "Failed to apply test to GitHub.",
      }));
    } finally {
      setApplyingFile(null);
    }
  };

  return (
    <section className="mt-8 overflow-hidden rounded-xl border border-border bg-card shadow-sm">
      {/* Header */}
      <div className="border-b border-border/60 px-5 py-4">
        <div className="flex items-center gap-2.5">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg border border-border bg-card-2">
            <Sparkles className="h-4 w-4 text-green" />
          </div>

          <div>
            <h3 className="text-sm font-semibold text-foreground">
              Generated tests
            </h3>

            <p className="mt-1 text-xs text-muted-foreground">
              {tests.length} test file
              {tests.length !== 1 ? "s" : ""} generated
            </p>
          </div>
        </div>
      </div>

      {/* Generated tests */}
      <div className="divide-y divide-border/60">
        {tests.map((test) => {
          const isCopied =
            copiedFile === test.testFilePath;

          const isApplying =
            applyingFile === test.testFilePath;

          const applied =
            appliedFiles[test.testFilePath];

          const applyError =
            applyErrors[test.testFilePath];

          return (
            <div
              key={`${test.sourceFilePath}-${test.testFilePath}`}
              className="p-5"
            >
              {/* File information */}
              <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
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

                <div className="flex flex-wrap items-center gap-2">
                  <span className="w-fit rounded-md border border-border bg-card-2 px-2 py-1 font-mono text-[10px] uppercase tracking-wider text-muted-foreground">
                    {test.framework}
                  </span>

                  {/* Copy */}
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

                  {/* Apply to GitHub */}
                  <button
                    type="button"
                    onClick={() =>
                      handleApplyToGitHub(test)
                    }
                    disabled={isApplying}
                    className="flex h-7 items-center gap-1.5 rounded-md border border-border bg-foreground px-2.5 font-mono text-[10px] font-medium text-background transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    {isApplying ? (
                      <>
                        <Loader2 className="h-3 w-3 animate-spin" />
                        Applying...
                      </>
                    ) : applied ? (
                      <>
                        <Check className="h-3 w-3" />
                        Applied
                      </>
                    ) : (
                      <>
                        <GitHubLogoIcon className="h-3 w-3" />
                        Apply to GitHub
                      </>
                    )}
                  </button>
                </div>
              </div>

              {/* Code */}
              <div className="overflow-hidden rounded-lg border border-border bg-background">
                <pre className="max-h-[500px] overflow-auto p-5 font-mono text-xs leading-relaxed text-foreground">
                  <code>{test.testCode}</code>
                </pre>
              </div>

              {/* Explanation */}
              <div className="mt-3 rounded-lg bg-card-2/40 px-4 py-3">
                <p className="text-xs leading-relaxed text-muted-foreground">
                  {test.explanation}
                </p>
              </div>

              {/* Success */}
              {applied && (
                <div className="mt-3 rounded-lg border border-border bg-card-2/40 px-4 py-3">
                  <div className="flex items-start gap-2">
                    <Check className="mt-0.5 h-3.5 w-3.5 shrink-0 text-green" />

                    <div className="min-w-0">
                      <p className="text-xs font-medium text-foreground">
                        Test file{" "}
                        {applied.action === "created"
                          ? "created"
                          : "updated"}{" "}
                        on GitHub
                      </p>

                      <p className="mt-1 text-[11px] text-muted-foreground">
                        {applied.path}
                      </p>

                      {applied.commit?.url && (
                        <a
                          href={applied.commit.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="mt-1.5 inline-block text-[11px] text-muted-foreground underline underline-offset-2 hover:text-foreground"
                        >
                          View commit
                        </a>
                      )}
                    </div>
                  </div>
                </div>
              )}

              {/* Error */}
              {applyError && (
                <div className="mt-3 rounded-lg border border-destructive/30 bg-destructive/5 px-4 py-3">
                  <p className="text-xs font-medium text-destructive">
                    Could not apply test to GitHub
                  </p>

                  <p className="mt-1 text-[11px] text-destructive/80">
                    {applyError}
                  </p>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </section>
  );
}