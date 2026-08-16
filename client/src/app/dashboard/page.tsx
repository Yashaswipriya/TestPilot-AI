'use client';

import * as React from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import { EmptyState } from '@/components/common/EmptyState';
import { Skeleton } from '@/components/ui/skeleton';
import {FolderGit2,TestTube2,Clock,ArrowRight,CheckCircle2,FileCode2,Loader2} from 'lucide-react';
import {historyService,TestGenerationHistory} from '@/services/history.service';

export default function DashboardPage() {
  const { user, isLoading: isAuthLoading } = useAuth();
  const router = useRouter();

  const [history, setHistory] = React.useState<
    TestGenerationHistory[]
  >([]);

  const [isHistoryLoading, setIsHistoryLoading] =
    React.useState(true);

  const [historyError, setHistoryError] =
    React.useState<string | null>(null);

  React.useEffect(() => {
    const fetchHistory = async () => {
      try {
        setIsHistoryLoading(true);
        setHistoryError(null);

        const data = await historyService.getHistory();

        setHistory(data);
      } catch (error: any) {
        console.error(
          'Failed to fetch dashboard history:',
          error
        );

        setHistoryError(
          error?.response?.data?.error ||
            'Failed to load dashboard history.'
        );
      } finally {
        setIsHistoryLoading(false);
      }
    };

    fetchHistory();
  }, []);

  /*
   * Number of unique repositories that have had
   * at least one successful test generation.
   */
  const repositoriesAnalyzed = React.useMemo(() => {
    const repositories = new Set(
      history.map(
        (item) =>
          `${item.repository.owner}/${item.repository.name}`
      )
    );

    return repositories.size;
  }, [history]);

  /*
   * Total number of generated test files across
   * all successful generations.
   */
  const testsGenerated = React.useMemo(() => {
    return history.reduce(
      (total, item) =>
        total + item.generatedTests.length,
      0
    );
  }, [history]);

  /*
   * History is already returned newest-first from the
   * backend, but sorting here keeps the dashboard safe
   * if that backend behavior changes later.
   */
  const latestRun = React.useMemo(() => {
    if (history.length === 0) {
      return null;
    }

    return [...history].sort(
      (a, b) =>
        new Date(b.createdAt).getTime() -
        new Date(a.createdAt).getTime()
    )[0];
  }, [history]);

  const stats = [
    {
      label: 'Repositories analyzed',
      value: repositoriesAnalyzed.toString(),
      icon: FolderGit2,
    },
    {
      label: 'Tests generated',
      value: testsGenerated.toString(),
      icon: TestTube2,
    },
    {
      label: 'Last run',
      value: latestRun
        ? new Date(
            latestRun.createdAt
          ).toLocaleDateString(undefined, {
            month: 'short',
            day: 'numeric',
          })
        : '—',
      icon: Clock,
    },
  ];

  const recentHistory = history.slice(0, 5);

  return (
    <div className="flex flex-1 w-full max-w-6xl mx-auto flex-col gap-8">
      {/* Welcome */}
      <div className="flex items-center gap-4">
        {isAuthLoading ? (
          <>
            <Skeleton className="h-12 w-12 rounded-full bg-card-2" />

            <div className="space-y-2">
              <Skeleton className="h-5 w-40 bg-card-2" />
              <Skeleton className="h-3.5 w-56 bg-card-2" />
            </div>
          </>
        ) : (
          <>
            {user?.avatarUrl && (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={user.avatarUrl}
                alt={user.username}
                className="h-12 w-12 rounded-full border border-border"
              />
            )}

            <div>
              <h1 className="text-[26px] font-extrabold tracking-[-1px] leading-tight text-foreground">
                Welcome back,{' '}
                {user?.name || user?.username}
              </h1>

              <p className="mt-1 text-[14px] text-muted-foreground">
                Here&apos;s what&apos;s happening across
                your repositories.
              </p>
            </div>
          </>
        )}
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        {stats.map((stat) => (
          <div
            key={stat.label}
            className="flex items-center gap-4 rounded-xl border border-border bg-card p-5"
          >
            <div className="flex h-10 w-10 items-center justify-center rounded-lg border border-border bg-card-2 text-green">
              <stat.icon className="h-4.5 w-4.5" />
            </div>

            <div>
              {isHistoryLoading ? (
                <Skeleton className="h-7 w-12 bg-card-2" />
              ) : (
                <div className="text-[22px] font-bold tracking-tight text-foreground">
                  {stat.value}
                </div>
              )}

              <div className="text-[13px] text-muted-foreground">
                {stat.label}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* History / Empty state */}
      {isHistoryLoading ? (
        <div className="flex min-h-[360px] flex-1 items-center justify-center rounded-xl border border-border bg-card">
          <div className="flex flex-col items-center gap-3">
            <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />

            <p className="text-sm text-muted-foreground">
              Loading your recent generations...
            </p>
          </div>
        </div>
      ) : historyError ? (
        <div className="flex min-h-[360px] flex-1 items-center justify-center rounded-xl border border-border bg-card">
          <div className="text-center">
            <p className="text-sm font-medium text-destructive">
              Could not load recent generations
            </p>

            <p className="mt-1 text-xs text-muted-foreground">
              {historyError}
            </p>
          </div>
        </div>
      ) : recentHistory.length === 0 ? (
        <div className="flex-1 flex items-center justify-center rounded-xl border border-border bg-card py-16">
          <EmptyState
            icon={TestTube2}
            title="No analyses yet"
            description="Pick a repository to generate your first AI-powered test suite."
            actionLabel="Browse repositories"
            onAction={() =>
              router.push('/repositories')
            }
          />
        </div>
      ) : (
        <div className="rounded-xl border border-border bg-card">
          <div className="flex items-center justify-between border-b border-border/60 px-5 py-4">
            <div>
              <p className="text-sm font-semibold text-foreground">
                Recent generations
              </p>

              <p className="mt-1 text-xs text-muted-foreground">
                Your latest AI-powered test generations.
              </p>
            </div>

            <button
              type="button"
              onClick={() => router.push('/history')}
              className="text-xs font-medium text-muted-foreground transition-colors hover:text-foreground"
            >
              View all
            </button>
          </div>

          <div className="divide-y divide-border/60">
            {recentHistory.map((item) => {
              const createdDate = new Date(
                item.createdAt
              );

              return (
                <button
                  key={item._id}
                  type="button"
                  onClick={() =>
                    router.push(
                      `/history/${item._id}`
                    )
                  }
                  className="group flex w-full items-center justify-between gap-4 px-5 py-4 text-left transition-colors hover:bg-card-2/40"
                >
                  <div className="flex min-w-0 items-center gap-3">
                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-border bg-card-2">
                      <FileCode2 className="h-4 w-4 text-muted-foreground" />
                    </div>

                    <div className="min-w-0">
                      <div className="flex min-w-0 items-center gap-2">
                        <span className="truncate text-sm font-medium text-foreground">
                          {item.repository.name}
                        </span>

                        <span className="hidden rounded-md border border-border bg-card-2 px-1.5 py-0.5 font-mono text-[9px] uppercase tracking-wider text-muted-foreground sm:inline-block">
                          {item.repository.owner}
                        </span>
                      </div>

                      <div className="mt-1 flex flex-wrap items-center gap-x-3 gap-y-1 text-[11px] text-muted-foreground">
                        <span>
                          {item.files.length}{' '}
                          {item.files.length === 1
                            ? 'source file'
                            : 'source files'}
                        </span>

                        <span>
                          {item.generatedTests.length}{' '}
                          {item.generatedTests.length ===
                          1
                            ? 'test file'
                            : 'test files'}
                        </span>

                        {item.files.length > 0 && (
                          <span className="font-mono uppercase">
                            {item.files[0].framework}
                          </span>
                        )}

                        <span>
                          {createdDate.toLocaleDateString(
                            undefined,
                            {
                              month: 'short',
                              day: 'numeric',
                              year: 'numeric',
                            }
                          )}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="flex shrink-0 items-center gap-3">
                    <span className="hidden items-center gap-1.5 rounded-md border border-border bg-card-2 px-2 py-1 text-[10px] font-medium text-muted-foreground sm:flex">
                      <CheckCircle2 className="h-3 w-3" />
                      {item.status}
                    </span>

                    <ArrowRight className="h-4 w-4 text-muted-foreground transition-transform group-hover:translate-x-0.5 group-hover:text-foreground" />
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}