'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import {
  ArrowLeft,
  Check,
  FileCode2,
  Loader2,
  Play,
} from 'lucide-react';
import { GitHubLogoIcon } from '@radix-ui/react-icons';
import Link from 'next/link';

import {
  repositoryService,
  RepositoryTreeItem,
  RepositoryFile,
} from '@/services/repository.service';
import { RepositoryTree } from '@/components/repository/RepositoryTree';
import { Button } from '@/components/ui/button';

export default function RepositoryPage() {
  const params = useParams();

  const owner = params.owner as string;
  const repo = params.repo as string;

  const [tree, setTree] = useState<RepositoryTreeItem[]>([]);
  const [selectedFiles, setSelectedFiles] = useState<string[]>([]);
  const [selectedFileContents, setSelectedFileContents] = useState<
    RepositoryFile[]
  >([]);

  const [isLoading, setIsLoading] = useState(true);
  const [isFetchingFiles, setIsFetchingFiles] = useState(false);
  const [error, setError] = useState<string | null>(null);

  /*
   * Fetch repository tree
   */
  useEffect(() => {
    const fetchTree = async () => {
      try {
        setIsLoading(true);
        setError(null);

        const data = await repositoryService.getRepositoryTree(
          owner,
          repo
        );

        setTree(data);
      } catch (error) {
        console.error('Failed to fetch repository tree:', error);
        setError('Failed to load repository files.');
      } finally {
        setIsLoading(false);
      }
    };

    if (owner && repo) {
      fetchTree();
    }
  }, [owner, repo]);

  /*
   * Fetch contents whenever selected files change
   */
  useEffect(() => {
    const fetchSelectedFiles = async () => {
      if (selectedFiles.length === 0) {
        setSelectedFileContents([]);
        return;
      }

      try {
        setIsFetchingFiles(true);

        const files = await Promise.all(
          selectedFiles.map((path) =>
            repositoryService.getRepositoryFile(
              owner,
              repo,
              path
            )
          )
        );

        setSelectedFileContents(files);

        console.log('Selected file contents:', files);
      } catch (error) {
        console.error(
          'Failed to fetch selected file contents:',
          error
        );
      } finally {
        setIsFetchingFiles(false);
      }
    };

    if (owner && repo) {
      fetchSelectedFiles();
    }
  }, [selectedFiles, owner, repo]);

  return (
    <div className="min-h-full w-full">
      {/* Header */}
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

          {/* Primary action */}
          <Button
            variant="primary"
            size="sm"
            disabled={
              selectedFiles.length === 0 ||
              isFetchingFiles
            }
            className="gap-2 font-mono text-xs"
          >
            {isFetchingFiles ? (
              <Loader2 className="h-3.5 w-3.5 animate-spin" />
            ) : (
              <Play className="h-3.5 w-3.5" />
            )}

            {isFetchingFiles
              ? 'Preparing...'
              : 'Generate Tests'}
          </Button>
        </div>
      </header>

      {/* Main */}
      <main className="mx-auto w-full max-w-7xl px-6 py-8">
        <div className="mb-7">
          <p className="mb-2 font-mono text-[11px] font-medium uppercase tracking-[0.18em] text-muted-foreground">
            Test generation
          </p>

          <h2 className="text-2xl font-bold tracking-tight text-foreground">
            Select files to analyze
          </h2>

          <p className="mt-2 max-w-2xl text-sm leading-relaxed text-muted-foreground">
            Choose the source files you want TestPilot AI to
            analyze and generate tests for.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-[minmax(0,1fr)_280px]">
          {/* File explorer */}
          <section className="overflow-hidden rounded-xl border border-border bg-card shadow-sm">
            <div className="flex items-center justify-between border-b border-border/60 px-5 py-4">
              <div className="flex items-center gap-2.5">
                <FileCode2 className="h-4 w-4 text-muted-foreground" />

                <span className="text-sm font-semibold">
                  Repository files
                </span>

                {!isLoading && (
                  <span className="rounded-md bg-card-2 px-2 py-0.5 font-mono text-[10px] text-muted-foreground">
                    {tree.length} items
                  </span>
                )}
              </div>

              {selectedFiles.length > 0 && (
                <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                  <Check className="h-3.5 w-3.5 text-green" />
                  {selectedFiles.length} selected
                </div>
              )}
            </div>

            <div className="p-3">
              {isLoading && (
                <div className="flex min-h-[320px] flex-col items-center justify-center gap-3">
                  <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />

                  <p className="text-sm text-muted-foreground">
                    Loading repository files...
                  </p>
                </div>
              )}

              {!isLoading && error && (
                <div className="flex min-h-[320px] items-center justify-center">
                  <p className="text-sm text-destructive">
                    {error}
                  </p>
                </div>
              )}

              {!isLoading && !error && (
                <RepositoryTree
                  items={tree}
                  selectedFiles={selectedFiles}
                  onSelectionChange={setSelectedFiles}
                />
              )}
            </div>
          </section>

          {/* Selection panel */}
          <aside className="h-fit rounded-xl border border-border bg-card shadow-sm">
            <div className="border-b border-border/60 px-5 py-4">
              <p className="text-sm font-semibold">
                Selection
              </p>

              <p className="mt-1 text-xs text-muted-foreground">
                Files selected for test generation
              </p>
            </div>

            <div className="p-5">
              {selectedFiles.length === 0 ? (
                <div className="rounded-lg border border-dashed border-border bg-card-2/40 px-4 py-8 text-center">
                  <FileCode2 className="mx-auto mb-3 h-5 w-5 text-muted-foreground/60" />

                  <p className="text-xs font-medium text-muted-foreground">
                    No files selected
                  </p>

                  <p className="mt-1 text-[11px] leading-relaxed text-muted-foreground/70">
                    Select files from the explorer to continue.
                  </p>
                </div>
              ) : (
                <div className="space-y-2">
                  {selectedFiles.map((file) => (
                    <div
                      key={file}
                      className="flex items-center gap-2 rounded-lg border border-border/70 bg-card-2/50 px-3 py-2"
                    >
                      <FileCode2 className="h-3.5 w-3.5 shrink-0 text-muted-foreground" />

                      <span className="truncate font-mono text-[11px] text-foreground">
                        {file}
                      </span>
                    </div>
                  ))}
                </div>
              )}

              {isFetchingFiles && selectedFiles.length > 0 && (
                <div className="mt-4 flex items-center gap-2 text-[11px] text-muted-foreground">
                  <Loader2 className="h-3 w-3 animate-spin" />
                  Loading source files...
                </div>
              )}

              {!isFetchingFiles &&
                selectedFileContents.length > 0 && (
                  <div className="mt-4 border-t border-border/60 pt-4">
                    <p className="text-[11px] text-muted-foreground">
                      {selectedFileContents.length} source{' '}
                      {selectedFileContents.length === 1
                        ? 'file'
                        : 'files'}{' '}
                      ready for analysis.
                    </p>
                  </div>
                )}
            </div>
          </aside>
        </div>
      </main>
    </div>
  );
}