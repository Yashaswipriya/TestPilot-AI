'use client';

import * as React from 'react';
import { useRepositories } from '@/hooks/useRepositories';
import { RepositoryCard } from '@/components/repository/RepositoryCard';
import { EmptyState } from '@/components/common/EmptyState';
import { ErrorState } from '@/components/common/ErrorState';
import { Skeleton } from '@/components/ui/skeleton';
import { Plus } from 'lucide-react';
import { GitHubLogoIcon } from '@radix-ui/react-icons';
import { Button } from '@/components/ui/button';

export default function RepositoryPage() {
  const { data: repositories, isLoading, error, refetch } = useRepositories();

  return (
    <div className="flex flex-col gap-8 flex-1 w-full max-w-6xl mx-auto py-10 px-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
        <div>
          <h1 className="text-[32px] font-extrabold tracking-[-1.2px] text-foreground leading-tight">Your Repositories</h1>
          <p className="text-[15px] text-muted-foreground mt-2 leading-relaxed">
            Select a repository to view its test generation dashboard.
          </p>
        </div>
        <Button variant="primary" className="font-mono tracking-tight text-[13.5px]">
          <Plus className="mr-2 h-4 w-4" />
          Connect new repo
        </Button>
      </div>

      {isLoading && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="rounded-xl border border-border bg-card p-6 shadow-sm">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <Skeleton className="h-10 w-10 rounded-lg bg-card-2" />
                  <div className="space-y-2">
                    <Skeleton className="h-4 w-32 bg-card-2" />
                    <Skeleton className="h-3 w-20 bg-card-2" />
                  </div>
                </div>
                <Skeleton className="h-5 w-16 rounded-full bg-card-2" />
              </div>
              <Skeleton className="h-10 w-full mb-6 bg-card-2" />
              <div className="flex justify-between border-t border-border/50 pt-4">
                <Skeleton className="h-4 w-20 bg-card-2" />
                <Skeleton className="h-4 w-24 bg-card-2" />
              </div>
            </div>
          ))}
        </div>
      )}

      {!isLoading && error && (
        <ErrorState
          title="Failed to load repositories"
          message="There was an error communicating with the server."
          onRetry={refetch}
        />
      )}

      {!isLoading && !error && repositories?.length === 0 && (
        <EmptyState
          icon={GitHubLogoIcon}
          title="No repositories found"
          description="Connect your GitHub account to import repositories and start generating tests."
          actionLabel="Connect GitHub"
          onAction={() => {
            window.location.href = `${process.env.NEXT_PUBLIC_API_URL}/auth/github`;
          }}
        />
      )}

      {!isLoading && !error && repositories && repositories.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 pb-20">
          {repositories.map((repo) => (
            <RepositoryCard key={repo._id} repository={repo} />
          ))}
        </div>
      )}
    </div>
  );
}