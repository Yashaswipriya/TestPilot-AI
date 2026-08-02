'use client';

import * as React from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import { EmptyState } from '@/components/common/EmptyState';
import { Skeleton } from '@/components/ui/skeleton';
import { FolderGit2, TestTube2, Clock } from 'lucide-react';

const stats = [
  { label: 'Repositories analyzed', value: '0', icon: FolderGit2 },
  { label: 'Tests generated', value: '0', icon: TestTube2 },
  { label: 'Last run', value: '—', icon: Clock },
];

export default function DashboardPage() {
  const { user, isLoading } = useAuth();
  const router = useRouter();

  return (
    <div className="flex flex-1 w-full max-w-6xl mx-auto flex-col gap-8">
      <div className="flex items-center gap-4">
        {isLoading ? (
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
                Welcome back, {user?.name || user?.username}
              </h1>
              <p className="mt-1 text-[14px] text-muted-foreground">
                Here&apos;s what&apos;s happening across your repositories.
              </p>
            </div>
          </>
        )}
      </div>

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
              <div className="text-[22px] font-bold tracking-tight text-foreground">{stat.value}</div>
              <div className="text-[13px] text-muted-foreground">{stat.label}</div>
            </div>
          </div>
        ))}
      </div>

      <div className="flex-1 flex items-center justify-center rounded-xl border border-border bg-card py-16">
        <EmptyState
          icon={TestTube2}
          title="No analyses yet"
          description="Pick a repository to generate your first AI-powered test suite."
          actionLabel="Browse repositories"
          onAction={() => router.push('/repositories')}
        />
      </div>
    </div>
  );
}