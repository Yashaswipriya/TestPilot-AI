"use client";

import { ArrowLeft, Loader2, Play } from "lucide-react";
import { GitHubLogoIcon } from "@radix-ui/react-icons";
import Link from "next/link";
import { Button } from "@/components/ui/button";

interface RepositoryHeaderProps {
  owner: string;
  repo: string;
  selectedFilesCount: number;
  isFetchingFiles: boolean;
  isGenerating: boolean;
  onGenerateTests: () => void;
}

export function RepositoryHeader({
  owner,
  repo,
  selectedFilesCount,
  isFetchingFiles,
  isGenerating,
  onGenerateTests,
}: RepositoryHeaderProps) {
  const isBusy = isFetchingFiles || isGenerating;

  return (
    <header className="border-b border-border/60">
      <div className="mx-auto flex w-full max-w-7xl items-center justify-between px-6 py-5">
        <div className="flex items-center gap-4">
          <Link
            href="/repositories"
            className="flex h-9 w-9 items-center justify-center rounded-lg border border-border bg-card text-muted-foreground transition-colors hover:bg-card-2 hover:text-foreground"
          >
            <ArrowLeft className="h-4 w-4" />
          </Link>

          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg border border-border bg-card-2">
              <GitHubLogoIcon className="h-5 w-5" />
            </div>

            <div>
              <div className="flex items-center gap-2">
                <h1 className="font-semibold tracking-tight text-foreground">
                  {repo}
                </h1>

                <span className="rounded-md border border-border bg-card-2 px-2 py-0.5 font-mono text-[10px] uppercase tracking-wider text-muted-foreground">
                  Repository
                </span>
              </div>

              <p className="mt-0.5 text-xs text-muted-foreground">
                {owner}
              </p>
            </div>
          </div>
        </div>

        <Button
          variant="primary"
          size="sm"
          disabled={selectedFilesCount === 0 || isBusy}
          onClick={onGenerateTests}
          className="gap-2 font-mono text-xs"
        >
          {isGenerating ? (
            <>
              <Loader2 className="h-3.5 w-3.5 animate-spin" />
              Generating...
            </>
          ) : isFetchingFiles ? (
            <>
              <Loader2 className="h-3.5 w-3.5 animate-spin" />
              Preparing...
            </>
          ) : (
            <>
              <Play className="h-3.5 w-3.5" />
              Generate Tests
            </>
          )}
        </Button>
      </div>
    </header>
  );
}